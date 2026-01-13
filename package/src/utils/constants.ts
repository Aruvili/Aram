import type { ThemeColors } from '../widgets/theme'

export const BADGE_SIZES = {
    sm: { padding: '2px 6px', fontSize: '10px' },
    md: { padding: '4px 10px', fontSize: '12px' },
    lg: { padding: '6px 14px', fontSize: '14px' }
} as const

export function getVariantColors(theme: ThemeColors) {
    return {
        primary: theme.accent,
        success: theme.success,
        warning: theme.warning,
        error: theme.error,
        muted: theme.muted
    }
}
