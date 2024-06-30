<script lang="ts">
	import { createQuery } from '$lib/query.svelte.js';

	const number = createQuery(
		async () => {
			await new Promise((resolve) => setTimeout(resolve, 100));
			return Math.random();
		},
		{
			key: 'random'
		}
	);
</script>

<p>
	{number.data}
</p>
