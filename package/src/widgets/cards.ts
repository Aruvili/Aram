import { createElement, type AramNode } from '../core/render'
import { getTheme } from './theme'

export interface CardProps {
    title?: string
    description?: string
    footer?: HTMLElement | string
    padding?: number
    radius?: number
    bg?: string
    border?: string
    shadow?: string
    hover?: boolean
    onClick?: () => void
}

export function Card(props: CardProps = {}, ...children: (HTMLElement | string | null)[]): HTMLElement {
    const t = getTheme()

    const card = createElement('div', {
        style: {
            backgroundColor: props.bg || t.card,
            border: props.border || `1px solid ${t.border}`,
            borderRadius: `${props.radius ?? 12}px`,
            padding: `${props.padding ?? 24}px`,
            boxShadow: props.shadow,
            cursor: props.onClick ? 'pointer' : undefined,
            transition: 'all 0.2s ease'
        },
        onclick: props.onClick
    })

    if (props.hover) {
        card.addEventListener('mouseenter', () => { card.style.backgroundColor = t.cardHover })
        card.addEventListener('mouseleave', () => { card.style.backgroundColor = props.bg || t.card })
    }

    if (props.title) {
        card.appendChild(createElement('h3', {
            style: { color: t.primary, fontSize: '16px', fontWeight: '600', marginBottom: props.description ? '4px' : '16px' }
        }, props.title))
    }

    if (props.description) {
        card.appendChild(createElement('p', {
            style: { color: t.muted, fontSize: '14px', marginBottom: '16px' }
        }, props.description))
    }

    children.filter(c => c !== null).forEach(child => {
        if (typeof child === 'string') {
            card.appendChild(createElement('span', {}, child))
        } else if (child) {
            card.appendChild(child)
        }
    })

    if (props.footer) {
        const footerEl = createElement('div', {
            style: { marginTop: '16px', paddingTop: '16px', borderTop: `1px solid ${t.border}` }
        })
        if (typeof props.footer === 'string') {
            footerEl.textContent = props.footer
        } else {
            footerEl.appendChild(props.footer)
        }
        card.appendChild(footerEl)
    }

    return card
}

export interface StatCardProps {
    title: string
    value: string | number | HTMLElement
    change?: string
    changeType?: 'up' | 'down' | 'neutral'
    description?: string
    icon?: string
    iconBg?: string
    trend?: 'up' | 'down'
    footer?: string | HTMLElement
}

export function StatCard(props: StatCardProps): HTMLElement {
    const t = getTheme()
    const isUp = props.changeType === 'up' || props.trend === 'up'
    const isDown = props.changeType === 'down' || props.trend === 'down'

    const card = createElement('div', {
        style: {
            backgroundColor: t.card,
            border: `1px solid ${t.border}`,
            borderRadius: '12px',
            padding: '20px',
            flex: '1 1 200px',
            minWidth: '200px',
            position: 'relative'
        }
    })

    const header = createElement('div', {
        style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }
    })
    header.appendChild(createElement('span', { style: { color: t.muted, fontSize: '13px' } }, props.title))

    if (props.change) {
        const badgeBg = isUp ? 'rgba(34,197,94,0.1)' : isDown ? 'rgba(239,68,68,0.1)' : 'rgba(161,161,170,0.1)'
        const badgeColor = isUp ? t.success : isDown ? t.error : t.muted
        header.appendChild(createElement('span', {
            style: {
                padding: '2px 8px',
                borderRadius: '9999px',
                fontSize: '12px',
                fontWeight: '500',
                backgroundColor: badgeBg,
                color: badgeColor
            }
        }, `${isUp ? '↗' : isDown ? '↘' : '→'} ${props.change}`))
    }
    card.appendChild(header)

    if (typeof props.value === 'string' || typeof props.value === 'number') {
        card.appendChild(createElement('div', {
            style: { color: t.primary, fontSize: '28px', fontWeight: '700', letterSpacing: '-0.025em' }
        }, String(props.value)))
    } else {
        card.appendChild(props.value)
    }

    if (props.description) {
        card.appendChild(createElement('p', {
            style: { color: t.muted, fontSize: '13px', marginTop: '8px' }
        }, props.description))
    }

    if (props.icon) {
        card.appendChild(createElement('div', {
            style: {
                position: 'absolute',
                top: '20px',
                right: '20px',
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                backgroundColor: props.iconBg || t.bgSubtle,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px'
            }
        }, props.icon))
    }

    return card
}
