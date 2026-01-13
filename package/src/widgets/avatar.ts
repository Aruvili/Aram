import { createElement } from '../core/render'
import { getTheme } from './theme'

export interface AvatarProps {
    src?: string
    name?: string
    size?: number | 'xs' | 'sm' | 'md' | 'lg' | 'xl'
    radius?: number | 'full'
    status?: 'online' | 'offline' | 'away' | 'busy'
    statusPosition?: 'top-right' | 'bottom-right'
    bg?: string
    color?: string
}

export function Avatar(props: AvatarProps = {}): HTMLElement {
    const t = getTheme()
    const sizes = { xs: 24, sm: 32, md: 40, lg: 48, xl: 64 }
    const size = typeof props.size === 'number' ? props.size : sizes[props.size || 'md']
    const radius = props.radius === 'full' ? '50%' : `${props.radius ?? 50}%`

    const wrapper = createElement('div', {
        style: { position: 'relative', display: 'inline-flex', width: `${size}px`, height: `${size}px` }
    })

    if (props.src) {
        const img = createElement('img', {
            src: props.src,
            alt: props.name || '',
            style: { width: '100%', height: '100%', borderRadius: radius, objectFit: 'cover' }
        })

        img.addEventListener('error', () => {
            const initials = (props.name || '?').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
            wrapper.innerHTML = ''
            wrapper.appendChild(createElement('div', {
                style: {
                    width: '100%',
                    height: '100%',
                    borderRadius: radius,
                    backgroundColor: props.bg || t.accent,
                    color: props.color || 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: `${size / 2.5}px`,
                    fontWeight: '600'
                }
            }, initials))
        })

        wrapper.appendChild(img)
    } else {
        const initials = (props.name || '?').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
        wrapper.appendChild(createElement('div', {
            style: {
                width: '100%',
                height: '100%',
                borderRadius: radius,
                backgroundColor: props.bg || t.accent,
                color: props.color || 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: `${size / 2.5}px`,
                fontWeight: '600'
            }
        }, initials))
    }

    if (props.status) {
        const statusColors = { online: t.success, offline: t.muted, away: t.warning, busy: t.error }
        const pos = props.statusPosition === 'top-right' ? { top: '0', right: '0' } : { bottom: '0', right: '0' }
        wrapper.appendChild(createElement('div', {
            style: {
                position: 'absolute',
                ...pos,
                width: `${size / 4}px`,
                height: `${size / 4}px`,
                backgroundColor: statusColors[props.status],
                borderRadius: '50%',
                border: `2px solid ${t.bg}`
            }
        }))
    }

    return wrapper
}

export interface AvatarGroupProps {
    avatars: AvatarProps[]
    max?: number
    size?: AvatarProps['size']
}

export function AvatarGroup(props: AvatarGroupProps): HTMLElement {
    const t = getTheme()
    const sizes = { xs: 24, sm: 32, md: 40, lg: 48, xl: 64 }
    const size = typeof props.size === 'number' ? props.size : sizes[props.size || 'md']
    const max = props.max || props.avatars.length
    const visible = props.avatars.slice(0, max)
    const remaining = props.avatars.length - max

    const group = createElement('div', {
        style: { display: 'flex', alignItems: 'center' }
    })

    visible.forEach((avatar, i) => {
        const el = Avatar({ ...avatar, size: props.size })
        el.style.marginLeft = i > 0 ? `-${size / 4}px` : '0'
        el.style.border = `2px solid ${t.bg}`
        el.style.borderRadius = '50%'
        group.appendChild(el)
    })

    if (remaining > 0) {
        const more = createElement('div', {
            style: {
                width: `${size}px`,
                height: `${size}px`,
                borderRadius: '50%',
                backgroundColor: t.card,
                border: `2px solid ${t.bg}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginLeft: `-${size / 4}px`,
                fontSize: `${size / 3}px`,
                color: t.muted,
                fontWeight: '500'
            }
        }, `+${remaining}`)
        group.appendChild(more)
    }

    return group
}
