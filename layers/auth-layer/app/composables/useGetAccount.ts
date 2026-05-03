// imports

import { useQuery } from "@tanstack/vue-query";

// types

export type GetAccountResponse = AccountProfile;

const useGetAccount = () => {
    // state

    const { $axios: axios } = useNuxtApp();
    const runtimeConfig = useRuntimeConfig();
    const endpoint = runtimeConfig.public.authModule.endpoints.profile;

    const { token } = useAuth();

    // computed

    const isEnabled = computed(() => {
        return !!token.value;
    });

    // methods

    const handler = async () => {
        const { data } = await axios.post(endpoint, undefined, {
            authorization: true,
        });

        return data;
    };

    return useQuery<GetAccountResponse, ApiError, unknown>({
        queryKey: ["refresh-token"],
        queryFn: () => handler(),
        meta: { handleError: false },
        enabled: isEnabled,
    });
};

export default useGetAccount;
