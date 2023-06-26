require('./configure');
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const { EnvironmentPlugin } = require('webpack');
const { ModuleFederationPlugin } = require("webpack").container;
// const { FederatedTypesPlugin } = require('@module-federation/typescript');
const WebpackRemoteTypesPlugin = require("webpack-remote-types-plugin").default;
const deps = require("../package.json").dependencies;
const { remotes, remotesBase, isProdFunc } = require('./config-utils');
const { getStyleLoaders, styleBasePath } = require("./common.config");

const isProd = isProdFunc();
const devServer = process.env.DEV_SERVER === 'true';

const miniCssFileName = isProd ? 'style.[contenthash:10].css' : 'style.css';
const miniCssChunkName = isProd ? '[name].[contenthash:10].chunk.css' : '[name].chunk.css';

const federationConfig = {
  name: "shell",
  // filename: "remoteEntry.js",
  remotes,
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
  new HtmlWebpackPlugin({
    template: "./public/index.html",
  }),
  new CopyWebpackPlugin({
    patterns: [
      {
        from: "public",
        globOptions: {
          ignore: ['**/index.html'],
        },
        // noErrorOnMissing: true,
      },
    ],
  }),
  new MiniCssExtractPlugin({
    filename: `${styleBasePath}${miniCssFileName}`,
    chunkFilename: `${styleBasePath}${miniCssChunkName}`,
    // insert: function (linkTag) {
    //   // Ref: https://webpack.js.org/plugins/mini-css-extract-plugin/#insert
    //   document.head.appendChild(linkTag);
    // },
  }),
  new WebpackManifestPlugin({
    fileName: 'webpack.manifest.json',
  }),
  new ModuleFederationPlugin(federationConfig),
  // new FederatedTypesPlugin({
  //   federationConfig,
  // }),
];

if (!devServer && process.env.NODE_ENV !== 'production') {
  plugins.push(new WebpackRemoteTypesPlugin({
    remotes: remotesBase,
    outputDir: 'node_modules/@types_mfe',
    remoteFileName: 'types/[name]-dts.tgz',
  }));
}

module.exports = {
  name: "client",
  mode: isProd ? "production" : "development",
  entry: "./src/index.ts",
  output: {
    path: path.join(process.cwd(), "dist"),
    filename: "bundle.[contenthash:8].js",
    chunkFilename: '[name].[contenthash:8].bundle.js',
    publicPath: "/",
  },
  devtool: isProd ? "source-map" : "cheap-module-source-map",
  target: 'web',
  devServer: {
    static: {
      directory: path.join(process.cwd(), 'public'),
    },
    historyApiFallback: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
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
        use: [...getStyleLoaders(false)],
        exclude: /\.module\.s?css$/,
        sideEffects: true,
      },
      {
        test: /\.module\.s?css$/,
        use: [...getStyleLoaders(false, true)],
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
