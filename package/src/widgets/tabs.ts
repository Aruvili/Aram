import { createElement } from '../core/render'
import { state, watch } from '../core/state'
import { getTheme } from './theme'

export interface TabsProps {
    tabs: { id: string; label: string; badge?: string | number; content: () => HTMLElement }[]
    defaultTab?: string
    variant?: 'default' | 'pills' | 'underline'
    onChange?: (tabId: string) => void
}

export function Tabs(props: TabsProps): HTMLElement {
    const t = getTheme()
    const activeTab = state(props.defaultTab || props.tabs[0]?.id)

    const container = createElement('div', {})

    const headers = createElement('div', {
        style: {
            display: 'flex',
            gap: props.variant === 'pills' ? '8px' : '0',
            borderBottom: props.variant === 'underline' ? `1px solid ${t.border}` : 'none',
            marginBottom: '16px'
        }
    })

    const tabButtons: HTMLButtonElement[] = []

    props.tabs.forEach((tab, index) => {
        const tabEl = createElement('button', {
            style: {
                padding: props.variant === 'pills' ? '8px 16px' : '12px 16px',
                backgroundColor: 'transparent',
                color: t.muted,
                border: 'none',
                borderBottom: 'none',
                borderRadius: props.variant === 'pills' ? '6px' : '0',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s',
                fontFamily: 'inherit'
            },
            onclick: () => {
                activeTab.set(tab.id)
                props.onChange?.(tab.id)
            }
        }, tab.label) as HTMLButtonElement

        if (tab.badge) {
            tabEl.appendChild(createElement('span', {
                style: {
                    padding: '2px 6px',
                    borderRadius: '9999px',
                    fontSize: '11px',
                    backgroundColor: t.cardHover,
                    color: t.muted
                }
            }, String(tab.badge)))
        }

        tabButtons.push(tabEl)
        headers.appendChild(tabEl)
    })

    container.appendChild(headers)

    const contentContainer = watch(activeTab, (activeId) => {
        props.tabs.forEach((tab, index) => {
            const isActive = tab.id === activeId
            const btn = tabButtons[index]
            btn.style.backgroundColor = props.variant === 'pills' && isActive ? t.cardHover : 'transparent'
            btn.style.color = isActive ? t.primary : t.muted
            btn.style.borderBottom = props.variant === 'underline' && isActive ? `2px solid ${t.accent}` : 'none'
        })

        const activeContent = props.tabs.find(tab => tab.id === activeId)
        return activeContent ? activeContent.content() : createElement('div', {})
    })

    container.appendChild(contentContainer)

    return container
}
