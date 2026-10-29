import { sveltekit } from '@sveltejs/kit/vite';
import adapter from '@sveltejs/adapter-vercel';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

const apiPort = process.env.API_PORT ?? '3001';

export default defineConfig({
	plugins: [
		tailwindcss(),
		// SvelteKit 3: Kit config lives here (svelte.config.js no longer exists)
		sveltekit({ adapter: adapter() })
	],
	server: {
		// In dev, /api/* is proxied to the local Rust server.
		// In production, Vercel routes /api/* to the Rust function (see vercel.json).
		proxy: { '/api': `http://127.0.0.1:${apiPort}` }
	}
});
