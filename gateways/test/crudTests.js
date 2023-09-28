import { describe, it, expect } from 'vitest';
import { initGateways } from './initGateways';
import { noSnapshot } from '../src/MemoryGateways';
import {
  primordialViz,
  primordialCommit,
  userJoe,
  sampleUpvote,
  sampleVizAuthorship,
  sampleComment,
  sampleMention,
  sampleFolder,
  samplePermission,
  sampleOrg,
  sampleOrgMembership,
  sampleTagging,
  sampleCollection,
  sampleCollectionMembership,
  sampleMilestone,
  sampleDeployment,
  sampleMergeRequest,
  sampleBetaProgramSignup,
  sampleEmbedding,
  sampleMigrationStatus,
  sampleMigrationBatch,
} from './fixtures';

export const crudTests = (entityName, sampleEntity) => {
  const saveMethod = `save${entityName}`;
  const getMethod = `get${entityName}`;
  const deleteMethod = `delete${entityName}`;

  describe(`CRUD ${entityName}`, () => {
    it(`${saveMethod} & ${getMethod}`, async () => {
      const gateways = await initGateways();

      const saveResult =
        await gateways[saveMethod](sampleEntity);
      expect(saveResult.outcome).toEqual('success');
      expect(saveResult.value).toEqual('success');

      const getResult = await gateways[getMethod](
        sampleEntity.id,
      );
      expect(getResult.outcome).toEqual('success');
      expect(
        noSnapshot[entityName]
          ? getResult.value
          : getResult.value.data,
      ).toEqual(sampleEntity);
    });

    it(`${getMethod} error case: not found`, async () => {
      const gateways = await initGateways();

      const getResult =
        await gateways[getMethod]('bogus-id');
      expect(getResult.outcome).toEqual('failure');
      expect(getResult.error.code).toEqual(
        'resourceNotFound',
      );
      expect(getResult.error.message).toEqual(
        'Resource not found with id: bogus-id',
      );
    });

    it(deleteMethod, async () => {
      const gateways = await initGateways();

      await gateways[saveMethod](sampleEntity);
      const getResultBefore = await gateways[getMethod](
        sampleEntity.id,
      );
      expect(getResultBefore.outcome).toEqual('success');

      const deleteResult = await gateways[deleteMethod](
        sampleEntity.id,
      );
      expect(deleteResult.outcome).toEqual('success');

      const getResultAfter = await gateways[getMethod](
        sampleEntity.id,
      );
      expect(getResultAfter.outcome).toEqual('failure');
    });

    it(`${deleteMethod} error case: not found`, async () => {
      const gateways = await initGateways();
      const deleteResult =
        await gateways[deleteMethod]('bogus-id');
      expect(deleteResult.outcome).toEqual('failure');
      expect(deleteResult.error.code).toEqual(
        'resourceNotFound',
      );
    });
  });
};

export const sampleEntities = {
  Info: primordialViz.info,
  Content: primordialViz.content,
  User: userJoe,
  Upvote: sampleUpvote,
  VizAuthorship: sampleVizAuthorship,
  Comment: sampleComment,
  Mention: sampleMention,
  Folder: sampleFolder,
  Permission: samplePermission,
  Org: sampleOrg,
  OrgMembership: sampleOrgMembership,
  Tagging: sampleTagging,
  Collection: sampleCollection,
  CollectionMembership: sampleCollectionMembership,
  Commit: primordialCommit,
  Milestone: sampleMilestone,
  Deployment: sampleDeployment,
  MergeRequest: sampleMergeRequest,
  BetaProgramSignup: sampleBetaProgramSignup,
  // Embedding: sampleEmbedding,
  MigrationStatus: sampleMigrationStatus,
  MigrationBatch: sampleMigrationBatch,
};
