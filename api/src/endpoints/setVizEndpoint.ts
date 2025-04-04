import express from 'express';
import multer from 'multer';
import AdmZip from 'adm-zip';
import {
  Gateways,
  err,
  missingParameterError,
} from 'gateways';
import { accessDeniedError } from 'gateways/src/errors';
import {
  CommitViz,
  GetAPIKeyOwner,
  GetInfoByIdOrSlug,
  SaveViz,
} from 'interactors';
import { Info, Snapshot, dateToTimestamp } from 'entities';
import {
  VizContent,
  VizFiles,
  VizId,
} from '@vizhub/viz-types';
import { generateVizFileId } from '@vizhub/viz-utils';

const upload = multer({ storage: multer.memoryStorage() });

// This endpoint allows a user to update the content of a viz.
// Example usage:
// curl -X POST \
//      -H "Authorization: ${VIZHUB_API_KEY}" \
//      -F "file=@code.zip" \
//      https://your-domain.com/api/set-viz/username/vizId

// This actually works:
// curl -X POST \
//      -H "Authorization: ${VIZHUB_API_KEY}" \
//      -F "file=@vizhub-export.zip" \
//      http://localhost:5173/api/set-viz/curran/awesome
export const setVizEndpoint = ({
  app,
  gateways,
}: {
  app: express.Express;
  gateways: Gateways;
}) => {
  const {
    getUserByUserName,
    saveInfo,
    saveContent,
    getContent,
  } = gateways;
  const getAPIKeyOwner = GetAPIKeyOwner(gateways);
  const getInfoByIdOrSlug = GetInfoByIdOrSlug(gateways);
  const saveViz = SaveViz({ saveInfo, saveContent });

  app.post(
    '/api/set-viz/:userName/:vizIdOrSlug',
    upload.single('file'),
    // @ts-ignore
    async (req, res) => {
      const vizIdOrSlug: string | undefined =
        req.params?.vizIdOrSlug;
      const ownerUserName: string = req.params?.userName;
      const file: Express.Multer.File | undefined =
        req.file;

      // Access the Authorization header
      const apiKeyString: string | undefined =
        req.headers.authorization;

      // Fail if no API key is provided
      if (apiKeyString === undefined) {
        return res
          .status(400)
          .send(err(missingParameterError('apiKey')));
      }

      if (!file) {
        return res
          .status(400)
          .send(err(missingParameterError('file')));
      }

      if (!vizIdOrSlug) {
        return res
          .status(400)
          .send(err(missingParameterError('vizIdOrSlug')));
      }

      // Get the User entity for the owner of the viz.
      const ownerUserResult =
        await getUserByUserName(ownerUserName);
      if (ownerUserResult.outcome === 'failure') {
        // console.log('Error when fetching owner user:');
        // console.log(ownerUserResult.error);
        return res.status(404).send(ownerUserResult.error);
      }
      const ownerUserSnapshot = ownerUserResult.value;
      const userId = ownerUserSnapshot.data.id;

      // Get the owner of the API key
      const apiKeyOwnerResult =
        await getAPIKeyOwner(apiKeyString);
      if (apiKeyOwnerResult.outcome === 'failure') {
        return res
          .status(404)
          .send(apiKeyOwnerResult.error);
      }

      // Validate that the owner of the API key is the same as
      // the owner of the viz
      if (apiKeyOwnerResult.value !== userId) {
        return res
          .status(403)
          .send(
            err(
              accessDeniedError(
                'You are not the owner of this API key. Only the owner can update the viz.',
              ),
            ),
          );
      }

      // Get the Info entity of the Viz.
      const infoResult = await getInfoByIdOrSlug({
        userId,
        idOrSlug: vizIdOrSlug,
      });
      if (infoResult.outcome === 'failure') {
        // Indicates viz not found
        return res.status(404).send(infoResult.error);
      }
      const infoSnapshot: Snapshot<Info> = infoResult.value;
      const oldInfo: Info = infoSnapshot.data;
      const id: VizId = oldInfo.id;

      // Only the owner can update the viz
      // TODO allow collaborators to update the viz
      if (oldInfo.owner !== userId) {
        return res
          .status(403)
          .send(
            err(
              accessDeniedError(
                'You are not the owner of this viz. Only the owner can update the viz.',
              ),
            ),
          );
      }

      const newInfo: Info = {
        ...oldInfo,
        updated: dateToTimestamp(new Date()),
        committed: false,
        commitAuthors: [userId],
      };

      // Unzip the file and update the content
      const zip = new AdmZip(file.buffer);
      const zipEntries = zip.getEntries();

      // TODO use the existing file IDs, use existing logic from migration
      const files: VizFiles = zipEntries.reduce(
        (acc, entry) => {
          acc[generateVizFileId()] = {
            name: entry.entryName,
            text: entry.getData().toString('utf8'),
          };
          return acc;
        },
        {},
      );

      const getContentResult = await getContent(id);
      if (getContentResult.outcome === 'failure') {
        return res.status(500).send(getContentResult.error);
      }
      const contentSnapshot = getContentResult.value;
      const oldContent: VizContent = contentSnapshot.data;

      // Save the new content with isInteracting set to true
      // so that it triggers a build / hot reload.
      const newContent: VizContent = {
        ...oldContent,
        files,
        isInteracting: true,
      };

      // Update the viz with the new content
      // TODO clean this up
      const updateResult1 = await saveViz({
        info: newInfo,
        content: newContent,
      });

      const newContent2: VizContent = {
        ...oldContent,
        files,
      };

      // Update the viz with the new content
      // TODO only update the content
      const updateResult2 = await saveViz({
        info: newInfo,
        content: newContent2,
      });

      await CommitViz(gateways)(id);

      if (updateResult2.outcome === 'failure') {
        return res.status(500).send(updateResult2.error);
      }

      res
        .status(200)
        .send({ message: 'Viz updated successfully' });
    },
  );
};
