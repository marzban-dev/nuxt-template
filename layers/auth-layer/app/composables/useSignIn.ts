import { useMutation } from "@tanstack/vue-query";
import type { AuthTokens, SignInParams } from "../../types/types";

const useSignIn = () => {
    const { $authApi } = useNuxtApp();

    return useMutation<AuthTokens, ApiError, SignInParams>({
        mutationKey: ["sign-in"],
        mutationFn: $authApi.signIn,
        meta: { handleError: false },
    });
};

export default useSignIn;
