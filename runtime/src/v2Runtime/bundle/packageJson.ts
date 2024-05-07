import { FilesV2 } from 'entities';

const EMPTY_PKG_JSON = {
  dependencies: {},
  vizhub: {},
  license: 'MIT',
};

export const packageJSON = (files: FilesV2) => {
  const packageJsonFile = files.find(
    (file) => file.name === 'package.json',
  );
  if (!packageJsonFile) {
    return EMPTY_PKG_JSON;
  }
  const packageJsonText = packageJsonFile.text;

  try {
    const pkg = packageJsonText
      ? JSON.parse(packageJsonText)
      : EMPTY_PKG_JSON;
    return pkg;
  } catch (error) {
    console.log(error);
    return EMPTY_PKG_JSON;
  }
};

export const dependencies = (files: FilesV2) =>
  packageJSON(files).dependencies || {};

export const getConfiguredLibraries = (files: FilesV2) => {
  const vizhubConfig = packageJSON(files).vizhub;
  return vizhubConfig ? vizhubConfig.libraries : {};
};

export const dependencySource = (
  { name, version },
  libraries,
) => {
  const path = libraries[name]
    ? libraries[name].path || ''
    : '';
  // unpkg uses file from unpkg or main field when no file specifid in url
  return `https://unpkg.com/${name}@${version}${path}`;
};

export const getLicense = (files) =>
  packageJSON(files).license || EMPTY_PKG_JSON.license;
