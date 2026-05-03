// imports

import { useMutation } from "@tanstack/vue-query";

// types

export type SignOutRequest = {
    refresh_token: string;
};

const useSignOut = () => {
    // state

    const { $axios: axios } = useNuxtApp();
    const runtimeConfig = useRuntimeConfig();
    const endpoint = runtimeConfig.public.authModule.endpoints.sign_out;

    // methods

    const handler = async (variables: SignOutRequest) => {
        const { data } = await axios.post(endpoint, variables, {
            authorization: true,
        });

        return data;
    };

    return useMutation<unknown, ApiError, SignOutRequest>({
        mutationKey: ["sign-out"],
        mutationFn: (variables) => handler(variables),
        meta: { handleError: false },
    });
};

export default useSignOut;
