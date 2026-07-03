// imports

import { useMutation } from "@tanstack/vue-query";

// types

export type RefreshAuthRequest = {
    refreshToken: string;
};

const useRefreshAuth = () => {
    // state

    const { $axios: axios } = useNuxtApp();
    const { path } = useAuthEndpoints();
    const { buildRefreshBody, extractTokens } = useAuthAdapters();

    // methods

    const handler = async (variables: RefreshAuthRequest): Promise<AuthTokens> => {
        const { data } = await axios.post(path("refresh"), buildRefreshBody(variables.refreshToken), {
            authorization: false,
        });

        return extractTokens(data);
    };

    return useMutation<AuthTokens, ApiError, RefreshAuthRequest>({
        mutationKey: ["refresh-token"],
        mutationFn: (variables) => handler(variables),
        meta: { handleError: false },
    });
};

export default useRefreshAuth;
