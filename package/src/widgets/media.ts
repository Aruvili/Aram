import { createElement } from '../render'

export function Divider(props: { color?: string; margin?: number } = {}): HTMLElement {
    const style = {
        width: '100%',
        height: '1px',
        backgroundColor: props.color || '#e0e0e0',
        margin: props.margin ? `${props.margin}px 0` : '8px 0'
    }
    return createElement('div', { style })
}

export function Spacer(props: { size?: number } = {}): HTMLElement {
    const style = props.size
        ? { flex: `0 0 ${props.size}px` }
        : { flex: '1' }
    return createElement('div', { style })
}
