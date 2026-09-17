import type { AuthApi, SignInParams, AuthTokens } from "../../types/types";

export default defineNuxtPlugin({
    dependsOn: ["axios"],
    setup: () => {
        const { $axios: axios } = useNuxtApp();

        const authApi: AuthApi = {
            signIn: async (params: SignInParams): Promise<AuthTokens> => {
                const { data } = await axios.post("/auth/signin", params);
                return {
                    token: data.access || data.token,
                    refreshToken: data.refresh || data.refreshToken || null,
                };
            },

            refresh: async (refreshToken: string): Promise<AuthTokens> => {
                const { data } = await axios.post("/auth/refresh", { refresh: refreshToken });
                return {
                    token: data.access || data.token,
                    refreshToken: data.refresh || data.refreshToken || null,
                };
            },

            verify: async (token: string): Promise<void> => {
                await axios.post("/auth/verify", { token });
            },

            logout: async (refreshToken: string): Promise<void> => {
                await axios.post("/auth/logout", { refresh: refreshToken });
            },
        };

        return {
            provide: { authApi },
        };
    },
});
