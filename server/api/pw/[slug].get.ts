const storage = useStorage()

export default defineEventHandler(async (event) => {
    const { slug } = event.context.params || {}

    const { pw } = getQuery(event)

    if (!(await storage.hasItem(`notes:${slug}-password`))) {
        throw createError({
            statusCode: 400,
            message: 'Wrong URL, does not Exist'
        })
    }

    let pw_res = await storage.getItem(`notes:${slug}-password`)
    if (typeof pw_res === "number") {
        pw_res = pw_res.toString()
    }
    let spw_res = await storage.getItem(`notes:${slug}-secret-password`)
    if (typeof spw_res === "number") {
        spw_res = spw_res.toString()
    }
    switch (pw) {
        case pw_res:
            return {
                change: false,
                isValidated: true
            }
        case spw_res:
            return {
                change: true,
                isValidated: false
            }
        default:
            throw createError({
                statusCode: 401,
                message: 'Wrong password'
            })
    }

})
