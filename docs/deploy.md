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

This defaults to `wrangler deploy` (direct production deploy, non-interactive).

To upload a version only (without production traffic switch):

```powershell
.\scripts\deploy-siddartha.ps1 -Mode upload
```

Equivalent direct Wrangler command:

```powershell
npx wrangler versions upload --config apps/siddartha/wrangler.toml
```

If you are already in `apps/siddartha`, use:

```powershell
npx wrangler versions upload --config wrangler.toml
```

## Coleco deploy

From repo root:

```powershell
.\scripts\deploy-coleco.ps1
```

This defaults to `wrangler deploy` (direct production deploy, non-interactive).

To upload a version only (without production traffic switch):

```powershell
.\scripts\deploy-coleco.ps1 -Mode upload
```

Equivalent direct Wrangler command:

```powershell
npx wrangler versions upload --config apps/coleco/wrangler.toml
```

If you are already in `apps/coleco`, use:

```powershell
npx wrangler versions upload --config wrangler.toml
```

## Secret provisioning (both workers)

Push required/optional secrets from your environment into Cloudflare:

```powershell
.\scripts\push-worker-secrets.ps1 -Worker all
```

Worker-specific runs:

```powershell
.\scripts\push-worker-secrets.ps1 -Worker siddartha
.\scripts\push-worker-secrets.ps1 -Worker coleco
```

Load from a local `.env` file first (without printing values):

```powershell
.\scripts\push-worker-secrets.ps1 -Worker all -DotEnvPath .env
```

## Common failure

`Missing entry-point to Worker script or to assets directory`

Cause: deploy command ran from the wrong directory or without `--config`.

Fix: always pass the app config path, e.g. `--config apps/siddartha/wrangler.toml`.
