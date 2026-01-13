import { createElement } from '../render'
import { getTheme } from './theme'

export interface BreadcrumbProps {
    items: { label: string; href?: string; icon?: string; onClick?: () => void }[]
    separator?: string | HTMLElement
    maxItems?: number
}

export function Breadcrumb(props: BreadcrumbProps): HTMLElement {
    const t = getTheme()

    let items = props.items
    if (props.maxItems && items.length > props.maxItems) {
        const first = items.slice(0, 1)
        const last = items.slice(-(props.maxItems - 1))
        items = [...first, { label: '...' }, ...last]
    }

    const container = createElement('nav', {
        style: { display: 'flex', alignItems: 'center', gap: '8px' }
    })

    items.forEach((item, i) => {
        const isLast = i === items.length - 1

        const wrapper = createElement('div', {
            style: { display: 'flex', alignItems: 'center', gap: '8px' }
        })

        if (item.icon) {
            wrapper.appendChild(createElement('span', { style: { fontSize: '14px' } }, item.icon))
        }

        if (item.href || item.onClick) {
            const link = createElement('a', {
                href: item.href || '#',
                style: {
                    color: isLast ? t.primary : t.muted,
                    textDecoration: 'none',
                    fontSize: '14px',
                    fontWeight: isLast ? '500' : 'normal',
                    transition: 'color 0.15s'
                },
                onclick: item.onClick ? (e: Event) => { e.preventDefault(); item.onClick?.() } : undefined
            }, item.label)

            if (!isLast) {
                link.addEventListener('mouseenter', () => { link.style.color = t.primary })
                link.addEventListener('mouseleave', () => { link.style.color = t.muted })
            }

            wrapper.appendChild(link)
        } else {
            wrapper.appendChild(createElement('span', {
                style: { color: isLast ? t.primary : t.muted, fontSize: '14px' }
            }, item.label))
        }

        container.appendChild(wrapper)

        if (!isLast) {
            if (typeof props.separator === 'string') {
                container.appendChild(createElement('span', {
                    style: { color: t.muted, fontSize: '12px' }
                }, props.separator || '/'))
            } else if (props.separator) {
                container.appendChild(props.separator)
            } else {
                container.appendChild(createElement('span', {
                    style: { color: t.muted, fontSize: '12px' }
                }, '/'))
            }
        }
    })

    return container
}
