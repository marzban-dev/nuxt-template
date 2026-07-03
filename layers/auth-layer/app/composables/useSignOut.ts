// imports

import { useMutation } from "@tanstack/vue-query";

// types

export type SignOutRequest = {
    refreshToken: string;
};

const useSignOut = () => {
    // state

    const { $axios: axios } = useNuxtApp();
    const { path } = useAuthEndpoints();
    const { buildSignOutBody } = useAuthAdapters();

    // methods

    const handler = async (variables: SignOutRequest) => {
        const { data } = await axios.post(path("logout"), buildSignOutBody(variables.refreshToken), {
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
