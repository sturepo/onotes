<script setup>
import ThemeBtn from '~~/components/ThemeBtn.vue';

const editing = ref(false)
const saving = ref(false)
const page = useState("page")
const password = usePassword()
const isOpen = ref(false)

// Fetch the page on SSR
if (!page.value) {
	page.value = await $fetch("/api/pages/index")
	page.value.parsed = await parseMarkdown(page.value.body)
}

// Re-parse on hydration to enable shiki highlight for code blocks
if (page.value && process.client) {
	onMounted(async () => {
		page.value.parsed = await parseMarkdown(page.value.body)
	})
}

async function editMode() {
	if (!password.value) {
        // password.value = prompt("What is the password?")
        isOpen.value = true
		if (!password.value) {
			alert("Password cannot be empty")
			return
		}
	}
	editing.value = true
	await nextTick()
}

function save() {
    if (!editing.value || saving.value) return

    saving.value = true
    editing.value = false
	$fetch("/api/pages/index", {
		method: "PUT",
		headers: {
			password: password.value,
		},
		body: page.value.body,
	})
		.then(async () => {
            page.value.parsed = await parseMarkdown(page.value.body)
			saving.value = false
		})
		.catch((err) => {
			saving.value = false
			alert(err.data.message)
		})
}
</script>

<template>
	<Head>
		<Title>{{ page.parsed.title || "ONOTES" }}</Title>
		<Meta
			name="description"
			:content="
				page.parsed.description || 'A notes taking app on the edge'
			"
		/>
	</Head>
	<div class="flex items-center" @dblclick="editMode">
    <div class="xl:max-w-6xl 2xl:max-w-7xl">
		<ClientOnly>
			<Tiptap @blur="save" :editing="editing" v-model="page.body" />
		</ClientOnly>
        </div>
	</div>
    <div class="flex flex-col items-end fixed right-10 bottom-8 gap-y-4">
    	<button
            @click="() => editing && editMode"
			class="group inline-flex tab-highlight-none items-center gap-x-2 h-9 px-3 rounded-full text-sm font-semibold whitespace-nowrap text-white/90 hover:text-white  focus:outline-none focus:ring-2 ring-offset-2 ring-offset-white"
            :class="{ 'bg-blue-700 hover:bg-blue-600 active:bg-blue-600/95 ring-blue-400': editing, ' bg-indigo-700 hover:bg-indigo-600 active:bg-indigo-600/95 ring-indigo-400 dark:bg-slate-700 dark:hover:bg-slate-600 dark:active:bg-slate-600/95 dark:ring-slate-400 ': !editing }"
		>
			<span class="h-[14px] leading-3">
                {{ editing ? "EDITING ..." : saving ? "SAVING" : "EDIT THE PAGE" }}
            </span>
			<span class="sr-only">, utility-first fundamentals </span>
                <Icon
					preserveAspectRatio="xMidYMid meet"
					shape-rendering="geometricPrecision"
                    :name="editing ? 'heroicons-solid:document-text' : 'heroicons-solid:pencil'"
					class="w-5 h-5"
				/>
		</button>
        <ThemeBtn />
    </div>
    <Prompt v-model:input-value="password" v-model:is-open="isOpen" />
	<!-- <p class="password" v-show="password">
		<span @click="updatePassword">Update password</span>
	</p> -->
</template>
