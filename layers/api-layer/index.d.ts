import type { AxiosError } from "axios";

declare global {
    type ApiError = AxiosError<unknown>; // Change unknown for defining the error body type
}

declare module "axios" {
    export interface AxiosRequestConfig {
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
