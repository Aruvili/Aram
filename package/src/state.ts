export type Subscriber = () => void

export interface State<T> {
    get: () => T
    set: (value: T | ((prev: T) => T)) => void
    subscribe: (fn: Subscriber) => () => void

    $: () => HTMLElement
}

let currentEffect: Subscriber | null = null

export function state<T>(initial: T): State<T> {
    let value = initial
    const subscribers = new Set<Subscriber>()

    const s: State<T> = {
        get: () => {
            if (currentEffect) subscribers.add(currentEffect)
            return value
        },
        set: (next) => {
            const newValue = typeof next === 'function'
                ? (next as (prev: T) => T)(value)
                : next
            if (newValue !== value) {
                value = newValue
                subscribers.forEach(fn => fn())
            }
        },
        subscribe: (fn) => {
            subscribers.add(fn)
            return () => subscribers.delete(fn)
        },
        $: () => {
            const span = document.createElement('span')
            span.textContent = String(value)
            subscribers.add(() => {
                span.textContent = String(value)
            })
            return span
        }
    }

    return s
}

export function effect(fn: Subscriber): () => void {
    const run = () => {
        currentEffect = run
        fn()
        currentEffect = null
    }
    run()
    return () => { }
}


export function watch<T>(s: State<T>, render: (value: T) => HTMLElement): HTMLElement {
    const container = document.createElement('span')
    container.style.display = 'contents'

    const update = () => {
        container.innerHTML = ''
        container.appendChild(render(s.get()))
    }

    update()
    s.subscribe(update)

    return container
}
