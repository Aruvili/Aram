import type { AramNode } from '../render'

export function For<T>(items: T[], render: (item: T, index: number) => AramNode): AramNode[] {
    return items.map((item, i) => render(item, i))
}

export function If(condition: boolean, then: () => AramNode, otherwise?: () => AramNode): AramNode | null {
    return condition ? then() : (otherwise?.() ?? null)
}

export function Show(when: boolean, children: AramNode): AramNode | null {
    return when ? children : null
}
