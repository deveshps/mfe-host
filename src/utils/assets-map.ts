import assetsMap from '../../dist/webpack.manifest.json';
import remote1AssetsMap from 'remote1/assetsMap';

const assetsMapAll = { ...assetsMap, ...remote1AssetsMap };

export default assetsMapAll;
