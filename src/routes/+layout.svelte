<script lang="ts">
	import '../app.css';
	import { dev } from '$app/env';
	import favicon from '#lib/assets/icon.png';
	import { injectAnalytics } from '@vercel/analytics/sveltekit';

	injectAnalytics({ mode: dev ? 'development' : 'production' });

	let { children } = $props();
</script>

<svelte:head>
	<title>ShindoClient Cdn</title>
	<meta name="description" content="Shindo Client custom cdn for assets and more!">
	<link rel="icon" type="image/png" href={favicon}>
</svelte:head>

<div class="min-h-screen bg-zinc-950 text-zinc-100 antialiased">
	{@render children()}
</div>

