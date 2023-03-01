<template>
    <input v-model="value" :type="isVisible ? 'text' : 'password'" :placeholder="props.placeholder"
        class="px-2 py-1 rounded-lg border-2 bg-white border-slate-200 dark:border-slate-500 placeholder:text-slate-400 focus:outline-none focus-visible:border-slate-400 dark:focus-visible:border-slate-400 focus-visible:ring-2 focus-visible:ring-slate-300 focus-visible:ring-offset-2 dark:bg-slate-600 dark:text-white dark:ring-offset-slate-800 dark:placeholder:text-slate-200 focus-visible:dark:placeholder:text-white" />
    <button @click="isVisible = !isVisible" type="button"
        :class="isVisible ? 'bg-blue-400 text-white focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:ring-offset-blue-800' : 'text-slate-500 bg-slate-100 dark:bg-white/10 focus-visible:ring-slate-500 focus-visible:ring-offset-2 dark:ring-offset-slate-800'"
        class="p-1.5 rounded-md focus:outline-none focus-visible:border-slate-400 dark:focus-visible:border-slate-400 focus-visible:ring-2">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
            class="h-6 w-6 dark:text-white">
            <path stroke-linecap="round" stroke-linejoin="round"
                d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
    </button>
</template>

<script setup lang="ts">
const isVisible = ref(false)
const props = defineProps(['modelValue', 'placeholder'])
const emit = defineEmits(['update:modelValue'])

const value = computed({
    get() {
        return props.modelValue
    },
    set(value) {
        emit('update:modelValue', value)
    }
})
</script>
