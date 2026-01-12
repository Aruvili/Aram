export type AramNode = HTMLElement | Text | AramNode[] | null

export function createElement(
    tag: string,
    props: Record<string, unknown> = {},
    ...children: (AramNode | string | number)[]
): HTMLElement {
    const el = document.createElement(tag)

    for (const [key, value] of Object.entries(props)) {
        if (key === 'style' && typeof value === 'object') {
            Object.assign(el.style, value)
        } else if (key.startsWith('on') && typeof value === 'function') {
            el.addEventListener(key.slice(2).toLowerCase(), value as EventListener)
        } else if (value !== undefined && value !== null) {
            el.setAttribute(key, String(value))
        }
    }

    for (const child of children.flat()) {
        if (child == null) continue
        if (typeof child === 'string' || typeof child === 'number') {
            el.appendChild(document.createTextNode(String(child)))
        } else if (child instanceof Node) {
            el.appendChild(child)
        }
    }

    return el
}

export function mount(node: AramNode, root: string | HTMLElement): void {
    const container = typeof root === 'string'
        ? document.querySelector(root)
        : root
    if (!container) throw new Error(`Mount target not found: ${root}`)
    if (node) container.appendChild(node as Node)
}
