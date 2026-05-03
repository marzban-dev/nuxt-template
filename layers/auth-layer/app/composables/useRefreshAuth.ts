// imports

import { useMutation } from "@tanstack/vue-query";

// types

export type RefreshAuthRequest = {
    refresh: string;
};

export type RefreshAuthResponse = {
    access: string;
    refresh: string;
};

const useRefreshAuth = () => {
    // state

    const { $axios: axios } = useNuxtApp();
    const runtimeConfig = useRuntimeConfig();
    const endpoint = runtimeConfig.public.authModule.endpoints.refresh;

    // methods

    const handler = async (variables: RefreshAuthRequest) => {
        const { data } = await axios.post(endpoint, variables, {
            authorization: false,
        });

        return data;
    };

    return useMutation<RefreshAuthResponse, ApiError, RefreshAuthRequest>({
        mutationKey: ["refresh-token"],
        mutationFn: (variables) => handler(variables),
        meta: { handleError: false },
    });
};

export default useRefreshAuth;
