// imports

import { useMutation } from "@tanstack/vue-query";

// types

export type SignInRequest = SignInParams;

export type SignInResponse = {
    access: string;
    refresh: string;
};

const useSignIn = () => {
    // state

    const appConfig = useAppConfig();
    const { $axios: axios } = useNuxtApp();
    const runtimeConfig = useRuntimeConfig();
    const endpoint = runtimeConfig.public.authModule.endpoints.signin;

    // methods

    const handler = async (variables: SignInRequest) => {
        const { data } = await axios.post<SignInResponse>(endpoint, variables, {
            authorization: false,
        });

        return data;
    };

    return useMutation<SignInResponse, ApiError, SignInRequest>({
        mutationKey: ["sign-in"],
        mutationFn: (variables) => handler(variables),
        meta: { handleError: false },
    });
};

export default useSignIn;
