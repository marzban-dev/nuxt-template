/**
 * Resolves the request/response adapters for the auth-layer.
 *
 * Every adapter can be overridden from the consuming app via
 * `appConfig.appAuth`. When not provided, the defaults below assume a backend
 * that accepts `{ refresh }` / `{ token }` / `{ refresh_token }` bodies and
 * returns `{ access, refresh }` — but nothing in the layer hardcodes that,
 * so a different backend only needs a few lines in `app.config.ts`.
 */
const useAuthAdapters = () => {
    const appConfig = useAppConfig();
    const adapters = appConfig.appAuth ?? {};

    const extractTokens =
        adapters.extractTokens ??
        ((response: unknown): AuthTokens => {
            const r = (response ?? {}) as Record<string, unknown>;
            return {
                token: r.access as string,
                refreshToken: (r.refresh as string) ?? null,
            };
        });

    const buildSignInBody = adapters.buildSignInBody ?? ((params: SignInParams) => params);
    const buildRefreshBody = adapters.buildRefreshBody ?? ((refreshToken: string) => ({ refresh: refreshToken }));
    const buildVerifyBody = adapters.buildVerifyBody ?? ((token: string) => ({ token }));
    const buildSignOutBody =
        adapters.buildSignOutBody ?? ((refreshToken: string) => ({ refresh_token: refreshToken }));

    return {
        extractTokens,
        buildSignInBody,
        buildRefreshBody,
        buildVerifyBody,
        buildSignOutBody,
    };
};

export default useAuthAdapters;
