const storage = useStorage()

export default defineEventHandler(async (event) => {
    const { slug } = event.context.params || {};
    // (await storage.hasItem('password')) ? console.log(await storage.getItem('password')) : await storage.setItem('password', 'ilove')
    let body = (await storage.getItem(`notes:${slug}`))

    if (typeof body !== 'string') {
        body = '# Hello'
    }

    return { slug, body }
})
