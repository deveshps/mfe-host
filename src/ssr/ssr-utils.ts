import path from "path";
import { readFile } from "fs/promises";
import { StringIndexable } from "../model/common.model";
import { styleBasePath } from "../../config/common.config"

export const isProdFunc = () => {
  // const isProduction = process.env.NODE_ENV === 'production';
  const isProd = process.env.PROD_MODE === 'true';
  const devServer = process.env.DEV_SERVER === 'true';
  return !devServer && isProd;
};

const extractStyleSheets = (assetsMap: StringIndexable<string> | null, assetsMapOnServer: StringIndexable<string> | null) => {
  if (!assetsMap || !assetsMapOnServer) return null;

  // TODO: ignore remote mfe styles if current route/pathname does not match for the mfe
  const styleSheets = Object.entries(assetsMap)
    .filter(([key]) => key.endsWith('.css'))
    .map(([key, value]) => [value, assetsMapOnServer[key]]);

  if (styleSheets.length === 0) {
    return null;
  }
  return styleSheets;
};

const readLocalStyleSheet = async (styleSheet: string) => {
  let styleSheetContent = null;
  try {
    const styleSheetPath = path.join(process.cwd(), `dist/${styleSheet}`);
    styleSheetContent = (await readFile(styleSheetPath)).toString();

    const basePath = `/${styleBasePath}`;
    styleSheetContent = styleSheetContent.replace('sourceMappingURL=', `sourceMappingURL=${basePath}`);
    // styleSheetContent = removeComments(styleSheetContent).trim();  
  } catch (e) {
    console.error('[ERROR:readLocalStyleSheet]', e);
    styleSheetContent = null;
  }
  return { [styleSheet]: styleSheetContent };
};

const readRemoteStyleSheet = async (styleSheet: string, styleSheetOnServer: string) => {
  let styleSheetContent = null;
  try {
    const styleSheetUrl = styleSheetOnServer;

    const resp = await fetch(styleSheetUrl);
    styleSheetContent = await resp.text();

    const index = styleSheet.lastIndexOf('/');
    const basePathUrl = styleSheet.substring(0, index + 1);
    styleSheetContent = styleSheetContent.replace('sourceMappingURL=', `sourceMappingURL=${basePathUrl}`);
  } catch (e) {
    console.error('[ERROR:readRemoteStyleSheet]', e);
    styleSheetContent = null;
  }
  return { [styleSheetOnServer]: styleSheetContent };
};

export const extractStyleSheetData = async (assetsMap: StringIndexable<string> | null, assetsMapOnServer: StringIndexable<string> | null) => {
  const styleSheets = extractStyleSheets(assetsMap, assetsMapOnServer);
  if (!styleSheets) return null;

  const prList = styleSheets.map(([styleSheet, styleSheetOnServer]) => {
    if (!styleSheet.startsWith('http')) {
      return readLocalStyleSheet(styleSheet);
    } else {
      return readRemoteStyleSheet(styleSheet, styleSheetOnServer);
    }
  });
  const styleSheetDataList = await Promise.all(prList);

  const styleSheetDataAll: StringIndexable<string | null> = styleSheetDataList.reduce((acc, styleObj) => {
    return { ...acc, ...styleObj };
  }, {});

  const styleSheetData: StringIndexable<string> = Object.entries(styleSheetDataAll).filter(([_, styleSheet]) => {
    return !!styleSheet;
  }).reduce((acc, [key, styleSheet]) => {
    return { ...acc, [key]: styleSheet};
  }, {});

  if (!Object.keys(styleSheetData).length) {
    return null;
  }
  return styleSheetData;
};

// // Ref: https://stackoverflow.com/a/59094308
// function removeComments(codeString: string) {
//   // takes a string of code, and strips comments: //, /* */
//   return codeString.replace(/\/\*[\s\S]*?\*\/|(?<=[^:])\/\/.*|^\/\/.*/g,'').trim();
// }
