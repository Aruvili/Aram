import { createElement, type AramNode } from '../render'

export interface TextProps {
    size?: number
    weight?: 'normal' | 'bold' | 'light' | number
    color?: string
    margin?: number
    align?: 'left' | 'center' | 'right'
    width?: number | string
    maxWidth?: number | string
    lineHeight?: number | string
    letterSpacing?: string
    opacity?: number
    truncate?: boolean
    fontFamily?: string
    cursor?: string
}

function buildTextStyle(props: TextProps): Record<string, string | number | undefined> {
    return {
        fontSize: props.size ? `${props.size}px` : undefined,
        fontWeight: props.weight || undefined,
        color: props.color,
        margin: props.margin !== undefined ? `${props.margin}px` : '0',
        textAlign: props.align,
        width: typeof props.width === 'number' ? `${props.width}px` : props.width,
        maxWidth: typeof props.maxWidth === 'number' ? `${props.maxWidth}px` : props.maxWidth,
        lineHeight: typeof props.lineHeight === 'number' ? `${props.lineHeight}` : props.lineHeight,
        letterSpacing: props.letterSpacing,
        opacity: props.opacity,
        fontFamily: props.fontFamily,
        cursor: props.cursor,
        overflow: props.truncate ? 'hidden' : undefined,
        textOverflow: props.truncate ? 'ellipsis' : undefined,
        whiteSpace: props.truncate ? 'nowrap' : undefined
    }
}

export function Title(props: TextProps = {}, ...children: (string | AramNode)[]): HTMLElement {
    const style = {
        ...buildTextStyle(props),
        fontSize: props.size ? `${props.size}px` : '24px',
        fontWeight: props.weight || 'bold'
    }
    return createElement('h1', { style }, ...children)
}

export function Text(props: TextProps = {}, ...children: (string | AramNode)[]): HTMLElement {
    const style = {
        ...buildTextStyle(props),
        fontSize: props.size ? `${props.size}px` : '16px',
        fontWeight: props.weight || 'normal'
    }
    return createElement('span', { style }, ...children)
}

export function Link(props: TextProps & { href: string; external?: boolean }, ...children: (string | AramNode)[]): HTMLElement {
    const style = {
        ...buildTextStyle(props),
        fontSize: props.size ? `${props.size}px` : '16px',
        color: props.color || '#0066cc',
        textDecoration: 'underline',
        cursor: 'pointer'
    }
    const attrs: Record<string, unknown> = { href: props.href, style }
    if (props.external === true) {
        attrs.target = '_blank'
        attrs.rel = 'noopener noreferrer'
    }
    return createElement('a', attrs, ...children)
}
