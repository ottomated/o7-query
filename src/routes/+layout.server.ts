import { hydrateToClient } from '#lib/ssr.ts';

export const load = async (event) => {
	return {
		queryData: hydrateToClient(event)
	};
};
