import { createElement, type AramNode } from '../render'

export interface TextProps {
    size?: number
    weight?: 'normal' | 'bold' | 'light' | number
    color?: string
    margin?: number
    align?: 'left' | 'center' | 'right'
}

export function Title(props: TextProps = {}, ...children: (string | AramNode)[]): HTMLElement {
    const style = {
        fontSize: props.size ? `${props.size}px` : '24px',
        fontWeight: props.weight || 'bold',
        color: props.color,
        margin: props.margin !== undefined ? `${props.margin}px` : '0',
        textAlign: props.align
    }
    return createElement('h1', { style }, ...children)
}

export function Text(props: TextProps = {}, ...children: (string | AramNode)[]): HTMLElement {
    const style = {
        fontSize: props.size ? `${props.size}px` : '16px',
        fontWeight: props.weight || 'normal',
        color: props.color,
        margin: props.margin !== undefined ? `${props.margin}px` : '0',
        textAlign: props.align
    }
    return createElement('p', { style }, ...children)
}

export function Link(props: TextProps & { href: string }, ...children: (string | AramNode)[]): HTMLElement {
    const style = {
        fontSize: props.size ? `${props.size}px` : '16px',
        color: props.color || '#0066cc',
        textDecoration: 'underline',
        cursor: 'pointer'
    }
    return createElement('a', { href: props.href, target: '_blank', style }, ...children)
}
