<script lang="ts">
	import { createQuery, Status } from '$lib/index.js';
	import Random from './Random.svelte';

	let enabled = $state(true);

	const query = createQuery(
		async ({ key }) => {
			await new Promise((resolve) => setTimeout(resolve, 300));
			return key + Math.random();
		},
		{
			key: 3,
			enabled: () => enabled
		}
	);
	$inspect(query).with((type, q) => console.log(type, q.data, q.error, q.status));
</script>

<button onclick={() => (enabled = !enabled)}>{enabled ? 'Disable' : 'Enable'}</button>

{#if query.isLoading}
	Loading...
{:else if query.isError}
	Error: {query.error}
{:else if query.isSuccess}
	{query.data}
{/if}

<Random />
<Random />
<Random />
