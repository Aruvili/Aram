import { createElement } from '../core/render'
import { state } from '../core/state'
import { getTheme } from './theme'
import { registerCleanup } from '../core/lifecycle'
import { injectStyles } from '../utils/styles'

let accordionStyleInjected = false

export interface AccordionProps {
    items: { id: string; title: string; content: () => HTMLElement }[]
    allowMultiple?: boolean
    defaultOpen?: string[]
    variant?: 'default' | 'bordered' | 'separated'
}

export function Accordion(props: AccordionProps): HTMLElement {
    const t = getTheme()
    const openItems = state<string[]>(props.defaultOpen || [])

    const container = createElement('div', {
        style: {
            display: 'flex',
            flexDirection: 'column',
            gap: props.variant === 'separated' ? '8px' : '0'
        }
    })

    props.items.forEach((item, index) => {
        const isFirst = index === 0
        const isLast = index === props.items.length - 1

        const wrapper = createElement('div', {
            style: {
                border: props.variant !== 'default' ? `1px solid ${t.border}` : 'none',
                borderBottom: props.variant === 'default' ? `1px solid ${t.border}` : undefined,
                borderRadius: props.variant === 'separated' ? '8px' :
                    props.variant === 'bordered' ? (isFirst ? '8px 8px 0 0' : isLast ? '0 0 8px 8px' : '0') : '0',
                overflow: 'hidden',
                marginTop: props.variant === 'bordered' && !isFirst ? '-1px' : '0'
            }
        })

        const header = createElement('button', {
            style: {
                width: '100%',
                padding: '16px',
                backgroundColor: t.card,
                border: 'none',
                color: t.primary,
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontFamily: 'inherit',
                transition: 'background-color 0.15s'
            },
            onclick: () => {
                const currentOpen = openItems.get()
                const isCurrentlyOpen = currentOpen.includes(item.id)

                if (props.allowMultiple) {
                    openItems.set(isCurrentlyOpen
                        ? currentOpen.filter(id => id !== item.id)
                        : [...currentOpen, item.id]
                    )
                } else {
                    openItems.set(isCurrentlyOpen ? [] : [item.id])
                }
            }
        })

        header.addEventListener('mouseenter', () => { header.style.backgroundColor = t.cardHover })
        header.addEventListener('mouseleave', () => { header.style.backgroundColor = t.card })

        const titleSpan = createElement('span', {}, item.title)
        const arrow = createElement('span', {
            style: {
                transition: 'transform 0.2s',
                fontSize: '12px'
            }
        }, '▼')

        header.appendChild(titleSpan)
        header.appendChild(arrow)
        wrapper.appendChild(header)

        const contentWrapper = createElement('div', {
            style: {
                maxHeight: '0',
                overflow: 'hidden',
                transition: 'max-height 0.3s ease, padding 0.3s ease',
                padding: '0 16px'
            }
        })

        const contentInner = createElement('div', {
            style: {
                borderTop: `1px solid ${t.border}`,
                paddingTop: '16px',
                paddingBottom: '16px',
                backgroundColor: t.bg
            }
        })
        contentInner.appendChild(item.content())
        contentWrapper.appendChild(contentInner)
        wrapper.appendChild(contentWrapper)

        const unsub = openItems.subscribe(() => {
            const isOpen = openItems.get().includes(item.id)
            arrow.style.transform = isOpen ? 'rotate(180deg)' : 'rotate(0deg)'
            contentWrapper.style.maxHeight = isOpen ? '1000px' : '0'
            contentWrapper.style.padding = isOpen ? '0 16px' : '0 16px'
        })

        registerCleanup(wrapper, unsub)

        const initialOpen = openItems.get().includes(item.id)
        arrow.style.transform = initialOpen ? 'rotate(180deg)' : 'rotate(0deg)'
        contentWrapper.style.maxHeight = initialOpen ? '1000px' : '0'

        container.appendChild(wrapper)
    })

    if (!accordionStyleInjected) {
        injectStyles('accordion', `
            @keyframes aram-accordion-open { from { opacity: 0; max-height: 0; } to { opacity: 1; max-height: 500px; } }
        `)
        accordionStyleInjected = true
    }

    return container
}
