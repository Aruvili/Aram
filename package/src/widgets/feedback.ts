import { createElement, type AramNode } from '../core/render'
import { BADGE_SIZES } from '../utils/constants'

let spinnerStyleInjected = false
let progressStyleInjected = false
let toastStyleInjected = false

export interface SpinnerProps {
    size?: number
    color?: string
    thickness?: number
}

export function Spinner(props: SpinnerProps = {}): HTMLElement {
    const size = props.size || 24
    const thickness = props.thickness || 3

    const style = {
        width: `${size}px`,
        height: `${size}px`,
        border: `${thickness}px solid rgba(255,255,255,0.1)`,
        borderTop: `${thickness}px solid ${props.color || '#6366f1'}`,
        borderRadius: '50%',
        animation: 'aram-spin 0.8s linear infinite'
    }

    if (!document.getElementById('aram-spinner-style')) {
        const styleEl = document.createElement('style')
        styleEl.id = 'aram-spinner-style'
        styleEl.textContent = '@keyframes aram-spin { to { transform: rotate(360deg); } }'
        document.head.appendChild(styleEl)
    }
    return createElement('div', { style })
}

export interface ProgressProps {
    value: number
    max?: number
    color?: string
    bg?: string
    height?: number
    radius?: number
    animated?: boolean
    striped?: boolean
}

export function Progress(props: ProgressProps): HTMLElement {
    const percent = Math.min(100, Math.max(0, (props.value / (props.max || 100)) * 100))
    const height = props.height || 8

    if (props.animated && !progressStyleInjected) {
        const styleEl = document.createElement('style')
        styleEl.id = 'aram-progress-style'
        styleEl.textContent = `
            @keyframes aram-progress-stripes {
                from { background-position: 1rem 0; }
                to { background-position: 0 0; }
            }
        `
        document.head.appendChild(styleEl)
    }

    const container = createElement('div', {
        style: {
            width: '100%',
            height: `${height}px`,
            backgroundColor: props.bg || 'rgba(255,255,255,0.1)',
            borderRadius: props.radius !== undefined ? `${props.radius}px` : `${height / 2}px`,
            overflow: 'hidden'
        }
    })

    const barStyle: Record<string, string> = {
        width: `${percent}%`,
        height: '100%',
        backgroundColor: props.color || '#6366f1',
        borderRadius: 'inherit',
        transition: 'width 0.3s ease'
    }

    if (props.striped) {
        barStyle.backgroundImage = 'linear-gradient(45deg, rgba(255,255,255,0.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.15) 75%, transparent 75%, transparent)'
        barStyle.backgroundSize = '1rem 1rem'
    }

    if (props.animated) {
        barStyle.animation = 'aram-progress-stripes 1s linear infinite'
    }

    container.appendChild(createElement('div', { style: barStyle }))
    return container
}

export interface BadgeProps {
    bg?: string
    color?: string
    variant?: 'solid' | 'outline' | 'soft'
    size?: 'sm' | 'md' | 'lg'
    radius?: number
}

export function Badge(props: BadgeProps = {}, ...children: (string | AramNode)[]): HTMLElement {
    const sizeStyle = BADGE_SIZES[props.size || 'md']

    const isSolid = props.variant === 'solid' || !props.variant
    const isOutline = props.variant === 'outline'
    const isSoft = props.variant === 'soft'

    const baseColor = props.bg || '#6366f1'

    let backgroundColor = baseColor
    let textColor = props.color || 'white'
    let border = 'none'

    if (isOutline) {
        backgroundColor = 'transparent'
        textColor = props.color || baseColor
        border = `1px solid ${baseColor}`
    } else if (isSoft) {
        backgroundColor = `${baseColor}20`
        textColor = props.color || baseColor
    }

    const style = {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...sizeStyle,
        borderRadius: props.radius !== undefined ? `${props.radius}px` : '9999px',
        fontWeight: 600,
        backgroundColor,
        color: textColor,
        border,
        letterSpacing: '0.025em'
    }
    return createElement('span', { style }, ...children)
}

let toastContainer: HTMLElement | null = null

export interface ToastOptions {
    type?: 'info' | 'success' | 'warning' | 'error'
    duration?: number
    position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center'
}

export function toast(message: string, options: ToastOptions = {}): void {
    const positions: Record<string, Record<string, string>> = {
        'top-right': { top: '20px', right: '20px' },
        'top-left': { top: '20px', left: '20px' },
        'bottom-right': { bottom: '20px', right: '20px' },
        'bottom-left': { bottom: '20px', left: '20px' },
        'top-center': { top: '20px', left: '50%', transform: 'translateX(-50%)' },
        'bottom-center': { bottom: '20px', left: '50%', transform: 'translateX(-50%)' }
    }

    const pos = positions[options.position || 'top-right']

    if (!toastContainer || toastContainer.getAttribute('data-position') !== (options.position || 'top-right')) {
        toastContainer?.remove()
        toastContainer = createElement('div', {
            id: 'aram-toast',
            style: {
                position: 'fixed',
                ...pos,
                zIndex: 9999,
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                pointerEvents: 'none'
            }
        })
        toastContainer.setAttribute('data-position', options.position || 'top-right')
        document.body.appendChild(toastContainer)
    }

    const colors = {
        info: '#3b82f6',
        success: '#22c55e',
        warning: '#eab308',
        error: '#ef4444'
    }

    const icons = {
        info: 'ℹ️',
        success: '✓',
        warning: '⚠️',
        error: '✕'
    }

    const toastEl = createElement('div', {
        style: {
            padding: '12px 20px',
            backgroundColor: colors[options.type || 'info'],
            color: 'white',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontWeight: 500,
            fontSize: '14px',
            animation: 'aram-toast-in 0.3s ease',
            pointerEvents: 'auto'
        }
    },
        createElement('span', {}, icons[options.type || 'info']),
        message
    )

    if (!toastStyleInjected) {
        const styleEl = document.createElement('style')
        styleEl.id = 'aram-toast-style'
        styleEl.textContent = `
            @keyframes aram-toast-in { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
            @keyframes aram-toast-out { from { opacity: 1; } to { opacity: 0; transform: translateX(100%); } }
        `
        document.head.appendChild(styleEl)
    }

    toastContainer.appendChild(toastEl)

    setTimeout(() => {
        toastEl.style.animation = 'aram-toast-out 0.3s ease forwards'
        setTimeout(() => toastEl.remove(), 300)
    }, options.duration || 3000)
}

export function Skeleton(props: {
    width?: number | string
    height?: number | string
    radius?: number
    animate?: boolean
} = {}): HTMLElement {
    if (!document.getElementById('aram-skeleton-style')) {
        const styleEl = document.createElement('style')
        styleEl.id = 'aram-skeleton-style'
        styleEl.textContent = `
            @keyframes aram-skeleton {
                0% { background-position: 200% 0; }
                100% { background-position: -200% 0; }
            }
        `
        document.head.appendChild(styleEl)
    }

    const style: Record<string, string> = {
        width: props.width ? (typeof props.width === 'number' ? `${props.width}px` : props.width) : '100%',
        height: props.height ? (typeof props.height === 'number' ? `${props.height}px` : props.height) : '20px',
        borderRadius: props.radius !== undefined ? `${props.radius}px` : '4px',
        background: 'linear-gradient(90deg, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.05) 75%)',
        backgroundSize: '200% 100%'
    }

    if (props.animate !== false) {
        style.animation = 'aram-skeleton 1.5s ease infinite'
    }

    return createElement('div', { style })
}

export function Tooltip(props: {
    text: string
    position?: 'top' | 'bottom' | 'left' | 'right'
}, child: HTMLElement): HTMLElement {
    const wrapper = createElement('div', {
        style: {
            position: 'relative',
            display: 'inline-block'
        }
    })

    const tooltip = createElement('div', {
        style: {
            position: 'absolute',
            backgroundColor: 'rgba(0,0,0,0.9)',
            color: 'white',
            padding: '6px 12px',
            borderRadius: '6px',
            fontSize: '12px',
            whiteSpace: 'nowrap',
            opacity: '0',
            visibility: 'hidden',
            transition: 'opacity 0.2s, visibility 0.2s',
            zIndex: '999',
            pointerEvents: 'none',
            ...(props.position === 'bottom' ? { top: '100%', left: '50%', transform: 'translateX(-50%)', marginTop: '8px' } :
                props.position === 'left' ? { right: '100%', top: '50%', transform: 'translateY(-50%)', marginRight: '8px' } :
                    props.position === 'right' ? { left: '100%', top: '50%', transform: 'translateY(-50%)', marginLeft: '8px' } :
                        { bottom: '100%', left: '50%', transform: 'translateX(-50%)', marginBottom: '8px' })
        }
    }, props.text)

    wrapper.appendChild(child)
    wrapper.appendChild(tooltip)

    wrapper.addEventListener('mouseenter', () => {
        tooltip.style.opacity = '1'
        tooltip.style.visibility = 'visible'
    })
    wrapper.addEventListener('mouseleave', () => {
        tooltip.style.opacity = '0'
        tooltip.style.visibility = 'hidden'
    })

    return wrapper
}
