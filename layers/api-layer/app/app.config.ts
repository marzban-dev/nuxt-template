import type { Mutation, Query } from "@tanstack/vue-query";

export default defineAppConfig({});

declare module "@nuxt/schema" {
    interface AppConfig {
        appApi?: {
            errorCallback?: (errorData: {
                error: ApiError;
                query?: Query<unknown, unknown, unknown, readonly unknown[]>;
                mutation?: Mutation<unknown, unknown, unknown, unknown>;
            }) => void;
            unhandledErrorCallback?: () => void;
        };
    }

    interface AppConfigInput {
        appApi?: {
            errorCallback?: (errorData: {
                error: ApiError;
                query?: Query<unknown, unknown, unknown, readonly unknown[]>;
                mutation?: Mutation<unknown, unknown, unknown, unknown>;
            }) => void;
            unhandledErrorCallback?: () => void;
        };
    }
}
