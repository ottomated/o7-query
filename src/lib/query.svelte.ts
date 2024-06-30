import { getContext } from 'svelte';
import { SSR } from './shared.js';

export const enum Status {
	Loading = 0,
	Error = 1,
	Success = 2
}

type Query<TData, TError = Error> =
	| {
			status: Status.Loading;
			isError: false;
			isSuccess: false;
			isLoading: true;
			data: undefined;
			error: undefined;
	  }
	| {
			status: Status.Error;
			isError: true;
			isSuccess: false;
			isLoading: false;
			data: undefined;
			error: Readonly<TError>;
	  }
	| {
			status: Status.Success;
			isError: false;
			isSuccess: true;
			isLoading: false;
			data: Readonly<TData>;
			error: undefined;
	  };

type Getter<T> = (() => T) | T;

type QueryOptions<TKey> = {
	enabled?: Getter<boolean>;
	refetchInterval?: Getter<number | undefined>;
	refetchOnWindowFocus?: Getter<boolean>;
	refetchOnReconnect?: Getter<boolean>;
	key: Getter<TKey>;
};

function get_value<T>(value: T | (() => T) | undefined): T | undefined {
	if (value === undefined) return undefined as T;
	return typeof value === 'function' ? (value as () => T)() : value;
}

export function createQuery<TKey, TData, TError = Error>(
	fetcher: (ctx: { signal: AbortSignal; key: TKey }) => Promise<TData>,
	options: QueryOptions<TKey>
) {
	const ssr = getContext<((key: TKey) => TData | undefined) | undefined>(SSR);
	let initial = ssr?.(get_value(options.key)!);

	let data = $state.frozen<TData | undefined>(initial);
	let error = $state.frozen<TError | undefined>(undefined);
	const status = $derived.by(() => {
		if (data) return Status.Success;
		if (error) return Status.Error;
		return Status.Loading;
	});

	let current_version = $state(0);
	function invalidate() {
		current_version++;
	}

	$effect(() => {
		if (!get_value(options?.enabled ?? true)) return;
		const interval = get_value(options?.refetchInterval);
		if (interval === undefined) return;
		const i = setInterval(invalidate, interval);
		return () => clearInterval(i);
	});

	$effect(() => {
		if (!get_value(options?.refetchOnWindowFocus ?? true)) return;
		window.addEventListener('focus', invalidate);
		return () => window.removeEventListener('focus', invalidate);
	});

	$effect(() => {
		if (!get_value(options?.refetchOnReconnect ?? true)) return;
		window.addEventListener('online', invalidate);
		return () => window.removeEventListener('online', invalidate);
	});

	$effect(() => {
		if (!get_value(options?.enabled ?? true)) {
			return;
		}
		// eslint-disable-next-line @typescript-eslint/no-unused-expressions
		current_version;

		// If we loaded the initial value from the cache, don't refetch
		// on mount.
		if (initial) {
			initial = undefined;
			return;
		}

		const abort_controller = new AbortController();
		const signal = abort_controller.signal;

		fetcher({ signal, key: get_value(options.key)! })
			.then((d) => {
				if (signal.aborted) return;
				data = d;
			})
			.catch((e) => {
				if (signal.aborted) return;
				error = e;
			});
		return () => abort_controller.abort();
	});

	return {
		get data() {
			return data;
		},
		get error() {
			return error;
		},
		get status() {
			return status;
		},
		get isLoading() {
			return status === Status.Loading;
		},
		get isError() {
			return status === Status.Error;
		},
		get isSuccess() {
			return status === Status.Success;
		}
	} as Query<TData, TError>;
}
