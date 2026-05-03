<script lang="ts" setup>
// imports

import { useJwt } from "@vueuse/integrations/useJwt";

// state

const { token, refreshToken, updateToken, updateRefreshToken, logout, isLoggedIn } = useAuth();
const { refetch: refetchAccount } = useGetAccount();
const { mutateAsync: developSignIn, isPending: isDevelopSignInPending } = useDevelopSignin();

const accessTokenValue = computed(() => unref(token) ?? "");
const refreshTokenValue = computed(() => unref(refreshToken) ?? "");
const { header: accessHeader, payload: accessPayload } = useJwt(accessTokenValue);
const { header: refreshHeader, payload: refreshPayload } = useJwt(refreshTokenValue);

const runtimeConfig = useRuntimeConfig();
const otpInputsCount = runtimeConfig.public.authModule.otpCount;
const otpInputsTimer = runtimeConfig.public.authModule.otpTimer;

// computed

const todayText = computed(() => toReadableDateString(new Date()));

const tokenDetails = computed(() => {
    const accessExpDate = new Date((accessPayload.value?.exp ?? 0) * 1000);
    const refreshExpDate = new Date((refreshPayload.value?.exp ?? 0) * 1000);

    const accessDateString = toReadableDateString(accessExpDate);
    const refreshDateString = toReadableDateString(refreshExpDate);

    return {
        accessExp: accessDateString,
        refreshExp: refreshDateString,
    };
});

// methods

const signInHandler = () => {
    developSignIn(
        {},
        {
            onSuccess: (response) => {
                updateToken(response.access);
                updateRefreshToken(response.refresh);
            },
            onError: () => {},
        }
    );
};

const signOutHandler = async () => {
    await logout();
};
</script>

<template>
    <div
        class="size-full h-screen bg-neutral-950"
        dir="ltr"
    >
        <div class="w-full flex flex-col gap-8 p-12">
            <div class="flex items-center gap-2">
                <span class="text-xl text-blue-400"> Today :</span>

                <div class="w-fit font-semibold tracking-wider px-2.5 text-white">
                    {{ todayText }}
                </div>
            </div>

            <div class="grid grid-cols-2 gap-4 w-full">
                <div class="bg-neutral-900 p-6 rounded-xl flex flex-col gap-4">
                    <div class="w-fit text-white">Access Token</div>
                    <div class="w-full break-words text-neutral-300">
                        {{ token ?? "You are signed out" }}
                    </div>
                    <div
                        v-if="token"
                        class="tracking-wider px-2.5 text-emerald-500"
                    >
                        {{ tokenDetails.accessExp }}
                    </div>
                </div>
                <div class="bg-neutral-900 p-6 rounded-xl flex flex-col gap-4">
                    <div class="w-fit text-white">Refresh Token</div>
                    <div class="w-full break-words text-neutral-300">
                        {{ refreshToken ?? "You are signed out" }}
                    </div>
                    <div
                        v-if="refreshToken"
                        class="tracking-wider px-2.5 text-emerald-500"
                    >
                        {{ tokenDetails.refreshExp }}
                    </div>
                </div>
            </div>

            <div class="flex items-center gap-4">
                <button
                    class="bg-blue-400 px-4 py-2 rounded-lg"
                    :disabled="isDevelopSignInPending"
                    :class="
                        isDevelopSignInPending
                            ? 'grayscale'
                            : 'cursor-pointer active:translate-y-0.5 transition-transform'
                    "
                    @click="signInHandler"
                >
                    {{ isDevelopSignInPending ? "Loading..." : "Sign In With Develop Token" }}
                </button>
                <button
                    v-if="isLoggedIn"
                    class="bg-rose-400 px-4 py-2 rounded-lg"
                    :class="
                        isDevelopSignInPending
                            ? 'grayscale'
                            : 'cursor-pointer active:translate-y-0.5 transition-transform'
                    "
                    :disabled="isDevelopSignInPending"
                    @click="signOutHandler"
                >
                    Logout
                </button>
            </div>
        </div>
    </div>
</template>
