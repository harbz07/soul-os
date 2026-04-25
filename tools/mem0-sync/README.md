# mem0 Sync Tooling

Tracked sync utilities for hosted-to-local mem0 replication.

## Script

- `hosted_to_local_sync.py`

## Behavior

- Source of truth: hosted Mem0 (`MEM0_API_KEY`)
- Direction: hosted -> local OpenMemory only
- Default import mode: `overwrite`
- Target import endpoint: `<LOCAL_BASE_URL>/api/v1/backup/import`

## Usage

```bash
python tools/mem0-sync/hosted_to_local_sync.py \
  --user-id harvey \
  --local-base-url http://127.0.0.1:8765 \
  --import-mode overwrite
```
