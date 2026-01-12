type Callback = () => void | (() => void)

const mountCallbacks: Map<Node, Callback[]> = new Map()
const cleanupCallbacks: Map<Node, Callback[]> = new Map()

let observer: MutationObserver | null = null

function initObserver() {
    if (observer) return

    observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            Array.from(mutation.addedNodes).forEach(node => {
                if (node instanceof HTMLElement) {
                    runMountCallbacks(node)
                }
            })
            Array.from(mutation.removedNodes).forEach(node => {
                if (node instanceof HTMLElement) {
                    runCleanupCallbacks(node)
                }
            })
        }
    })

    observer.observe(document.body, { childList: true, subtree: true })
}

function runMountCallbacks(node: Node) {
    const callbacks = mountCallbacks.get(node)
    if (callbacks) {
        for (const cb of callbacks) {
            const cleanup = cb()
            if (typeof cleanup === 'function') {
                if (!cleanupCallbacks.has(node)) {
                    cleanupCallbacks.set(node, [])
                }
                cleanupCallbacks.get(node)!.push(cleanup)
            }
        }
        mountCallbacks.delete(node)
    }
}

function runCleanupCallbacks(node: Node) {
    const callbacks = cleanupCallbacks.get(node)
    if (callbacks) {
        for (const cb of callbacks) {
            cb()
        }
        cleanupCallbacks.delete(node)
    }
}

let currentElement: HTMLElement | null = null

export function setCurrentElement(el: HTMLElement | null) {
    currentElement = el
}

export function getCurrentElement(): HTMLElement | null {
    return currentElement
}

export function onMount(callback: Callback): void {
    initObserver()

    if (!currentElement) {
        queueMicrotask(() => callback())
        return
    }

    if (!mountCallbacks.has(currentElement)) {
        mountCallbacks.set(currentElement, [])
    }
    mountCallbacks.get(currentElement)!.push(callback)
}

export function onCleanup(callback: () => void): void {
    initObserver()

    if (!currentElement) {
        return
    }

    if (!cleanupCallbacks.has(currentElement)) {
        cleanupCallbacks.set(currentElement, [])
    }
    cleanupCallbacks.get(currentElement)!.push(callback)
}

export function registerCleanup(element: Node, callback: () => void): void {
    initObserver()

    if (!cleanupCallbacks.has(element)) {
        cleanupCallbacks.set(element, [])
    }
    cleanupCallbacks.get(element)!.push(callback)
}
