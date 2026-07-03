import type { Ref } from "vue";

export default defineAppConfig({});

declare global {
    /**
     * Parameters accepted by the sign-in mutation.
     *
     * Left intentionally empty so the consuming app can describe its own
     * sign-in payload through interface merging:
     *
     * @example
     * declare global {
     *     interface SignInParams {
     *         username: string;
     *         password: string;
     *     }
     * }
     */
    interface SignInParams {}

    /**
     * Shape of the authenticated account/profile returned by the profile endpoint.
     * Fill it in from the consuming app via interface merging.
     */
    interface AccountProfile {}

    /**
     * Normalized token pair the auth-layer works with internally.
     * Backend responses are mapped into this shape by `extractTokens`,
     * so the rest of the layer never depends on a backend-specific field name.
     */
    interface AuthTokens {
        token: string;
        refreshToken: string | null;
    }

    /**
     * Storage strategy contract. The default implementation is cookie-based,
     * but any reactive get/set source (localStorage, memory, Pinia, …) works.
     */
    interface AuthStorage {
        token: Ref<string | null | undefined>;
        refreshToken: Ref<string | null | undefined>;
    }
}

declare module "@nuxt/schema" {
    /**
     * App-provided adapters. These live in `appConfig` (not `runtimeConfig`)
     * because they are functions and must not be serialized. Every field is
     * optional — when omitted the layer falls back to sensible defaults that
     * match a `{ access, refresh }` backend.
     */
    interface AppAuthConfig {
        /** Map a raw backend response into the normalized `AuthTokens` shape. */
        extractTokens?: (response: unknown) => AuthTokens;

        /** Build the request body sent to the sign-in endpoint. */
        buildSignInBody?: (params: SignInParams) => unknown;
        /** Build the request body sent to the refresh endpoint. */
        buildRefreshBody?: (refreshToken: string) => unknown;
        /** Build the request body sent to the verify endpoint. */
        buildVerifyBody?: (token: string) => unknown;
        /** Build the request body sent to the sign-out endpoint. */
        buildSignOutBody?: (refreshToken: string) => unknown;

        /** Provide a custom storage strategy instead of the default cookies. */
        storage?: () => AuthStorage;

        /**
         * Local-development sign-in. When provided, the devtools Auth panel shows
         * a "Sign In" button that stores the returned tokens directly — no network
         * call. Leave undefined to hide it.
         */
        developSignIn?: () => AuthTokens | Promise<AuthTokens>;
        /** Called whenever a request fails with 401 before the user is logged out. */
        unauthorizedEvent?: (error: ApiError) => void;
    }

    interface AppConfig {
        appAuth?: AppAuthConfig;
    }
    interface AppConfigInput {
        appAuth?: AppAuthConfig;
    }

    interface PublicRuntimeConfig {
        authModule: {
            endpoints: Record<string, { name?: string; path: string }>;
            signInPath: string;
            verifyStep: boolean;
            cookie: {
                tokenName: string;
                refreshTokenName: string;
                maxAge: number;
                secure: boolean;
                sameSite: "lax" | "strict" | "none";
                path: string;
            };
        };
    }
}
