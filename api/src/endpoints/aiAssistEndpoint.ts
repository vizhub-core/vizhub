import bodyParser from 'body-parser';
import { EntityName } from 'entities';
import { generateAIResponse } from 'vzcode/src/server/handleAIAssist';
import { toCollectionName } from 'database/src/toCollectionName';

/**
 * Middleware to validate the body of the request.
 */
function validateRequestBody(req, res, next) {
  const { vizId, text, fileId, cursorLocation } = req.body;

  // Check if all required fields are provided
  if (
    !vizId ||
    typeof vizId !== 'string' ||
    !text ||
    typeof text !== 'string' ||
    !fileId ||
    typeof fileId !== 'string' ||
    typeof cursorLocation !== 'number'
  ) {
    return res.status(400).send({
      message:
        'Invalid request body. Missing or invalid fields.',
    });
  }

  next();
}

export const aiAssistEndpoint = ({
  app,
  shareDBConnection,
}) => {
  // Handle AI Assist requests.
  app.post(
    '/api/ai-assist/',
    bodyParser.json(),
    validateRequestBody,
    async (req, res) => {
      const {
        vizId,
        text: inputText,
        cursorLocation: insertionCursor,
        fileId,
      } = req.body;

      // Get the ShareDB document for the viz content
      const entityName: EntityName = 'Content';
      const shareDBDoc = shareDBConnection.get(
        toCollectionName(entityName),
        vizId,
      );

      try {
        await generateAIResponse({
          inputText,
          insertionCursor,
          fileId,
          shareDBDoc,
        });

        res
          .status(200)
          .send({ message: 'Operation successful!' });
      } catch (error) {
        console.error('handleAIAssist error:', error);
        res.status(500).send({
          message: 'Internal Server Error',
          error: error.message,
        });
      }
    },
  );
};
