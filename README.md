1. Start docker compose:
```shell
docker composer up -d
```
---
2. Map host `api.finapp.local` to localhost in your hosts file
---
3. Create DB schema:
```shell
docker exec -it finapp-php php bin/doctrine orm:schema-tool:create
```
---
4. Load fixtures:
```shell
docker exec -it finapp-php php bin/fixtures
```
---
5. Start vite (open url provided by vite in browser):
```shell
cd finapp-react
npm run dev
```
---
6. Enjoy ;)
---