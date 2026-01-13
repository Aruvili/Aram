import { Input } from './input'
import { createField } from '../core/form'
import { required, email, phone, minLength, creditCard } from '../core/validators'

export interface FormInputField {
    value: { get: () => string; set: (v: string) => void; subscribe: (fn: () => void) => () => void }
    error: { get: () => string | null; subscribe: (fn: () => void) => () => void }
    touched: { get: () => boolean; set: (v: boolean) => void; subscribe: (fn: () => void) => () => void }
    validate: () => Promise<boolean> | boolean
}

export interface FormInputProps {

    field?: FormInputField
    name?: string
    type?: 'text' | 'email' | 'tel' | 'password' | 'url' | 'number' | 'card'
    required?: boolean
    minLength?: number

    placeholder?: string
    disabled?: boolean
    width?: number | string
    defaultValue?: string
}

const autoFields = new Map<string, FormInputField>()

export function FormInput(props: FormInputProps): HTMLElement {
    const container = document.createElement('div')
    container.style.display = 'flex'
    container.style.flexDirection = 'column'

    let field: FormInputField

    if (props.field) {
        field = props.field
    } else if (props.name) {
        const key = props.name

        if (!autoFields.has(key)) {
            const validators = []
            if (props.required) {
                validators.push(required(`${props.placeholder || props.name} is required`))
            }

            if (props.type === 'email') {
                validators.push(email('Please enter a valid email'))
            }

            if (props.type === 'tel') {
                validators.push(phone('Please enter a valid phone number'))
            }

            if (props.type === 'card') {
                validators.push(creditCard('Invalid credit card number'))
            }

            if (props.minLength) {
                validators.push(minLength(props.minLength))
            }

            autoFields.set(key, createField(props.defaultValue || '', validators))
        }

        field = autoFields.get(key)!
    } else {
        throw new Error('FormInput requires either "field" or "name" prop')
    }

    const input = Input({
        placeholder: props.placeholder,
        type: props.type === 'card' ? 'text' : props.type,
        disabled: props.disabled,
        width: props.width,
        value: field.value.get(),
        onInput: (e) => {
            field.value.set((e.target as HTMLInputElement).value)
        },
        onBlur: () => {
            field.touched.set(true)
            field.validate()
        }
    })

    const errorDiv = document.createElement('div')
    errorDiv.style.color = '#ef4444'
    errorDiv.style.fontSize = '12px'
    errorDiv.style.paddingLeft = '4px'
    errorDiv.style.marginTop = '4px'

    const updateError = () => {
        const error = field.error.get()
        const touched = field.touched.get()
        errorDiv.textContent = (error && touched) ? error : ''
    }

    field.error.subscribe(updateError)
    field.touched.subscribe(updateError)
    updateError()

    container.appendChild(input)
    container.appendChild(errorDiv)

    return container
}

export function getFormData(fieldNames: string[]): Record<string, string> {
    const data: Record<string, string> = {}
    for (const name of fieldNames) {
        const field = autoFields.get(name)
        if (field) {
            data[name] = field.value.get()
        }
    }
    return data
}

export async function validateForm(fieldNames: string[]): Promise<boolean> {
    let isValid = true

    for (const name of fieldNames) {
        const field = autoFields.get(name)
        if (field) {
            field.touched.set(true)
            const valid = await field.validate()
            if (!valid) isValid = false
        }
    }

    return isValid
}
