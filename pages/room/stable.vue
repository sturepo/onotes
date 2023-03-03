<script setup lang="ts">
import type { RealtimeChannel } from '@supabase/supabase-js'
import type { Database } from '~/types'
import { useEventListener, useThrottleFn } from '@vueuse/core'
import { nanoid } from 'nanoid';
const route = useRoute()

let realtimeChannel: RealtimeChannel
let cleanup: () => void
let user_id: string
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

// Once page is mounted, listen to changes on the `collaborators` table and refresh collaborators when receiving event
onMounted(() => {
    user_id = nanoid(4)
    cleanup = useEventListener(window, 'mousemove', (e) => mousemove(e)())
    // Real time listener for new workouts
    console.log("Initialized")
    if (!realtimeChannel) {
        realtimeChannel = client.channel('room1', {
            config: {
                broadcast: {
                    self: false
                }
            }
        }).on('broadcast', { event: 'cursor-pos' }, ({ payload }) => {
            if (!users.has(payload.user_id)) {
                users.add(payload.user_id)
                x.set(payload.user_id, signal(payload.x))
                y.set(payload.user_id, signal(payload.y))
                mouse_colors.set(payload.user_id, randomColor())
            } else {
                x.get(payload.user_id) && ((x.get(payload.user_id))?.set(payload.x))
                y.get(payload.user_id) && ((y.get(payload.user_id))?.set(payload.y))
            }
        })
        realtimeChannel.subscribe((status) => {
            if (status === 'SUBSCRIBED') {
                console.log('SUBSCRIBED', user_id)
            }
        })
    }
})

// Don't forget to unsubscribe when user left the page
onUnmounted(() => {
    client.removeChannel(realtimeChannel)
    if (cleanup) cleanup() // This will unregister the listener.
})
</script>
<template>
    <pre>  {{ JSON.stringify(document, null, 2) }} </pre>
    <template v-for="user in users">
        <Cursor :x="x.get(user)" :mouse-color="mouse_colors.get(user)" :y="y.get(user)" />
    </template>
</template>
