import { isURLSafe, isCSSValueSafe, sanitizeHTML as secureSanitize, logSecurityEvent } from './security'

export type AramNode = HTMLElement | Text | AramNode[] | null

export function createElement(
    tag: string,
    props: Record<string, unknown> = {},
    ...children: (AramNode | string | number)[]
): HTMLElement {
    const el = document.createElement(tag)

    for (const [key, value] of Object.entries(props)) {
        if (key === 'style' && typeof value === 'object') {
            const styleObj = value as Record<string, string>
            for (const [prop, val] of Object.entries(styleObj)) {
                if (val && isCSSValueSafe(String(val))) {
                    (el.style as unknown as Record<string, string>)[prop] = val
                } else if (val) {
                    logSecurityEvent(`Blocked dangerous CSS: ${prop}=${val}`)
                }
            }
        } else if (key.startsWith('on') && typeof value === 'function') {
            el.addEventListener(key.slice(2).toLowerCase(), value as EventListener)
        } else if (key.startsWith('on') && typeof value === 'string') {
            logSecurityEvent(`Blocked string event handler: ${key}`)
            continue
        } else if (value !== undefined && value !== null) {
            const strValue = String(value)

            if (key === 'href' || key === 'src' || key === 'action' || key === 'formaction' || key === 'xlink:href' || key === 'data' || key === 'poster') {
                if (!isURLSafe(strValue)) {
                    logSecurityEvent(`Blocked dangerous URL: ${key}=${strValue}`)
                    continue
                }
            }

            el.setAttribute(key, strValue)
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

export function dangerouslySetHTML(html: string): HTMLElement {
    const wrapper = document.createElement('div')
    wrapper.innerHTML = secureSanitize(html)
    logSecurityEvent('dangerouslySetHTML called - content sanitized')
    return wrapper
}

export function unsafeSetHTML(html: string): HTMLElement {
    logSecurityEvent('WARNING: unsafeSetHTML called - no sanitization')
    const wrapper = document.createElement('div')
    wrapper.innerHTML = html
    return wrapper
}
