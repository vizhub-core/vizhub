// From https://github.com/vizhub-core/vizhub/blob/f0d1fbc6cd0f8d124d6424ec8bd948785209d6c4/vizhub-v2/packages/useCases/src/interactors/updateScores.js#L10

import { Info, timestampToDate } from 'entities';
import decay from 'decay';
const hackerHotScore = decay.hackerHot();
const infinityIfNaN = (number) =>
  isNaN(number) ? -Infinity : number;

export const computePopularity = (info: Info): number => {
  const { created, updated, upvotesCount, forksCount } =
    info;

  // Use the midpoint between created and updated as the date for scoring.
  const midpointDate = timestampToDate(
    (created + updated) / 2,
  );

  // Compute popularity "points" where:
  // * One upvote = two points
  // * One fork = one point
  const numUpvotes = upvotesCount ? upvotesCount : 0;
  const numForks = forksCount ? forksCount : 0;
  const points = numUpvotes + numForks / 2;

  const popularity = infinityIfNaN(
    hackerHotScore(points, midpointDate),
  );

  return popularity;
};
