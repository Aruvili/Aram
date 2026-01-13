import { state, type State } from './state'
import type { ValidationRule } from './validators'

export interface FieldState<T = any> {
    value: State<T>
    error: State<string | null>
    touched: State<boolean>
    dirty: State<boolean>
    validating: State<boolean>
}

export function createField<T>(
    initialValue: T,
    validators: ValidationRule[] = []
): FieldState<T> & {
    validate: () => Promise<boolean>
    reset: () => void
} {
    const fieldState: FieldState<T> = {
        value: state(initialValue),
        error: state<string | null>(null),
        touched: state(false),
        dirty: state(false),
        validating: state(false)
    }

    const validate = async (): Promise<boolean> => {
        fieldState.validating.set(true)

        const currentValue = fieldState.value.get()

        for (const validator of validators) {
            const error = await validator.validate(currentValue)
            if (error) {
                fieldState.error.set(error)
                fieldState.validating.set(false)
                return false
            }
        }

        fieldState.error.set(null)
        fieldState.validating.set(false)
        return true
    }

    const reset = () => {
        fieldState.value.set(initialValue)
        fieldState.error.set(null)
        fieldState.touched.set(false)
        fieldState.dirty.set(false)
        fieldState.validating.set(false)
    }

    fieldState.value.subscribe(() => {
        fieldState.dirty.set(true)
        if (fieldState.touched.get()) {
            validate()
        }
    })

    return {
        ...fieldState,
        validate,
        reset
    }
}

export interface FormConfig {
    onSubmit: (data: Record<string, any>) => void | Promise<void>
    onError?: (errors: Record<string, string>) => void
    validateOnBlur?: boolean
    validateOnChange?: boolean
}

export function createForm(
    fields: Record<string, FieldState>,
    config: FormConfig
) {
    const submitting = state(false)
    const submitCount = state(0)

    const validateAll = async (): Promise<boolean> => {
        let isValid = true
        const errors: Record<string, string> = {}

        for (const [name, field] of Object.entries(fields)) {
            field.touched.set(true)

            if ('validate' in field && typeof field.validate === 'function') {
                const valid = await (field as any).validate()
                if (!valid) {
                    isValid = false
                    const error = field.error.get()
                    if (error) errors[name] = error
                }
            }
        }

        if (!isValid && config.onError) {
            config.onError(errors)
        }

        return isValid
    }

    const submit = async () => {
        submitting.set(true)
        submitCount.set(submitCount.get() + 1)

        const isValid = await validateAll()

        if (isValid) {
            const data: Record<string, any> = {}
            for (const [name, field] of Object.entries(fields)) {
                data[name] = field.value.get()
            }

            await config.onSubmit(data)
        }

        submitting.set(false)
    }

    const reset = () => {
        for (const field of Object.values(fields)) {
            if ('reset' in field && typeof field.reset === 'function') {
                (field as any).reset()
            }
        }
        submitCount.set(0)
    }

    return {
        submit,
        reset,
        validateAll,
        submitting,
        submitCount
    }
}
