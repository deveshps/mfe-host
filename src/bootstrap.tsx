import React, { StrictMode } from "react";
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from "./app";
import HtmlApp from "./html";

const devServer = process.env.DEV_SERVER === 'true';

const ReactApp = devServer ? App : HtmlApp;
const renderAppElem = (
  <StrictMode>
    <BrowserRouter>
      <ReactApp />
    </BrowserRouter>
  </StrictMode>
);

if (devServer) {
  const root = createRoot(document.getElementById("root") as Element);
  root.render(renderAppElem);
} else {
  hydrateRoot(document, renderAppElem);
}

export {};
