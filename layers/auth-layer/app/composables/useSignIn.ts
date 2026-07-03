// imports

import { useMutation } from "@tanstack/vue-query";

const useSignIn = () => {
    // state

    const { $axios: axios } = useNuxtApp();
    const { path } = useAuthEndpoints();
    const { buildSignInBody, extractTokens } = useAuthAdapters();

    // methods

    const handler = async (variables: SignInParams): Promise<AuthTokens> => {
        const { data } = await axios.post(path("signin"), buildSignInBody(variables), {
            authorization: false,
        });

        return extractTokens(data);
    };

    return useMutation<AuthTokens, ApiError, SignInParams>({
        mutationKey: ["sign-in"],
        mutationFn: (variables) => handler(variables),
        meta: { handleError: false },
    });
};

export default useSignIn;
