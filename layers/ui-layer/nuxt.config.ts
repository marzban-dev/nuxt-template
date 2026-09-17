import { fileURLToPath } from "url";
import { dirname, join } from "path";
import tailwindcss from "@tailwindcss/vite";

const currentDir = dirname(fileURLToPath(import.meta.url));

export default defineNuxtConfig({
    css: [join(currentDir, "./assets/css/main-tailwind.css"), join(currentDir, "./assets/css/vue-animations.css")],

    ui: {
        colorMode: false,
        theme: {
            colors: ["primary", "secondary", "info", "success", "warning", "error"],
        },
    },

    vite: {
        plugins: [tailwindcss()],
    },

    modules: ["@nuxt/ui", "@nuxt/fonts"],
});
