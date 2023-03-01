<template>
    <editor-content :ref="editorRef" :editor="editor" />
</template>

<script setup lang="ts">
import { useEditor, EditorContent, Content } from "@tiptap/vue-3"
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'
import Typography from '@tiptap/extension-typography'
import Link from '@tiptap/extension-link'
import { lowlight } from 'lowlight/lib/core'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import Highlight from "@tiptap/extension-highlight"
import StarterKit from "@tiptap/starter-kit"
import css from 'highlight.js/lib/languages/css'
import js from 'highlight.js/lib/languages/javascript'
import ts from 'highlight.js/lib/languages/typescript'
import html from 'highlight.js/lib/languages/xml'


const props = defineProps({ modelValue: String, editingValue: Boolean })
const emit = defineEmits(["update:modelValue", "update:editingValue", "blur"])
const editorRef = ref()

const editing = computed({
    get() {
        return props.editingValue
    },
    set(newValue) {
        emit('update:editingValue', newValue)
    }
})

const body = computed({
    get() {
        return props.modelValue
    },
    set(newValue) {
        emit('update:modelValue', newValue)
    }
})

lowlight.registerLanguage('html', html)
lowlight.registerLanguage('css', css)
lowlight.registerLanguage('js', js)
lowlight.registerLanguage('ts', ts)

const editor = useEditor({
    content: props.modelValue,
    extensions: [
        StarterKit.configure({
            // disable extension as it's already present in CodeBlockLowlight
            codeBlock: false,
            // collaboration comes with it's own history extension
            // history: false
        }),
        TaskList,
        Typography,
        TaskItem.configure({
            nested: true,
        }),
        Highlight.configure({
            HTMLAttributes: {
                class: 'inline-block px-2 rounded-lg selection:bg-indigo-800 bg-indigo-500 text-white ',
            },
        }),
        Link,
        CodeBlockLowlight.configure({
            lowlight,
        }),
    ],
    onBlur: () => {
        emit("blur", false)
    },
    onUpdate: () => {
        emit("update:modelValue", editor.value?.getHTML())
    },
    editorProps: {
        attributes: {
            class: "prose dark:prose-invert md:w-[767px] lg:w-[1023px] max-w-none prose-slate font-op focus:outline-none",
        },
    },
    editable: props.editingValue
})

watch(body, (content) => {
    const isSame = editor.value?.getHTML() === content
    if (!isSame) {
        editor.value?.commands.setContent(content as Content, false)
    }
})

watch(editing, (isEditing) => {
    if (isEditing === true) {
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

ul[data-type=taskList] div {
    margin: 0;
}

ul[data-type=taskList] p {
    margin: 0;
    line-height: 8px;
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
