export function usePassword() {
    const password = useState<string>('Notes-password', () => '')

    if (process.client) {
        password.value = window.localStorage.getItem('NOTES-password') || ''
    }

    watch(password, () => {
        window.localStorage.setItem('NOTES-password', password.value || '')
    })

    return password
}
