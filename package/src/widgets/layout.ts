import { createFlexBox, appendChildren } from '../utils/dom'
import { applyCommonStyles } from '../utils/styles'
import type { AramNode } from '../core/render'

export interface BoxProps {
    pad?: number | string
    padX?: number
    padY?: number
    margin?: number | string

    bg?: string
    color?: string

    width?: number | string
    height?: number | string
    minWidth?: number | string
    minHeight?: number | string
    maxWidth?: number | string
    maxHeight?: number | string

    radius?: number
    border?: string

    gap?: number
    align?: 'start' | 'center' | 'end' | 'stretch'
    justify?: 'start' | 'center' | 'end' | 'between' | 'around'
    wrap?: boolean
    grow?: boolean
}

function createFlexContainer(direction?: 'row' | 'column') {
    return (props: BoxProps, ...children: AramNode[]): HTMLElement => {
        const el = createFlexBox(direction)

        applyCommonStyles(el, props)

        if (props.gap !== undefined) el.style.gap = `${props.gap}px`
        if (props.wrap) el.style.flexWrap = 'wrap'
        if (props.grow) el.style.flexGrow = '1'

        const alignMap = { start: 'flex-start', center: 'center', end: 'flex-end', stretch: 'stretch' }
        const justifyMap = { start: 'flex-start', center: 'center', end: 'flex-end', between: 'space-between', around: 'space-around' }

        if (props.align) el.style.alignItems = alignMap[props.align]
        if (props.justify) el.style.justifyContent = justifyMap[props.justify]

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
