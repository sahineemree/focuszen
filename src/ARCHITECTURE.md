# FocusZen Architecture

## Principles
- `app/` is routing only (Expo Router)
- `src/` contains all product code
- Feature-based modules: `src/modules/<feature>`
- Layering:
  - presentation -> domain -> data
  - domain must not import from presentation/data/platform
  - data may import domain
  - presentation may import domain

## Modules
- soundscape: audio + ambience library (MVP core)
- settings: local preferences + app settings

## Platform adapters
- `src/platform`: adapters for Expo APIs (audio, storage, haptics, etc.)
