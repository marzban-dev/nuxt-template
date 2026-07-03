type AppApiConfig = {
    /** Called for handled 4xx responses (queries/mutations with `meta.handleError`). */
    errorCallback?: (errorData: ApiErrorContext) => void;
    /** Called for any other failure (5xx, network, etc.). */
    unhandledErrorCallback?: () => void;
};

export default defineAppConfig({});

declare module "@nuxt/schema" {
    interface AppConfig {
        appApi?: AppApiConfig;
    }

    interface AppConfigInput {
        appApi?: AppApiConfig;
    }
}
