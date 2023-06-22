import React from 'react';
import { Request, Response } from 'express';
import { renderToPipeableStream } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import HtmlApp from '../src/html';
import { fetchInitialData } from '../src/ssr/initial-data';
import { StaticProvider } from '../src/ssr/static-context';
import { extractStyleSheetData } from "../src/ssr/ssr-utils";
import { InitialData } from '../src/model/response.model';
import { assetsMap, assetsMapOnServer } from '../src/utils/assets-map';

export async function sendResponse(req: Request, res: Response) {
  res.socket?.on('error', (error) => console.error('Fatal:', error));

  const p1 = fetchInitialData(req, res);
  const p2 = extractStyleSheetData(assetsMap, assetsMapOnServer);

  const [initialDataValue, styleSheetData] = await Promise.all([p1, p2]);

  const initialData: InitialData = { ...initialDataValue }; // initialData might change during serverRender

  const location = {
    pathname: req.url,
  };

  let didError = false;
  const stream = renderToPipeableStream(
    <StaticRouter location={location}>
      <StaticProvider value={{ initialData, assetsMap }}>
        <HtmlApp styleSheetData={styleSheetData} />
      </StaticProvider>
    </StaticRouter>,
    {
      bootstrapScriptContent: `window.__INITIAL_DATA__ = ${JSON.stringify(initialData)};`,
      bootstrapScripts: [`${assetsMap['main.js']}`],
      onShellReady: () => {
        res.statusCode = didError ? 500 : 200;
        res.setHeader('Content-type', 'text/html');
        stream.pipe(res);
      },
      onError: (error) => {
        didError = true;
        console.error('Error:', error);
      },
    }
  );
}

export async function sendEmptyResponse(req: Request, res: Response) {
  res.status(404).send();
}
