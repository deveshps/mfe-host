import remote1Routes from 'login_mfe/routes';
// import remote2Routes from 'remote2/routes';

export const routesList: DataSourceItem[] = [
  ...remote1Routes,
  // ...remote2Routes,
];

interface DataSourceItem {
  path: string;
  dataSource: string;
}
