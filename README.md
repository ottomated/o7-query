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
