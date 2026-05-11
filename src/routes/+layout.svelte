<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.ico';
	import { injectAnalytics } from '@vercel/analytics/sveltekit';
	import { onMount } from 'svelte';

	let { children } = $props();

	onMount(() => {
		injectAnalytics();
	});
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
{@render children()}
