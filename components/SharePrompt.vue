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
                            class="mt-4 max-w-sm scale-100 transform rounded-2xl bg-white p-6 opacity-100 shadow-xl dark:bg-slate-700">
                            <form class="flex flex-col" @submit.prevent="share">
                                <div class="flex items-center mb-4 gap-x-2">
                                    <PasswordInput placeholder="Enter Password" v-model="pw" />
                                </div>
                                <div class="flex items-center mb-2 gap-x-2">
                                    <PasswordInput placeholder="Enter Secret Key" v-model="spw" />
                                </div>
                                <div class="flex gap-x-1 mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                                        class="w-4 h-4 dark:text-white text-slate-500">
                                        <path fill-rule="evenodd"
                                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
                                            clip-rule="evenodd" />
                                    </svg>
                                    <p class="text-start text-xs text-slate-500 select-none dark:text-slate-400 w-52">
                                        <em class="text-slate-400 dark:text-slate-300">secret key</em> used to change the
                                        settings,
                                        share it wisely. it's assigned once for now!
                                    </p>
                                </div>
                                <div class="flex gap-2 mb-4">
                                    <button @click="isPublic = true" type="button"
                                        :class="isPublic === true ? 'bg-sky-500 dark:bg-blue-500 text-white dark:border-blue-400 shadow-sm shadow-sky-500 dark:shadow-blue-800' : 'bg-white dark:bg-slate-400 text-slate-900 dark:text-slate-50'"
                                        class="border dark:border-slate-400 w-full leading-4 py-3 rounded-lg flex items-center justify-center">Public</button>
                                    <button @click="isPublic = false" type="button"
                                        :class="isPublic === false ? 'bg-sky-500 dark:bg-blue-500 text-white dark:border-blue-400 shadow-sm shadow-sky-500 dark:shadow-blue-800' : 'bg-white dark:bg-slate-400 text-slate-900 dark:text-slate-50'"
                                        class="border dark:border-slate-400 w-full leading-4 py-3 rounded-lg flex items-center justify-center">Private</button>
                                </div>
                                <div class="flex items-center gap-x-6">
                                    <input v-model="name" type="text" placeholder="document's name"
                                        class="shrink px-2 py-1 w-40 rounded-lg border-2 bg-white border-slate-200 dark:border-slate-500 placeholder:text-slate-400 focus:outline-none focus-visible:border-slate-400 dark:focus-visible:border-slate-400 focus-visible:ring-2 focus-visible:ring-slate-300 focus-visible:ring-offset-2 dark:bg-slate-600 dark:text-white dark:ring-offset-slate-800 dark:placeholder:text-slate-200 focus-visible:dark:placeholder:text-white" />
                                    <button type="submit"
                                        class="inline-flex justify-center rounded-md border w-[70px] h-[37.97px] border-slate-200 dark:border-slate-600 bg-blue-400 px-4 py-2 text-sm font-medium text-white dark:text-slate-900 hover:bg-blue-500 focus:outline-none dark:focus-visible:bg-white focus-visible:ring-2 dark:focus-visible:ring-slate-500 focus-visible:ring-offset-2 dark:bg-slate-200 dark:ring-offset-slate-800 dark:hover:bg-white">
                                        <template v-if="!sharing"> Share </template>
                                        <Icon v-else name="line-md:loading-twotone-loop" class="w-6 h-6 text-slate-600" />
                                    </button>
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
import { nanoid } from 'nanoid'

const page = useState("page")

const { isOpen } = defineProps(["isOpen"])

const sharing = ref(false);
const successful = ref(false);

const isPublic = ref(true)
const pw = ref("")
const spw = ref("")
const name = ref("")
const router = useRouter();

const closeModal = () => isOpen.update(() => false)

const share = async () => {
    const slug = nanoid(6)
    sharing.value = true

    const { success, error } = await $fetch(`/api/pages/${slug}?pw=${pw.value}&spw=${spw.value}&name=${name.value === "" ? "docnote" : name.value}&is_public=${isPublic.value ? "TRUE" : "FALSE"}`, {
        method: "POST",
        // @ts-ignore
        body: page.value?.body || "SORRY! OOOPS SOME ERROR! contact on sukhpreetben10@gmail.com",
    })

    if (error) {
        sharing.value = false
        alert('error!' + error)
    } else if (success) {
        successful.value = true;
        closeModal()
        setTimeout(() => {
            sharing.value = false
            window.localStorage.removeItem('NOTES-password');
            router.push({ path: `/${slug}` });
        }, 400)
    } else {
        sharing.value = false
        console.log("SOME ERROR ELSE THAN STORAGE ERROR!")
    }
    sharing.value = false
}

</script>
