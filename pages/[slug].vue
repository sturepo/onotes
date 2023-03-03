<script setup lang="ts">
import { onKeyStroke } from '@vueuse/core'
const route = useRoute()
const slug = route.params.slug;

const page = useState<{
    body: string
    is_public: boolean
    name: string
    validating: boolean
    validated: boolean
    editing: boolean
    saving: boolean
}>("genpage")

const isOpen = signal(false)
const password = usePassword()
// QW5tBw
// Fetch the page on SSR
if (!page.value) {
    try {
        page.value = {
            ...(await $fetch(`/api/pages/${slug}`, {
                headers: {
                    password: password.value
                }
            })),
            editing: false,
            saving: false,
            validated: true,
            validating: false,
        }
    } catch (error) {
        console.log(error)
        page.value = {
            body: "<h1>Authenticate First</h1>",
            is_public: false,
            name: "docnote",
            editing: false,
            saving: false,
            validated: false,
            validating: false
        };
    }
}

// Re-parse on hydration t o enable shiki highlight for code blocks
onMounted(() => {
    if (!page.value.is_public) {
        page.value.validating = true
        page.value.body = '<h1>Validating ...</h1>'
        $fetch(`/api/pages/${slug}`, {
            headers: {
                password: password.value
            }
        }).then((v) => {
            page.value = {
                ...page.value,
                ...v
            }
            page.value.validating = false
            page.value.validated = true
            isOpen.update(() => false)
        }).catch((error) => {
            console.log(error, password.value)
            page.value.body = '<h1>Error</h1>'
            page.value.validating = false
            page.value.validated = false
            isOpen.update(() => true)
        })
    }
})

const canExit = computed(() => !page.value.editing && !page.value.saving)
watch(canExit, (v) => {
    if (v) {
        removeEventListener("beforeunload", beforeUnloadListener, { capture: true });
    } else {
        addEventListener("beforeunload", beforeUnloadListener, { capture: true });
    }
})
async function editMode() {
    if (page.value.validated) page.value.editing = true
    else if (!password.value || !page.value.validated) isOpen.update(() => true)
    await nextTick()
}

function save() {
    if (!page.value.editing || page.value.saving) return
    page.value.saving = true
    $fetch(`/api/pages/${slug}`, {
        method: "PUT",
        headers: {
            password: password.value,
        },
        body: page.value.body,
    })
        .then(async () => {
            page.value.editing = page.value.saving = false
        })
        .catch((err) => {
            page.value.editing = page.value.saving = false
            page.value.validated = false;
            console.log(err)
            isOpen.update(() => true)
        })
}

onKeyStroke(['ctrl', ';'], (e) => {
    if (e.ctrlKey && e.key === ';') {
        isOpen.update(() => true)
    }
})

</script>
<template>
    <div class="dark:bg-slate-900 bg-slate-100 flex flex-col items-center min-h-screen pt-6 pb-8" @click="save">
        <div
            class="bg-white dark:bg-slate-800 w-full sm:w-max px-3 pt-3 sm:px-5 sm:pt-3 shadow shadow-slate-300 dark:shadow-slate-600 rounded-md min-h-[calc(100vh-140px)]">
            <Tiptap @click.stop="editMode" v-model:editing-value="page.editing" v-model="page.body" />
        </div>
    </div>
    <div class="flex flex-col items-end fixed right-10 bottom-8 gap-y-4">
        <button v-if="page.editing || page.saving" @click="save"
            class="group inline-flex tab-highlight-none items-center gap-x-2 h-9 px-3 rounded-full text-sm font-semibold whitespace-nowrap text-white/90 hover:text-white focus:outline-none focus:ring-2 ring-offset-2 ring-offset-white bg-blue-700 hover:bg-blue-600 active:bg-blue-600/95 ring-blue-400">
            <span class="h-[14px] leading-3">
                {{ page.saving ? "SAVING" : "SAVE" }}
            </span>
            <span class="sr-only"> Saving the document </span>
            <Icon preserveAspectRatio="xMidYMid meet" shape-rendering="geometricPrecision" :name="
                page.saving
                    ? 'heroicons:document-text'
                    : 'heroicons:cloud-arrow-up'
            " class="w-5 h-5" />
        </button>
        <button @click="editMode" v-else
            class="group inline-flex tab-highlight-none items-center gap-x-2 h-9 px-3 rounded-full text-sm font-semibold whitespace-nowrap text-white/90 hover:text-white focus:outline-none focus:ring-2 ring-offset-2 ring-offset-white bg-indigo-700 hover:bg-indigo-600 active:bg-indigo-600/95 ring-indigo-400 dark:bg-slate-700 dark:hover:bg-slate-600 dark:active:bg-slate-600/95 dark:ring-slate-400">
            <span class="h-[14px] leading-3"> EDIT THE PAGE </span>
            <span class="sr-only">, Edit the document </span>
            <Icon preserveAspectRatio="xMidYMid meet" shape-rendering="geometricPrecision" name="heroicons-solid:pencil"
                class="w-5 h-5" />
        </button>
        <ClientOnly>
            <ThemeBtn />
        </ClientOnly>
        <div v-if="page.validated"
            class="group inline-flex tab-highlight-none items-center gap-x-2 h-9 px-3 rounded-full text-sm font-semibold whitespace-nowrap text-white/90 hover:text-white focus:outline-none focus:ring-2 ring-offset-2 ring-offset-white bg-sky-400 hover:bg-sky-300 active:bg-sky-500/95 ring-sky-200 dark:bg-sky-500 dark:hover:bg-sky-600 dark:active:bg-sky-600/95 dark:ring-sky-400">
            <span class="h-[14px] leading-3"> Verified </span>
            <span class="sr-only">, Verified User </span>
            <Icon preserveAspectRatio="xMidYMid meet" shape-rendering="geometricPrecision"
                name="heroicons:check-badge-solid" class="w-5 h-5 text-white" />
        </div>
    </div>
    <PasswordPrompt :is-open="isOpen" />
</template>
