// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindTypography from '@tailwindcss/typography'
import tailwindForms from '@tailwindcss/forms'
import defaultTheme from 'tailwindcss/defaultTheme'

export default defineNuxtConfig({
    // Enable content to leverages <ContentRendererMarkdown /> component
    modules: ['@nuxt/content', 'nuxt-icon', '@nuxtjs/tailwindcss'],
    // Define storage used in API routes with useStorage()
    nitro: {
        storage: {
            notes: {
                driver: 'cloudflare-kv-binding',
                binding: 'ONOTES'
            }
        },
        // Overwrite notes storage in development using FS
        devStorage: {
            notes: {
                driver: 'fs',
                base: './.data/notes'
            }
        }
    },
    tailwindcss: {
        config: {
            darkMode: 'class',
            extends: {
                theme: {
                    fontFamily: {
                        'sans': ['InterVar', ...defaultTheme.fontFamily.sans]
                    }
                }
            },
            plugins: [
                tailwindTypography,
                tailwindForms
            ]
        }
    },

    // Password to edit the notes
    runtimeConfig: {
        password: process.env.NUXT_PASSWORD || 'ilovenuxt'
    },
})
