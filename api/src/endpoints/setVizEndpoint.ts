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
  GetInfoByIdOrSlug,
  SaveViz,
} from 'interactors';
import {
  Content,
  Files,
  Info,
  Snapshot,
  VizId,
  dateToTimestamp,
  generateFileId,
} from 'entities';

const upload = multer({ storage: multer.memoryStorage() });

// This endpoint allows a user to update the content of a viz.
// Example usage:
// curl -X POST \
//      -H "Authorization: ${VIZHUB_API_KEY}" \
//      -F "file=@code.zip" \
//      https://your-domain.com/api/set-viz/username/vizId

// This actually works:
// curl -X POST \
//      -F "file=@vizhub-export-new.zip" \
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
  const getInfoByIdOrSlug = GetInfoByIdOrSlug(gateways);
  const saveViz = SaveViz({ saveInfo, saveContent });

  app.post(
    '/api/set-viz/:userName/:vizIdOrSlug',
    upload.single('file'),
    async (req, res) => {
      const vizIdOrSlug: string | undefined =
        req.params?.vizIdOrSlug;
      const ownerUserName: string = req.params?.userName;
      const file: Express.Multer.File | undefined =
        req.file;

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
        console.log('Error when fetching owner user:');
        console.log(ownerUserResult.error);
        return res.status(404).send(ownerUserResult.error);
      }
      const ownerUserSnapshot = ownerUserResult.value;
      const userId = ownerUserSnapshot.data.id;

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
      const files: Files = zipEntries.reduce(
        (acc, entry) => {
          acc[generateFileId()] = {
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
      const oldContent: Content = contentSnapshot.data;

      const newContent: Content = {
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

      const newContent2: Content = {
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
