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

export function computed<T>(fn: () => T): State<T> {
    const s = state<T>(undefined as T)

    effect(() => {
        s.set(fn())
    })

    return {
        get: s.get,
        set: () => { throw new Error('Cannot set a computed state') },
        subscribe: s.subscribe,
        $: s.$
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

export function watch<T>(s: State<T>, render: (value: T) => HTMLElement): HTMLElement {
    const container = document.createElement('span')
    container.style.display = 'contents'

    let currentNode: Node | null = null

    const update = () => {
        const newNode = render(s.get())

        if (currentNode) {
            container.replaceChild(newNode, currentNode)
        } else {
            container.appendChild(newNode)
        }
        currentNode = newNode
    }

    update()
    s.subscribe(update)

    return container
}

let batchDepth = 0
let pendingUpdates: Set<Subscriber> = new Set()

export function batch(fn: () => void): void {
    batchDepth++
    try {
        fn()
    } finally {
        batchDepth--
        if (batchDepth === 0) {
            const updates = pendingUpdates
            pendingUpdates = new Set()
            updates.forEach(update => update())
        }
    }
}

export function isBatching(): boolean {
    return batchDepth > 0
}

export function scheduleUpdate(fn: Subscriber): void {
    if (batchDepth > 0) {
        pendingUpdates.add(fn)
    } else {
        fn()
    }
}
