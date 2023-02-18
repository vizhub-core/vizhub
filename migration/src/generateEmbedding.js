import * as use from '@tensorflow-models/universal-sentence-encoder';
import '@tensorflow/tfjs-node';

let model;

export const generateEmbedding = async (goodFiles) => {
  const sentence = removeEmoji(goodFiles)
    // Substring on name as there was one particular case
    // f1ae79caa0d74e13bcfb7ba16355d65f
    // where someone apparently pasted data into the file name field
    .map(
      ({ name, text }) =>
        name?.substring(0, 100) + ' ' + text?.substring(0, 4000)
    )
    .join(' ')
    .replace(
      /\n|\/\/|<|!|>|\/|{|}|=|;|@|\.|"|\(|\)|`|\+|:|,|'|\||\$|-|\[|\]|\?|#|\*|\\n|_|\d\d+|’|%/g,
      ' '
    )
    // https://stackoverflow.com/questions/1981349/regex-to-replace-multiple-spaces-with-a-single-space
    .replace(/\s\s+/g, ' ');

  if (!model) {
    console.log('Initializing TensorFlow...');
    model = await use.load();
  }

  let embedding;

  // Retry this as it crashes sporadically for no apparent reason.
  const invokeTensorFlow = async () => {
    const embeddingResult = await model.embed([sentence]);
    const embeddingArray = embeddingResult.arraySync();

    try {
      embedding = embeddingResult.arraySync()[0];
    } catch (error) {
      console.log('Caught TensorFlow error. Retrying...');
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await invokeTensorFlow();
    }
  };
  await invokeTensorFlow();

  // Cause for concern - this will break everything downstream.
  if (embedding.length !== 512) {
    console.log('Embedding has a strange length of ' + embedding.length);
    process.exit();
  }

  return embedding;
};

// This code ensures that the error here will not be thrown:
// https://github.com/josephg/unicount/blob/master/index.ts#L12
export const removeEmoji = (object) => {
  const str = JSON.stringify(object);
  const newChars = [];
  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i);
    if (code >= 0xd800 && code <= 0xdfff) {
      // Skip this motherfucker - that shit causes ERRORS
      continue;
    }
    newChars.push(str[i]);
  }
  const newStr = newChars.join('');
  return JSON.parse(newStr);
};
