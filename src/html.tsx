import React from "react";
import App from "./app";
import { useStaticContext } from './ssr/static-context';
import { extractInitialData } from "./ssr/initial-data";
import { StringIndexable } from "./model/common.model";

// NOTE: Keep it in ES5, as it is expected to go to browser w/o transpilation
function onLoadScript() {
  function onLoad(callback: () => void) {
    if (document.readyState === 'complete') {
      callback();
    } else {
      window.addEventListener('load', callback);
    }
  }
  onLoad(function() {
    // NOTE: Not deleting data-ssr='css-remote' due to observed FOUS for a bit after SSR
    var styleElements = document.querySelectorAll("style[data-ssr='css']");
    styleElements.forEach(function(elem) {
      elem.remove();
    });
  });
}

function Html({ children, assetsMap, styleSheetData, title }: HtmlProps) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="shortcut icon" href="/logo.a0185b04.svg" />
        <title>{title || 'My App'}</title>
        <meta name="description" content="my app" />

        {/* {styleSheets && styleSheets.map(url => (
          <link key={url} rel="stylesheet" type="text/css" href={url} />
        ))} */}
        {styleSheetData && Object.entries(styleSheetData).map(([styleSheet, styleSheetContent]) => (
          <style key={styleSheet} data-ssr={`css${styleSheet.startsWith('http') ? '-remote' : ''}`}>
            {styleSheetContent}
          </style>
        ))}
      </head>
      <body style={{margin:0}}>
        <noscript
          dangerouslySetInnerHTML={{
            __html: `<b>Enable JavaScript to run this app.</b>`
          }}
        />
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html: `${onLoadScript.toString()}\n${onLoadScript.name}();`
          }}
        />
      </body>
    </html>
  );
}

function HtmlApp({ styleSheetData }: HtmlAppProps) {
  const staticContext = useStaticContext();
  const initialData = extractInitialData(staticContext?.initialData);
  const assetsMap = staticContext?.assetsMap || null;

  return (
    <Html assetsMap={assetsMap} styleSheetData={styleSheetData}>
      <App initialData={initialData} />
    </Html>
  );
}

export default HtmlApp;

interface HtmlProps {
  children: React.ReactNode;
  assetsMap: StringIndexable<string> | null;
  styleSheetData?: StringIndexable<string> | null;
  title?: string;
}

interface HtmlAppProps {
  styleSheetData?: StringIndexable<string> | null;
}
