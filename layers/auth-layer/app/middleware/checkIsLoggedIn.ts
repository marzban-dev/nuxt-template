export default defineNuxtRouteMiddleware((from, to) => {
    const runtimeConfig = useRuntimeConfig();
    const signInPath = runtimeConfig.public.authModule.signInPath;

    const { token } = useAuth();
    const localePath = useLocalePath();

    if (!token.value) {
        return navigateTo(
            localePath({
                path: signInPath,
                query: {
                    cb: from?.path ?? to.path,
                },
            }),
        );
    }
});
