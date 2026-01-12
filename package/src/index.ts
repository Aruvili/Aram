import { createElement, type AramNode } from './render'

//Core
export { state, computed, effect, watch, batch, type State, type Subscriber } from './state'
export { createElement, mount, type AramNode } from './render'

//Widgets
export * from './widgets'

//Helper App Function
export function AramApp(...children: AramNode[]): HTMLElement {
    const el = createElement('div', { id: 'aram-app', style: { minHeight: '100vh' } })
    for (const child of children.flat()) {
        if (child) el.appendChild(child as Node)
    }
    return el
}
