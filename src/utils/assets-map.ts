import assetsMap from '../../dist/webpack.manifest.json';
import remote1AssetsMap from 'remote1/assetsMap';
import remote2AssetsMap from 'remote2/assetsMap';

const assetsMapAll = {
  ...assetsMap,
  ...remote1AssetsMap,
  ...remote2AssetsMap,
};

export default assetsMapAll;
