const storage = useStorage()

export default defineEventHandler(async (event) => {
    const { slug } = event.context.params || {}
    // Force being a string (CF workers always returns a Buffer)
    const body = (await readRawBody(event, 'utf8'))?.toString()

    const res_pw = await storage.getItem(`notes:${slug}-password`)
    const pw = getHeader(event, 'password')
    console.log(`Password:${pw}_ Res_PW:${res_pw}_`)

    if (pw !== res_pw) {
        throw createError({
            statusCode: 401,
            message: 'Wrong password'
        })
    }

    await storage.setItem(`notes:${slug}`, body)

    return { body }
})
