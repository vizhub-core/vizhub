import { UpvoteViz } from 'interactors';
import { generateUpvoteId } from 'interactors';
import { Gateways } from 'gateways';
import { UpvoteV2, VizId } from 'entities';

// Migrate upvotes
export const migrateUpvotes = async ({
  vizId,
  upvotesV2,
  gateways,
}: {
  vizId: VizId;
  upvotesV2: Array<UpvoteV2>;
  gateways: Gateways;
}) => {
  const { getUpvote } = gateways;
  const upvoteViz = UpvoteViz(gateways);

  process.stdout.write('    ');
  if (upvotesV2 && upvotesV2.length > 0) {
    for (const upvoteV2 of upvotesV2) {
      const { userId, timestamp } = upvoteV2;

      // If the upvote already exists, skip it
      const upvoteId = generateUpvoteId(userId, vizId);
      const upvoteExists =
        (await getUpvote(upvoteId)).outcome === 'success';
      if (upvoteExists) {
        process.stdout.write('-');
      } else {
        process.stdout.write('+');

        const result = await upvoteViz({
          user: userId,
          viz: vizId,
          timestamp,
        });
        if (result.outcome === 'failure') {
          console.log(result.error);
          process.exit(1);
        }
      }
    }
    process.stdout.write('\n');
  }
};
