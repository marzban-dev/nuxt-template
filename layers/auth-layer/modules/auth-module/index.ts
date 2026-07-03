import { createResolver, defineNuxtModule, extendPages, useLogger } from "@nuxt/kit";
import { defu } from "defu";
import { addCustomTab } from "@nuxt/devtools-kit";

type AuthEndpoint = {
    name?: string;
    path: string;
};

type ModuleOptions = {
    /**
     * Backend endpoints. `signin`, `refresh`, `verify`, `logout` and `profile`
     * are required; the rest are optional and only used by helper composables.
     */
    endpoints: {
        signin: AuthEndpoint;
        refresh: AuthEndpoint;
        verify: AuthEndpoint;
        logout: AuthEndpoint;
        profile: AuthEndpoint;
    };
    /** In-app route the auth middleware redirects to when a guard fails. */
    signInPath: string;
    /** Whether `checkAuth` calls the verify endpoint before trusting a token. */
    verifyStep: boolean;
    /** Default cookie storage configuration. */
    cookie: {
        tokenName: string;
        refreshTokenName: string;
        maxAge: number;
        secure: boolean;
        sameSite: "lax" | "strict" | "none";
        path: string;
    };
};

const REQUIRED_ENDPOINTS = ["signin", "refresh", "verify", "logout", "profile"] as const;

export default defineNuxtModule<ModuleOptions>({
    meta: {
        name: "auth-module",
        configKey: "authModule",
    },

    defaults: {
        // endpoints must be supplied by the app; there is no sensible default.
        endpoints: undefined as unknown as ModuleOptions["endpoints"],
        signInPath: "/sign-in",
        verifyStep: true,
        cookie: {
            tokenName: "token",
            refreshTokenName: "refresh-token",
            maxAge: 60 * 60 * 24 * 30,
            secure: true,
            sameSite: "lax",
            path: "/",
        },
    },

    async setup(moduleOptions, nuxt) {
        const resolver = createResolver(import.meta.url);
        const logger = useLogger("auth-layer");

        if (!moduleOptions.endpoints) {
            logger.box("Please provide `authModule.endpoints` in nuxt.config.ts");
            process.exit(1);
        }

        const missing = REQUIRED_ENDPOINTS.filter((key) => !moduleOptions.endpoints[key]?.path);
        if (missing.length) {
            logger.box(`Missing required authModule endpoints: ${missing.join(", ")}`);
            process.exit(1);
        }

        nuxt.options.runtimeConfig.public.authModule = defu(nuxt.options.runtimeConfig.public.authModule, {
            endpoints: moduleOptions.endpoints,
            signInPath: moduleOptions.signInPath,
            verifyStep: moduleOptions.verifyStep,
            cookie: moduleOptions.cookie,
        });

        extendPages((pages) => {
            pages.unshift({
                name: "devtools-auth-view",
                path: "/devtools-auth-view",
                file: resolver.resolve("runtime/templates/devtools-auth-view.vue"),
            });
        });

        addCustomTab({
            name: "auth-module",
            title: "Auth Module",
            icon: "lucide:lock-keyhole",
            view: {
                type: "iframe",
                src: "/devtools-auth-view",
            },
        });
    },
});
