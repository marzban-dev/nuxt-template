<script lang="ts" setup>

// types

type Props = {
    checkOnServerPrefetch?: boolean
}

// props

const props = withDefaults(defineProps<Props>(), {
    checkOnServerPrefetch: true
});
const { checkOnServerPrefetch } = toRefs(props);

// states

useServerSideAuthCheck(checkOnServerPrefetch.value);

</script>

<template>
    <slot />
</template>