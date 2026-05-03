export default defineNuxtPlugin({
    dependsOn: ["axios"],
    setup: () => {
        const { logout } = useAuth();
        const { $axios: axios } = useNuxtApp();
        const appConfig = useAppConfig();

        axios.interceptors.response.use(
            (response) => {
                return response;
            },
            async function (error: ApiError) {
                if (error.status === 401) {
                    if (appConfig.appAuth?.unauthorizedEvent) {
                        appConfig.appAuth.unauthorizedEvent(error);
                    }
                    await logout();
                }
                return Promise.reject(error);
            }
        );
    },
});
