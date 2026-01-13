import type { AramNode } from '../core/render'
import type { State } from '../core/state'
import { registerCleanup } from '../core/lifecycle'

export function For<T>(
    items: T[] | State<T[]>,
    render: (item: T, index: number) => AramNode,
    getKey?: (item: T, index: number) => string | number
): AramNode[] | HTMLElement {

    if (Array.isArray(items)) {
        return items.map((item, i) => render(item, i))
    }

    const container = document.createElement('div')
    container.style.display = 'contents'

    const nodeMap = new Map<string | number, Node>()

    const update = () => {
        const currentItems = items.get()

        while (container.firstChild) {
            container.removeChild(container.firstChild)
        }
        nodeMap.clear()

    
        currentItems.forEach((item, index) => {
            const key = getKey ? getKey(item, index) : index
            const node = render(item, index) as Node
            nodeMap.set(key, node)
            container.appendChild(node)
        })
    }

    update()
    const unsub = items.subscribe(update)
    registerCleanup(container, unsub)

    return container
}

export function If(
    condition: boolean | State<boolean>,
    then: () => AramNode,
    otherwise?: () => AramNode
): AramNode | HTMLElement | null {

    if (typeof condition === 'boolean') {
        return condition ? then() : (otherwise?.() ?? null)
    }

    const container = document.createElement('span')
    container.style.display = 'contents'

    let currentNode: Node | null = null

    const update = () => {
        const result = condition.get() ? then() : (otherwise?.() ?? null)
        if (result) {
            if (currentNode) container.replaceChild(result as Node, currentNode)
            else container.appendChild(result as Node)
            currentNode = result as Node
        } else {
            if (currentNode) {
                container.removeChild(currentNode)
                currentNode = null
            }
        }
    }

    update()
    const unsub = condition.subscribe(update)
    registerCleanup(container, unsub)

    return container
}

export function Show(
    when: boolean | State<boolean>,
    children: AramNode | (() => AramNode)
): AramNode | HTMLElement | null {

    if (typeof when === 'boolean') {
        if (!when) return null
        return typeof children === 'function' ? children() : children
    }

    const container = document.createElement('span')
    container.style.display = 'contents'

    let currentNode: Node | null = null

    const update = () => {
        if (when.get()) {
            const content = typeof children === 'function' ? children() : children
            if (content) {
                if (currentNode) container.replaceChild(content as Node, currentNode)
                else container.appendChild(content as Node)
                currentNode = content as Node
            }
        } else {
            if (currentNode) container.removeChild(currentNode)
            currentNode = null
        }
    }

    update()
    const unsub = when.subscribe(update)
    registerCleanup(container, unsub)

    return container
}
