import axiosOriginal from "axios";

export default defineNuxtPlugin({
    name: "axios",
    setup: () => {
        const { $i18n } = useNuxtApp();
        const config = useRuntimeConfig();
        const auth = useAuth();

        const axios = axiosOriginal.create({
            baseURL: config.public.API_BASE_URL,
        });

        axios.interceptors.request.use((config) => {
            // Set locale for i18n
            config.headers["Accept-Language"] = $i18n?.locale.value === "fa_ir" ? "fa" : $i18n?.locale.value;

            // Set auth header
            if (config.authorization && auth.token.value) {
                config.headers.Authorization = `Bearer ${auth.token.value}`;
            }

            return config;
        });

        axios.interceptors.response.use(
            (response) => {
                return response;
            },
            // async function (error: ApiError) {
            //     if (process.env.NODE_ENV === "development") {
            //     }
            //     return Promise.reject(error);
            // }
        );

        return {
            provide: {
                axios,
            },
        };
    },
});
