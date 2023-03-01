const storage = useStorage()

export default defineEventHandler(async (event) => {
    const { slug } = event.context.params || {}

    // Force being a string (CF workers always returns a Buffer)
    const new_spw = (await readRawBody(event, 'utf8'))?.toString()

    try {
        if (await storage.hasItem(`notes:${slug}`)) {
            return { success: false, error: "Already notes with this slug exists!" }
        }
    } catch (error) {
        return { success: false, error }
    }

    try {
        await storage.setItem(`notes:${slug}-secret-password`, new_spw)
        return { success: true }
    } catch (error) {
        return { success: false, error }
    }
})
