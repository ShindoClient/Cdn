<script lang="ts">
	import { page } from '$app/stores';

	// Get error from URL query param
	const error = $derived($page.url.searchParams.has('error'));
</script>

<div class="page">
	<div class="card">
		<svg class="logo" viewBox="0 0 24 24" fill="none">
			<path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z" fill="#1DB954" />
			<path d="M16.5 16.5c-.2 0-.4-.06-.56-.18-1.98-1.2-4.48-1.48-7.42-.8-.28.06-.56-.1-.62-.38-.06-.28.1-.56.38-.62 3.22-.74 5.98-.42 8.2.94.24.14.32.46.18.7-.1.18-.28.28-.46.28l-.1.04z" fill="white" />
			<path d="M17.5 14c-.24 0-.48-.08-.66-.24-2.32-1.42-5.86-1.84-8.6-1-.32.1-.66-.08-.76-.4-.1-.32.08-.66.4-.76 3.14-.96 7.04-.5 9.7 1.16.28.18.38.54.2.84-.12.26-.38.4-.66.4h-.02v.02z" fill="white" />
			<path d="M18.5 11.5c-.28 0-.54-.1-.74-.28C15 9.52 10.44 9.34 7.5 10.18c-.38.1-.78-.1-.88-.48-.1-.38.1-.78.48-.88 3.38-.96 8.42-.78 11.66 1.28.34.2.44.64.24.98-.14.26-.4.42-.68.42z" fill="white" />
		</svg>
		{#if !error}
			<div class="spinner"></div>
			<p>Connecting to Spotify...</p>
		{:else}
			<div class="error-icon">✕</div>
			<p>Authentication failed. Close this window and try again.</p>
		{/if}
	</div>
</div>

<style>
	.page {
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		background: #0a0a0a;
	}
	.card {
		background: #111;
		border: 1px solid #1a1a1a;
		border-radius: 16px;
		padding: 48px 40px;
		text-align: center;
	}
	.logo {
		width: 48px;
		height: 48px;
		margin-bottom: 24px;
	}
	p {
		color: #888;
		font-size: 14px;
		margin: 0;
		font-family: sans-serif;
	}
	.spinner {
		width: 32px;
		height: 32px;
		border: 2px solid #222;
		border-top-color: #1db954;
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
		margin: 0 auto 16px;
	}
	@keyframes spin {
		to { transform: rotate(360deg); }
	}
	.error-icon {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		background: rgba(255, 80, 80, 0.15);
		color: #ff5050;
		font-size: 18px;
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 0 auto 16px;
	}
</style>