export type SignInParams = any;

export type AuthTokens = {
    token: string;
    refreshToken: string | null;
};

export interface AuthApi {
    signIn: (params: SignInParams) => Promise<AuthTokens>;
    refresh: (refreshToken: string) => Promise<AuthTokens>;
    verify: (token: string) => Promise<void>;
    logout: (refreshToken: string) => Promise<void>;
}

declare module "#app" {
    interface NuxtApp {
        $authApi: AuthApi;
    }
}

declare module "vue" {
    interface ComponentCustomProperties {
        $authApi: AuthApi;
    }
}
