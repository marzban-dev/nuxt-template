export default defineNuxtConfig({
    compatibilityDate: "2025-09-04",
    devtools: {
        enabled: true,
    },
    ssr: true,

    extends: [],

    components: [
        {
            path: "~/components",
            pathPrefix: false,
            prefix: "App",
        },
    ],

    assetsGeneratorModule: {
        assets: ["public/img", "public/video"],
        output: "app/constants/assets.ts",
    },

    authModule: {
        signInPath: "/sign-in",
        endpoints: {
            develop_token: {
                name: "",
                path: "/user/develop_token",
            },
            logout: {
                name: "",
                path: "/user/logout",
            },
            profile: {
                name: "",
                path: "/user/profile",
            },
            refresh: {
                name: "",
                path: "/user/token/refresh",
            },
            signin: {
                name: "",
                path: "/user/token",
            },
            update: {
                name: "",
                path: "/user/profile",
            },
            verify: {
                name: "",
                path: "/user/verify",
            },
        },
    },

    image: {
        quality: 85,
        domains: [],
    },

    icon: {
        cssLayer: "base",
        // customCollections: [
        //     {
        //         prefix: "ci",
        //         dir: "layers/icons-layer/public/icons",
        //     },
        // ],
        // iconifyApiEndpoint: process.env.API_ICONS_URL || "https://icon-server.time4reserve.ir/",
        // fallbackToApi : false
    },

    typescript: {
        includeWorkspace: true,
    },

    modules: [
        "@vueuse/nuxt",
        "@formkit/auto-animate/nuxt",
        "motion-v/nuxt",
        "@pinia/nuxt",
        "@nuxt/image",
        "@nuxtjs/seo",
        "@nuxt/icon",
    ],

    runtimeConfig: {
        public: {
            API_BASE_URL: process.env.API_BASE_URL || "http://localhost:8000",
        },
    },

    vite: {
        optimizeDeps: {
            include: [
                "@tanstack/vue-query",
                "@unhead/schema-org/vue",
                "@vue/devtools-core",
                "@vue/devtools-kit",
                "@vueuse/integrations/useJwt",
                "axios",
                "jwt-decode",
            ],
        },
    },
});
