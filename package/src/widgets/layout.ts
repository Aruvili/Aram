import { createElement, type AramNode } from '../render'

export interface BoxProps {
    pad?: number
    margin?: number
    bg?: string
    color?: string
    radius?: number
    gap?: number
    align?: 'left' | 'center' | 'right'
    width?: number | string
    height?: number | string
}

function propsToStyle(props: BoxProps): Record<string, string> {
    const style: Record<string, string> = {}
    if (props.pad) style.padding = `${props.pad}px`
    if (props.margin) style.margin = `${props.margin}px`
    if (props.bg) style.backgroundColor = props.bg
    if (props.color) style.color = props.color
    if (props.radius) style.borderRadius = `${props.radius}px`
    if (props.gap) style.gap = `${props.gap}px`
    if (props.align) style.textAlign = props.align
    if (props.width) style.width = typeof props.width === 'number' ? `${props.width}px` : props.width
    if (props.height) style.height = typeof props.height === 'number' ? `${props.height}px` : props.height
    return style
}

export function Box(props: BoxProps = {}, ...children: (AramNode | string)[]): HTMLElement {
    return createElement('div', { style: propsToStyle(props) }, ...children)
}

export function Row(props: BoxProps = {}, ...children: (AramNode | string)[]): HTMLElement {
    const style = { ...propsToStyle(props), display: 'flex', flexDirection: 'row' }
    return createElement('div', { style }, ...children)
}

export function Column(props: BoxProps = {}, ...children: (AramNode | string)[]): HTMLElement {
    const style = { ...propsToStyle(props), display: 'flex', flexDirection: 'column' }
    return createElement('div', { style }, ...children)
}

export function Center(props: BoxProps = {}, ...children: (AramNode | string)[]): HTMLElement {
    const style = { ...propsToStyle(props), display: 'flex', alignItems: 'center', justifyContent: 'center' }
    return createElement('div', { style }, ...children)
}

export function Header(props: BoxProps = {}, ...children: (AramNode | string)[]): HTMLElement {
    return createElement('header', { style: propsToStyle(props) }, ...children)
}

export function Section(props: BoxProps = {}, ...children: (AramNode | string)[]): HTMLElement {
    return createElement('section', { style: propsToStyle(props) }, ...children)
}
