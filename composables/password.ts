export function usePassword() {
    const password = ref('')

    if (process.client) {
        password.value = window.localStorage.getItem('ONOTES-password') || ''
    }

    watch(password, () => {
        window.localStorage.setItem('ONOTES-password', password.value || '')
    })

    return password
}

