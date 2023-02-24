import mdTransformer from '@nuxt/content/transformers/markdown'

export async function parseMarkdown(body: string) {
    const parsed = await mdTransformer.parse('index.md', body)
    return parsed
}
