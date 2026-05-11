<script lang="ts">
	import { page } from '$app/state';

	import { Music } from '@lucide/svelte';
	const error = $derived(page.url.searchParams.has('error'));
</script>

<div class="page">
	<div class="card">
		<Music class="logo" />
		{#if !error}
			<div class="spinner"></div>
			<p>Connecting to Spotify...</p>
		{:else}
			<div class="error-icon">✕</div>
			<p>Authentication failed. Close this window and try again.</p>
		{/if}
	</div>
</div>
