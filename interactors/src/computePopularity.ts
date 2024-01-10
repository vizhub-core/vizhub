// From https://github.com/vizhub-core/vizhub/blob/f0d1fbc6cd0f8d124d6424ec8bd948785209d6c4/vizhub-v2/packages/useCases/src/interactors/updateScores.js#L10

import { Info, timestampToDate } from 'entities';
import decay from 'decay';

// Default gravity is 1.8
// The higher the gravity, the more quickly scores decay.
const gravity = 1.8;

const hackerHotScore = decay.hackerHot(gravity);
const infinityIfNaN = (number) =>
  isNaN(number) ? -Infinity : number;

export const computePopularity = (info: Info): number => {
  const { created, upvotesCount, forksCount } = info;

  // Use the midpoint between created and updated as the date for scoring.
  // const midpointDate = timestampToDate(
  //   (created + updated) / 2,
  // );
  // Use the created date for scoring.
  const createdDate = timestampToDate(created);

  // Compute popularity "points" by weighting
  // upvotes and forks.
  const numUpvotes = upvotesCount ? upvotesCount : 0;
  const numForks = forksCount ? forksCount : 0;
  const points = numUpvotes * 3 + numForks;

  const popularity = infinityIfNaN(
    hackerHotScore(points, createdDate),
  );

  return popularity;
};
