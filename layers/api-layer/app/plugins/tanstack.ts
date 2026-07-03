import type { DehydratedState, VueQueryPluginOptions } from "@tanstack/vue-query";
import { VueQueryPlugin, QueryClient, hydrate, dehydrate, QueryCache, MutationCache } from "@tanstack/vue-query";

import { defineNuxtPlugin, useState } from "#imports";
import { AxiosError } from "axios";

/** Default time (ms) a query result is considered fresh before refetching. */
const DEFAULT_STALE_TIME = 5000;

export default defineNuxtPlugin({
    enforce: "pre",
    setup: (nuxt) => {
        const appConfig = useAppConfig();

        const vueQueryState = useState<DehydratedState | null>("vue-query");

        const handleError = (context: ApiErrorContext) => {
            // Errors are only routed to the app callbacks on the client.
            if (!import.meta.client || !(context.error instanceof AxiosError)) return;

            const status = context.error.status ?? 0;

            if (status >= 400 && status < 500) {
                appConfig.appApi?.errorCallback?.(context);
            } else {
                appConfig.appApi?.unhandledErrorCallback?.();
            }
        };

        const queryClient = new QueryClient({
            defaultOptions: { queries: { staleTime: DEFAULT_STALE_TIME } },
            queryCache: new QueryCache({
                onError: (error, query) => {
                    if (query.meta?.handleError) handleError({ error: error as ApiError, query });
                },
            }),
            mutationCache: new MutationCache({
                onError: (error, _variables, _context, mutation) => {
                    if (mutation.meta?.handleError) handleError({ error: error as ApiError, mutation });
                },
            }),
        });
        const options: VueQueryPluginOptions = { queryClient };

        nuxt.vueApp.use(VueQueryPlugin, options);

        if (import.meta.server) {
            nuxt.hooks.hook("app:rendered", () => {
                vueQueryState.value = dehydrate(queryClient);
            });
        }

        if (import.meta.client) {
            hydrate(queryClient, vueQueryState.value);
        }

        return {
            provide: {
                queryClient,
            },
        };
    },
});
