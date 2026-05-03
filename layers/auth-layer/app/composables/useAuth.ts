import type { AxiosError } from "axios";

const useAuth = () => {
    // state

    const { mutateAsync: refreshAuth } = useRefreshAuth();
    const { mutateAsync: verify } = useVerify();
    const { mutateAsync: signOut } = useSignOut();

    const token = useCookie("token", {
        maxAge: 60 * 60 * 24 * 30,
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        path: "/",
        secure: true,
        sameSite: "lax",
    });

    const refreshToken = useCookie("refresh-token", {
        maxAge: 60 * 60 * 24 * 30,
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        path: "/",
        secure: true,
        sameSite: "lax",
    });

    // methods

    const updateToken = (newToken: string) => {
        token.value = newToken;
    };

    const updateRefreshToken = (newToken: string) => {
        refreshToken.value = newToken;
    };

    const logout = async (reload?: boolean) => {
        if (refreshToken.value) {
            const currentRefreshToken = refreshToken.value;

            token.value = undefined;
            refreshToken.value = undefined;

            await signOut({ refresh_token: currentRefreshToken });
            if (reload) window.location.href = "/";
        }
    };

    const checkAuth = async () => {
        if (token.value) {
            try {
                await verify({
                    token: token.value,
                });

                return true;
            } catch (e) {
                const err = e as AxiosError;

                if (err?.status && err.status >= 400) {
                    if (refreshToken.value) {
                        try {
                            const refreshResponse = await refreshAuth({
                                refresh: refreshToken.value,
                            });

                            updateToken(refreshResponse.access);
                            updateRefreshToken(refreshResponse.refresh);

                            return true;
                        } catch (e) {
                            const err = e as AxiosError;

                            if (err?.status && err.status >= 400) {
                                await logout();
                            }

                            return false;
                        }
                    } else {
                        await logout();
                        return false;
                    }
                }

                return false;
            }
        } else {
            if (refreshToken.value) {
                try {
                    const refreshResponse = await refreshAuth({
                        refresh: refreshToken.value,
                    });

                    updateToken(refreshResponse.access);
                    updateRefreshToken(refreshResponse.refresh);

                    return true;
                } catch (e) {
                    const err = e as AxiosError;

                    if (err?.status && err.status >= 400) {
                        await logout();
                    }

                    return false;
                }
            } else {
                await logout();
                return false;
            }
        }
    };

    // computed

    const isLoggedIn = computed(() => !!token.value);

    return {
        token,
        refreshToken,
        updateRefreshToken,
        updateToken,
        logout,
        isLoggedIn,
        checkAuth,
    };
};

export default useAuth;
