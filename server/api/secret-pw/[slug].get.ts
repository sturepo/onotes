const storage = useStorage()

export default defineEventHandler(async (event) => {
    const { slug } = event.context.params || {}

    const { spw } = getQuery(event)

    if (!(await storage.hasItem(`notes:${slug}-secret-password`))) {
        throw createError({
            statusCode: 401,
            message: 'Slug not exists'
        })
    }

    const pw_res = await storage.getItem(`notes:${slug}-secret-password`)

    if (spw === pw_res) {
        return {
            success: true
        }
    }

    return {
        success: false
    }
})
