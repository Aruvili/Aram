import { createElement } from '../core/render'
import { getTheme } from './theme'

export interface PaginationProps {
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
    showFirstLast?: boolean
    showPageNumbers?: boolean
    maxPageButtons?: number
    size?: 'sm' | 'md' | 'lg'
    variant?: 'default' | 'outline' | 'simple'
}

export function Pagination(props: PaginationProps): HTMLElement {
    const t = getTheme()
    const sizes = { sm: { pad: '6px 10px', font: '12px' }, md: { pad: '8px 12px', font: '14px' }, lg: { pad: '10px 14px', font: '16px' } }
    const s = sizes[props.size || 'md']

    const container = createElement('div', {
        style: { display: 'flex', alignItems: 'center', gap: '4px' }
    })

    const createButton = (text: string, page: number | null, disabled = false, active = false) => {
        const btn = createElement('button', {
            style: {
                padding: s.pad,
                backgroundColor: active ? t.primary : props.variant === 'outline' ? 'transparent' : t.card,
                color: active ? t.bg : disabled ? t.muted : t.primary,
                border: props.variant === 'outline' ? `1px solid ${t.border}` : 'none',
                borderRadius: '6px',
                cursor: disabled ? 'not-allowed' : 'pointer',
                fontSize: s.font,
                opacity: disabled ? 0.5 : 1,
                fontFamily: 'inherit',
                minWidth: '36px',
                transition: 'all 0.15s'
            },
            onclick: () => page !== null && !disabled && !active && props.onPageChange(page),
            disabled
        }, text)

        if (!disabled && !active) {
            btn.addEventListener('mouseenter', () => { btn.style.backgroundColor = t.cardHover })
            btn.addEventListener('mouseleave', () => { btn.style.backgroundColor = props.variant === 'outline' ? 'transparent' : t.card })
        }

        return btn
    }

    if (props.variant === 'simple') {
        container.appendChild(createButton('← Previous', props.currentPage - 1, props.currentPage === 1))
        container.appendChild(createElement('span', {
            style: { padding: '0 16px', color: t.muted, fontSize: s.font }
        }, `Page ${props.currentPage} of ${props.totalPages}`))
        container.appendChild(createButton('Next →', props.currentPage + 1, props.currentPage === props.totalPages))
        return container
    }

    if (props.showFirstLast) {
        container.appendChild(createButton('«', 1, props.currentPage === 1))
    }
    container.appendChild(createButton('‹', props.currentPage - 1, props.currentPage === 1))

    if (props.showPageNumbers !== false) {
        const maxButtons = props.maxPageButtons || 5
        const halfButtons = Math.floor(maxButtons / 2)
        let start = Math.max(1, props.currentPage - halfButtons)
        let end = Math.min(props.totalPages, start + maxButtons - 1)

        if (end - start < maxButtons - 1) {
            start = Math.max(1, end - maxButtons + 1)
        }

        if (start > 1) {
            container.appendChild(createButton('1', 1))
            if (start > 2) {
                container.appendChild(createElement('span', { style: { color: t.muted, padding: '0 4px' } }, '...'))
            }
        }

        for (let i = start; i <= end; i++) {
            container.appendChild(createButton(String(i), i, false, i === props.currentPage))
        }

        if (end < props.totalPages) {
            if (end < props.totalPages - 1) {
                container.appendChild(createElement('span', { style: { color: t.muted, padding: '0 4px' } }, '...'))
            }
            container.appendChild(createButton(String(props.totalPages), props.totalPages))
        }
    }

    container.appendChild(createButton('›', props.currentPage + 1, props.currentPage === props.totalPages))
    if (props.showFirstLast) {
        container.appendChild(createButton('»', props.totalPages, props.currentPage === props.totalPages))
    }

    return container
}
