import { UserName, VizId } from 'entities';

export type VizImport = {
  userName: UserName;
  idOrSlug: VizId | string;
};

export const extractVizImport = (
  str: string,
): VizImport | null => {
  // Updated regular expression pattern
  // Username: Alphanumeric characters, including underscores and hyphens
  // ID: Alphanumeric characters, including underscores, hyphens, and possibly other special characters
  const pattern = /^@([a-zA-Z0-9_-]+)\/([a-zA-Z0-9_-]+)$/;
  const match = str.match(pattern);

  if (match) {
    // Extract the username and id
    return {
      userName: match[1],
      idOrSlug: match[2],
    };
  } else {
    // Return null if the string does not match
    return null;
  }
};

// // Example usages
// const result1 = extractDetails("@curran/21f72bf74ef04ea0b9c9b82aaaec859a");
// console.log(result1); // { username: "curran", id: "21f72bf74ef04ea0b9c9b82aaaec859a" }

// const result2 = extractDetails("@curran/scatter-plot");
// console.log(result2); // { username: "curran", id: "scatter-plot" }
