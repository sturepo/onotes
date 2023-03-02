<script setup lang="ts">
import type { Database } from '~/types'
const client = useSupabaseClient()
const { data: rooms } = await useAsyncData<Rooms>('rooms', async () => {
    const { data } = await client.from('rooms').select()
    return data
})
</script>
<template>
    <ul v-for="room in rooms">
        <li> {{ room. }} </li>
    </ul>
</template>
