import type { AxiosError } from "axios";
import type { AuthTokens } from "../../types/types";
import { useMutation } from "@tanstack/vue-query";

const useAuth = () => {
    // state

    const runtimeConfig = useRuntimeConfig();
    const verifyStep = runtimeConfig.public.authModule.verifyStep;

    const { $authApi } = useNuxtApp();
    const { token, refreshToken } = useAuthStorage();

    // internal lifecycle mutations
    
    const { mutateAsync: refreshAuth } = useMutation<AuthTokens, ApiError, { refreshToken: string }>({
        mutationKey: ["refresh-token"],
        mutationFn: (variables) => $authApi.refresh(variables.refreshToken),
        meta: { handleError: false },
    });

    const { mutateAsync: verify } = useMutation<void, ApiError, { token: string }>({
        mutationKey: ["verify-token"],
        mutationFn: (variables) => $authApi.verify(variables.token),
        meta: { handleError: false },
    });

    const { mutateAsync: signOut } = useMutation<void, ApiError, { refreshToken: string }>({
        mutationKey: ["sign-out"],
        mutationFn: (variables) => $authApi.logout(variables.refreshToken),
        meta: { handleError: false },
    });

    // methods

    const updateToken = (newToken: string) => {
        token.value = newToken;
    };

    const updateRefreshToken = (newToken: string) => {
        refreshToken.value = newToken;
    };

    const applyTokens = (tokens: AuthTokens) => {
        updateToken(tokens.token);
        if (tokens.refreshToken) updateRefreshToken(tokens.refreshToken);
    };

    const logout = async (reload?: boolean) => {
        if (refreshToken.value) {
            const currentRefreshToken = refreshToken.value;

            token.value = undefined;
            refreshToken.value = undefined;

            await signOut({ refreshToken: currentRefreshToken });
            if (reload) window.location.href = "/";
        } else {
            token.value = undefined;
            if (reload) window.location.href = "/";
        }
    };

    /** Attempt to renew the session from the refresh token; logs out on failure. */
    const tryRefresh = async (): Promise<boolean> => {
        if (!refreshToken.value) {
            await logout();
            return false;
        }

        try {
            const tokens = await refreshAuth({ refreshToken: refreshToken.value });
            applyTokens(tokens);
            return true;
        } catch (e) {
            const err = e as AxiosError;
            if (err?.status && err.status >= 400) await logout();
            return false;
        }
    };

    const checkAuth = async (): Promise<boolean> => {
        // No access token — try to bootstrap from the refresh token.
        if (!token.value) {
            return await tryRefresh();
        }

        // When the verify step is disabled, a present token is trusted; the 401
        // response interceptor handles lazy expiry.
        if (!verifyStep) return true;

        try {
            await verify({ token: token.value });
            return true;
        } catch (e) {
            const err = e as AxiosError;
            if (err?.status && err.status >= 400) return await tryRefresh();
            return false;
        }
    };

    // computed

    const isLoggedIn = computed(() => !!token.value);

    return {
        token,
        refreshToken,
        updateRefreshToken,
        updateToken,
        applyTokens,
        logout,
        isLoggedIn,
        checkAuth,
    };
};

export default useAuth;
