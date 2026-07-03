// imports

import { useMutation } from "@tanstack/vue-query";

// types

export type VerifyRequest = {
    token: string;
};

const useVerify = () => {
    // state

    const { $axios: axios } = useNuxtApp();
    const { path } = useAuthEndpoints();
    const { buildVerifyBody } = useAuthAdapters();

    // methods

    const handler = async (variables: VerifyRequest) => {
        const { data } = await axios.post(path("verify"), buildVerifyBody(variables.token), {
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
