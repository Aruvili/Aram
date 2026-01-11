import { createElement, type AramNode } from '../render'

export interface ButtonProps {
    pad?: number
    radius?: number
    bg?: string
    color?: string
    onClick?: () => void
    disabled?: boolean
}

export function Button(props: ButtonProps = {}, ...children: (string | AramNode)[]): HTMLElement {
    const style = {
        padding: props.pad ? `${props.pad}px` : '10px 16px',
        borderRadius: props.radius ? `${props.radius}px` : '6px',
        backgroundColor: props.bg || '#4CAF50',
        color: props.color || 'white',
        border: 'none',
        cursor: props.disabled ? 'not-allowed' : 'pointer',
        opacity: props.disabled ? 0.6 : 1,
        fontWeight: 500,
        fontSize: '14px'
    }
    return createElement('button', { style, onclick: props.onClick, disabled: props.disabled }, ...children)
}

export interface InputProps {
    placeholder?: string
    value?: string
    type?: 'text' | 'password' | 'email' | 'number'
    onInput?: (e: InputEvent) => void
    onChange?: (e: Event) => void
}

export function Input(props: InputProps = {}): HTMLElement {
    const style = {
        padding: '10px',
        borderRadius: '6px',
        border: '1px solid #ddd',
        fontSize: '14px',
        width: '100%',
        outline: 'none'
    }
    const el = createElement('input', {
        style,
        type: props.type || 'text',
        placeholder: props.placeholder,
        oninput: props.onInput,
        onchange: props.onChange
    })
    if (props.value !== undefined) {
        (el as HTMLInputElement).value = props.value
    }
    return el
}
