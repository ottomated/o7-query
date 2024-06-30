import type { RequestEvent } from '@sveltejs/kit';
import { hash } from 'object-code';
import { SSR } from './shared.js';

/** @internal */
export type SsrKey = number & { __ssr_key__: never };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SsrMap = Map<SsrKey, any>;

type RequestEventLocals = {
	[SSR]: SsrMap;
};
export function hydrateToClient(event: RequestEvent): SsrMap {
	// We need to return new values whenever the page is changed
	// eslint-disable-next-line @typescript-eslint/no-unused-expressions
	event.url.pathname;

	const locals = event.locals as RequestEventLocals;
	if (locals[SSR]) return locals[SSR];

	locals[SSR] = new Map();
	return locals[SSR];
}

export function ssrPreload(key: unknown, value: unknown, event: RequestEvent) {
	const k = hash(key) as SsrKey;
	const locals = event.locals as RequestEventLocals;
	if (!locals[SSR]) {
		locals[SSR] = new Map();
	}
	locals[SSR].set(k, value);
	return value;
}
export { default as SSRProvider } from './SSRProvider.svelte';
