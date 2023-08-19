import { Client } from 'pg';
import {
  resourceNotFoundError,
  invalidDecrementError,
} from './errors';
import {
  defaultSortField,
  defaultSortOrder,
} from 'entities';
import { ok, err } from './Result';
import { pageSize } from './Gateways';
import { getCollectionName } from './toCollectionName';

const connectionConfig = {
  user: '<username>',
  host: '<hostname>',
  database: '<database>',
  password: '<password>',
  port: '<port>',
};

export const PostgresGateways = () => {
  const client = new Client(connectionConfig);
  client.connect();

  const genericSave = (entityName) => async (entity) => {
    const collectionName = getCollectionName(entityName);
    const values = Object.values(entity);

    try {
      await client.query(
        `INSERT INTO ${collectionName}(${Object.keys(
          entity,
        ).join(', ')}) VALUES(${values
          .map((value, index) => `$${index + 1}`)
          .join(', ')}) ON CONFLICT DO NOTHING`,
        values,
      );
      return ok('success');
    } catch (error) {
      return err(error);
    }
  };

  const genericGet = (entityName) => async (id) => {
    const collectionName = getCollectionName(entityName);

    try {
      const result = await client.query(
        `SELECT * FROM ${collectionName} WHERE id = $1`,
        [id],
      );
      if (result.rows.length === 0) {
        return err(resourceNotFoundError(id));
      }
      return ok(result.rows[0]); // Assuming there is only one result
    } catch (error) {
      return err(error);
    }
  };

  const genericDelete = (entityName) => async (id) => {
    const collectionName = getCollectionName(entityName);

    try {
      const result = await client.query(
        `DELETE FROM ${collectionName} WHERE id = $1`,
        [id],
      );
      if (result.rowCount === 0) {
        return err(resourceNotFoundError(id));
      }
      return ok('success');
    } catch (error) {
      return err(error);
    }
  };

  const crud = (entityName) => ({
    [`save${entityName}`]: genericSave(entityName),
    [`get${entityName}`]: genericGet(entityName),
    [`delete${entityName}`]: genericDelete(entityName),
  });

  const getForks = async (id) => {
    try {
      const result = await client.query(
        'SELECT * FROM forks WHERE forkedFrom = $1',
        [id],
      );
      return ok(result.rows);
    } catch (error) {
      return err(error);
    }
  };

  const getInfos = async ({
    owner,
    forkedFrom,
    sortField = defaultSortField,
    pageNumber = 0,
    sortOrder = defaultSortOrder,
  }) => {
    try {
      const result = await client.query(
        `SELECT * FROM infos WHERE owner = $1 AND forkedFrom = $2 ORDER BY ${sortField} ${sortOrder} OFFSET $3 LIMIT $4`,
        [
          owner,
          forkedFrom,
          pageNumber * pageSize,
          pageSize,
        ],
      );
      return ok(result.rows);
    } catch (error) {
      return err(error);
    }
  };

  const incrementForksCount = async (id) => {
    try {
      await client.query(
        'UPDATE infos SET forksCount = forksCount + 1 WHERE id = $1',
        [id],
      );
      return ok('success');
    } catch (error) {
      return err(error);
    }
  };

  const decrementForksCount = async (id) => {
    try {
      const result = await client.query(
        'UPDATE infos SET forksCount = forksCount - 1 WHERE id = $1 RETURNING forksCount',
        [id],
      );
      if (
        result.rows.length === 0 ||
        result.rows[0].forksCount < 0
      ) {
        return err(invalidDecrementError(id, 'forksCount'));
      }
      return ok('success');
    } catch (error) {
      return err(error);
    }
  };

  const incrementUpvotesCount = async (id) => {
    try {
      await client.query(
        'UPDATE infos SET upvotesCount = upvotesCount + 1 WHERE id = $1',
        [id],
      );
      return ok('success');
    } catch (error) {
      return err(error);
    }
  };

  const decrementUpvotesCount = async (id) => {
    try {
      const result = await client.query(
        'UPDATE infos SET upvotesCount = upvotesCount - 1 WHERE id = $1 RETURNING upvotesCount',
        [id],
      );
      if (
        result.rows.length === 0 ||
        result.rows[0].upvotesCount < 0
      ) {
        return err(
          invalidDecrementError(id, 'upvotesCount'),
        );
      }
      return ok('success');
    } catch (error) {
      return err(error);
    }
  };

  const getCommitAncestors = async (
    id,
    toNearestMilestone,
    start,
  ) => {
    try {
      let query = `
        WITH RECURSIVE traverse AS (
          SELECT
            id,
            parent,
            milestone
          FROM
            commits
          WHERE
            id = '${id}'
          UNION ALL
          SELECT
            c.id,
            c.parent,
            c.milestone
          FROM
            traverse AS t,
            commits AS c
          WHERE
            c.id = t.parent
        )
        SELECT
          traverse.id,
          traverse.parent,
          traverse.milestone
        FROM
          traverse
      `;

      if (toNearestMilestone) {
        query += `
          WHERE
            traverse.milestone IS NULL OR traverse.id = '${id}'
          ORDER BY
            traverse.milestone DESC NULLS LAST,
            traverse.id ASC
          LIMIT 1
        `;
      }

      const result = await client.query(query);
      const commits = result.rows.map((row) => ({
        id: row.id,
        parent: row.parent,
        milestone: row.milestone,
      }));

      return ok(commits);
    } catch (error) {
      return err(error);
    }
  };

  const getFolderAncestors = async (id) => {
    try {
      const result = await client.query(
        `WITH RECURSIVE traverse AS (
          SELECT
            node_id,
            name,
            parent,
            owner,
            visibility
          FROM
            folder
          WHERE
            node_id = $1
          UNION ALL
          SELECT
            folder.node_id,
            folder.name,
            folder.parent,
            folder.owner,
            folder.visibility
          FROM
            traverse
            JOIN folder ON traverse.parent = folder.node_id
        )
        SELECT
          node_id,
          name,
          parent,
          owner,
          visibility
        FROM
          traverse
        ORDER BY
          node_id`,
        [id],
      );

      if (result.rows.length === 0) {
        return err(resourceNotFoundError(id));
      }

      return ok(result.rows);
    } catch (error) {
      return err(error);
    }
  };

  // In this implementation, we're using a common table expression (CTE) with the `WITH RECURSIVE` statement to perform a recursive query. The query starts with the given folder ID and traverses through the `folder` table recursively using a self-join. The result is ordered by the `node_id` to ensure the correct folder lineage.

  // The result of the query will contain all the ancestor folders, including the queried folder itself. You can modify the query and the returned fields as per your requirements.

  const getUserByUserName = async (userName) => {
    try {
      const result = await client.query(
        'SELECT * FROM users WHERE userName = $1',
        [userName],
      );
      if (result.rows.length === 0) {
        return err(resourceNotFoundError(userName));
      }
      return ok(result.rows[0]);
    } catch (error) {
      return err(error);
    }
  };

  const getUserByEmails = async (emails) => {
    try {
      const result = await client.query(
        'SELECT * FROM users WHERE email = ANY($1::text[])',
        [emails],
      );
      if (result.rows.length === 0) {
        return err(resourceNotFoundError(emails));
      }
      return ok(result.rows);
    } catch (error) {
      return err(error);
    }
  };

  const getUsersByIds = async (ids) => {
    try {
      const result = await client.query(
        `SELECT * FROM users WHERE id = ANY($1::integer[])`,
        [ids],
      );
      if (result.rows.length === 0) {
        return err(resourceNotFoundError(ids));
      }
      return ok(result.rows);
    } catch (error) {
      return err(error);
    }
  };

  const getPermissions = async (user, resources) => {
    try {
      const result = await client.query(
        'SELECT * FROM permissions WHERE user = $1 AND resource = ANY($2::text[])',
        [user, resources],
      );
      return ok(result.rows);
    } catch (error) {
      return err(error);
    }
  };

  let postgresGateways = {
    getForks,
    getInfos,
    incrementForksCount,
    decrementForksCount,
    incrementUpvotesCount,
    decrementUpvotesCount,
    getCommitAncestors,
    getFolderAncestors,
    getUserByUserName,
    getUserByEmails,
    getUsersByIds,
    getPermissions,
  };

  for (const entityName of crudEntityNames) {
    postgresGateways = {
      ...postgresGateways,
      ...crud(entityName),
    };
  }

  return postgresGateways;
};
