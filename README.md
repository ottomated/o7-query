<p align="center">
  <img src="https://i.postimg.cc/T1Wk3khh/logo.png" width="112" alt="o7 Logo" />
</p>

<h1 align="center">@o7/query</h1>

<p align="center">Lightweight (< 1kb), SSR-ready async state management for Svelte.</p>
<br />

## Basic Usage

```svelte
<script>
	import { createQuery } from '@o7/query';

	const catImage = createQuery(
		async () => {
			const res = await fetch('/api/random-cat');
			return await res.text();
		},
		{ key: 'random-cat' }
	);
</script>

{#if catImage.isLoading}
	Loading...
{:else if catImage.isError}
	Error: {catImage.error}
{:else if catImage.isSuccess}
	<img src={catImage.data} alt="Cat" />
{/if}
```

## Usage with SSR

Wrap your app in an `SSRProvider` component:

```svelte
<script lang="ts">
	import { SSRProvider } from '#lib/ssr.ts';
	const { children, data } = $props();
</script>

// src/routes/+layout.svelte

<SSRProvider data={data.queryData}>
	{@render children()}
</SSRProvider>
```

Then call `ssrPreload` in any of your `load` functions:

```ts
// src/routes/+page.server.ts

import { ssrPreload } from 'o7/query/ssr';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	ssrPreload('yourQueryKey', 'yourQueryValue', event);
};
```

Then call `createQuery` like normal:

```svelte
<script>
	import { createQuery } from '@o7/query';

	const q = createQuery(
		async () => {
			const res = await fetch('/api/get-query-data');
			return await res.text();
		},
		{ key: 'yourQueryValue' }
	);
</script>

{#if q.isLoading}
	Loading...
{:else if q.isError}
	Error: {q.error}
{:else if q.isSuccess}
	Value of yourQueryKey = {q.data}
{/if}
```
