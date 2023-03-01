<script setup>
const editing = ref(false)
const page = useState("page")
const isOpen = signal(false)

// Fetch the page on SSR
if (!page.value) {
    page.value = { body: "You can start typing here ... " }
}

onMounted(() => {
    page.value.body = window.localStorage.getItem("NOTES_LOCALSTORAGE") || "You can start typing here ... "
})

async function editMode() {
    editing.value = true
    await nextTick()
}

async function save() {
    if (!editing.value) return
    window.localStorage.setItem('NOTES_LOCALSTORAGE', page.value.body)
    editing.value = false
}

watch(editing, (v) => {
    if (v) {
        addEventListener("beforeunload", beforeUnloadListener, { capture: true });
    } else {
        removeEventListener("beforeunload", beforeUnloadListener, { capture: true });
    }
})
</script>
<template>
    <Head>
        <Title> Document APP </Title>
        <Meta name="description" content="A notes taking app on the edge" />
    </Head>
    <div class="dark:bg-slate-900 bg-slate-100 flex flex-col items-center min-h-screen pt-6 pb-8" @click="save">
        <div
            class="bg-white dark:bg-slate-800 w-full sm:w-max px-3 pt-3 sm:px-5 sm:pt-3 shadow shadow-slate-300 dark:shadow-slate-600 rounded-md min-h-[calc(100vh-140px)]">
            <Tiptap @click.stop="editMode" v-model:editing-value="editing" v-model="page.body" />
        </div>
    </div>
    <div class="flex flex-col items-end fixed right-10 bottom-8 gap-y-4">
        <button v-if="editing" @click="save"
            class="group inline-flex tab-highlight-none items-center gap-x-2 h-9 px-3 rounded-full text-sm font-semibold whitespace-nowrap text-white/90 hover:text-white focus:outline-none focus:ring-2 ring-offset-2 ring-offset-white bg-blue-700 hover:bg-blue-600 active:bg-blue-600/95 ring-blue-400">
            <span class="h-[14px] leading-3">
                SAVE
            </span>
            <span class="sr-only"> Save the document </span>
            <Icon preserveAspectRatio="xMidYMid meet" shape-rendering="geometricPrecision" name="heroicons:document-text"
                class="w-5 h-5" />
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
        <LazySharePrompt :is-open="isOpen" />
        <button @click="isOpen.update(() => true)"
            class="inline-flex tab-highlight-none items-center gap-x-2 h-9 px-3 rounded-full text-sm font-semibold whitespace-nowrap text-white/90 hover:text-white focus:outline-none focus:ring-2 ring-offset-2 ring-offset-white bg-blue-700 hover:bg-blue-600 active:bg-blue-600/95 ring-blue-400">
            <span class="h-[14px] leading-3">
                SHARE
            </span>
            <span class="sr-only"> Share the document </span>
            <Icon preserveAspectRatio="xMidYMid meet" shape-rendering="geometricPrecision" name="heroicons:share"
                class="w-5 h-5" />
        </button>
    </div>
</template>
