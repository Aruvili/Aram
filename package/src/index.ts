import { createElement, type AramNode } from './core/render'

//Core
export {
    state, computed, effect, createEffect,
    watch, batch, __DEV__, setDevMode,
    safeScheduleUpdate, type State, type Subscriber
} from './core/state'
export { createElement, mount, dangerouslySetHTML, unsafeSetHTML, type AramNode } from './core/render'
export { onMount, onCleanup } from './core/lifecycle'
export { createContext, useContext, getContext, type Context } from './core/context'
export { createField, createForm, type FieldState, type FormConfig } from './core/form'
export * from './core/validators'
export { Router, Route, NavLink, navigate, getRouterContext, type RouterContext, type RouteConfig } from './router'

//Security
export {
    isURLSafe, isCSSValueSafe, sanitizeHTML, escapeHTML,
    isSafeObject, freeze, securityLog, logSecurityEvent,
    generateCSP, validateInput, secureRandomString,
    getCSRFToken, validateCSRFToken, rateLimit
} from './security/security'

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
