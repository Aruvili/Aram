
const DANGEROUS_PROTOCOLS = [
    'javascript:',
    'data:text/html',
    'vbscript:',
    'file:',
    'blob:',
]

const DANGEROUS_TAGS = [
    'script', 'iframe', 'object', 'embed', 'form', 'input', 'button',
    'link', 'style', 'meta', 'base', 'applet', 'frame', 'frameset',
    'layer', 'ilayer', 'bgsound', 'xml'
]

const DANGEROUS_ATTRS = [
    'onclick', 'onerror', 'onload', 'onmouseover', 'onfocus', 'onblur',
    'onchange', 'onsubmit', 'onreset', 'onselect', 'onabort', 'ondblclick',
    'onkeydown', 'onkeypress', 'onkeyup', 'onmousedown', 'onmouseup',
    'onmousemove', 'onmouseout', 'formaction', 'xlink:href', 'action',
    'srcdoc', 'data', 'dynsrc', 'lowsrc'
]

export function isURLSafe(url: string): boolean {
    if (!url || typeof url !== 'string') return false

    const lower = url.toLowerCase().trim()

    for (const protocol of DANGEROUS_PROTOCOLS) {
        if (lower.startsWith(protocol)) {
            return false
        }
    }

    if (lower.includes('%3a') || lower.includes('&#')) {
        const decoded = decodeURIComponent(url)
        for (const protocol of DANGEROUS_PROTOCOLS) {
            if (decoded.toLowerCase().startsWith(protocol)) {
                return false
            }
        }
    }

    return true
}

export function isCSSValueSafe(value: string): boolean {
    if (!value || typeof value !== 'string') return true

    const lower = value.toLowerCase()

    if (lower.includes('url(')) {
        for (const protocol of DANGEROUS_PROTOCOLS) {
            if (lower.includes(`url("${protocol}`) ||
                lower.includes(`url('${protocol}`) ||
                lower.includes(`url(${protocol}`)) {
                return false
            }
        }
    }

    if (lower.includes('expression(')) {
        return false
    }

    if (lower.includes('behavior:')) {
        return false
    }

    return true
}

export function sanitizeHTML(html: string): string {
    const div = document.createElement('div')
    div.innerHTML = html

    for (const tag of DANGEROUS_TAGS) {
        const elements = div.getElementsByTagName(tag)
        while (elements.length > 0) {
            elements[0].parentNode?.removeChild(elements[0])
        }
    }

    const allElements = div.getElementsByTagName('*')
    for (let i = 0; i < allElements.length; i++) {
        const el = allElements[i]
        for (const attr of DANGEROUS_ATTRS) {
            el.removeAttribute(attr)
        }

        const href = el.getAttribute('href')
        const src = el.getAttribute('src')

        if (href && !isURLSafe(href)) {
            el.removeAttribute('href')
        }
        if (src && !isURLSafe(src)) {
            el.removeAttribute('src')
        }
    }

    return div.innerHTML
}

export function escapeHTML(str: string): string {
    if (!str || typeof str !== 'string') return ''

    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;')
}

export function isSafeObject(obj: unknown): boolean {
    if (obj === null || typeof obj !== 'object') return true

    const record = obj as Record<string, unknown>

    if ('__proto__' in record) return false
    if ('constructor' in record && record.constructor !== Object) return false
    if ('prototype' in record) return false

    for (const value of Object.values(record)) {
        if (!isSafeObject(value)) return false
    }

    return true
}

export function freeze<T extends object>(obj: T): Readonly<T> {
    return Object.freeze(obj)
}

export const securityLog: string[] = []

export function logSecurityEvent(event: string): void {
    const timestamp = new Date().toISOString()
    const entry = `[${timestamp}] ${event}`
    securityLog.push(entry)

    if (securityLog.length > 100) {
        securityLog.shift()
    }
}

export function generateCSP(options: {
    defaultSrc?: string[]
    scriptSrc?: string[]
    styleSrc?: string[]
    imgSrc?: string[]
    connectSrc?: string[]
}): string {
    const directives: string[] = []

    if (options.defaultSrc) {
        directives.push(`default-src ${options.defaultSrc.join(' ')}`)
    }
    if (options.scriptSrc) {
        directives.push(`script-src ${options.scriptSrc.join(' ')}`)
    }
    if (options.styleSrc) {
        directives.push(`style-src ${options.styleSrc.join(' ')}`)
    }
    if (options.imgSrc) {
        directives.push(`img-src ${options.imgSrc.join(' ')}`)
    }
    if (options.connectSrc) {
        directives.push(`connect-src ${options.connectSrc.join(' ')}`)
    }

    return directives.join('; ')
}

export function validateInput(value: string, options: {
    maxLength?: number
    pattern?: RegExp
    allowHTML?: boolean
}): { valid: boolean; sanitized: string; errors: string[] } {
    const errors: string[] = []
    let sanitized = value

    if (options.maxLength && value.length > options.maxLength) {
        errors.push(`Input exceeds maximum length of ${options.maxLength}`)
        sanitized = value.slice(0, options.maxLength)
    }

    if (options.pattern && !options.pattern.test(value)) {
        errors.push('Input does not match required pattern')
    }

    if (!options.allowHTML) {
        sanitized = escapeHTML(sanitized)
    }

    return {
        valid: errors.length === 0,
        sanitized,
        errors
    }
}

export function secureRandomString(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    const array = new Uint8Array(length)
    crypto.getRandomValues(array)

    let result = ''
    for (let i = 0; i < length; i++) {
        result += chars[array[i] % chars.length]
    }
    return result
}

let csrfToken: string | null = null

export function getCSRFToken(): string {
    if (!csrfToken) {
        csrfToken = secureRandomString(32)
    }
    return csrfToken
}

export function validateCSRFToken(token: string): boolean {
    return csrfToken !== null && token === csrfToken
}

const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

export function rateLimit(key: string, maxRequests: number, windowMs: number): boolean {
    const now = Date.now()
    const record = rateLimitMap.get(key)

    if (!record || now > record.resetTime) {
        rateLimitMap.set(key, { count: 1, resetTime: now + windowMs })
        return true
    }

    if (record.count >= maxRequests) {
        return false
    }

    record.count++
    return true
}
