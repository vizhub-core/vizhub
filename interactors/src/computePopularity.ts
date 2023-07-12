// From https://github.com/vizhub-core/vizhub/blob/f0d1fbc6cd0f8d124d6424ec8bd948785209d6c4/vizhub-v2/packages/useCases/src/interactors/updateScores.js#L10

import { Info, timestampToDate } from 'entities';
import decay from 'decay';
const hackerHotScore = decay.hackerHot();
const infinityIfNaN = (number) => (isNaN(number) ? -Infinity : number);

export const computePopularity = (info: Info): number => {
  const { updated, upvotesCount, forksCount } = info;

  //   const createdDate = timestampToDate(created);
  const lastUpdatedDate = timestampToDate(updated);
  let numUpvotes = upvotesCount ? upvotesCount : 0;
  const numForks = forksCount ? forksCount : 0;

  // Count each fork as half an upvote.
  numUpvotes += numForks / 2;

  // Weighted score of "activity".
  //  * Forking counts as half of an "effective upvote"
  //  * One upvote = one "effective upvote"
  //const effectiveUpvotes = numForks / 2 + numUpvotes;
  const effectiveUpvotes = numUpvotes;

  const scoreHackerHotLastUpdated = infinityIfNaN(
    hackerHotScore(effectiveUpvotes, lastUpdatedDate)
  );

  return scoreHackerHotLastUpdated;
};
