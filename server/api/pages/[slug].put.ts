const storage = useStorage()

export default defineEventHandler(async (event) => {
    const { slug } = event.context.params || {}
    // Force being a string (CF workers always returns a Buffer)
    const body = (await readRawBody(event, 'utf8'))?.toString()

    const pw = await storage.getItem('notes:password-v1')

    if (getHeader(event, 'password') !== pw) {
        throw createError({
            statusCode: 401,
            message: 'Wrong password'
        })
    }

    await storage.setItem(`notes:${slug}`, body)

    return { slug, body }
})
