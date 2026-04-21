<script lang="ts">
	import { page } from '$app/stores';

	let statusCode = $derived($page.status ?? 404);
</script>

<div class="error-page">
	<div class="error-card">
		<span class="badge">Error {statusCode}</span>
		<h1>Conteúdo não encontrado</h1>
		<p>O endpoint solicitado não existe nesta CDN.</p>
	</div>
</div>

<style>
	.error-page {
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 20px;
		background: #0a0a0a;
	}

	.error-card {
		max-width: 400px;
		text-align: center;
		padding: 40px;
		background: #111;
		border: 1px solid #1a1a1a;
		border-radius: 16px;
	}

	.badge {
		display: inline-block;
		padding: 6px 14px;
		background: rgba(255, 80, 80, 0.15);
		border: 1px solid rgba(255, 80, 80, 0.3);
		border-radius: 20px;
		color: #ff5050;
		font-size: 12px;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		margin-bottom: 16px;
	}

	h1 {
		margin: 0 0 12px;
		font-size: 24px;
		font-weight: 700;
		color: #ffffff;
	}

	p {
		margin: 0;
		font-size: 14px;
		color: #888888;
	}
</style>