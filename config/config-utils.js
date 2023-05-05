const mfManifest = require('./mf.manifest.json');

function getRemotesBase(remotes) {
  const sources = Object.entries(remotes).map(([key, value]) => {
    const i = value.indexOf('@');
    const remoteName = value.substring(0, i);
    const remoteUrl = value.substring(i + 1);
    const url = new URL(remoteUrl);
    url.href = url.origin;
    return { [key]: `${remoteName}@${url.toString()}` };
  });
  return Object.assign({}, ...sources);
}
  
const remotesList = Object.entries(mfManifest).map(([key, value]) => ({ [key]: `${value.scope}@${value.entryUrl}` }));
const serverRemotesList = Object.entries(mfManifest).map(([key, value]) => ({ [key]: `${value.scope}@${value.serverEntryUrl}` }));

const remotes = Object.assign({}, ...remotesList);
const serverRemotes = Object.assign({}, ...serverRemotesList);
const remotesBase = getRemotesBase(remotes);

const isProdFunc = () => {
  // const isProduction = process.env.NODE_ENV === 'production';
  const isProd = process.env.PROD_MODE === 'true';
  const devServer = process.env.DEV_SERVER === 'true';
  return !devServer && isProd;
};

module.exports = { remotes, remotesBase, serverRemotes, isProdFunc };
