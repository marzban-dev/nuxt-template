import type { AxiosError } from "axios";
import type { Mutation, Query } from "@tanstack/vue-query";

declare global {
    /** Error surfaced by axios / tanstack. Replace `unknown` to type the error body. */
    type ApiError = AxiosError<unknown>;

    /** Context handed to the app-level API error callbacks. */
    type ApiErrorContext = {
        error: ApiError;
        query?: Query<unknown, unknown, unknown, readonly unknown[]>;
        mutation?: Mutation<unknown, unknown, unknown, unknown>;
    };
}

declare module "axios" {
    export interface AxiosRequestConfig {
        /** When true, the request interceptor attaches the bearer token. */
        authorization?: boolean;
    }
}

// type ApiPaginated<T, D = object> = {
//     count: number;
//     next: string | null;
//     previous: string | null;
//     results: T[];
//     data?: D;
// };
// type ApiErrorData = Record<string, (string | ApiErrorData)[]>;
// type ApiError = AxiosError<ApiErrorData>;
