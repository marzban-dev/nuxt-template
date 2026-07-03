/**
 * Resolves configured auth endpoints as plain `path` strings.
 *
 * Endpoints are declared in `nuxt.config.ts` as `{ name, path }` objects; this
 * helper is the single place that reads `.path`, so composables never touch the
 * runtime-config shape directly.
 */
const useAuthEndpoints = () => {
    const runtimeConfig = useRuntimeConfig();
    const endpoints = runtimeConfig.public.authModule.endpoints;

    const path = (key: string): string => {
        const endpoint = endpoints[key];
        if (!endpoint?.path) {
            throw new Error(`[auth-layer] endpoint "${key}" is not configured in authModule.endpoints`);
        }
        return endpoint.path;
    };

    return { path };
};

export default useAuthEndpoints;
