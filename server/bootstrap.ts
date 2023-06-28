import path from 'path';
import express from 'express';
import { sendResponse, sendEmptyResponse } from './render';
import { isProdFunc } from "../src/ssr/ssr-utils";

const isProd = isProdFunc();
const mode = isProd ? 'prod' : 'dev';

const app = express();

const PORT =  5000;

app.use(express.static(path.join(process.cwd(), 'dist'), { index: false }));

app.get('*', (req, res) => {
  if (['.js', '.css', '.map'].includes(req.path.substring(req.path.lastIndexOf('.')))) {
    // [Unexpected] Static file should already exist in `dist` folder
    sendEmptyResponse(req, res);
  } else {
    sendResponse(req, res);
  }
});

app.listen(PORT, () => {
  console.log(`[${mode}] Server started on port ${PORT}`);
});

// TODO: https://github.com/module-federation/universe/tree/main/packages/node#revalidate
app.post('/_reload', (req, res) => {
  process.exit();
});
