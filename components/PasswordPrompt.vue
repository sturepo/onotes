<template>
    <!-- https://play.tailwindcss.com/RejbxcQhic designed here by self. -->
    <TransitionRoot appear :show="isOpen()" as="template">
        <Dialog as="div" @close="closeModal" class="relative z-10">
            <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100"
                leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
                <div class="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm"></div>
            </TransitionChild>
            <div class="fixed inset-0 overflow-y-auto">
                <div class="flex min-h-full items-center justify-center p-4 text-center">
                    <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0 scale-95"
                        enter-to="opacity-100 scale-100" leave="duration-200 ease-in" leave-from="opacity-100 scale-100"
                        leave-to="opacity-0 scale-95">
                        <DialogPanel
                            class="mt-4 max-w-sm scale-100 transform rounded-2xl bg-white p-6 opacity-100 shadow-xl transition-colors duration-150 ease-out"
                            :class="new_pw ? 'bg-indigo-400 dark:bg-indigo-600' : 'dark:bg-slate-700'">
                            <form class="flex flex-col" @submit.prevent="submit">
                                <div class="flex items-center mb-4 gap-x-2">
                                    <PasswordInput placeholder="Enter Password" v-model="pw" />
                                </div>
                                <div class="flex items-center gap-x-3">
                                    <button type="submit"
                                        class="inline-flex justify-center rounded-md border w-[70px] h-[37.97px] border-slate-200 dark:border-slate-600 bg-blue-400 px-4 py-2 text-sm font-medium text-white dark:text-slate-900 hover:bg-blue-500 focus:outline-none dark:focus-visible:bg-white focus-visible:ring-2 dark:focus-visible:ring-slate-500 focus-visible:ring-offset-2 dark:bg-slate-200 dark:ring-offset-slate-800 dark:hover:bg-white">
                                        Submit
                                    </button>
                                    <div v-if="!new_pw"
                                        class="w-full select-none flex items-center justify-center h-[37.97px] rounded-md "
                                        :class="page.validating ? 'bg-slate-200 text-slate-600' : (err ? 'bg-rose-500 text-white' : 'hidden')">
                                        {{ page.validating ? 'Validating' : (err ? 'Wrong Password' : 'Progress') }}
                                    </div>
                                    <div v-else
                                        class="w-full select-none flex items-center justify-center h-[37.97px] rounded-md"
                                        :class="page.validating ? 'bg-slate-200 text-slate-600' : 'bg-white text-slate-900'">
                                        {{ page.validating ? 'Validating' : 'Enter New Password' }}
                                    </div>
                                    <div v-if="pw_changed"
                                        class="w-full text-sm select-none shadow-sm relative flex items-center gap-x-2 rounded-md pl-3 py-2 h-[37.97px] bg-green-400 text-white">
                                        Password Changed
                                        <button @click="pw_changed = false" type="button" class="absolute right-2">
                                            <Icon name="heroicons:x-circle-20-solid" class="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
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
const route = useRoute()
const slug = route.params.slug
// const page = useState("page")

const { isOpen } = defineProps(["isOpen"])

const pw = usePassword()
const page = useState<{
    body: string
    is_public: boolean
    name: string
    validating: boolean
    validated: boolean
}>('genpage')

const err = ref(false)
const prevPw = ref("")
const new_pw = computed(() => prevPw.value !== "")

const pw_changed = ref(false)

const closeModal = () => {
    if ((page.value.is_public && !page.value.validating) || page.value.validated) {
        isOpen.update(() => false)
    }
}

const validate = async () => {
    pw_changed.value = false
    page.value.validating = true
    err.value = false
    try {
        const res = await $fetch(`/api/pw/${slug}?pw=${pw.value}`)
        page.value.validating = false
        if (res.isValidated) {
            page.value.validated = true
            closeModal()
        } else if (res.change) {
            prevPw.value = pw.value
        }
    } catch (error) {
        err.value = true
        page.value.validating = false
        page.value.validated = false
        console.log(error)
    }
}

const change = async () => {
    page.value.validating = true
    await $fetch(`/api/pw/${slug}?pw=${pw.value}`, {
        method: 'PUT',
        headers: {
            password: prevPw.value
        },
        body: pw.value
    })
    page.value.validating = false
    prevPw.value = ""
    pw_changed.value = true
}

const submit = () => {
    if (new_pw.value) {
        change()
    } else {
        validate()
    }
}
</script>
