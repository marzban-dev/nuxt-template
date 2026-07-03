<script lang="ts" setup>
// imports

import * as ui_locales from "@nuxt/ui/locale";
import { VueQueryDevtools } from "@tanstack/vue-query-devtools";

// states

const { locale } = useI18n();

const { dir, lang } = useAppLocale();

useSeoMeta({
    titleTemplate: (titleChunk) => {
        return titleChunk ? `${titleChunk} | Website` : "Website";
    },
    viewport: {
        initialScale: 1,
        maximumScale: 1,
        userScalable: "no",
        width: "device-width",
    },
});

useHead({
    htmlAttrs: {
        dir,
        lang,
        class: "",
    },
    bodyAttrs: { class: "" },
});
</script>

<template>
    <NuxtRouteAnnouncer />
    <NuxtPwaManifest />

    <NuxtLayout>
        <UApp
            :locale="ui_locales[locale]"
            :toaster="{ position: 'top-center', progress: false, expand: false }"
            :tooltip="{ delayDuration: 0 }"
        >
            <AuthLayerWrapper>
                <NuxtPage />
            </AuthLayerWrapper>

            <ClientOnly>
                <VueQueryDevtools dir="rtl" />
            </ClientOnly>
        </UApp>
    </NuxtLayout>
</template>
