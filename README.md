# SvelteKit + Rust (Axum) — minimal template for Vercel

Frontend: **SvelteKit 3 / Svelte 5 + Tailwind 4 + Lucide icons**. Backend: **Rust + Axum**. Deploy: **Vercel**.
No auth, no database, no required `.env`: clone, install, run.

> **This template is built for [Bun](https://bun.sh).** Use `bun` for everything (install, scripts, adding packages). Do not use npm/yarn/pnpm: the lockfile is `bun.lock`, and mixing package managers creates conflicting lockfiles.

## Requirements

- [Bun](https://bun.sh) 1.1+
- Rust (via [rustup](https://rustup.rs))

Arch Linux: `sudo pacman -S rustup && rustup default stable`, and Bun via `curl -fsSL https://bun.sh/install | bash`.

## Getting started

```bash
bun install
bun run dev      # starts Vite (5173) + the Rust server (3001) together
```

Open http://localhost:5173. Vite proxies `/api/*` to Rust, so the frontend calls `/api/...` the same way in dev and in production.

## Project structure

```
api/server.rs          Rust entry point (Vercel Function or local server)
src-rs/lib.rs          main router (everything under /api)
src-rs/routes/         one file per route (health.rs, hello.rs)
src/routes/            SvelteKit pages
src/lib/api.ts         fetch helper for the backend
bun.lock               Bun lockfile (commit it)
src/app.css            Tailwind (@import 'tailwindcss')
vite.config.ts         Vite + SvelteKit (adapter) config + /api proxy
vercel.json            rewrite /api/* -> Rust function
Cargo.toml             Rust deps (axum, tokio, serde, vercel_runtime)
```

## Adding an API route

1. Create `src-rs/routes/ping.rs`:
   ```rust
   pub async fn ping() -> &'static str { "pong" }
   ```
2. In `src-rs/routes/mod.rs`: add `pub mod ping;` and `.route("/ping", get(ping::ping))`
3. Call it from the frontend: `await api('/ping')` → `GET /api/ping`

## Icons (Lucide)

Icons come from [`@lucide/svelte`](https://lucide.dev/guide/packages/lucide-svelte). Import them one by one to keep the bundle small:

```svelte
<script lang="ts">
	import Rocket from '@lucide/svelte/icons/rocket';
</script>

<Rocket class="size-5 text-orange-500" />
```

Browse all icons at https://lucide.dev/icons. Size and color are controlled with Tailwind classes.

## Scripts

| command | what it does |
|---|---|
| `bun run dev` | frontend + backend together |
| `bun run dev:web` / `dev:api` | only one side |
| `bun run build` | SvelteKit production build |
| `bun run check` | svelte-check (types) |
| `bun run check:api` / `bun run fmt` | `cargo check` / `cargo fmt` |

## Deploying to Vercel

1. Push the repo to GitHub (including `bun.lock`) and import it in Vercel. The **SvelteKit** preset is auto-detected, and Vercel installs with Bun when it finds `bun.lock`.
2. Deploy. The Rust function is compiled by Vercel's Rust runtime (beta) from `Cargo.toml` + `api/server.rs`.

## Notes

- **SvelteKit 3:** Kit config lives in `vite.config.ts` (there is no `svelte.config.js`), and the import alias is `#lib/...` (defined in `package.json > imports`), with the file extension in the import (`'#lib/api.js'`).
- **Lightweight:** Rust `release` profile uses LTO + `strip`; the frontend has no extra dependencies beyond the essentials (Tailwind via the Vite plugin).
- **Rust on Vercel is in beta.** For heavier or long-running workloads, consider a separate service.
