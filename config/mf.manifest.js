const mfManifestDev = require('./mf.manifest.dev.json');
const mfManifestProd = require('./mf.manifest.prod.json');

const isProd = process.env.NODE_ENV === 'production';

const mfManifest = isProd ? mfManifestProd : mfManifestDev;

module.exports = mfManifest;
