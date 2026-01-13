export interface ValidationRule {
    validate: (value: any) => string | null | Promise<string | null>
    message?: string
}

export function required(message = 'This field is required'): ValidationRule {
    return {
        validate: (value: any) => {
            if (value === null || value === undefined || value === '') {
                return message
            }
            if (typeof value === 'string' && value.trim() === '') {
                return message
            }
            return null
        }
    }
}

export function email(message = 'Invalid email address'): ValidationRule {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return {
        validate: (value: string) => {
            if (!value) return null
            return emailRegex.test(value) ? null : message
        }
    }
}

export function minLength(min: number, message?: string): ValidationRule {
    return {
        validate: (value: string) => {
            if (!value) return null
            const msg = message || `Minimum ${min} characters required`
            return value.length >= min ? null : msg
        }
    }
}

export function maxLength(max: number, message?: string): ValidationRule {
    return {
        validate: (value: string) => {
            if (!value) return null
            const msg = message || `Maximum ${max} characters allowed`
            return value.length <= max ? null : msg
        }
    }
}

export function pattern(regex: RegExp, message = 'Invalid format'): ValidationRule {
    return {
        validate: (value: string) => {
            if (!value) return null
            return regex.test(value) ? null : message
        }
    }
}

export function min(minValue: number, message?: string): ValidationRule {
    return {
        validate: (value: number) => {
            if (value === null || value === undefined) return null
            const msg = message || `Must be at least ${minValue}`
            return value >= minValue ? null : msg
        }
    }
}

export function max(maxValue: number, message?: string): ValidationRule {
    return {
        validate: (value: number) => {
            if (value === null || value === undefined) return null
            const msg = message || `Must be at most ${maxValue}`
            return value <= maxValue ? null : msg
        }
    }
}

export function phone(message = 'Invalid phone number'): ValidationRule {
    const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/
    return {
        validate: (value: string) => {
            if (!value) return null
            return phoneRegex.test(value) ? null : message
        }
    }
}

export function creditCard(message = 'Invalid credit card number'): ValidationRule {
    return {
        validate: (value: string) => {
            if (!value) return null

            const cleaned = value.replace(/[\s-]/g, '')

            if (!/^\d+$/.test(cleaned)) return message

            let sum = 0
            let isEven = false

            for (let i = cleaned.length - 1; i >= 0; i--) {
                let digit = parseInt(cleaned[i])

                if (isEven) {
                    digit *= 2
                    if (digit > 9) digit -= 9
                }

                sum += digit
                isEven = !isEven
            }

            return sum % 10 === 0 ? null : message
        }
    }
}

export function url(message = 'Invalid URL'): ValidationRule {
    return {
        validate: (value: string) => {
            if (!value) return null
            try {
                new URL(value)
                return null
            } catch {
                return message
            }
        }
    }
}

export function match(otherValue: string, message = 'Values do not match'): ValidationRule {
    return {
        validate: (value: string) => {
            if (!value) return null
            return value === otherValue ? null : message
        }
    }
}

export function custom(
    validator: (value: any) => boolean,
    message = 'Invalid value'
): ValidationRule {
    return {
        validate: (value: any) => {
            return validator(value) ? null : message
        }
    }
}

export function asyncValidator(
    validator: (value: any) => Promise<boolean>,
    message = 'Validation failed'
): ValidationRule {
    return {
        validate: async (value: any) => {
            try {
                const isValid = await validator(value)
                return isValid ? null : message
            } catch {
                return message
            }
        }
    }
}
