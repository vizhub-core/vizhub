import { CommitId, Image } from 'entities';
import { GetThumbnail } from 'interactors';
import { RequestWithAuth } from '../types';
import { getAuthenticatedUserId } from '../parseAuth0User';
import { Gateways, Result } from 'gateways';
import { Response } from 'express';

// Requests a page of infos and their correponding owner users.
export const vizThumbnailEndpoint = ({
  app,
  gateways,
}: {
  // WTF TypeScript there must be a better way
  app: Express.Application & {
    get: (
      path: string,
      handler: (
        req: RequestWithAuth,
        res: Response,
      ) => void,
    ) => void;
  };
  gateways: Gateways;
}) => {
  const getThumbnail = GetThumbnail(gateways);
  // const getInfosAndOwners = GetInfosAndOwners(gateways);
  app.get(
    '/api/viz-thumbnail/:commitId-:width.png',
    async (
      req: RequestWithAuth & {
        params: { commitId: CommitId; width: string };
      },
      res: Response,
    ) => {
      // Validate params
      const width = parseInt(req.params.width);
      if (isNaN(width)) {
        return res.status(400).send('Invalid width');
      }
      const commitId = req.params.commitId;
      if (commitId === undefined) {
        return res.status(400).send('Invalid commitId');
      }

      // Get the currently authenticated user.
      const authenticatedUserId =
        getAuthenticatedUserId(req);

      try {
        // Desired behavior for thumbnails:
        //  * If the thumbnail exists, return it.
        //  * If the thumbnail doesn't exist, generate it.
        //    * If the full scale screenshot exists,
        //      generate the thumbnail from it.
        //    * If the full scale screenshot doesn't exist,
        //      generate and store both the full scale screenshot
        //      and the thumbnail.

        // Generate the image using the provided commitId
        const imageResult: Result<Image> =
          await getThumbnail({
            commitId,
            authenticatedUserId,
            width,
          });

        if (imageResult.outcome === 'failure') {
          return res.send(imageResult.error);
        }
        const imageOrNull: Image | null = imageResult.value;

        if (imageOrNull !== null) {
          const image: Image = imageOrNull;
          // Set the proper header for the image response (WebP)
          res.setHeader('content-type', 'image/webp');

          // Send the image buffer as the response
          res.send(image.buffer);
        } else {
          // In this case, the image generation timed out, which
          // could happen if the queue is backed up.
          // We want to just never respond in this case, so that
          // the client will retry the request.
        }
      } catch (error) {
        console.error('Error generating image:', error);
        res.status(500).send('Internal Server Error');
      }
    },
  );
};
