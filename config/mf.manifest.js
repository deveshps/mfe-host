const mfManifestJson = require('./mf.manifest.json');

const isProd = process.env.NODE_ENV === 'production';

const mfManifest = Object.entries(mfManifestJson).map(([key, value]) => {
  if (isProd && value.remoteOrigin) {
    value.entryUrl = `${value.remoteOrigin}${value.entryUrl}`;
  } else {
    value.entryUrl = `${value.localOrigin}${value.entryUrl}`;
  }
  if (isProd && !value.locallyHosted) {
    value.serverEntryUrl = `${value.remoteOrigin}${value.serverEntryUrl}`;
  } else {
    value.serverEntryUrl = `${value.localOrigin}${value.serverEntryUrl}`;
  }
  return [key, value];
}).reduce((obj, [key, value]) => {
  return { ...obj, [key]: value };
}, {});

module.exports = mfManifest;
