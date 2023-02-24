const storage = useStorage()
const config = useRuntimeConfig()

export default defineEventHandler(async (event) => {
    const { slug } = event.context.params || {}

    const { pw: password } = getQuery(event)

    if (!(await storage.hasItem('notes:password-v1'))) {
        await storage.setItem('notes:password-v1', 'fruitjuice@1@')
    }

    const pw = await storage.getItem('notes:password-v1')

    if (config.password === password) {
        return {
            change: true,
            isValidated: false
        }
    }

    if (password !== pw) {
        throw createError({
            statusCode: 401,
            message: 'Wrong password'
        })
    }


    return {
        slug,
        isValidated: true
    }
})
