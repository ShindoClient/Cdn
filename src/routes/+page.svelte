<script lang="ts">
	import { api } from '#lib/api.js';
	// Import icons one by one (keeps the bundle small): https://lucide.dev/icons
	import Rocket from '@lucide/svelte/icons/rocket';
	import Send from '@lucide/svelte/icons/send';
	import LoaderCircle from '@lucide/svelte/icons/loader-circle';

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

<svelte:head>
	<title>SvelteKit + Rust</title>
</svelte:head>

<main class="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-6 px-6">
	<header>
		<h1 class="flex items-center gap-2 text-3xl font-bold tracking-tight">
			<Rocket class="size-7 text-orange-500" />
			SvelteKit + Rust
		</h1>
		<p class="mt-1 text-sm text-zinc-400">Svelte 5 · Tailwind 4 · Axum · Vercel · Bun</p>
	</header>

	<form
		class="flex gap-2"
		onsubmit={(e) => {
			e.preventDefault();
			greet();
		}}
	>
		<input
			bind:value={name}
			placeholder="Your name"
			class="flex-1 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 outline-none focus:border-orange-500"
		/>
		<button
			disabled={loading}
			class="flex items-center gap-2 rounded-lg bg-orange-600 px-4 py-2 font-medium transition hover:bg-orange-500 disabled:opacity-50"
		>
			{#if loading}
				<LoaderCircle class="size-4 animate-spin" />
			{:else}
				<Send class="size-4" />
			{/if}
			Call API
		</button>
	</form>

	{#if message}
		<p class="rounded-lg border border-zinc-800 bg-zinc-900 p-4">{message}</p>
	{/if}
	{#if error}
		<p class="rounded-lg border border-red-900 bg-red-950 p-4 text-red-300">{error}</p>
	{/if}
</main>
