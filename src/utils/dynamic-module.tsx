import React from "react";
// @ts-expect-error
import { RemoteComponent } from 'react-dynamic-remote-component';

// Ref: [Dynamic loading of modules]
// https://dev.to/omher/lets-dynamic-remote-modules-with-webpack-module-federation-2b9m
// https://oskari.io/blog/dynamic-remotes-module-federation/

// NOTE:
// SSR will not work for this component, and throw with message `window is not defined`
// So, call this function dynamically on client, e.g. on button click, or inside useEffect()
export function dynamicModule(module: string, remote: { scope: string, entryUrl: string }) {
  return (props: any) => (
    <RemoteComponent
      module={module}
      scope={remote.scope}
      url={remote.entryUrl}
      {...props}
    />
  );
}
