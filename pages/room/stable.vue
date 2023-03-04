<script setup lang="ts">
import type { RealtimeChannel } from '@supabase/supabase-js'
import type { Database } from '~/types'
import { useEventListener, useThrottleFn } from '@vueuse/core'
import { nanoid } from 'nanoid';
const route = useRoute()

let realtimeChannel: RealtimeChannel
let cleanup: () => void
let user_id: string = nanoid(4)
const client = useSupabaseClient<Database>()

const users = reactive(new Set<string>())
const mouse_colors = reactive(new Map<string, string>())

const x = reactive(new Map<string, {
    (): number;
    set(value: number): void;
    update(updater: (v: number) => number): void;
    mutate(mutator: (v: number) => number): void;
}>())

const y = reactive(new Map<string, {
    (): number;
    set(value: number): void;
    update(updater: (v: number) => number): void;
    mutate(mutator: (v: number) => number): void;
}>())

const { data: document } = await useAsyncData('document', async () => {
    const { data } = await client.from('documents').select(
        '*'
    ).eq('id', route.params.slug).single()
    return data
})

const mousemove = (e: MouseEvent) => useThrottleFn(() => {
    // do something, it will be called at most 1 time per second
    if (realtimeChannel) {
        realtimeChannel.send({
            type: 'broadcast',
            event: 'cursor-pos',
            payload: {
                user_id,
                x: e.clientX,
                y: e.clientY,
            },
        })
    }
}, 100)

</script>
<template>
    <pre>  {{ JSON.stringify(document, null, 2) }} </pre>
    <template v-for="user in users">
        <Cursor :x="x.get(user)" :mouse-color="mouse_colors.get(user)" :y="y.get(user)" />
    </template>
</template>
