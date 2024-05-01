// From https://github.com/vizhub-core/vizhub/blob/f0d1fbc6cd0f8d124d6424ec8bd948785209d6c4/vizhub-v2/packages/useCases/src/interactors/updateScores.js#L10

import { Info, timestampToDate } from 'entities';
import decay from 'decay';

// Default gravity is 1.8
// The higher the gravity, the more quickly scores decay.
const gravity = 1.2;

const hackerHotScore = decay.hackerHot(gravity);
const infinityIfNaN = (number) =>
  isNaN(number) ? -Infinity : number;

export const computePopularity = (info: Info): number => {
  const { created, updated, upvotesCount, forksCount, v3 } =
    info;

  // Use the midpoint between created and updated as the date for scoring.
  const midpointDate = timestampToDate(
    (created + updated) / 2,
  );
  // Use the created date for scoring.
  // const createdDate = timestampToDate(created);

  // Compute popularity "points" by weighting
  // upvotes and forks.

  // Forks are worth 1 point each.
  const forkPoints = forksCount || 0;

  // Upvotes are worth 5 points each.
  const upvotePoints = (upvotesCount || 0) * 5;

  // V3 vizzes are worth 2 points.
  // const v3Points = v3 ? 2 : 0;

  let points = upvotePoints + forkPoints;

  // Multiplier effect for v3 vizzes.
  if (v3) {
    points = points * 1.5;
  }

  const popularity = infinityIfNaN(
    hackerHotScore(points, midpointDate),
  );

  return popularity;
};
