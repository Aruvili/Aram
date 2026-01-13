import { createElement } from '../render'

export interface SpacerProps {
    size?: number
    width?: number | string
    height?: number | string
    flex?: number | string
}

export function Divider(props: {
    color?: string
    margin?: number
    vertical?: boolean
    thickness?: number
} = {}): HTMLElement {
    const isVertical = props.vertical
    const style = {
        width: isVertical ? `${props.thickness || 1}px` : '100%',
        height: isVertical ? '100%' : `${props.thickness || 1}px`,
        backgroundColor: props.color || 'rgba(255,255,255,0.1)',
        margin: props.margin ? `${props.margin}px` : '8px 0',
        flexShrink: '0'
    }
    return createElement('div', { style })
}

export function Spacer(props: SpacerProps = {}): HTMLElement {
    const style: Record<string, string> = {}

    if (props.width) {
        style.width = typeof props.width === 'number' ? `${props.width}px` : props.width
        style.flexShrink = '0'
    }
    if (props.height) {
        style.height = typeof props.height === 'number' ? `${props.height}px` : props.height
        style.flexShrink = '0'
    }
    if (props.size) {
        style.flex = `0 0 ${props.size}px`
    }
    if (props.flex) {
        style.flex = String(props.flex)
    }

    // Default: flexible spacer
    if (!props.width && !props.height && !props.size && !props.flex) {
        style.flex = '1'
    }

    return createElement('div', { style })
}

export function Image(props: {
    src: string
    size?: number
    width?: number | string
    height?: number | string
    objectFit?: 'cover' | 'contain' | 'fill' | 'none'
    display?: string
    alt?: string
    loading?: 'lazy' | 'eager'
    decoding?: 'async' | 'auto' | 'sync'
    radius?: number
    shadow?: string
}): HTMLImageElement {
    const style: Record<string, string | undefined> = {
        display: props.display || 'block',
        objectFit: props.objectFit || 'cover'
    }

    if (props.size) {
        style.width = `${props.size}px`
        style.height = `${props.size}px`
    }
    if (props.width) {
        style.width = typeof props.width === 'number' ? `${props.width}px` : props.width
    }
    if (props.height) {
        style.height = typeof props.height === 'number' ? `${props.height}px` : props.height
    }
    if (props.radius) {
        style.borderRadius = `${props.radius}px`
    }
    if (props.shadow) {
        style.boxShadow = props.shadow
    }

    return createElement('img', {
        src: props.src,
        alt: props.alt || '',
        loading: props.loading || 'lazy',
        decoding: props.decoding || 'async',
        style
    }) as HTMLImageElement
}

export function Video(props: {
    src: string
    width?: number | string
    height?: number | string
    autoplay?: boolean
    loop?: boolean
    muted?: boolean
    controls?: boolean
    poster?: string
    radius?: number
}): HTMLVideoElement {
    const style: Record<string, string> = {}

    if (props.width) {
        style.width = typeof props.width === 'number' ? `${props.width}px` : props.width
    }
    if (props.height) {
        style.height = typeof props.height === 'number' ? `${props.height}px` : props.height
    }
    if (props.radius) {
        style.borderRadius = `${props.radius}px`
    }

    return createElement('video', {
        src: props.src,
        autoplay: props.autoplay,
        loop: props.loop,
        muted: props.muted,
        controls: props.controls ?? true,
        poster: props.poster,
        style
    }) as HTMLVideoElement
}

export function Audio(props: {
    src: string
    autoplay?: boolean
    loop?: boolean
    controls?: boolean
}): HTMLAudioElement {
    return createElement('audio', {
        src: props.src,
        autoplay: props.autoplay,
        loop: props.loop,
        controls: props.controls ?? true
    }) as HTMLAudioElement
}
