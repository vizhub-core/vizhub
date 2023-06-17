import { Configuration, OpenAIApi } from 'openai';
import { removeEmoji } from './removeEmoji';

// The dimension of the embedding, as a string.
export const embeddingSize = 1536;

const apiKey = process.env.VIZHUB_OPENAI_API_KEY;

const configuration = new Configuration({ apiKey });
const openAi = new OpenAIApi(configuration);

// Computes an embedding for the input text.
const embed = async (input) => {
  const embeddingRes = await openAi.createEmbedding({
    model: 'text-embedding-ada-002',
    input,
  });
  const [{ embedding }] = embeddingRes.data.data;
  return embedding;
};

export const generateEmbeddingOpenAI = async (goodFiles) => {
  const input = removeEmoji(goodFiles)
    .map(({ name, text }) => {
      // Substring on name as there was one particular case
      // f1ae79caa0d74e13bcfb7ba16355d65f
      // where someone apparently pasted data into the file name field
      const nameSubstring = name?.substring(0, 100).trim();

      // Substring on text to handle large files such as CSV or JSON data files.
      const textSubstring = text?.substring(0, 4000).trim();

      // Put the name and text together in a format that OpenAI can understand.
      return `File \`${nameSubstring}\`:\n\`\`\`${textSubstring}\`\`\``;
    })
    .join('\n\n');

  console.log('TODO format sentence for openai');
  console.log('TODO check ballpark token limit');
  console.log(
    '** Begin input *************************************************************************'
  );
  console.log(input);
  console.log(
    '** End input *************************************************************************'
  );
  return await embed(input);
};
