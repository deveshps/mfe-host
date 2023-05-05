import { Response } from 'express';
import { GenericRequest } from '../model/common.model';
import { InitialData } from '../model/response.model';
import { fetchPageData } from '../shared/utils';

export async function fetchInitialData(req: GenericRequest, res?: Response): Promise<InitialData | null> {
  const pageData = await fetchPageData(req);

  return {
    pageData,
    headerData: {},
    footerData: {},
  };
}

export function extractInitialData(staticContext?: InitialData | null): InitialData | null {
  const initialDataOnServer = () => staticContext || null;

  const initialDataOnClient = () => {
    if (typeof window !== 'undefined') {
      return (window as any).__INITIAL_DATA__ || null;
    }
    return null;
  };

  const isServer = typeof window === 'undefined';
  const initialData = isServer ? initialDataOnServer() : initialDataOnClient();

  return initialData;
}
