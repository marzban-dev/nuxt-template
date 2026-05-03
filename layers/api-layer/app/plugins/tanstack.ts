import type { DehydratedState, Mutation, Query, VueQueryPluginOptions } from "@tanstack/vue-query";
import { VueQueryPlugin, QueryClient, hydrate, dehydrate, QueryCache, MutationCache } from "@tanstack/vue-query";

import { defineNuxtPlugin, useState } from "#imports";
import { AxiosError } from "axios";

export default defineNuxtPlugin({
    enforce: "pre",
    setup: (nuxt) => {
        const appConfig = useAppConfig();

        const vueQueryState = useState<DehydratedState | null>("vue-query");

        const errorHandler = (errorData: {
            error: ApiError;
            query?: Query<unknown, unknown, unknown, readonly unknown[]>;
            mutation?: Mutation<unknown, unknown, unknown, unknown>;
        }) => {
            if (import.meta.client && errorData.error instanceof AxiosError) {
                if (errorData.error.status && errorData.error.status >= 400 && errorData.error.status <= 499) {
                    if (appConfig.appApi?.errorCallback) {
                        appConfig.appApi?.errorCallback(errorData);
                    }
                } else {
                    if (appConfig.appApi?.unhandledErrorCallback) {
                        appConfig.appApi?.unhandledErrorCallback();
                    }
                }
            }
        };

        const queryClient = new QueryClient({
            defaultOptions: { queries: { staleTime: 5000 } },
            queryCache: new QueryCache({
                onError: (error, query) => {
                    if (query.meta?.handleError) errorHandler({ error: error as ApiError, query });
                },
            }),
            mutationCache: new MutationCache({
                onError: (error, _variables, _context, mutation) => {
                    if (mutation.meta?.handleError) errorHandler({ error: error as ApiError, mutation });
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
