export default defineNuxtRouteMiddleware(() => {
    const { token } = useAuth();
    const localePath = useLocalePath();

    if (token.value) {
        return navigateTo(localePath("/"));
    }
});
