export interface BoxStyleProps {
    pad?: number | string
    padX?: number
    padY?: number
    margin?: number | string
    marginX?: number
    marginY?: number
}

export interface ColorStyleProps {
    bg?: string
    color?: string
}

export interface SizeStyleProps {
    width?: number | string
    height?: number | string
    minWidth?: number | string
    minHeight?: number | string
    maxWidth?: number | string
    maxHeight?: number | string
}

export interface BorderStyleProps {
    radius?: number
    border?: string
    borderTop?: string
    borderBottom?: string
    borderLeft?: string
    borderRight?: string
}

export function toPx(value: number | string): string {
    return typeof value === 'number' ? `${value}px` : value
}

export function applyBoxStyles(element: HTMLElement, props: BoxStyleProps): void {
    const style = element.style

    if (props.pad !== undefined) {
        style.padding = toPx(props.pad)
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
        style.margin = toPx(props.margin)
    }
    if (props.marginX !== undefined) {
        style.marginLeft = `${props.marginX}px`
        style.marginRight = `${props.marginX}px`
    }
    if (props.marginY !== undefined) {
        style.marginTop = `${props.marginY}px`
        style.marginBottom = `${props.marginY}px`
    }
}

export function applyColorStyles(element: HTMLElement, props: ColorStyleProps): void {
    if (props.bg) element.style.backgroundColor = props.bg
    if (props.color) element.style.color = props.color
}

export function applySizeStyles(element: HTMLElement, props: SizeStyleProps): void {
    const style = element.style

    if (props.width !== undefined) style.width = toPx(props.width)
    if (props.height !== undefined) style.height = toPx(props.height)
    if (props.minWidth !== undefined) style.minWidth = toPx(props.minWidth)
    if (props.minHeight !== undefined) style.minHeight = toPx(props.minHeight)
    if (props.maxWidth !== undefined) style.maxWidth = toPx(props.maxWidth)
    if (props.maxHeight !== undefined) style.maxHeight = toPx(props.maxHeight)
}

export function applyBorderStyles(element: HTMLElement, props: BorderStyleProps): void {
    const style = element.style

    if (props.radius !== undefined) style.borderRadius = `${props.radius}px`
    if (props.border) style.border = props.border
    if (props.borderTop) style.borderTop = props.borderTop
    if (props.borderBottom) style.borderBottom = props.borderBottom
    if (props.borderLeft) style.borderLeft = props.borderLeft
    if (props.borderRight) style.borderRight = props.borderRight
}

export function applyCommonStyles(
    element: HTMLElement,
    props: BoxStyleProps & ColorStyleProps & SizeStyleProps & BorderStyleProps
): void {
    applyBoxStyles(element, props)
    applyColorStyles(element, props)
    applySizeStyles(element, props)
    applyBorderStyles(element, props)
}

const injectedStyles = new Set<string>()

export function injectStyles(id: string, css: string): void {
    if (!injectedStyles.has(id)) {
        const style = document.createElement('style')
        style.id = `aram-${id}`
        style.textContent = css
        document.head.appendChild(style)
        injectedStyles.add(id)
    }
}

export function removeStyles(id: string): void {
    const style = document.getElementById(`aram-${id}`)
    if (style) {
        style.remove()
        injectedStyles.delete(id)
    }
}
