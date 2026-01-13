import { createElement, type AramNode } from '../render'

export interface BoxProps {
    pad?: number | string
    padX?: number
    padY?: number
    margin?: number | string
    gap?: number

    width?: number | string
    height?: number | string
    minWidth?: number | string
    maxWidth?: number | string
    minHeight?: number | string
    maxHeight?: number | string

    bg?: string
    color?: string

    radius?: number
    border?: string
    borderColor?: string
    borderTop?: string
    borderRight?: string
    borderBottom?: string
    borderLeft?: string

    align?: 'left' | 'center' | 'right'

    flex?: number | string
    flexShrink?: number
    flexGrow?: number

    shadow?: string
    opacity?: number
    overflow?: 'hidden' | 'auto' | 'scroll' | 'visible'

    cursor?: string

    position?: 'relative' | 'absolute' | 'fixed' | 'sticky'
    top?: number | string
    right?: number | string
    bottom?: number | string
    left?: number | string
    zIndex?: number
}

function buildBoxStyle(props: BoxProps): Record<string, string | number | undefined> {
    const style: Record<string, string | number | undefined> = {}

    if (props.pad !== undefined) {
        style.padding = typeof props.pad === 'number' ? `${props.pad}px` : props.pad
    }
    if (props.padX !== undefined) {
        style.paddingLeft = `${props.padX}px`
        style.paddingRight = `${props.padX}px`
    }
    if (props.padY !== undefined) {
        style.paddingTop = `${props.padY}px`
        style.paddingBottom = `${props.padY}px`
    }

    if (props.margin !== undefined) {
        style.margin = typeof props.margin === 'number' ? `${props.margin}px` : props.margin
    }

    if (props.gap !== undefined) {
        style.gap = `${props.gap}px`
    }

    if (props.width !== undefined) {
        style.width = typeof props.width === 'number' ? `${props.width}px` : props.width
    }
    if (props.height !== undefined) {
        style.height = typeof props.height === 'number' ? `${props.height}px` : props.height
    }
    if (props.minWidth !== undefined) {
        style.minWidth = typeof props.minWidth === 'number' ? `${props.minWidth}px` : props.minWidth
    }
    if (props.maxWidth !== undefined) {
        style.maxWidth = typeof props.maxWidth === 'number' ? `${props.maxWidth}px` : props.maxWidth
    }
    if (props.minHeight !== undefined) {
        style.minHeight = typeof props.minHeight === 'number' ? `${props.minHeight}px` : props.minHeight
    }
    if (props.maxHeight !== undefined) {
        style.maxHeight = typeof props.maxHeight === 'number' ? `${props.maxHeight}px` : props.maxHeight
    }

    if (props.bg) style.backgroundColor = props.bg
    if (props.color) style.color = props.color

    if (props.radius !== undefined) style.borderRadius = `${props.radius}px`
    if (props.border) style.border = props.border
    if (props.borderColor) style.borderColor = props.borderColor
    if (props.borderTop) style.borderTop = props.borderTop
    if (props.borderRight) style.borderRight = props.borderRight
    if (props.borderBottom) style.borderBottom = props.borderBottom
    if (props.borderLeft) style.borderLeft = props.borderLeft

    if (props.align) style.textAlign = props.align

    if (props.flex !== undefined) style.flex = String(props.flex)
    if (props.flexShrink !== undefined) style.flexShrink = String(props.flexShrink)
    if (props.flexGrow !== undefined) style.flexGrow = String(props.flexGrow)

    if (props.shadow) style.boxShadow = props.shadow
    if (props.opacity !== undefined) style.opacity = props.opacity
    if (props.overflow) style.overflow = props.overflow
    if (props.cursor) style.cursor = props.cursor

    if (props.position) style.position = props.position
    if (props.top !== undefined) style.top = typeof props.top === 'number' ? `${props.top}px` : props.top
    if (props.right !== undefined) style.right = typeof props.right === 'number' ? `${props.right}px` : props.right
    if (props.bottom !== undefined) style.bottom = typeof props.bottom === 'number' ? `${props.bottom}px` : props.bottom
    if (props.left !== undefined) style.left = typeof props.left === 'number' ? `${props.left}px` : props.left
    if (props.zIndex !== undefined) style.zIndex = props.zIndex

    return style
}

export function Box(props: BoxProps = {}, ...children: (AramNode | string | null)[]): HTMLElement {
    return createElement('div', { style: buildBoxStyle(props) }, ...children.filter(c => c !== null))
}

export function Row(props: BoxProps & {
    wrap?: boolean
    justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'
    items?: 'start' | 'center' | 'end' | 'stretch' | 'baseline'
} = {}, ...children: (AramNode | string | null)[]): HTMLElement {
    const justifyMap = {
        start: 'flex-start',
        center: 'center',
        end: 'flex-end',
        between: 'space-between',
        around: 'space-around',
        evenly: 'space-evenly'
    }
    const itemsMap = {
        start: 'flex-start',
        center: 'center',
        end: 'flex-end',
        stretch: 'stretch',
        baseline: 'baseline'
    }

    const style: Record<string, string | number | undefined> = {
        ...buildBoxStyle(props),
        display: 'flex',
        flexDirection: 'row',
        alignItems: props.items ? itemsMap[props.items] : 'center',
        justifyContent: props.justify ? justifyMap[props.justify] : undefined,
        flexWrap: props.wrap ? 'wrap' : undefined
    }
    return createElement('div', { style }, ...children.filter(c => c !== null))
}

export function Column(props: BoxProps & {
    justify?: 'start' | 'center' | 'end' | 'between' | 'around'
    items?: 'start' | 'center' | 'end' | 'stretch'
} = {}, ...children: (AramNode | string | null)[]): HTMLElement {
    const justifyMap = {
        start: 'flex-start',
        center: 'center',
        end: 'flex-end',
        between: 'space-between',
        around: 'space-around'
    }
    const itemsMap = {
        start: 'flex-start',
        center: 'center',
        end: 'flex-end',
        stretch: 'stretch'
    }

    const style: Record<string, string | number | undefined> = {
        ...buildBoxStyle(props),
        display: 'flex',
        flexDirection: 'column',
        justifyContent: props.justify ? justifyMap[props.justify] : undefined,
        alignItems: props.items ? itemsMap[props.items] : undefined
    }
    return createElement('div', { style }, ...children.filter(c => c !== null))
}

export function Center(props: BoxProps = {}, ...children: (AramNode | string | null)[]): HTMLElement {
    const style = {
        ...buildBoxStyle(props),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    }
    return createElement('div', { style }, ...children.filter(c => c !== null))
}

export function Header(props: BoxProps = {}, ...children: (AramNode | string | null)[]): HTMLElement {
    return createElement('header', { style: buildBoxStyle(props) }, ...children.filter(c => c !== null))
}

export function Section(props: BoxProps = {}, ...children: (AramNode | string | null)[]): HTMLElement {
    return createElement('section', { style: buildBoxStyle(props) }, ...children.filter(c => c !== null))
}

export function Grid(props: BoxProps & {
    cols?: number | string
    rows?: number | string
    areas?: string
    autoRows?: string
    autoCols?: string
} = {}, ...children: (AramNode | string | null)[]): HTMLElement {
    const style: Record<string, string | number | undefined> = {
        ...buildBoxStyle(props),
        display: 'grid'
    }

    if (props.cols !== undefined) {
        style.gridTemplateColumns = typeof props.cols === 'number'
            ? `repeat(${props.cols}, 1fr)`
            : props.cols
    }
    if (props.rows !== undefined) {
        style.gridTemplateRows = typeof props.rows === 'number'
            ? `repeat(${props.rows}, 1fr)`
            : props.rows
    }
    if (props.areas) style.gridTemplateAreas = props.areas
    if (props.autoRows) style.gridAutoRows = props.autoRows
    if (props.autoCols) style.gridAutoColumns = props.autoCols

    return createElement('div', { style }, ...children.filter(c => c !== null))
}
