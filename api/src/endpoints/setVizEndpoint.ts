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

  const processVizUpdate = async ({
    req,
    res,
  }: {
    req: express.Request;
    res: express.Response;
  }) => {
    const vizIdOrSlug: string | undefined =
      req.params?.vizIdOrSlug;
    const ownerUserName: string = req.params?.userName;

    // Access the Authorization header
    const apiKeyString: string | undefined =
      req.headers.authorization;

    // Fail if no API key is provided
    if (apiKeyString === undefined) {
      return res
        .status(400)
        .send(err(missingParameterError('apiKey')));
    }

    if (!vizIdOrSlug) {
      return res
        .status(400)
        .send(err(missingParameterError('vizIdOrSlug')));
    }

    // Either req.body or req.file should be defined
    const file: Express.Multer.File | undefined = req.file;
    const body = req.body;

    if (!file && !body) {
      return res
        .status(400)
        .send(
          err(
            missingParameterError(
              'No `file` or `body` provided',
            ),
          ),
        );
    }

    if (body && !body.files) {
      return res
        .status(400)
        .send(
          err(
            missingParameterError(
              'No `files` provided in the body',
            ),
          ),
        );
    }

    let files: Files;
    // Handle the case where a zip file is uploaded
    if (file) {
      // Unzip the file and update the content
      const zip = new AdmZip(file.buffer);
      const zipEntries = zip.getEntries();

      // TODO use the existing file IDs, use existing logic from migration
      files = zipEntries.reduce((acc, entry) => {
        acc[generateFileId()] = {
          name: entry.entryName,
          text: entry.getData().toString('utf8'),
        };
        return acc;
      }, {});
    } else {
      // Handle the case where a JSON object is provided
      files = body.files;
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

    // Get the owner of the API key
    const apiKeyOwnerResult =
      await getAPIKeyOwner(apiKeyString);
    if (apiKeyOwnerResult.outcome === 'failure') {
      return res.status(404).send(apiKeyOwnerResult.error);
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

    const getContentResult = await getContent(id);
    if (getContentResult.outcome === 'failure') {
      return res.status(500).send(getContentResult.error);
    }
    const contentSnapshot = getContentResult.value;
    const oldContent: Content = contentSnapshot.data;

    // Save the new content with isInteracting set to true
    // so that it triggers a build / hot reload.
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
    if (updateResult1.outcome === 'failure') {
      return res.status(500).send(updateResult1.error);
    }

    // This un-sets isInteracting.
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
  };

  app.post(
    '/api/set-viz/json/:userName/:vizIdOrSlug',
    express.json(),
    async (req, res) => {
      // req.body is defined here
      await processVizUpdate({ req, res });
    },
  );

  app.post(
    '/api/set-viz/zip/:userName/:vizIdOrSlug',
    upload.single('file'),
    async (req, res) => {
      // req.file is defined here
      await processVizUpdate({ req, res });
    },
  );
};
