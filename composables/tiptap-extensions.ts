import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'
import Typography from '@tiptap/extension-typography'
import Link from '@tiptap/extension-link'
import { lowlight } from 'lowlight/lib/core'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import Highlight from "@tiptap/extension-highlight"
import StarterKit from "@tiptap/starter-kit"
import css from 'highlight.js/lib/languages/css'
import go from 'highlight.js/lib/languages/go'
import c from 'highlight.js/lib/languages/c'
import dart from 'highlight.js/lib/languages/dart'
import js from 'highlight.js/lib/languages/javascript'
import ts from 'highlight.js/lib/languages/typescript'
import html from 'highlight.js/lib/languages/xml'

import Collaboration from '@tiptap/extension-collaboration'
import CollaborationCursor from '@tiptap/extension-collaboration-cursor'

lowlight.registerLanguage('html', html)
lowlight.registerLanguage('css', css)
lowlight.registerLanguage('js', js)
lowlight.registerLanguage('ts', ts)
lowlight.registerLanguage('go', go)
lowlight.registerLanguage('dart', dart)
lowlight.registerLanguage('c', c)

interface baseOption {
    isColab: false
    user?: never
}

interface colabOption {
    isColab: true
    user: {
        name: string
        color: string
    }
}

type Options = baseOption | colabOption

const a: Options = {
    isColab: false
}

export const makeExtensions = async ({ isColab, user }: Options = { isColab: false }) => {

    const extensions = [
        StarterKit.configure({
            // disable extension as it's already present in CodeBlockLowlight
            codeBlock: false,
            // collaboration comes with it's own history extension
            history: isColab ? false : {
                depth: 100,
                newGroupDelay: 1000
            }
        }),
        Typography,
        TaskList.configure({
            HTMLAttributes: {
                class: 'flex flex-col space-y-2'
            }
        }),
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
    ]
    if (!isColab) return extensions;
    const Y = await import('yjs')
    const { HocuspocusProvider } = await import('@hocuspocus/provider')
    const ydoc = new Y.Doc()
    const provider = new HocuspocusProvider({
        url: 'ws://0.0.0.0:1234',
        name: 'example-document',
        document: ydoc,
    })
    return [
        ...extensions,
        Collaboration.configure({
            document: ydoc,
        }),
        CollaborationCursor.configure({
            provider,
            user
        }),
    ]
}
