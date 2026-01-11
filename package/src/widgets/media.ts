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

export function Image(props: {
    src: string,
    size?: number,
    width?: number,
    height?: number,
    objectFit?: string,
    display?: string,
    alt?: string,
    loading?: 'lazy' | 'eager',
    decoding?: 'async' | 'auto' | 'sync'
}): HTMLImageElement {

    const style = {
        width: props.size ? `${props.size}px` : props.width ? `${props.width}px` : 'auto',
        height: props.size ? `${props.size}px` : props.height ? `${props.height}px` : 'auto',
        objectFit: props.objectFit || 'contain',
        display: props.display || 'block'
    }

    return createElement('img', {
        src: props.src,
        alt: props.alt || '',
        loading: props.loading ?? 'lazy',
        decoding: props.decoding ?? 'async',
        style
    }) as HTMLImageElement
}

export function Video(props: {
    src: string,
    controls?: boolean,
    autoplay?: boolean,
    loop?: boolean,
    muted?: boolean,
    poster?: string,
    preload?: "auto" | "metadata" | "none",
    size?: number,
    display?: string,
    width?: number,
    height?: number,
    objectFit?: string
}): HTMLVideoElement {

    const style = {
        width: props.size ? `${props.size}px` : props.width ? `${props.width}px` : 'auto',
        height: props.size ? `${props.size}px` : props.height ? `${props.height}px` : 'auto',
        display: props.display || 'block',
        objectFit: props.objectFit || 'contain'
    }

    const attr: Record<string, unknown> = {
        src: props.src,
        poster: props.poster,
        preload: props.preload ?? 'metadata',
        style
    }

    if (props.controls) attr.controls = true
    if (props.autoplay) attr.autoplay = true
    if (props.loop) attr.loop = true
    if (props.muted) attr.muted = true
    else if (props.autoplay) attr.muted = true

    return createElement('video', attr) as HTMLVideoElement
}

export function Audio(props: {
    src: string,
    controls?: boolean,
    autoplay?: boolean,
    loop?: boolean,
    muted?: boolean,
    preload?: "auto" | "metadata" | "none",
    display?: string
}): HTMLAudioElement {

    const style = {
        display: props.display || 'block'
    }

    const attr: Record<string, unknown> = {
        src: props.src,
        preload: props.preload ?? 'metadata',
        style
    }

    if (props.controls) attr.controls = true
    if (props.autoplay) attr.autoplay = true
    if (props.loop) attr.loop = true
    if (props.muted) attr.muted = true

    return createElement('audio', attr) as HTMLAudioElement
}

