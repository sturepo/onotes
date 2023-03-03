<template>
    <editor-content :editor="editor" />
</template>

<script setup lang="ts">
import { useEditor, EditorContent, Content } from "@tiptap/vue-3"

const props = defineProps({
    modelValue: String, isColab: Boolean, editingValue: Boolean, user: Object({
        name: String,
        color: String
    })
})

const emit = defineEmits(["update:modelValue", "update:editingValue", "blur"])

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

const editor = useEditor({
    content: props.modelValue,
    extensions: await makeExtensions((
        props.isColab === true ? ({
            isColab: true,
            user: props.user
        }) : ({
            isColab: false
        })
    )),
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
editor.value?.registerPlugin
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
[type='checkbox']:checked {
    background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3c/svg%3e");
}

[type='checkbox']:checked {
    border-color: transparent;
    background-color: currentColor;
    background-size: 100% 100%;
    background-position: center;
    background-repeat: no-repeat;
}

[type='checkbox'] {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    padding: 0;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
    display: inline-block;
    vertical-align: middle;
    background-origin: border-box;
    -webkit-user-select: none;
    -moz-user-select: none;
    user-select: none;
    flex-shrink: 0;
    border-radius: 2px;
    height: 1rem;
    width: 1rem;
    color: #2563eb;
    background-color: #fff;
    border-color: #6b7280;
    border-width: 1px;
    --tw-shadow: 0 0 #0000;
}

input {
    font-family: inherit;
    font-size: 100%;
    font-weight: inherit;
    line-height: inherit;
    color: inherit;
    margin: 0;
    padding: 0;
}

ul[data-type=taskList] {
    list-style: none;
    padding: 0;
}

ul[data-type=taskList] label {
    margin: 0;
    display: flex;
}

ul[data-type=taskList] div {
    margin: 0;
    display: flex;
    align-items: center;
    flex-direction: row;
}

ul[data-type=taskList] p {
    margin: 0;
}

ul[data-type=taskList] li {
    display: flex;
    /* background-color: #0002; */
    /* align-items: baseline; */
    max-width: fit-content;
    padding-inline-end: 6px;
    /* padding-block: 2px; */
    border-radius: 10px;
}

ul[data-type=taskList] li input {
    position: relative;
    top: 6px;
    left: 2px;
}

ul[data-type=taskList] li>label {
    display: flex;
    flex: 0 0 auto;
    margin-right: 0.5rem;
    user-select: none;
}

ul[data-type=taskList] li>div {
    margin-top: 0px;
    flex: 1 1 auto;
}

.collaboration-cursor__caret {
    position: relative;
    margin-left: -1px;
    margin-right: -1px;
    border-left: 1px solid #0D0D0D;
    border-right: 1px solid #0D0D0D;
    word-break: normal;
    pointer-events: none;
}

.collaboration-cursor__label {
    position: absolute;
    top: -1.4em;
    left: -1px;
    font-size: 12px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
    -webkit-user-select: none;
    -moz-user-select: none;
    user-select: none;
    color: #0d0d0d;
    padding: 0.1rem 0.3rem;
    border-radius: 3px 3px 3px 0;
    white-space: nowrap;
}
</style>
