import assetsMapJson from '../../dist/webpack.manifest.json';
import mfManifest from '../../config/mf.manifest';
import remote1AssetsMap from 'remote1/assetsMap';

function getAssetMapOnServer(remoteAssetsMap: any, remoteName: string) {
  const { localOrigin, locallyHosted } = (mfManifest as any)[remoteName];
  
  const remoteAssetsMapNew = Object.entries(remoteAssetsMap).map(([key, value]) => {
    if (locallyHosted) {
      value = `${localOrigin}${new URL(value as string).pathname}`;
    }
    return [key, value];
  }).reduce((obj, [key, value]) => {
    return { ...obj, [key as string]: value };
  }, {});
 
  return remoteAssetsMapNew;
}

export const assetsMap = {
  ...assetsMapJson,
  ...remote1AssetsMap,
};

export const assetsMapOnServer = {
  ...assetsMapJson,
  ...getAssetMapOnServer(remote1AssetsMap, 'remote1'),
};
