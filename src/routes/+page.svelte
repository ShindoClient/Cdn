<script lang="ts">
	import { api } from '#lib/api.js';
	// Import icons one by one (keeps the bundle small): https://lucide.dev/icons
	import { Database } from '@lucide/svelte';

	let name = $state('');
	let message = $state<string | null>(null);
	let error = $state<string | null>(null);
	let loading = $state(false);

	async function greet() {
		loading = true;
		error = null;
		try {
			const query = name ? `?name=${encodeURIComponent(name)}` : '';
			message = (await api<{ message: string }>(`/hello${query}`)).message;
		} catch (e) {
			error = e instanceof Error ? e.message : 'Unknown error';
		} finally {
			loading = false;
		}
	}
</script>

<main class="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-6 px-6">
	<header>
		<h1 class="flex items-center justify-center gap-2 text-3xl font-bold tracking-tight">
			<Database class="size-7 text-orange-500" />
			ShindoClient Cdn
		</h1>
		<p class="mt-1 text-sm text-zinc-400 text-center">Shindo Client custom cdn for assets and more!</p>
	</header>


	{#if message}
		<p class="rounded-lg border border-zinc-800 bg-zinc-900 p-4">{message}</p>
	{/if}
	{#if error}
		<p class="rounded-lg border border-red-900 bg-red-950 p-4 text-red-300">{error}</p>
	{/if}
</main>
