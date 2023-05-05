require('./configure');
const path = require("path");
const nodeExternals = require('webpack-node-externals');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { EnvironmentPlugin } = require('webpack');
const { UniversalFederationPlugin } = require("@module-federation/node");
const deps = require("../package.json").dependencies;
const { serverRemotes, isProdFunc } = require('./config-utils');
const { getStyleLoaders } = require("./common.config");

const isProd = isProdFunc();

const federationConfig = {
  name: "shell",
  library: { type: "commonjs-module" },
  isServer: true,
  // filename: "remoteEntry.js",
  remotes: serverRemotes,
  shared: {
    ...deps,
    react: deps.react,
    "react-dom": deps["react-dom"],
    "react-router-dom": deps["react-router-dom"],
    rxjs: deps.rxjs,
  },
};

const plugins = [
  new EnvironmentPlugin({
    // NODE_ENV: 'development', // use 'development' unless process.env.NODE_ENV is defined
    MFE_NAME: '',
    PROD_MODE: 'false',
    DEV_SERVER: 'false',
  }),
  new MiniCssExtractPlugin(),
  new UniversalFederationPlugin(federationConfig),
];

module.exports = {
  name: "server",
  mode: isProd ? "production" : "development",
  entry: "./server/index.ts",
  output: {
    path: path.join(process.cwd(), "dist/server"),
    filename: "server.js",
    chunkFilename: '[name].[hash].server.js',
    libraryTarget: "commonjs-module",
  },
  devtool: isProd ? "source-map" : "cheap-module-source-map",
  target: false,  // `false` required for UniversalFederationPlugin
  // externals: [nodeExternals()],  // ignore all modules in node_modules folder
  module: {
    rules: [
      {
        test: /\.(tsx?|jsx?)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.s?css$/,
        use: [...getStyleLoaders(true)],
        exclude: /\.module\.s?css$/,
        sideEffects: true,
      },
      {
        test: /\.module\.s?css$/,
        use: [...getStyleLoaders(true, true)],
      },
    ],
  },
  resolve: {
    alias: {
      "src": path.resolve(process.cwd(), "src"),
    },
    extensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
  },
  plugins,
};
