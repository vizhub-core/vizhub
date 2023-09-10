import OpenAI from 'openai';
import { encode, decode } from 'gpt-3-encoder';

import { removeEmoji } from './removeEmoji';

// The dimension of the embedding, as a string.
export const embeddingSize = 1536;

// The name of the model to use.
const model = 'text-embedding-ada-002';

// The maximum number of tokens that OpenAI can handle for the model.
const maxTokens = 8191;

// The maximum length of a file name.
const maxFileNameLength = 100;

// The maximum length of a file text.
const maxFileTextLength = 4000;

// The API key for OpenAI.
const apiKey = process.env.VIZHUB_OPENAI_API_KEY;

// The OpenAI API client.
const openai = new OpenAI({ apiKey });

// Ensures the prompt is not too long.
// Inspired by the way LatentScope does it.
function truncateIfNeeded(str) {
  if (!str) str = ' ';
  let tokens = encode(str);
  console.log(
    `    Input for embedding has ${tokens.length} tokens.`,
  );
  if (tokens.length > maxTokens) {
    str = decode(tokens.slice(0, maxTokens));
    console.log(
      `Warning: text is too long. Truncating ${tokens.length} to ${maxTokens} tokens.`,
    );
  }
  return str;
}

// Computes an embedding for the input text.
const embed = async (input) => {
  const embeddingRes = await openai.createEmbedding({
    model,
    input: truncateIfNeeded(input),
  });
  const [{ embedding }] = embeddingRes.data.data;
  return embedding;
};

export const generateEmbeddingOpenAI = async (
  goodFiles,
) => {
  const input = removeEmoji(goodFiles)
    .map(({ name, text }) => {
      // Substring on name as there was one particular case
      // f1ae79caa0d74e13bcfb7ba16355d65f
      // where someone apparently pasted data into the file name field
      const nameSubstring = name
        ?.substring(0, maxFileNameLength)
        .trim();

      // Substring on text to handle large files such as CSV or JSON data files.
      const textSubstring = text
        ?.substring(0, maxFileTextLength)
        .trim();

      // Put the name and text together in a format that OpenAI can understand.
      return `File \`${nameSubstring}\`:\n\`\`\`${textSubstring}\`\`\``;
    })
    .join('\n\n');

  // console.log(
  //   '** Begin input *************************************************************************'
  // );
  // console.log(input);
  // console.log(
  //   '** End input *************************************************************************'
  // );
  return await embed(input);
};
