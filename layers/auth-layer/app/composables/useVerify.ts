// imports

import { useMutation } from "@tanstack/vue-query";

// types

export type VerifyRequest = {
    token: string;
};

const useVerify = () => {
    // state

    const { $axios: axios } = useNuxtApp();
    const runtimeConfig = useRuntimeConfig();
    const endpoint = runtimeConfig.public.authModule.endpoints.verify;

    // methods

    const handler = async (variables: VerifyRequest) => {
        const { data } = await axios.post(endpoint, variables, {
            authorization: false,
        });

        return data;
    };

    return useMutation<unknown, ApiError, VerifyRequest>({
        mutationKey: ["verify-token"],
        mutationFn: (variables) => handler(variables),
        meta: { handleError: false },
    });
};

export default useVerify;
