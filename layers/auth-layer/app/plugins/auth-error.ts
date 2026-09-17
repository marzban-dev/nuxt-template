export default defineNuxtPlugin({
    dependsOn: ["axios"],
    setup: () => {
        const { logout } = useAuth();
        const { $axios: axios } = useNuxtApp();

        axios.interceptors.response.use(
            (response) => {
                return response;
            },
            async function (error: ApiError) {
                if (error.status === 401) {
                    await logout();
                }
                return Promise.reject(error);
            },
        );
    },
});
