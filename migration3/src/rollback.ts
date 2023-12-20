import { CommitId, Info } from 'entities';
import { Gateways } from 'gateways';

export const rollback = async ({
  migratedInfo,
  gateways,
}: {
  migratedInfo: Info;
  gateways: Gateways;
}): Promise<void> => {
  const { deleteCommit, deleteContent, deleteInfo } =
    gateways;

  throw new Error(
    'TODO: Implement rollback! Should delete the viz and all forks recursively.',
  );

  console.log(`    Deleting migrated commits...`);
  console.log(`      Deleting start commit`);
  console.log(
    (await deleteCommit(migratedInfo.start)).outcome,
  );
  console.log(`      Deleting end commit`);
  console.log(
    (await deleteCommit(migratedInfo.end)).outcome,
  );

  console.log(`    Deleting migrated content...`);
  console.log(
    (await deleteContent(migratedInfo.id)).outcome,
  );

  console.log(`    TODO Deleting migrated upvotes...`);
  //   const upvotesResult = await getUpvotesForViz(migratedInfo.id);
  //   if (upvotesResult.outcome === 'success') {
  //     const upvotes = upvotesResult.value.data;
  //     for (const upvote of upvotes) {
  //       console.log((await deleteUpvote(upvote.id)).outcome);
  //     }
  //   }

  console.log(
    `    TODO Deleting migrated collaborators...`,
  );
  //   const permissionsResult = await getPermissionsForViz(migratedInfo.id);
  //   if (permissionsResult.outcome === 'success') {
  //     const permissions = permissionsResult.value.data;
  //     for (const permission of permissions) {
  //       console.log(
  //         (await deletePermission(permission.id)).outcome,
  //       );
  //     }
  //   }
  console.log(`    Deleting migrated info...`);
  console.log((await deleteInfo(migratedInfo.id)).outcome);
};
