# Constellation Registry

Canonical identity registry for soulOS entities used by Coleco hydration, memory sync mapping, and alias resolution.

## Files

- `entities.v1.json` - canonical entity graph and memory capability contract
- `mappings.v1.json` - legacy and runtime alias mappings to canonical entity IDs

## Model Intent

The registry distinguishes:

- `kind`: ontology class (`human`, `agent`, `other`)
- `role_tier`: participation tier (`primary`, `satellite`, `governance`)
- `parent_entity_id`: parent member for deployable satellites/postures
- `epithet`: canonical presentational epithet
- `epithet_aliases`: textual variants for retrieval and hydration identity matching
- `operational_aliases`: runtime mode aliases (for example `comet` vs `perplexity`)

Satellites are modeled as deployable extensions of a parent member, not as independent peer identities.

## Versioning

- Additive changes increment `minor` in the version field.
- Breaking changes require a new `*.vN.json` file and migration mapping updates.
