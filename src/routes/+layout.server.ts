import { hydrateToClient } from '$lib/ssr.js';

export const load = async (event) => {
	return {
		queryData: hydrateToClient(event)
	};
};
