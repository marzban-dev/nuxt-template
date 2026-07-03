// imports

import { useQuery } from "@tanstack/vue-query";

const useGetAccount = () => {
    // state

    const { $axios: axios } = useNuxtApp();
    const { path } = useAuthEndpoints();

    const { token } = useAuth();

    // computed

    const isEnabled = computed(() => {
        return !!token.value;
    });

    // methods

    const handler = async (): Promise<AccountProfile> => {
        const { data } = await axios.post(path("profile"), undefined, {
            authorization: true,
        });

        return data;
    };

    return useQuery<AccountProfile, ApiError>({
        queryKey: ["account-profile"],
        queryFn: () => handler(),
        meta: { handleError: false },
        enabled: isEnabled,
    });
};

export default useGetAccount;
