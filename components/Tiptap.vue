<template>
    <editor-content :ref="editorRef" :editor="editor" />
</template>

<script setup lang="ts">
import { useEditor, EditorContent, Content } from "@tiptap/vue-3"
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'
import Typography from '@tiptap/extension-typography'
import Highlight from "@tiptap/extension-highlight"
import StarterKit from "@tiptap/starter-kit"

const props = defineProps({ modelValue: String, editing: Boolean })
const emit = defineEmits(["update:modelValue", "blur"])
const editorRef = ref()

const editor = useEditor({
    content: props.modelValue,
    extensions: [
        StarterKit,
        TaskList,
        Typography,
        TaskItem.configure({
            nested: true,
        }),
        Highlight.configure({
            HTMLAttributes: {
                class: 'inline-block px-2 rounded-lg selection:bg-indigo-800 bg-indigo-500 text-white ',
            },
        })
    ],
    onBlur: () => {
        emit("blur", false)
    },
    onUpdate: () => {
        emit("update:modelValue", editor.value?.getHTML())
    },
    editorProps: {
        attributes: {
            class: "prose font-op dark:prose-invert max-w-none prose-slate mx-auto lg:prose-lg m-5 focus:outline-none",
        },
    },
    editable: props.editing
})

watch(props, () => {
    const isSame = editor.value?.getHTML() === props.modelValue
    if (!isSame) {
        editor.value?.commands.setContent(props.modelValue as Content, false)
    }
    if (props?.editing === true) {
        editor.value?.setEditable(true)
        editor.value?.commands.focus()
    } else {
        editor.value?.setEditable(false)
    }
})
</script>

<style>
ul[data-type=taskList] {
    list-style: none;
    padding: 0;
}

ul[data-type=taskList] label {
    margin: 0;
}

ul[data-type=taskList] p {
    margin: 0;
}

ul[data-type=taskList] li {
    display: flex;
}

ul[data-type=taskList] li>label {
    flex: 0 0 auto;
    margin-right: 0.5rem;
    user-select: none;
}

ul[data-type=taskList] li>div {
    flex: 1 1 auto;
}
</style>
