// imports

import { useMutation } from "@tanstack/vue-query";

/**
 * Local-development sign-in. If `appAuth.developSignIn` is provided it is used
 * directly (no network); otherwise the configured `develop_token` endpoint is
 * called. Returns normalized `AuthTokens` like the regular sign-in.
 */
const useDevelopSignin = () => {
    // state

    const { $axios: axios } = useNuxtApp();
    const appConfig = useAppConfig();
    const { path } = useAuthEndpoints();
    const { buildSignInBody, extractTokens } = useAuthAdapters();

    // methods

    const handler = async (variables: SignInParams): Promise<AuthTokens> => {
        if (appConfig.appAuth?.developSignIn) {
            return await appConfig.appAuth.developSignIn();
        }

        const { data } = await axios.post(path("develop_token"), buildSignInBody(variables), {
            authorization: false,
        });

        return extractTokens(data);
    };

    return useMutation<AuthTokens, ApiError, SignInParams>({
        mutationKey: ["develop-sign-in"],
        mutationFn: (variables) => handler(variables),
        meta: { handleError: false },
    });
};

export default useDevelopSignin;
