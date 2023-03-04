<template>
    <h1>Chat</h1>
</template>
<script setup lang="ts">
import { nanoid } from 'nanoid';

const user_id: string = nanoid(4)
const user_color = randomColor()
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

const { x: mouseX, y: mouseY } = useMouse()
const { width, height } = useWindowSize()

watchThrottled(
    [mouseX, mouseY],
    () => {
        if (realtimeChannel) {
            realtimeChannel.send({
                type: 'broadcast',
                event: 'cursor-pos',
                payload: {
                    user_id,
                    x: mouseX.value / width.value,
                    y: mouseY.value / height.value,
                    color: user_color.tailwind
                },
            })
        }
    },
    { throttle: 100 },
)

const registerUser = (user: { id: string, color: string, x: number, y: number }) => {
    users.add(user.id)
    mouse_colors.set(user.id, user.color)
    x.set(user.id, signal(user.x * width.value))
    y.set(user.id, signal(user.y * height.value))
}
const updateUserCursor = (user_id: string, payload: { x: number, y: number }) => {
    x.get(user_id) && ((x.get(user_id))?.set(payload.x * width.value))
    y.get(user_id) && ((y.get(user_id))?.set(payload.y * height.value))
}

const deleteUser = (user_id: string) => {
    users.delete(user_id)
    mouse_colors.delete(user_id)
    x.delete(user_id)
    y.delete(user_id)
}
</script>
