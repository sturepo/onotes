<template>
    <TransitionRoot appear :show="props.isOpen" as="template">
        <Dialog as="div" @close="closeModal" class="relative z-10">
            <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100"
                leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
                <div class="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm" />
            </TransitionChild>

            <div class="fixed inset-0 overflow-y-auto">
                <div class="flex min-h-full items-center justify-center p-4 text-center">
                    <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0 scale-95"
                        enter-to="opacity-100 scale-100" leave="duration-200 ease-in" leave-from="opacity-100 scale-100"
                        leave-to="opacity-0 scale-95">
                        <DialogPanel
                            class="w-max mt-4 transform rounded-2xl bg-white dark:bg-slate-700 p-6 opacity-100 shadow-xl"
                            :class="props.class">
                            <form class="flex items-center gap-x-5" @submit.prevent="closeModal">
                                <input type="password" placeholder="Enter Password" v-model="password"
                                    class="rounded-lg bg-white dark:bg-slate-600 dark:text-white dark:placeholder:text-slate-200 focus-visible:dark:placeholder:text-white dark:ring-offset-slate-800 placeholder:text-slate-400 focus:outline-none border-2 focus-visible:border-slate-400 focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2" />
                                <button type="submit"
                                    class="inline-flex justify-center rounded-md border bg-slate-100 hover:bg-white focus-visible:bg-white border-slate-600 dark:bg-slate-200 dark:hover:bg-white dark:ring-offset-slate-800 px-4 py-2 text-sm font-medium text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2">
                                    Submit
                                </button>
                            </form>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </div>
        </Dialog>
    </TransitionRoot>
</template>

<script setup lang="ts">
import {
    TransitionRoot,
    TransitionChild,
    Dialog,
    DialogPanel,
} from "@headlessui/vue"

const props = defineProps({ inputValue: String, isOpen: Boolean, class: String })
const emit = defineEmits(["update:inputValue", "update:isOpen"])
const isOpen = ref(false)

const password = computed({
    get() {
        return props.inputValue
    },
    set(value) {
        emit("update:inputValue", value)
    },
})

watch(props, (n, o) => {
    o.isOpen === n.isOpen ? null : (
        isOpen.value = n.isOpen
    )
})

function openModal() {
    emit("update:isOpen", true)
}

function closeModal() {
    emit("update:isOpen", false)
}
</script>
