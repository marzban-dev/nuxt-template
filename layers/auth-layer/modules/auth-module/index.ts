import { createResolver, defineNuxtModule, extendPages, useLogger } from "@nuxt/kit";
import { defu } from "defu";
import { addCustomTab } from "@nuxt/devtools-kit";

type ModuleOptions = {
    endpoints: {
        profile: string;
        refresh: string;
        verify: string;
        signin: string;
        sign_out: string;
    };
    signInPath: string;
};

export default defineNuxtModule<ModuleOptions>({
    meta: {
        name: "auth-module",
        configKey: "authModule",
    },

    defaults: {
        endpoints: undefined,
    },

    async setup(moduleOptions, nuxt) {
        const resolver = createResolver(import.meta.url);
        const logger = useLogger("auth-layer");

        if (!moduleOptions.endpoints) {
            logger.box("Please provide endpoints of authModule in nuxt.config.ts");
            process.exit(1);
        }

        nuxt.options.runtimeConfig.public.authModule = defu(nuxt.options.runtimeConfig.public.authModule, {
            endpoints: moduleOptions.endpoints,
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
