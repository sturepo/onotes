const storage = useStorage()

export default defineEventHandler(async (event) => {
    const { slug } = event.context.params || {}

    // Force being a string (CF workers always returns a Buffer)
    const body = (await readRawBody(event, 'utf8'))?.toString()
    const { pw, spw, is_public, name } = getQuery(event)

    // console.log(slug)
    // console.log(`PW:${pw}_ SPW:${spw}_ ISPUBLIC:${is_public}_ NAME:${name}_`)

    try {
        if (await storage.hasItem(`notes:${slug}`)) {
            return { success: false, error: "Already notes with this slug exists!" }
        }
    } catch (error) {
        return { success: false, error }
    }

    if (typeof pw !== "string" && typeof spw !== "string") {
        try {
            await Promise.all([
                storage.setItem(`notes:${slug}`, body),
                storage.setItem(`notes:${slug}-password`, "12345678"),
                storage.setItem(`notes:${slug}-secret-password`, "abc"),
                storage.setItem(`notes:${slug}-is-public`, is_public),
                storage.setItem(`notes:${slug}-document-name`, "docsnote"),
            ])
            return { success: true }
        } catch (error) {
            return { success: false, error }
        }
    } else {
        try {
            await Promise.all([
                storage.setItem(`notes:${slug}`, body),
                storage.setItem(`notes:${slug}-password`, pw),
                storage.setItem(`notes:${slug}-secret-password`, spw),
                storage.setItem(`notes:${slug}-is-public`, is_public),
                storage.setItem(`notes:${slug}-document-name`, name),
            ])
            return { success: true }
        } catch (error) {
            return { success: false, error }
        }
    }
})
