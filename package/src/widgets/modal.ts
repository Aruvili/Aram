import { createElement } from '../core/render'
import { getTheme } from './theme'
import { registerCleanup } from '../core/lifecycle'
import { injectStyles } from '../utils/styles'
import { appendChildren } from '../utils/dom'

let modalStyleInjected = false

export interface ModalProps {
    title?: string
    description?: string
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
    onClose?: () => void
    closeOnOutsideClick?: boolean
    closeOnEscape?: boolean
}

export function Modal(props: ModalProps = {}, ...children: HTMLElement[]): HTMLElement {
    const t = getTheme()
    const sizes = { sm: '400px', md: '500px', lg: '600px', xl: '800px', full: '95vw' }

    const overlay = createElement('div', {
        style: {
            position: 'fixed',
            inset: '0',
            backgroundColor: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: '9999',
            padding: '20px'
        },
        onclick: (e: Event) => {
            if (e.target === overlay && props.closeOnOutsideClick !== false && props.onClose) {
                props.onClose()
            }
        }
    })

    if (props.closeOnEscape !== false && props.onClose) {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                props.onClose?.()
            }
        }
        document.addEventListener('keydown', handleEscape)
        registerCleanup(overlay, () => document.removeEventListener('keydown', handleEscape))
    }

    const modal = createElement('div', {
        style: {
            backgroundColor: t.card,
            border: `1px solid ${t.border}`,
            borderRadius: '12px',
            padding: '24px',
            width: '100%',
            maxWidth: sizes[props.size || 'md'],
            maxHeight: '90vh',
            overflow: 'auto',
            animation: 'aram-modal-in 0.2s ease'
        }
    })
    if (!modalStyleInjected) {
        injectStyles('modal', `
            @keyframes aram-modal-in { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        `)
        modalStyleInjected = true
    }

    if (props.title || props.onClose) {
        const header = createElement('div', {
            style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }
        })
        if (props.title) {
            header.appendChild(createElement('h2', {
                style: { color: t.primary, fontSize: '18px', fontWeight: '600' }
            }, props.title))
        }
        if (props.onClose) {
            const closeBtn = createElement('button', {
                style: {
                    background: 'none',
                    border: 'none',
                    color: t.muted,
                    cursor: 'pointer',
                    fontSize: '20px',
                    padding: '4px'
                },
                onclick: props.onClose
            }, '✕')
            header.appendChild(closeBtn)
        }
        modal.appendChild(header)
    }

    if (props.description) {
        modal.appendChild(createElement('p', {
            style: { color: t.muted, fontSize: '14px', marginBottom: '16px' }
        }, props.description))
    }

    appendChildren(modal, children)
    overlay.appendChild(modal)

    return overlay
}

export function showModal(props: ModalProps = {}, ...children: HTMLElement[]): () => void {
    const modal = Modal({ ...props, onClose: () => modal.remove() }, ...children)
    document.body.appendChild(modal)
    return () => modal.remove()
}

export interface ConfirmDialogProps {
    title: string
    message: string
    confirmText?: string
    cancelText?: string
    onConfirm: () => void
    onCancel?: () => void
    variant?: 'default' | 'danger'
}

export function showConfirmDialog(props: ConfirmDialogProps): () => void {
    const t = getTheme()

    const footer = createElement('div', {
        style: { display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }
    })

    const cancelBtn = createElement('button', {
        style: {
            padding: '10px 20px',
            backgroundColor: 'transparent',
            color: t.muted,
            border: `1px solid ${t.border}`,
            borderRadius: '6px',
            cursor: 'pointer',
            fontFamily: 'inherit'
        },
        onclick: () => { close(); props.onCancel?.() }
    }, props.cancelText || 'Cancel')

    const confirmBtn = createElement('button', {
        style: {
            padding: '10px 20px',
            backgroundColor: props.variant === 'danger' ? t.error : t.accent,
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontFamily: 'inherit'
        },
        onclick: () => { close(); props.onConfirm() }
    }, props.confirmText || 'Confirm')

    footer.appendChild(cancelBtn)
    footer.appendChild(confirmBtn)

    const close = showModal(
        { title: props.title, description: props.message, size: 'sm' },
        footer
    )

    return close
}
