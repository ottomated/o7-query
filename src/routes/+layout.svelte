<script lang="ts">
	import { SSRProvider } from '$lib/ssr.js';
	const { children, data } = $props();
</script>

<SSRProvider data={data.queryData}>
	{@render children()}
</SSRProvider>
