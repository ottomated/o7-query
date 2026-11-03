<script lang="ts">
	import { SSRProvider } from '#lib/ssr.ts';
	const { children, data } = $props();
</script>

<SSRProvider data={data.queryData}>
	{@render children()}
</SSRProvider>
