import { registerCleanup } from './lifecycle'

export type Subscriber = () => void

export interface State<T> {
    get: () => T
    set: (value: T | ((prev: T) => T)) => void
    subscribe: (fn: Subscriber) => () => void
    $: () => HTMLElement
}

export function isState<T>(val: unknown): val is State<T> {
    return val !== null && typeof val === 'object' && 'subscribe' in val && 'get' in val
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
            if (newValue !== null && typeof newValue === 'object') {
                const obj = newValue as Record<string, unknown>
                if (Object.prototype.hasOwnProperty.call(obj, '__proto__') ||
                    Object.prototype.hasOwnProperty.call(obj, 'prototype')) {
                    console.warn('[Aram] Blocked prototype pollution attempt')
                    return
                }
            }
            if (newValue !== value) {
                value = newValue
                subscribers.forEach(fn => scheduleUpdate(fn))
            }
        },
        subscribe: (fn) => {
            subscribers.add(fn)
            return () => subscribers.delete(fn)
        },
        $: () => {
            const span = document.createElement('span')
            span.textContent = String(value)
            const update = () => {
                span.textContent = String(value)
            }
            subscribers.add(update)
            registerCleanup(span, () => subscribers.delete(update))
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
        try {
            fn()
        } catch (err) {
            console.error('[Aram] Effect error:', err)
        }
        currentEffect = null
    }
    run()
    return () => { }
}

export function createEffect(fn: () => void | (() => void)): () => void {
    let cleanup: (() => void) | void = undefined
    let disposed = false

    const run = () => {
        if (disposed) return

        if (cleanup) {
            cleanup()
            cleanup = undefined
        }

        currentEffect = run
        try {
            cleanup = fn()
        } catch (err) {
            console.error('[Aram] Effect error:', err)
        }
        currentEffect = null
    }

    run()

    return () => {
        disposed = true
        if (cleanup) {
            cleanup()
            cleanup = undefined
        }
    }
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
    const unsub = s.subscribe(update)
    registerCleanup(container, unsub)

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

const MAX_UPDATES_PER_FRAME = 100
let updateCount = 0
let frameId: number | null = null

function resetUpdateCount() {
    updateCount = 0
    frameId = null
}

export function safeScheduleUpdate(fn: Subscriber): void {
    updateCount++
    if (updateCount > MAX_UPDATES_PER_FRAME) {
        if (__DEV__) {
            console.warn('[Aram] Possible infinite loop detected. Update limit reached.')
        }
        return
    }
    if (!frameId) {
        frameId = requestAnimationFrame(resetUpdateCount)
    }
    scheduleUpdate(fn)
}

export let __DEV__ = true

export function setDevMode(isDev: boolean): void {
    __DEV__ = isDev
}
