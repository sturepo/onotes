const storage = useStorage()
const config = useRuntimeConfig()

export default defineEventHandler(async (event) => {
    const { slug } = event.context.params || {}

    // Force being a string (CF workers always returns a Buffer)
    const password = (await readRawBody(event, 'utf8'))?.toString()

    if (getHeader(event, 'password') !== config.password) {
        throw createError({
            statusCode: 401,
            message: 'Wrong password'
        })
    }

    const pw = await storage.setItem(`notes:password-v1`, password)

    return { slug, password: pw }
})
