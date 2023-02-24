<script setup>
import { onKeyStroke } from '@vueuse/core'

const editing = ref(false)
const saving = ref(false)
const page = useState("page")
const password = usePassword()
const isOpen = ref(false)
const validated = ref(false)
const prevPassword = ref("")

watch(isOpen, async (v) => {
    if (!v) {
        if (prevPassword.value === "") {
            const { isValidated, change } = await $fetch(`/api/pw/index?pw=${password.value}`);
            validated.value = isValidated
            if (change) {
                prevPassword.value = password.value
            }
        } else {
            isOpen.value = true
            await $fetch(`/api/pw/index?pw=${password.value}`, {
                method: 'PUT',
                headers: {
                    password: prevPassword.value
                },
                body: password.value
            })
            prevPassword.value = ""
        }
    }
})

watch(prevPassword, async (p) => {
    p !== "" && (isOpen.value = true)
})

// Fetch the page on SSR
if (!page.value) {
    page.value = await $fetch("/api/pages/index")
    page.value.parsed = await parseMarkdown(page.value.body)
}

// Re-parse on hydration to enable shiki highlight for code blocks
if (page.value && process.client) {
    onMounted(async () => {
        page.value.parsed = await parseMarkdown(page.value.body)
        const { isValidated } = await $fetch(`/api/pw/index?pw=${password.value}`);
        validated.value = isValidated
    })
}

async function editMode() {
    if (!password.value || !validated.value) isOpen.value = true
    else if (validated.value) editing.value = true
    await nextTick()
}

function save() {
    if (!editing.value || saving.value) return
    saving.value = true
    $fetch("/api/pages/index", {
        method: "PUT",
        headers: {
            password: password.value,
        },
        body: page.value.body,
    })
        .then(async () => {
            page.value.parsed = await parseMarkdown(page.value.body)
            editing.value = saving.value = false
        })
        .catch((err) => {
            editing.value = saving.value = false
            validated.value = false;
            alert(err.data.message)
        })
}

onKeyStroke(['ctrl', ';'], (e) => {
    if (e.ctrlKey && e.key === ';') {
        isOpen.value = true
    }
})

</script>
<template>
    <Head>
        <Title>{{ page.parsed.title || "ONOTES" }}</Title>
        <Meta name="description" :content="
            page.parsed.description || 'A notes taking app on the edge'
        " />
    </Head>
    <div class="flex items-center justify-center w-full" @dblclick="editMode">
        <div class="bg-white dark:bg-slate-800 w-full sm:w-max px-3 pt-3 sm:px-5 sm:pt-3 shadow shadow-slate-300 dark:shadow-slate-600 rounded-md min-h-[calc(100vh-240px)]">
            <Tiptap @blur="save" :editing="editing" v-model="page.body" />
        </div>
    </div>
    <div class="flex flex-col items-end fixed right-10 bottom-8 gap-y-4">
        <button v-if="editing || saving" @click="save"
            class="group inline-flex tab-highlight-none items-center gap-x-2 h-9 px-3 rounded-full text-sm font-semibold whitespace-nowrap text-white/90 hover:text-white focus:outline-none focus:ring-2 ring-offset-2 ring-offset-white bg-blue-700 hover:bg-blue-600 active:bg-blue-600/95 ring-blue-400">
            <span class="h-[14px] leading-3">
                {{ saving ? "SAVING" : "SAVE" }}
            </span>
            <span class="sr-only"> Saving the document </span>
            <Icon preserveAspectRatio="xMidYMid meet" shape-rendering="geometricPrecision" :name="
                saving
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
        <ThemeBtn />
        <div v-if="validated"
            class="group inline-flex tab-highlight-none items-center gap-x-2 h-9 px-3 rounded-full text-sm font-semibold whitespace-nowrap text-white/90 hover:text-white focus:outline-none focus:ring-2 ring-offset-2 ring-offset-white bg-sky-400 hover:bg-sky-300 active:bg-sky-500/95 ring-sky-200 dark:bg-sky-500 dark:hover:bg-sky-600 dark:active:bg-sky-600/95 dark:ring-sky-400">
            <span class="h-[14px] leading-3"> Verified </span>
            <span class="sr-only">, Verified User </span>
            <Icon preserveAspectRatio="xMidYMid meet" shape-rendering="geometricPrecision"
                name="heroicons:check-badge-solid" class="w-5 h-5 text-white" />
        </div>
    </div>
    <Prompt v-model:input-value="password" :class=" prevPassword != '' && '!bg-purple-600'" v-model:is-open="isOpen" />
</template>
