import { ssrPreload } from '$lib/ssr.js';

export const load = async (event) => {
	ssrPreload(3, 3.14159, event);
	ssrPreload('random', Math.random(), event);
};
