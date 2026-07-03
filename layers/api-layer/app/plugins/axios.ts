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

        axios.interceptors.request.use((request) => {
            // Send the active language as its primary subtag (e.g. "fa_ir" -> "fa").
            const locale = $i18n?.locale.value;
            if (locale) {
                request.headers["Accept-Language"] = locale.split("_")[0];
            }

            // Attach the bearer token for requests that opt in via `authorization`.
            if (request.authorization && auth.token.value) {
                request.headers.Authorization = `Bearer ${auth.token.value}`;
            }

            return request;
        });

        // Response errors are intentionally left to bubble up so tanstack's query /
        // mutation caches (see tanstack.ts) can route them to the app callbacks.

        return {
            provide: {
                axios,
            },
        };
    },
});
