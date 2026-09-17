import { createResolver, defineNuxtModule, extendPages } from "@nuxt/kit";
import { defu } from "defu";
import { addCustomTab } from "@nuxt/devtools-kit";

type ModuleOptions = {
    /** In-app route the auth middleware redirects to when a guard fails. */
    signInPath: string;
    /** Whether `checkAuth` calls the verify endpoint before trusting a token. */
    verifyStep: boolean;
};

export default defineNuxtModule<ModuleOptions>({
    meta: {
        name: "auth-module",
        configKey: "authModule",
    },

    defaults: {
        signInPath: "/sign-in",
        verifyStep: true,
    },

    async setup(moduleOptions, nuxt) {
        const resolver = createResolver(import.meta.url);

        nuxt.options.runtimeConfig.public.authModule = defu(nuxt.options.runtimeConfig.public.authModule, {
            signInPath: moduleOptions.signInPath,
            verifyStep: moduleOptions.verifyStep,
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
