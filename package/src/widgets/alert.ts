import { createElement } from '../render'
import { getTheme } from './theme'

export interface AlertProps {
    type?: 'info' | 'success' | 'warning' | 'error'
    title?: string
    icon?: string
    dismissible?: boolean
    onDismiss?: () => void
    variant?: 'default' | 'filled' | 'outline'
}

export function Alert(props: AlertProps = {}, ...children: (HTMLElement | string)[]): HTMLElement {
    const t = getTheme()

    const colors = {
        info: { bg: 'rgba(59,130,246,0.1)', border: t.accent, filled: t.accent, icon: 'ℹ️' },
        success: { bg: 'rgba(34,197,94,0.1)', border: t.success, filled: t.success, icon: '✓' },
        warning: { bg: 'rgba(234,179,8,0.1)', border: t.warning, filled: t.warning, icon: '⚠️' },
        error: { bg: 'rgba(239,68,68,0.1)', border: t.error, filled: t.error, icon: '✕' }
    }
    const c = colors[props.type || 'info']

    let bgColor = c.bg
    let borderStyle = `1px solid ${c.border}`
    let textColor = t.primary

    if (props.variant === 'filled') {
        bgColor = c.filled
        borderStyle = 'none'
        textColor = 'white'
    } else if (props.variant === 'outline') {
        bgColor = 'transparent'
    }

    const alert = createElement('div', {
        style: {
            backgroundColor: bgColor,
            border: borderStyle,
            borderRadius: '8px',
            padding: '16px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px'
        }
    })

    alert.appendChild(createElement('span', {
        style: { fontSize: '18px', flexShrink: '0' }
    }, props.icon || c.icon))

    const content = createElement('div', { style: { flex: '1' } })
    if (props.title) {
        content.appendChild(createElement('div', {
            style: { color: textColor, fontWeight: '600', marginBottom: '4px', fontSize: '14px' }
        }, props.title))
    }
    children.forEach(child => {
        if (typeof child === 'string') {
            content.appendChild(createElement('p', {
                style: { color: props.variant === 'filled' ? 'rgba(255,255,255,0.9)' : t.muted, fontSize: '14px', margin: '0' }
            }, child))
        } else {
            content.appendChild(child)
        }
    })
    alert.appendChild(content)

    if (props.dismissible) {
        const dismiss = createElement('button', {
            style: {
                background: 'none',
                border: 'none',
                color: props.variant === 'filled' ? 'rgba(255,255,255,0.7)' : t.muted,
                cursor: 'pointer',
                padding: '0',
                fontSize: '16px',
                flexShrink: '0'
            },
            onclick: () => { alert.remove(); props.onDismiss?.() }
        }, '✕')
        alert.appendChild(dismiss)
    }

    return alert
}

export interface CalloutProps {
    icon?: string
    title?: string
    variant?: 'default' | 'note' | 'tip' | 'important' | 'warning' | 'caution'
}

export function Callout(props: CalloutProps = {}, ...children: (HTMLElement | string)[]): HTMLElement {
    const t = getTheme()

    const variants = {
        default: { bg: t.bgSubtle, border: t.border, icon: '📝' },
        note: { bg: 'rgba(59,130,246,0.1)', border: t.accent, icon: 'ℹ️' },
        tip: { bg: 'rgba(34,197,94,0.1)', border: t.success, icon: '💡' },
        important: { bg: 'rgba(139,92,246,0.1)', border: '#8b5cf6', icon: '⚡' },
        warning: { bg: 'rgba(234,179,8,0.1)', border: t.warning, icon: '⚠️' },
        caution: { bg: 'rgba(239,68,68,0.1)', border: t.error, icon: '🔴' }
    }

    const v = variants[props.variant || 'default']

    const callout = createElement('div', {
        style: {
            backgroundColor: v.bg,
            borderLeft: `4px solid ${v.border}`,
            borderRadius: '4px',
            padding: '16px',
            display: 'flex',
            gap: '12px'
        }
    })

    callout.appendChild(createElement('span', { style: { fontSize: '18px' } }, props.icon || v.icon))

    const content = createElement('div', { style: { flex: '1' } })
    if (props.title) {
        content.appendChild(createElement('div', {
            style: { color: t.primary, fontWeight: '600', marginBottom: '4px', fontSize: '14px' }
        }, props.title))
    }
    children.forEach(child => {
        if (typeof child === 'string') {
            content.appendChild(createElement('p', { style: { color: t.muted, fontSize: '14px', margin: '0' } }, child))
        } else {
            content.appendChild(child)
        }
    })
    callout.appendChild(content)

    return callout
}
