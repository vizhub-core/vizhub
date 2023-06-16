import { Configuration, OpenAIApi } from 'openai';

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

export const generateEmbeddingOpenAI = async ({ goodFiles, openAiAPIKey }) => {
  const input = removeEmoji(goodFiles)
    // Substring on name as there was one particular case
    // f1ae79caa0d74e13bcfb7ba16355d65f
    // where someone apparently pasted data into the file name field
    .map(({ name, text }) =>
      [
        `File \`${name?.substring(0, 100)}\`:`,
        '```\n',
        text?.substring(0, 4000),
        '```\n',
      ].join('\n')
    )
    .join('\n\n');

  console.log('TODO format sentence for openai');
  console.log('TODO check ballpark token limit');

  console.log(input);

  return await embed(input);
};
