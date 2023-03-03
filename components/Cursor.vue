<template>
    <teleport to="body">
        <svg :class="mouseColor" class="dark:stroke-white dark:stroke-1" style="position: absolute;"
            :style="{ top: `${y}px`, left: `${x}px` }" fill="currentColor" height="24" shape-rendering="geometricPrecision"
            stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24"
            width="24">
            <path d="m4 4 16 5.333L12 12l-2.667 8L4 4Z"></path>
        </svg>
    </teleport>
</template>
<script setup lang="ts">
import { useTransition } from '@vueuse/core'
const { x: in_x, y: in_y, mouseColor } = defineProps(['x', 'y', 'mouseColor'])

const x = useTransition(computed(in_x), {
    duration: 50
})

const y = useTransition(computed(in_y), {
    duration: 50
})
</script>
