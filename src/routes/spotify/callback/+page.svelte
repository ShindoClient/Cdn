<script lang="ts">
	import { page } from '$app/state';

	import { Music } from '@lucide/svelte';
	const error = $derived(page.url.searchParams.has('error'));
</script>

<main class="mx-auto flex min-h-screen max-w-60 flex-col justify-center gap-6 px-6">
	<div class="flex items-center gap-2 flex-col text-center border border-zinc-800 bg-zinc-900 p-4 rounded-lg">
		<Music class="size-10" />
		{#if !error}
			<p>Connecting to Spotify...</p>
		{:else}
			<p>Authentication failed. Close this window and try again.</p>
		{/if}
	</div>
</main>
