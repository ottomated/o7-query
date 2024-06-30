<script lang="ts">
	import { type Snippet, setContext } from 'svelte';
	import type { SsrMap, SsrKey } from './ssr.js';
	import { SSR } from './shared.js';
	import { hash } from 'object-code';

	const { children, data }: { children: Snippet; data: SsrMap } = $props();

	function get(key: unknown) {
		return data.get(hash(key) as SsrKey);
	}
	setContext(SSR, get);
</script>

{@render children()}
