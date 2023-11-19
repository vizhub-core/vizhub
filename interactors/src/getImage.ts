import { Gateways, Result, ok, err } from 'gateways';
import { diff } from 'ot';
import {
  VizId,
  Info,
  Content,
  Commit,
  CommitId,
  Timestamp,
  UserId,
  Visibility,
} from 'entities';
import { generateId } from './generateId';
import { SaveViz } from './saveViz';
import { GetContentAtCommit } from './getContentAtCommit';
import { CommitViz } from './commitViz';

// TODO: Figure out what this should be.
export type Image = any;

// getImage
//  * Gets an image for a commit
//  * If the image has already been generated, returns it.
//  * Otherwise, generates the image and returns it.
//  * Handles concurrency issues.
export const GetImage = (gateways: Gateways) => {
  return async (options: {
    commit: CommitId;
  }): Promise<Result<Image>> => {
    return ok(newInfo);
  };
};
