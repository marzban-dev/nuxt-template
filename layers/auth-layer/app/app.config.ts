export default defineAppConfig({});

declare global {
    type SignInParams = unknown;
    type AccountProfile = unknown;
}

declare module "@nuxt/schema" {
    interface AppConfig {
        appAuth?: {
            developSignIn?: () => { access: string; refresh: string };
            unauthorizedEvent?: (error: ApiError) => void;
        };
    }
    interface AppConfigInput {
        appAuth: {
            developSignIn?: () => { access: string; refresh: string };
            unauthorizedEvent?: (errors: ApiError) => void;
        };
    }
}
