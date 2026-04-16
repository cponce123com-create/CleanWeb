# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

## Artifacts

### CleanWeb.tools (`artifacts/cleanweb-tools`)
- **Kind**: react-vite (frontend-only, no backend)
- **Preview path**: `/`
- **Language**: Spanish (todo en español)
- **Description**: Colección de herramientas gratuitas para limpiar y gestionar redes sociales. Todo funciona en el navegador con scripts de consola, sin guardar datos.
- **Pages**:
  - `/` — Homepage con buscador en tiempo real y grid de herramientas por plataforma
  - `/google-fotos` — Eliminar Google Fotos (script de consola)
  - `/youtube/exportar-playlist` — Exportar playlist YouTube a CSV
  - `/youtube/borrar-historial` — Borrar historial YouTube
  - `/instagram/dejar-de-seguir` — Dejar de seguir en Instagram
  - `/instagram/quitar-likes` — Quitar likes en Instagram
  - `/twitter/dejar-de-seguir` — Dejar de seguir en Twitter/X
  - `/twitter/borrar-tweets` — Borrar tweets
  - `/facebook/dejar-de-seguir` — Dejar de seguir en Facebook
  - `/tiktok/dejar-de-seguir` — Dejar de seguir en TikTok
  - `/spotify/exportar-playlist` — Exportar playlist Spotify (OAuth PKCE)
- **Design tokens**: fondo #0a0a0a, cards #141414, acento verde #4ade80, azul #60a5fa, rojo #ef4444
- **Icons**: lucide-react + react-icons/si (SiInstagram, SiX, SiFacebook, SiTiktok, SiSpotify, SiYoutube, SiGooglephotos); LinkedIn usa Linkedin de lucide-react
