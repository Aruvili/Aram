import { createElement, type AramNode } from '../core/render'
import { registerCleanup } from '../core/lifecycle'
import { type State, isState } from '../core/state'

export interface ButtonProps {
    pad?: number | string
    padX?: number
    padY?: number
    radius?: number
    bg?: string
    color?: string
    border?: string

    width?: number | string
    height?: number | string

    onClick?: () => void
    disabled?: boolean | State<boolean>
    loading?: boolean | State<boolean>
    type?: 'button' | 'submit' | 'reset'

    variant?: 'solid' | 'outline' | 'ghost'
    size?: 'sm' | 'md' | 'lg'

    shadow?: string
    cursor?: string
}

export function Button(
    props: ButtonProps = {},
    ...children: (string | AramNode)[]
): HTMLButtonElement {
    const sizes = {
        sm: { padding: '6px 12px', fontSize: '13px' },
        md: { padding: '10px 16px', fontSize: '14px' },
        lg: { padding: '12px 24px', fontSize: '16px' }
    }
    const sizeStyle = sizes[props.size || 'md']

    let padding = sizeStyle.padding
    if (props.pad !== undefined) {
        padding = typeof props.pad === 'number' ? `${props.pad}px` : props.pad
    }
    if (props.padX !== undefined || props.padY !== undefined) {
        const px = props.padX || 16
        const py = props.padY || 10
        padding = `${py}px ${px}px`
    }
    let backgroundColor = props.bg || '#4CAF50'
    let textColor = props.color || '#fff'
    let border = props.border || 'none'

    if (props.variant === 'outline') {
        backgroundColor = 'transparent'
        textColor = props.color || props.bg || '#4CAF50'
        border = `1px solid ${props.bg || 'rgba(255,255,255,0.2)'}`
    } else if (props.variant === 'ghost') {
        backgroundColor = 'transparent'
        textColor = props.color || 'inherit'
        border = 'none'
    }

    const style: Record<string, string | number | undefined> = {
        padding,
        fontSize: sizeStyle.fontSize,
        borderRadius: props.radius !== undefined ? `${props.radius}px` : '6px',
        backgroundColor,
        color: textColor,
        border,
        cursor: 'pointer',
        opacity: '1',
        fontWeight: '500',
        fontFamily: 'inherit',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        transition: 'all 0.2s ease',
        outline: 'none',
        boxShadow: props.shadow
    }

    if (props.width) {
        style.width = typeof props.width === 'number' ? `${props.width}px` : props.width
    }
    if (props.height) {
        style.height = typeof props.height === 'number' ? `${props.height}px` : props.height
    }

    const btn = document.createElement('button')
    btn.type = props.type ?? 'button'

    Object.assign(btn.style, style)

    children.forEach(child => {
        if (typeof child === 'string') {
            btn.appendChild(document.createTextNode(child))
        } else if (child instanceof Node) {
            btn.appendChild(child)
        }
    })

    let originalContent: Node[] = []

    if (props.onClick) {
        btn.addEventListener('click', () => {
            const disabled = isState(props.disabled) ? props.disabled.get() : props.disabled
            const loading = isState(props.loading) ? props.loading.get() : props.loading

            if (!disabled && !loading) {
                props.onClick!()
            }
        })
    }

    const updateButtonState = () => {
        const disabled = isState(props.disabled) ? props.disabled.get() : props.disabled
        const loading = isState(props.loading) ? props.loading.get() : props.loading

        btn.disabled = !!(disabled || loading)

        if (disabled || loading) {
            btn.style.cursor = 'not-allowed'
            btn.style.opacity = '0.6'
        } else {
            btn.style.cursor = props.cursor || 'pointer'
            btn.style.opacity = '1'
        }

        if (loading) {
            if (originalContent.length === 0) {
                originalContent = Array.from(btn.childNodes)
            }
            btn.textContent = 'Loading...'
        } else {
            if (originalContent.length > 0) {
                btn.textContent = ''
                originalContent.forEach(node => btn.appendChild(node.cloneNode(true)))
                originalContent = []
            }
        }
    }

    updateButtonState()

    if (isState(props.disabled)) {
        const unsubDisabled = props.disabled.subscribe(updateButtonState)
        registerCleanup(btn, unsubDisabled)
    }
    if (isState(props.loading)) {
        const unsubLoading = props.loading.subscribe(updateButtonState)
        registerCleanup(btn, unsubLoading)
    }

    return btn
}

export interface InputProps {
    placeholder?: string
    value?: string
    type?: 'text' | 'password' | 'email' | 'number' | 'search' | 'tel' | 'url'
    name?: string
    id?: string

    disabled?: boolean
    readonly?: boolean
    required?: boolean
    autofocus?: boolean

    pattern?: string
    minLength?: number
    maxLength?: number
    min?: number
    max?: number
    step?: number

    width?: number | string
    height?: number | string
    radius?: number
    bg?: string
    color?: string
    border?: string
    pad?: number

    onInput?: (e: InputEvent) => void
    onChange?: (e: Event) => void
    onFocus?: (e: FocusEvent) => void
    onBlur?: (e: FocusEvent) => void
    onKeyDown?: (e: KeyboardEvent) => void
}

export function Input(props: InputProps = {}): HTMLInputElement {
    const style: Record<string, string | number | undefined> = {
        padding: props.pad ? `${props.pad}px` : '10px 12px',
        borderRadius: props.radius !== undefined ? `${props.radius}px` : '6px',
        border: props.border || '1px solid rgba(255,255,255,0.1)',
        backgroundColor: props.bg || 'rgba(255,255,255,0.05)',
        color: props.color || 'inherit',
        fontSize: '14px',
        width: props.width ? (typeof props.width === 'number' ? `${props.width}px` : props.width) : '100%',
        outline: 'none',
        fontFamily: 'inherit',
        transition: 'border-color 0.2s ease'
    }

    if (props.height) {
        style.height = typeof props.height === 'number' ? `${props.height}px` : props.height
    }

    return createElement('input', {
        style,
        type: props.type ?? 'text',
        placeholder: props.placeholder,
        value: props.value,
        name: props.name,
        id: props.id,
        disabled: props.disabled,
        readonly: props.readonly,
        required: props.required,
        autofocus: props.autofocus,
        pattern: props.pattern,
        minLength: props.minLength,
        maxLength: props.maxLength,
        min: props.min,
        max: props.max,
        step: props.step,
        oninput: props.onInput,
        onchange: props.onChange,
        onfocus: props.onFocus,
        onblur: props.onBlur,
        onkeydown: props.onKeyDown
    }) as HTMLInputElement
}

export interface TextareaProps extends Omit<InputProps, 'type' | 'min' | 'max' | 'step'> {
    rows?: number
    cols?: number
    resize?: 'none' | 'both' | 'horizontal' | 'vertical'
}

export function Textarea(props: TextareaProps = {}): HTMLTextAreaElement {
    const style: Record<string, string | number | undefined> = {
        padding: props.pad ? `${props.pad}px` : '10px 12px',
        borderRadius: props.radius !== undefined ? `${props.radius}px` : '6px',
        border: props.border || '1px solid rgba(255,255,255,0.1)',
        backgroundColor: props.bg || 'rgba(255,255,255,0.05)',
        color: props.color || 'inherit',
        fontSize: '14px',
        width: props.width ? (typeof props.width === 'number' ? `${props.width}px` : props.width) : '100%',
        outline: 'none',
        fontFamily: 'inherit',
        resize: props.resize || 'vertical'
    }

    return createElement('textarea', {
        style,
        placeholder: props.placeholder,
        value: props.value,
        name: props.name,
        id: props.id,
        disabled: props.disabled,
        readonly: props.readonly,
        required: props.required,
        rows: props.rows || 4,
        cols: props.cols,
        minLength: props.minLength,
        maxLength: props.maxLength,
        oninput: props.onInput,
        onchange: props.onChange,
        onfocus: props.onFocus,
        onblur: props.onBlur
    }) as HTMLTextAreaElement
}

export interface SelectProps {
    options: { value: string; label: string; disabled?: boolean }[]
    value?: string
    placeholder?: string
    disabled?: boolean
    width?: number | string
    radius?: number
    bg?: string
    color?: string
    border?: string
    onChange?: (value: string) => void
}

export function Select(props: SelectProps): HTMLSelectElement {
    const style: Record<string, string | number | undefined> = {
        padding: '10px 12px',
        borderRadius: props.radius !== undefined ? `${props.radius}px` : '6px',
        border: props.border || '1px solid rgba(255,255,255,0.1)',
        backgroundColor: props.bg || 'rgba(255,255,255,0.05)',
        color: props.color || 'inherit',
        fontSize: '14px',
        width: props.width ? (typeof props.width === 'number' ? `${props.width}px` : props.width) : '100%',
        outline: 'none',
        fontFamily: 'inherit',
        cursor: 'pointer'
    }

    const select = createElement('select', {
        style,
        disabled: props.disabled,
        onchange: (e: Event) => props.onChange?.((e.target as HTMLSelectElement).value)
    }) as HTMLSelectElement

    if (props.placeholder) {
        select.appendChild(createElement('option', { value: '', disabled: true, selected: true }, props.placeholder))
    }

    props.options.forEach(opt => {
        select.appendChild(createElement('option', {
            value: opt.value,
            disabled: opt.disabled,
            selected: props.value === opt.value
        }, opt.label))
    })

    return select
}

export function Checkbox(props: {
    checked?: boolean
    label?: string
    disabled?: boolean
    onChange?: (checked: boolean) => void
}): HTMLElement {
    const wrapper = createElement('label', {
        style: {
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            cursor: props.disabled ? 'not-allowed' : 'pointer',
            opacity: props.disabled ? 0.6 : 1
        }
    })

    const input = createElement('input', {
        type: 'checkbox',
        checked: props.checked,
        disabled: props.disabled,
        onchange: (e: Event) => props.onChange?.((e.target as HTMLInputElement).checked),
        style: {
            width: '16px',
            height: '16px',
            cursor: 'inherit'
        }
    })

    wrapper.appendChild(input)
    if (props.label) {
        wrapper.appendChild(createElement('span', {}, props.label))
    }

    return wrapper
}
