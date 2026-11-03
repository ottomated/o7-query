import { ssrPreload } from '#lib/ssr.ts';

export const load = async (event) => {
	ssrPreload(3, 3.14159, event);
	ssrPreload('random', Math.random(), event);
};
