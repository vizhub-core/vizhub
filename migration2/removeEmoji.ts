// This code ensures that the error here will not be thrown:
// https://github.com/josephg/unicount/blob/master/index.ts#L12
export const removeEmoji = (object) => {
  const str: string = JSON.stringify(object);
  const newChars: Array<string> = [];
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
