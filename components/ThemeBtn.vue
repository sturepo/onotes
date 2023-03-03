<template>
    <button @click="toggleDark()" class="group inline-flex tab-highlight-none items-center gap-x-2 h-9 px-3 rounded-full text-sm font-semibold whitespace-nowrap focus:outline-none focus:ring-2 ring-offset-2 ring-offset-white 
        bg-slate-800 hover:bg-slate-800/90 active:bg-slate-700/95 text-white/90 hover:text-white ring-slate-800 
        dark:bg-orange-700 dark:hover:bg-yellow-600 dark:active:bg-amber-600 dark:text-white/90 dark:hover:text-white dark:ring-orange-400
        ">
        <span class="h-[14px] leading-3">
            Enable {{ isDark ? "Light" : "Dark" }} Mode
        </span>
        <span class="sr-only">, utility-first fundamentals </span>
        <Icon preserveAspectRatio="xMidYMid meet" shape-rendering="geometricPrecision"
            :name="isDark ? 'heroicons:sun' : 'heroicons:moon'" class="w-5 h-5" />
    </button>
</template>
<script setup lang="ts">
import { useDark, useToggle } from '@vueuse/core'
const isDark = useDark()
const toggleDark = useToggle(isDark)
</script>
