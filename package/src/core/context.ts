import { createElement, type AramNode } from './render'

export interface Context<T> {
    Provider: (props: { value: T; children?: AramNode | AramNode[] }) => HTMLElement
    _defaultValue: T
    _id: symbol
}

const contextRegistry = new WeakMap<HTMLElement, Map<symbol, any>>()

export function createContext<T>(defaultValue: T): Context<T> {
    const contextId = Symbol('Context')

    const context: Context<T> = {
        _defaultValue: defaultValue,
        _id: contextId,

        Provider: (props: { value: T; children?: AramNode | AramNode[] }) => {
            const container = createElement('div', {
                style: { display: 'contents' }
            })

            if (!contextRegistry.has(container)) {
                contextRegistry.set(container, new Map())
            }
            contextRegistry.get(container)!.set(contextId, props.value)

            const children = Array.isArray(props.children) ? props.children : [props.children]
            for (const child of children) {
                if (child && child instanceof Node) {
                    container.appendChild(child)
                }
            }

            return container
        }
    }

    return context
}

export function useContext<T>(context: Context<T>, element?: HTMLElement): T {
    if (!element) {
        return context._defaultValue
    }

    let current: HTMLElement | null = element.parentElement

    while (current) {
        const contextMap = contextRegistry.get(current)
        if (contextMap && contextMap.has(context._id)) {
            return contextMap.get(context._id) as T
        }
        current = current.parentElement
    }

    return context._defaultValue
}

export function getContext<T>(context: Context<T>): T {
    return context._defaultValue
}
