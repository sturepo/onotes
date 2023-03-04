function getRandomInt(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

export const randomColor = () => {
    const i = getRandomInt(0, 22)
    return { hex: hexColors[i], tailwind: tailwindColors[i] }
}

const tailwindColors = [
    'dark:text-slate-400 text-slate-500',
    'dark:text-gray-400 text-gray-500',
    'dark:text-zinc-400 text-zinc-500',
    'dark:text-neutral-400 text-neutral-500',
    'dark:text-stone-400 text-stone-500',
    'dark:text-red-400 text-red-500',
    'dark:text-orange-400 text-orange-500',
    'dark:text-amber-400 text-amber-500',
    'dark:text-yellow-400 text-yellow-500',
    'dark:text-lime-400 text-lime-500',
    'dark:text-green-400 text-green-500',
    'dark:text-emerald-400 text-emerald-500',
    'dark:text-teal-400 text-teal-500',
    'dark:text-cyan-400 text-cyan-500',
    'dark:text-sky-400 text-sky-500',
    'dark:text-blue-400 text-blue-500',
    'dark:text-indigo-400 text-indigo-500',
    'dark:text-violet-400 text-violet-500',
    'dark:text-purple-400 text-purple-500',
    'dark:text-fuchsia-400 text-fuchsia-500',
    'dark:text-pink-300 text-pink-500',
    'dark:text-rose-300 text-rose-500',
]

const hexColors = [
    '#64748b',
    '#6b7280',
    '#71717a',
    '#737373',
    '#78716c',
    '#ef4444',
    '#f97316',
    '#f59e0b',
    '#eab308',
    '#84cc16',
    '#22c55e',
    '#10b981',
    '#14b8a6',
    '#06b6d4',
    '#0ea5e9',
    '#3b82f6',
    '#6366f1',
    '#8b5cf6',
    '#a855f7',
    '#d946ef',
    '#ec4899',
    '#f43f5e',
]
