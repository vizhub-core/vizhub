import { UpvoteViz } from 'interactors';
import { logDetail } from './logDetail';
import { generateUpvoteId } from 'interactors';
import { Gateways } from 'gateways';

// Migrate upvotes
export const migrateUpvotesIfNeeded = async ({
  vizV2,
  gateways,
}: {
  vizV2: any;
  gateways: Gateways;
}) => {
  const upvoteViz = UpvoteViz(gateways);
  if (vizV2.info.upvotes && vizV2.info.upvotes.length > 0) {
    logDetail(
      `    Migrating ${vizV2.info.upvotes.length} upvotes ('+' = migrated, '-' = skipped)`
    );
    process.stdout.write(`    `);

    for (const upvote of vizV2.info.upvotes) {
      const viz = vizV2.info.id;
      const user = upvote.userId;
      const timestamp = upvote.timestamp;

      // If the upvote already exists, skip it
      const upvoteId = generateUpvoteId(viz, user);
      const upvoteExists =
        (await gateways.getUpvote(upvoteId)).outcome === 'success';
      if (upvoteExists) {
        // console.log('      Skipping upvote ', upvoteId);
        process.stdout.write('-');
        continue;
      }
      process.stdout.write('+');
      await upvoteViz({ viz, user, timestamp });
    }
    process.stdout.write('\n');
  }
};
