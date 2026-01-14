import { createFlexBox, appendChildren } from '../utils/dom'
import { applyCommonStyles } from '../utils/styles'
import type { AramNode } from '../core/render'

export interface BoxProps {
    // Box model
    pad?: number | string
    padX?: number
    padY?: number
    margin?: number | string

    // Colors
    bg?: string
    color?: string

    // Size
    width?: number | string
    height?: number | string
    minWidth?: number | string
    minHeight?: number | string
    maxWidth?: number | string
    maxHeight?: number | string

    // Border
    radius?: number
    border?: string
    borderTop?: string
    borderBottom?: string
    borderLeft?: string
    borderRight?: string

    // Flex
    gap?: number
    align?: 'start' | 'center' | 'end' | 'stretch'
    items?: 'start' | 'center' | 'end' | 'stretch'  // alias for align
    justify?: 'start' | 'center' | 'end' | 'between' | 'around'
    wrap?: boolean
    flex?: number | string
    grow?: boolean

    // Other
    overflow?: 'hidden' | 'auto' | 'scroll' | 'visible'
}

function createFlexContainer(direction?: 'row' | 'column') {
    return (props: BoxProps, ...children: AramNode[]): HTMLElement => {
        const el = createFlexBox(direction)

        // Apply all styles using utilities
        applyCommonStyles(el, props)

        // Additional flex styles
        if (props.gap !== undefined) el.style.gap = `${props.gap}px`
        if (props.wrap) el.style.flexWrap = 'wrap'
        if (props.grow) el.style.flexGrow = '1'
        if (props.flex !== undefined) el.style.flex = typeof props.flex === 'number' ? String(props.flex) : props.flex
        if (props.overflow) el.style.overflow = props.overflow

        // Alignment - support both 'align' and 'items' (items is alias)
        const alignMap = { start: 'flex-start', center: 'center', end: 'flex-end', stretch: 'stretch' }
        const justifyMap = { start: 'flex-start', center: 'center', end: 'flex-end', between: 'space-between', around: 'space-around' }

        const alignValue = props.items || props.align
        if (alignValue) el.style.alignItems = alignMap[alignValue]
        if (props.justify) el.style.justifyContent = justifyMap[props.justify]

        // Append children
        appendChildren(el, children)

        return el
    }
}

export const Box = createFlexContainer()

export const Row = createFlexContainer('row')

export const Column = createFlexContainer('column')

export function Center(props: BoxProps, ...children: AramNode[]): HTMLElement {
    return Box({
        ...props,
        align: 'center',
        justify: 'center'
    }, ...children)
}

export function Header(props: BoxProps, ...children: AramNode[]): HTMLElement {
    const el = document.createElement('header')
    el.style.display = 'flex'
    el.style.flexDirection = 'row'
    el.style.alignItems = 'center'

    applyCommonStyles(el, props)

    if (props.gap !== undefined) el.style.gap = `${props.gap}px`

    appendChildren(el, children)

    return el
}

export function Section(props: BoxProps, ...children: AramNode[]): HTMLElement {
    const el = document.createElement('section')
    el.style.display = 'flex'
    el.style.flexDirection = 'column'

    applyCommonStyles(el, props)

    if (props.gap !== undefined) el.style.gap = `${props.gap}px`

    appendChildren(el, children)

    return el
}

export interface GridProps extends BoxProps {
    columns?: number
    rows?: number
    areas?: string
}

export function Grid(props: GridProps, ...children: AramNode[]): HTMLElement {
    const el = document.createElement('div')
    el.style.display = 'grid'

    applyCommonStyles(el, props)

    if (props.columns) el.style.gridTemplateColumns = `repeat(${props.columns}, 1fr)`
    if (props.rows) el.style.gridTemplateRows = `repeat(${props.rows}, 1fr)`
    if (props.areas) el.style.gridTemplateAreas = props.areas
    if (props.gap !== undefined) el.style.gap = `${props.gap}px`

    appendChildren(el, children)

    return el
}
