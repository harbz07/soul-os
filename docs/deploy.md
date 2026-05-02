# Deploy Guide (Workers)

This repo uses per-app Wrangler configs under `apps/<app>/wrangler.toml`.
Do **not** run deploys from the repo root without `--config`.

## Token setup

Use a Cloudflare API token with Workers deploy permissions and set it as:

- local shell env var: `CLOUDFLARE_API_TOKEN`
- CI secret/env var: `CLOUDFLARE_API_TOKEN`

### Local (PowerShell)

Current terminal only:

```powershell
$env:CLOUDFLARE_API_TOKEN = "<token>"
```

Persistent (new terminals):

```powershell
setx CLOUDFLARE_API_TOKEN "<token>"
```

After `setx`, open a **new** terminal before deploy.

## Siddartha deploy

From repo root:

```powershell
.\scripts\deploy-siddartha.ps1
```

Equivalent direct Wrangler command:

```powershell
npx wrangler versions upload --config apps/siddartha/wrangler.toml
```

## Coleco deploy

Direct Wrangler command:

```powershell
npx wrangler versions upload --config apps/coleco/wrangler.toml
```

## Common failure

`Missing entry-point to Worker script or to assets directory`

Cause: deploy command ran from the wrong directory or without `--config`.

Fix: always pass the app config path, e.g. `--config apps/siddartha/wrangler.toml`.
