export interface ThemeColors {
    bg: string
    bgSubtle: string
    card: string
    cardHover: string
    border: string
    primary: string
    muted: string
    accent: string
    success: string
    warning: string
    error: string
}

export const defaultTheme: ThemeColors = {
    bg: '#09090b',
    bgSubtle: '#18181b',
    card: '#18181b',
    cardHover: '#27272a',
    border: '#27272a',
    primary: '#fafafa',
    muted: '#a1a1aa',
    accent: '#3b82f6',
    success: '#22c55e',
    warning: '#eab308',
    error: '#ef4444'
}

let currentTheme = { ...defaultTheme }

export function setTheme(theme: Partial<ThemeColors>): void {
    currentTheme = { ...currentTheme, ...theme }
}

export function getTheme(): ThemeColors {
    return { ...currentTheme }
}

export function resetTheme(): void {
    currentTheme = { ...defaultTheme }
}
