export type Subscriber = () => void

export interface State<T> {
    get: () => T
    set: (value: T | ((prev: T) => T)) => void
    subscribe: (fn: Subscriber) => () => void
}

let currentEffect: Subscriber | null = null

export function state<T>(initial: T): State<T> {
    let value = initial
    const subscribers = new Set<Subscriber>()

    return {
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
        }
    }
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
