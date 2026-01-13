import { createElement } from '../core/render'
import { getTheme } from './theme'

let loadingStyleInjected = false

export interface EmptyStateProps {
    icon?: string
    title: string
    description?: string
    action?: { label: string; onClick: () => void; variant?: 'primary' | 'secondary' }
    secondaryAction?: { label: string; onClick: () => void }
    size?: 'sm' | 'md' | 'lg'
}

export function EmptyState(props: EmptyStateProps): HTMLElement {
    const t = getTheme()
    const sizes = {
        sm: { icon: '32px', title: '14px', desc: '12px', pad: '24px' },
        md: { icon: '48px', title: '18px', desc: '14px', pad: '48px' },
        lg: { icon: '64px', title: '24px', desc: '16px', pad: '64px' }
    }
    const s = sizes[props.size || 'md']

    const container = createElement('div', {
        style: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: s.pad,
            textAlign: 'center'
        }
    })

    if (props.icon) {
        container.appendChild(createElement('span', {
            style: { fontSize: s.icon, marginBottom: '16px' }
        }, props.icon))
    }

    container.appendChild(createElement('h3', {
        style: {
            color: t.primary,
            fontSize: s.title,
            fontWeight: '600',
            marginBottom: '8px',
            margin: '0 0 8px 0'
        }
    }, props.title))

    if (props.description) {
        container.appendChild(createElement('p', {
            style: {
                color: t.muted,
                fontSize: s.desc,
                marginBottom: '24px',
                maxWidth: '400px',
                margin: '0 0 24px 0',
                lineHeight: '1.5'
            }
        }, props.description))
    }

    if (props.action || props.secondaryAction) {
        const actions = createElement('div', {
            style: { display: 'flex', gap: '12px' }
        })

        if (props.action) {
            actions.appendChild(createElement('button', {
                style: {
                    padding: '10px 20px',
                    backgroundColor: props.action.variant === 'secondary' ? 'transparent' : t.accent,
                    color: props.action.variant === 'secondary' ? t.muted : 'white',
                    border: props.action.variant === 'secondary' ? `1px solid ${t.border}` : 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: '500',
                    fontFamily: 'inherit'
                },
                onclick: props.action.onClick
            }, props.action.label))
        }

        if (props.secondaryAction) {
            actions.appendChild(createElement('button', {
                style: {
                    padding: '10px 20px',
                    backgroundColor: 'transparent',
                    color: t.muted,
                    border: `1px solid ${t.border}`,
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontFamily: 'inherit'
                },
                onclick: props.secondaryAction.onClick
            }, props.secondaryAction.label))
        }

        container.appendChild(actions)
    }

    return container
}

export interface ErrorStateProps {
    title?: string
    message?: string
    onRetry?: () => void
    retryLabel?: string
}

export function ErrorState(props: ErrorStateProps): HTMLElement {
    const t = getTheme()

    return EmptyState({
        icon: '⚠️',
        title: props.title || 'Something went wrong',
        description: props.message || 'An error occurred. Please try again.',
        action: props.onRetry ? { label: props.retryLabel || 'Try again', onClick: props.onRetry } : undefined
    })
}

export interface LoadingStateProps {
    message?: string
    size?: 'sm' | 'md' | 'lg'
}

export function LoadingState(props: LoadingStateProps = {}): HTMLElement {
    const t = getTheme()
    const sizes = { sm: 24, md: 32, lg: 48 }
    const size = sizes[props.size || 'md']

    if (!loadingStyleInjected) {
        const style = document.createElement('style')
        style.id = 'aram-loading-style'
        style.textContent = '@keyframes aram-spin { to { transform: rotate(360deg); } }'
        document.head.appendChild(style)
        loadingStyleInjected = true
    }

    const container = createElement('div', {
        style: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '48px',
            gap: '16px'
        }
    })

    container.appendChild(createElement('div', {
        style: {
            width: `${size}px`,
            height: `${size}px`,
            border: `3px solid ${t.border}`,
            borderTop: `3px solid ${t.accent}`,
            borderRadius: '50%',
            animation: 'aram-spin 0.8s linear infinite'
        }
    }))

    if (props.message) {
        container.appendChild(createElement('p', {
            style: { color: t.muted, fontSize: '14px', margin: '0' }
        }, props.message))
    }

    return container
}
