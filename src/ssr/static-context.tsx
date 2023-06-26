import React, { createContext, useContext } from 'react';
import { InitialData } from '../model/response.model';
import { StringIndexable } from '../model/common.model';

const StaticContext = createContext<StaticContextValue | null>(null);

const StaticProvider = ({ children, value }: { children: React.ReactNode, value: StaticContextValue }) => (
  <StaticContext.Provider value={value}>
    {children}
  </StaticContext.Provider>
);

const useStaticContext = () => useContext(StaticContext);

export { StaticProvider, useStaticContext };

interface StaticContextValue {
  initialData: InitialData;
  assetsMap: StringIndexable<string>;
}
