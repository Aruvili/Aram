import { createElement, type AramNode } from './render'

//Core
export { state, computed, effect, createEffect,
    watch, batch, __DEV__, setDevMode,
    safeScheduleUpdate, type State, type Subscriber
} from './state'
export { createElement, mount, dangerouslySetHTML, unsafeSetHTML, type AramNode } from './render'
export { onMount, onCleanup } from './lifecycle'
export { Router, Route, NavLink, navigate, getRouterContext, type RouterContext, type RouteConfig } from './router'

//Security
export {
    isURLSafe, isCSSValueSafe, sanitizeHTML, escapeHTML,
    isSafeObject, freeze, securityLog, logSecurityEvent,
    generateCSP, validateInput, secureRandomString,
    getCSRFToken, validateCSRFToken, rateLimit
} from './security'

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
