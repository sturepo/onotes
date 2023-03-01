import { shallowRef, triggerRef, computed as _computed } from 'vue'

export function signal<T>(initialValue: T) {
    const r = shallowRef(initialValue)
    const s = () => r.value
    s.set = (value: T) => { r.value = value }
    s.update = (updater: (v: T) => T) => { r.value = updater(r.value) }
    s.mutate = (mutator: (v: T) => T) => { mutator(r.value); triggerRef(r) }
    return s
}

export type Signal = typeof signal

// export function computed<T>(getter: (v: T) => (() => T)) {
//     const c = _computed(getter)
//     return () => c.value
// }
