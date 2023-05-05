import remote1Routes from 'remote1/routes';

export const routesList: DataSourceItem[] = [
  ...remote1Routes,
];

interface DataSourceItem {
  path: string;
  dataSource: string;
}
