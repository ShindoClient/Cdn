<script lang="ts">
	import { page } from '$app/state';

	let statusCode = $derived(page.status ?? 404);
</script>

<div class="error-page">
	<div class="error-card">
		<span class="badge">Error {statusCode}</span>
		<h1>Content not found</h1>
		<p>The requested endpoint does not exist on this CDN.</p>
	</div>
</div>
