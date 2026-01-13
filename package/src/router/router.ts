import { createElement, type AramNode } from '../core/render'
import { state, type State } from '../core/state'
import { registerCleanup } from '../core/lifecycle'

export interface RouterContext {
    path: string
    params: Record<string, string>
    query: Record<string, string>
}

export interface RouteConfig {
    path: string
    component: (ctx: RouterContext) => AramNode
    beforeEnter?: (ctx: RouterContext) => boolean | Promise<boolean>
}

const currentPath: State<string> = state(window.location.pathname)
const routes: RouteConfig[] = []

function parseQuery(search: string): Record<string, string> {
    const query: Record<string, string> = {}
    const params = new URLSearchParams(search)
    params.forEach((value, key) => {
        query[key] = value
    })
    return query
}

function matchPath(pattern: string, path: string): { match: boolean; params: Record<string, string> } {
    const params: Record<string, string> = {}

    if (pattern === '*') {
        return { match: true, params }
    }

    const patternParts = pattern.split('/').filter(Boolean)
    const pathParts = path.split('/').filter(Boolean)

    if (patternParts.length !== pathParts.length) {
        return { match: false, params }
    }

    for (let i = 0; i < patternParts.length; i++) {
        const patternPart = patternParts[i]
        const pathPart = pathParts[i]

        if (patternPart.startsWith(':')) {
            params[patternPart.slice(1)] = pathPart
        } else if (patternPart !== pathPart) {
            return { match: false, params }
        }
    }

    return { match: true, params }
}

function getCurrentContext(): RouterContext {
    const path = currentPath.get()
    const query = parseQuery(window.location.search)
    return { path, params: {}, query }
}

export function navigate(path: string, options?: { query?: Record<string, string>; replace?: boolean }): void {
    let url = path

    if (options?.query) {
        const params = new URLSearchParams(options.query)
        url = `${path}?${params.toString()}`
    }

    if (options?.replace) {
        window.history.replaceState({}, '', url)
    } else {
        window.history.pushState({}, '', url)
    }

    currentPath.set(path)
}

export function Route(config: RouteConfig): RouteConfig {
    return config
}

export function NavLink(
    props: { href: string; replace?: boolean; class?: string },
    ...children: (AramNode | string)[]
): HTMLElement {
    const el = createElement('a', {
        href: props.href,
        class: props.class,
        style: { cursor: 'pointer', textDecoration: 'none' },
        onclick: (e: Event) => {
            e.preventDefault()
            navigate(props.href, { replace: props.replace })
        }
    }, ...children)

    return el
}

export function Router(...routeConfigs: RouteConfig[]): HTMLElement {
    routeConfigs.forEach(r => routes.push(r))

    const container = document.createElement('div')
    container.style.display = 'contents'

    let currentNode: Node | null = null

    const render = async () => {
        const path = currentPath.get()
        const query = parseQuery(window.location.search)

        for (const route of routes) {
            const { match, params } = matchPath(route.path, path)

            if (match) {
                const ctx: RouterContext = { path, params, query }

                if (route.beforeEnter) {
                    const allowed = await route.beforeEnter(ctx)
                    if (!allowed) continue
                }

                const newNode = route.component(ctx) as Node

                if (currentNode) {
                    container.replaceChild(newNode, currentNode)
                } else {
                    container.appendChild(newNode)
                }
                currentNode = newNode
                return
            }
        }
    }

    render()

    const unsub = currentPath.subscribe(() => render())
    registerCleanup(container, unsub)

    const handlePopState = () => {
        currentPath.set(window.location.pathname)
    }
    window.addEventListener('popstate', handlePopState)
    registerCleanup(container, () => window.removeEventListener('popstate', handlePopState))

    return container
}

export function getRouterContext(): RouterContext {
    return getCurrentContext()
}
