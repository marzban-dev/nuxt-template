/**
 * Resolves where the tokens are stored.
 *
 * Defaults to cookies (using the names/options from `authModule.cookie`) so the
 * SSR auth check works out of the box. The consuming app can swap in any other
 * strategy — localStorage, memory, Pinia — by providing `appAuth.storage`.
 */
const useAuthStorage = (): AuthStorage => {
    const appConfig = useAppConfig();

    if (appConfig.appAuth?.storage) {
        return appConfig.appAuth.storage();
    }

    const runtimeConfig = useRuntimeConfig();
    const cookie = runtimeConfig.public.authModule.cookie;

    const options = {
        maxAge: cookie.maxAge,
        expires: new Date(Date.now() + cookie.maxAge * 1000),
        path: cookie.path,
        secure: cookie.secure,
        sameSite: cookie.sameSite,
    } as const;

    const token = useCookie(cookie.tokenName, options);
    const refreshToken = useCookie(cookie.refreshTokenName, options);

    return { token, refreshToken };
};

export default useAuthStorage;
