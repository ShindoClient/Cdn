<script lang="ts">
	import '../app.css';
	import { injectAnalytics } from '@vercel/analytics/sveltekit'
  import { onMount } from 'svelte'
	onMount(() => {
		injectAnalytics();
	});
</script>


<slot />
