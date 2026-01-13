import { createElement } from '../render'
import { state, type State } from '../state'
import { getTheme } from './theme'
import { registerCleanup } from '../lifecycle'

export interface SidebarSection {
    label?: string
    items: SidebarItem[]
}

export interface SidebarItem {
    id: string
    icon?: string
    label: string
    href?: string
    onClick?: () => void
    badge?: string | number
    active?: boolean
    disabled?: boolean
    children?: SidebarItem[]
}

export interface SidebarProps {
    logo?: { icon: string; text: string; onClick?: () => void }
    sections: SidebarSection[]
    footer?: HTMLElement | (() => HTMLElement)
    collapsed?: State<boolean>
    collapsible?: boolean
    width?: number
    collapsedWidth?: number
    bg?: string
    border?: boolean
}

export function Sidebar(props: SidebarProps): HTMLElement {
    const t = getTheme()
    const collapsed = props.collapsed || state(false)

    const sidebar = createElement('aside', {
        style: {
            width: `${collapsed.get() ? (props.collapsedWidth || 60) : (props.width || 240)}px`,
            height: '100vh',
            backgroundColor: props.bg || t.bg,
            borderRight: props.border !== false ? `1px solid ${t.border}` : 'none',
            display: 'flex',
            flexDirection: 'column',
            padding: '12px',
            transition: 'width 0.2s ease',
            flexShrink: '0',
            overflow: 'hidden',
            position: 'sticky',
            top: '0'
        }
    })
    let logoContainer: HTMLElement | null = null
    let toggleButton: HTMLElement | null = null
    let navContainer: HTMLElement | null = null

    const updateSidebarContent = (isCollapsed: boolean) => {
        const newWidth = isCollapsed ? (props.collapsedWidth || 60) : (props.width || 240)
        sidebar.style.width = `${newWidth}px`

        if (logoContainer) {
            const textSpan = logoContainer.querySelector('span:nth-child(2)') as HTMLElement
            if (textSpan) {
                textSpan.style.display = isCollapsed ? 'none' : 'inline'
            }
        }

        if (toggleButton) {
            toggleButton.textContent = isCollapsed ? '»' : '«'
            toggleButton.style.justifyContent = isCollapsed ? 'center' : 'flex-end'
        }

        if (navContainer) {
            const navItems = navContainer.querySelectorAll('a') as NodeListOf<HTMLAnchorElement>
            navItems.forEach(item => {
                item.style.justifyContent = isCollapsed ? 'center' : 'flex-start'
                item.style.gap = isCollapsed ? '0' : '10px'
                item.style.padding = isCollapsed ? '12px' : '10px 12px'

                const label = item.querySelector('span:nth-child(2)') as HTMLElement
                if (label) label.style.display = isCollapsed ? 'none' : 'inline'

                const badge = item.querySelector('span:last-child') as HTMLElement
                if (badge && badge.style.marginLeft === 'auto') {
                    badge.style.display = isCollapsed ? 'none' : 'inline'
                }
            })
            const labels = navContainer.querySelectorAll('span[style*="text-transform: uppercase"]') as NodeListOf<HTMLElement>
            labels.forEach(label => {
                label.style.display = isCollapsed ? 'none' : 'block'
            })
        }
    }

    const unsub = collapsed.subscribe(() => {
        updateSidebarContent(collapsed.get())
    })
    registerCleanup(sidebar, unsub)

    if (props.logo) {
        logoContainer = createElement('div', {
            style: {
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '8px',
                marginBottom: '16px',
                cursor: props.logo.onClick ? 'pointer' : 'default'
            },
            onclick: props.logo.onClick
        })
        logoContainer.appendChild(createElement('div', {
            style: {
                width: '32px',
                height: '32px',
                backgroundColor: t.card,
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
                flexShrink: '0'
            }
        }, props.logo.icon))

        logoContainer.appendChild(createElement('span', {
            style: {
                color: t.primary,
                fontWeight: '600',
                fontSize: '14px',
                whiteSpace: 'nowrap',
                display: collapsed.get() ? 'none' : 'inline'
            }
        }, props.logo.text))

        if (props.collapsible) {
            toggleButton = createElement('button', {
                style: {
                    marginLeft: 'auto',
                    background: 'none',
                    border: 'none',
                    color: t.muted,
                    cursor: 'pointer',
                    padding: '4px',
                    display: collapsed.get() ? 'none' : 'block'
                },
                onclick: (e: Event) => {
                    e.stopPropagation()
                    collapsed.set(!collapsed.get())
                }
            }, '«')
            logoContainer.appendChild(toggleButton)
        }

        sidebar.appendChild(logoContainer)
    }

    if (props.collapsible && collapsed.get()) {
        const expandButton = createElement('button', {
            style: {
                background: 'none',
                border: 'none',
                color: t.muted,
                cursor: 'pointer',
                padding: '8px',
                marginBottom: '16px',
                width: '100%',
                display: 'flex',
                justifyContent: 'center'
            },
            onclick: () => collapsed.set(!collapsed.get())
        }, '»')
        toggleButton = expandButton
        sidebar.appendChild(expandButton)
    }

    navContainer = createElement('div', {
        style: { display: 'flex', flexDirection: 'column', gap: '24px', flex: '1', overflow: 'auto' }
    })

    props.sections.forEach(section => {
        const sectionEl = createElement('div', {
            style: { display: 'flex', flexDirection: 'column', gap: '4px' }
        })

        if (section.label && !collapsed.get()) {
            sectionEl.appendChild(createElement('span', {
                style: {
                    color: t.muted,
                    fontSize: '11px',
                    fontWeight: '500',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    padding: '0 12px',
                    marginBottom: '4px'
                }
            }, section.label))
        }

        section.items.forEach(item => {
            sectionEl.appendChild(renderNavItem(item, collapsed.get(), t))
        })

        navContainer.appendChild(sectionEl)
    })

    sidebar.appendChild(navContainer)

    if (props.footer) {
        const footerEl = createElement('div', {
            style: { marginTop: 'auto', paddingTop: '16px', borderTop: `1px solid ${t.border}` }
        })
        footerEl.appendChild(typeof props.footer === 'function' ? props.footer() : props.footer)
        sidebar.appendChild(footerEl)
    }

    return sidebar
}

function renderNavItem(item: SidebarItem, collapsed: boolean, t: ReturnType<typeof getTheme>): HTMLElement {
    const el = createElement('a', {
        href: item.href || '#',
        style: {
            display: 'flex',
            alignItems: 'center',
            gap: collapsed ? '0' : '10px',
            padding: collapsed ? '12px' : '10px 12px',
            borderRadius: '6px',
            backgroundColor: item.active ? t.cardHover : 'transparent',
            color: item.disabled ? t.muted : item.active ? t.primary : t.muted,
            textDecoration: 'none',
            fontSize: '14px',
            cursor: item.disabled ? 'not-allowed' : 'pointer',
            transition: 'all 0.15s',
            justifyContent: collapsed ? 'center' : 'flex-start',
            opacity: item.disabled ? 0.5 : 1
        },
        onclick: item.onClick && !item.disabled ? (e: Event) => { e.preventDefault(); item.onClick?.() } : undefined
    })

    if (!item.disabled) {
        el.addEventListener('mouseenter', () => {
            if (!item.active) el.style.backgroundColor = t.cardHover
            el.style.color = t.primary
        })
        el.addEventListener('mouseleave', () => {
            if (!item.active) el.style.backgroundColor = 'transparent'
            if (!item.active) el.style.color = t.muted
        })
    }

    if (item.icon) {
        el.appendChild(createElement('span', {
            style: { fontSize: '16px', flexShrink: '0' }
        }, item.icon))
    }

    if (!collapsed) {
        el.appendChild(createElement('span', { style: { whiteSpace: 'nowrap' } }, item.label))

        if (item.badge) {
            el.appendChild(createElement('span', {
                style: {
                    marginLeft: 'auto',
                    padding: '2px 6px',
                    borderRadius: '9999px',
                    fontSize: '11px',
                    backgroundColor: t.accent,
                    color: 'white'
                }
            }, String(item.badge)))
        }
    }

    return el
}
