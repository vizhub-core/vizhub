import { CommitId, Image } from 'entities';
import { GetImage } from 'interactors';
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
  const getImage = GetImage(gateways);
  // const getInfosAndOwners = GetInfosAndOwners(gateways);
  app.get(
    '/api/viz-thumbnail/:commitId.png',
    async (
      req: RequestWithAuth & {
        params: { commitId: CommitId };
      },
      res: Response,
    ) => {
      // Get the currently authenticated user.
      const authenticatedUserId =
        getAuthenticatedUserId(req);

      // Get the commit ID from the request parameters.
      const { commitId } = req.params;

      try {
        // Generate the image using the provided commitId
        const imageResult: Result<Image> = await getImage({
          commitId,
          authenticatedUserId,
        });

        if (imageResult.outcome === 'failure') {
          return res.send(imageResult.error);
        }
        const imageOrNull: Image | null = imageResult.value;

        if (imageOrNull !== null) {
          const image: Image = imageOrNull;
          // Set the proper header for the image response
          res.setHeader('content-type', image.mimeType);

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
