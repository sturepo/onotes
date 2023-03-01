const storage = useStorage()

export default defineEventHandler(async (event) => {
    const { slug } = event.context.params || {};
    // (await storage.hasItem('password')) ? console.log(await storage.getItem('password')) : await storage.setItem('password', 'ilove')
    const [body, is_public, name] = (await Promise.all([
        storage.getItem(`notes:${slug}`),
        storage.getItem(`notes:${slug}-is-public`),
        storage.getItem(`notes:${slug}-document-name`),
    ])) as [string, boolean, string]
    if (is_public) {
        return { body, is_public, name }
    } else {
        let pw = await storage.getItem(`notes:${slug}-password`)
        if (typeof pw === "number") {
            pw = pw.toString()
        }
        if (getHeader(event, 'password') !== pw) {
            throw createError({
                statusCode: 401,
                message: 'Wrong password'
            })
        }
        return { body, is_public: false, name }
    }
})
