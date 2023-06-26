# My App

## Steps to integrate another microfrontend into mfe host
1. Add a new entry in the file `config/mf.manifest.json` for the new remote microfrontend, say `remote2`
2. Add new route entry in `src/app.tsx` for the new remote microfrontend.
3. Add routes from the new remote microfrontend into the route list at `src/routes.ts`.
4. Add assets from the new remote microfrontend into the assets map at `src/utils/assets-map.ts`. (NOTE: handle assetsMap and assetsMapOnServer)
