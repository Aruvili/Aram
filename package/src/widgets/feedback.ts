import { createElement, type AramNode } from '../render'

export function Spinner(props: { size?: number; color?: string } = {}): HTMLElement {
    const size = props.size || 24
    const style = {
        width: `${size}px`,
        height: `${size}px`,
        border: `3px solid #f3f3f3`,
        borderTop: `3px solid ${props.color || '#4CAF50'}`,
        borderRadius: '50%',
        animation: 'aram-spin 1s linear infinite'
    }
    // Add keyframes if not exists
    if (!document.getElementById('aram-spinner-style')) {
        const styleEl = document.createElement('style')
        styleEl.id = 'aram-spinner-style'
        styleEl.textContent = '@keyframes aram-spin { to { transform: rotate(360deg); } }'
        document.head.appendChild(styleEl)
    }
    return createElement('div', { style })
}

export function Progress(props: { value: number; color?: string; height?: number }): HTMLElement {
    const container = createElement('div', {
        style: { width: '100%', height: `${props.height || 8}px`, backgroundColor: '#e0e0e0', borderRadius: '4px', overflow: 'hidden' }
    })
    container.appendChild(createElement('div', {
        style: { width: `${Math.min(100, Math.max(0, props.value))}%`, height: '100%', backgroundColor: props.color || '#4CAF50', transition: 'width 0.3s' }
    }))
    return container
}

export function Badge(props: { bg?: string; color?: string; variant?: 'solid' | 'outline' } = {}, ...children: (string | AramNode)[]): HTMLElement {
    const isSolid = props.variant !== 'outline'
    const style = {
        display: 'inline-block',
        padding: '4px 8px',
        borderRadius: '9999px',
        fontSize: '12px',
        fontWeight: 600,
        backgroundColor: isSolid ? (props.bg || '#4CAF50') : 'transparent',
        color: isSolid ? (props.color || 'white') : (props.bg || '#4CAF50'),
        border: isSolid ? 'none' : `1px solid ${props.bg || '#4CAF50'}`
    }
    return createElement('span', { style }, ...children)
}

let toastContainer: HTMLElement | null = null

export function toast(message: string, options: { type?: 'info' | 'success' | 'warning' | 'error'; duration?: number } = {}): void {
    if (!toastContainer) {
        toastContainer = createElement('div', {
            id: 'aram-toast',
            style: { position: 'fixed', top: '20px', right: '20px', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '8px' }
        })
        document.body.appendChild(toastContainer)
    }
    const colors = { info: '#2196F3', success: '#4CAF50', warning: '#FF9800', error: '#F44336' }
    const toast = createElement('div', {
        style: { padding: '12px 20px', backgroundColor: colors[options.type || 'info'], color: 'white', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }
    }, message)
    toastContainer.appendChild(toast)
    setTimeout(() => toast.remove(), options.duration || 3000)
}
