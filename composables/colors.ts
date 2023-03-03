function getRandomInt(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

export const randomColor = () => {
    const i = getRandomInt(0, colors.length)
    console.log(i)
    return colors[i]
}

const colors = [
    'dark:text-slate-300 text-slate-500',
    'dark:text-gray-300 text-gray-500',
    'dark:text-zinc-300 text-zinc-500',
    'dark:text-neutral-300 text-neutral-500',
    'dark:text-stone-300 text-stone-500',
    'dark:text-red-300 text-red-500',
    'dark:text-orange-300 text-orange-500',
    'dark:text-amber-300 text-amber-500',
    'dark:text-yellow-300 text-yellow-500',
    'dark:text-lime-300 text-lime-500',
    'dark:text-green-300 text-green-500',
    'dark:text-emerald-300 text-emerald-500',
    'dark:text-teal-300 text-teal-500',
    'dark:text-cyan-300 text-cyan-500',
    'dark:text-sky-300 text-sky-500',
    'dark:text-blue-300 text-blue-500',
    'dark:text-indigo-300 text-indigo-500',
    'dark:text-violet-300 text-violet-500',
    'dark:text-purple-300 text-purple-500',
    'dark:text-fuchsia-300 text-fuchsia-500',
    'dark:text-pink-300 text-pink-500',
    'dark:text-rose-300 text-rose-500',
]
