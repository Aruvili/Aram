import type { AramNode } from '../core/render'

export function appendChildren(
    parent: HTMLElement,
    children: (AramNode | null | undefined | false)[]
): void {
    for (const child of children.flat()) {
        if (child && child instanceof Node) {
            parent.appendChild(child)
        }
    }
}

export function createFlexBox(direction: 'row' | 'column' = 'column'): HTMLDivElement {
    const el = document.createElement('div')
    el.style.display = 'flex'
    el.style.flexDirection = direction
    return el
}

export function createStyledElement<K extends keyof HTMLElementTagNameMap>(
    tag: K,
    styles: Partial<CSSStyleDeclaration>
): HTMLElementTagNameMap[K] {
    const el = document.createElement(tag)
    Object.assign(el.style, styles)
    return el
}

export function createElementWithClasses<K extends keyof HTMLElementTagNameMap>(
    tag: K,
    ...classNames: string[]
): HTMLElementTagNameMap[K] {
    const el = document.createElement(tag)
    el.className = classNames.join(' ')
    return el
}

export function setAttributes(
    element: HTMLElement,
    attrs: Record<string, string | number | boolean>
): void {
    for (const [key, value] of Object.entries(attrs)) {
        if (typeof value === 'boolean') {
            if (value) {
                element.setAttribute(key, '')
            }
        } else {
            element.setAttribute(key, String(value))
        }
    }
}

export function clearChildren(element: HTMLElement): void {
    while (element.firstChild) {
        element.removeChild(element.firstChild)
    }
}

export function replaceChildren(
    element: HTMLElement,
    newChildren: (AramNode | null | undefined | false)[]
): void {
    clearChildren(element)
    appendChildren(element, newChildren)
}
