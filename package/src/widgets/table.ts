import { createElement } from '../core/render'
import { getTheme } from './theme'
import { state } from '../core/state'
import { registerCleanup } from '../core/lifecycle'

export interface TableColumn<T> {
    key: keyof T | string
    header: string
    width?: string
    align?: 'left' | 'center' | 'right'
    sortable?: boolean
    render?: (value: unknown, row: T, index: number) => HTMLElement | string
}

export interface DataTableProps<T> {
    data: T[]
    columns: TableColumn<T>[]
    selectable?: boolean
    onSelect?: (selected: T[]) => void
    striped?: boolean
    hoverable?: boolean
    bordered?: boolean
    compact?: boolean
    emptyMessage?: string
}

export function DataTable<T extends Record<string, unknown>>(props: DataTableProps<T>): HTMLElement {
    const t = getTheme()
    const padding = props.compact ? '8px 12px' : '12px 16px'

    const selectedIndices = state<Set<number>>(new Set())

    const sortState = state<{ key: keyof T | string | null; direction: 'asc' | 'desc' }>({ key: null, direction: 'asc' })

    const wrapper = createElement('div', {
        style: {
            width: '100%',
            overflow: 'auto',
            border: props.bordered ? `1px solid ${t.border}` : 'none',
            borderRadius: props.bordered ? '8px' : '0'
        }
    })

    const table = createElement('table', {
        style: {
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '14px'
        }
    })
    const thead = createElement('thead', {})
    const headerRow = createElement('tr', {
        style: { backgroundColor: t.bgSubtle }
    })

    if (props.selectable) {
        const th = createElement('th', { style: { padding, width: '40px' } })
        const headerCheckbox = createElement('input', {
            type: 'checkbox',
            onchange: (e: Event) => {
                const checked = (e.target as HTMLInputElement).checked
                if (checked) {
                    selectedIndices.set(new Set(props.data.map((_, i) => i)))
                    props.onSelect?.(props.data)
                } else {
                    selectedIndices.set(new Set())
                    props.onSelect?.([])
                }
                // Update all row checkboxes
                updateRowCheckboxes()
            }
        }) as HTMLInputElement
        th.appendChild(headerCheckbox)
        headerRow.appendChild(th)
    }

    const sortedData = () => {
        const sort = sortState.get()
        if (!sort.key) return props.data

        return [...props.data].sort((a, b) => {
            const aVal = a[sort.key as keyof T]
            const bVal = b[sort.key as keyof T]

            if (aVal == null && bVal == null) return 0
            if (aVal == null) return 1
            if (bVal == null) return -1

            let comparison = 0
            if (typeof aVal === 'number' && typeof bVal === 'number') {
                comparison = aVal - bVal
            } else {
                comparison = String(aVal).localeCompare(String(bVal))
            }

            return sort.direction === 'asc' ? comparison : -comparison
        })
    }

    props.columns.forEach(col => {
        const th = createElement('th', {
            style: {
                padding,
                textAlign: col.align || 'left',
                width: col.width,
                color: t.muted,
                fontWeight: '500',
                fontSize: '12px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                borderBottom: `1px solid ${t.border}`,
                cursor: col.sortable ? 'pointer' : 'default'
            }
        })

        const headerContent = createElement('span', {
            style: { display: 'flex', alignItems: 'center', gap: '4px' }
        })
        headerContent.appendChild(document.createTextNode(col.header))

        if (col.sortable) {
            const sortIcon = createElement('span', {
                style: { opacity: '0.5', fontSize: '10px' }
            }, '↕')
            headerContent.appendChild(sortIcon)

            th.onclick = () => {
                const current = sortState.get()
                const newDirection = current.key === col.key && current.direction === 'asc' ? 'desc' : 'asc'
                sortState.set({ key: col.key, direction: newDirection })
                renderTableBody()
            }
        }

        th.appendChild(headerContent)
        headerRow.appendChild(th)
    })
    thead.appendChild(headerRow)
    table.appendChild(thead)

    const tbody = createElement('tbody', {})
    let rowCheckboxes: HTMLInputElement[] = []

    const updateRowCheckboxes = () => {
        const selected = selectedIndices.get()
        rowCheckboxes.forEach((checkbox, index) => {
            checkbox.checked = selected.has(index)
        })
    }

    const renderTableBody = () => {
        tbody.innerHTML = ''
        rowCheckboxes = []
        const dataToRender = sortedData()

        if (dataToRender.length === 0) {
            const emptyRow = createElement('tr', {})
            const emptyCell = createElement('td', {
                style: {
                    padding: '32px',
                    textAlign: 'center',
                    color: t.muted,
                    fontSize: '14px'
                }
            }, props.emptyMessage || 'No data available')
            emptyCell.setAttribute('colspan', String(props.columns.length + (props.selectable ? 1 : 0)))
            emptyRow.appendChild(emptyCell)
            tbody.appendChild(emptyRow)
        } else {
            dataToRender.forEach((row, rowIndex) => {
                const tr = createElement('tr', {
                    style: {
                        backgroundColor: props.striped && rowIndex % 2 === 1 ? t.bgSubtle : 'transparent',
                        transition: 'background-color 0.15s'
                    }
                })

                if (props.hoverable !== false) {
                    tr.addEventListener('mouseenter', () => { tr.style.backgroundColor = t.cardHover })
                    tr.addEventListener('mouseleave', () => {
                        tr.style.backgroundColor = props.striped && rowIndex % 2 === 1 ? t.bgSubtle : 'transparent'
                    })
                }

                if (props.selectable) {
                    const td = createElement('td', { style: { padding, width: '40px' } })
                    const rowCheckbox = createElement('input', {
                        type: 'checkbox',
                        checked: selectedIndices.get().has(rowIndex),
                        onchange: (e: Event) => {
                            const checked = (e.target as HTMLInputElement).checked
                            const newSet = new Set(selectedIndices.get())
                            if (checked) {
                                newSet.add(rowIndex)
                            } else {
                                newSet.delete(rowIndex)
                            }
                            selectedIndices.set(newSet)
                            const selectedData = Array.from(newSet).map(i => props.data[i])
                            props.onSelect?.(selectedData)
                        }
                    }) as HTMLInputElement
                    rowCheckboxes.push(rowCheckbox)
                    td.appendChild(rowCheckbox)
                    tr.appendChild(td)
                }

                props.columns.forEach(col => {
                    const td = createElement('td', {
                        style: {
                            padding,
                            textAlign: col.align || 'left',
                            borderBottom: `1px solid ${t.border}`,
                            color: t.primary
                        }
                    })

                    const value = row[col.key as keyof T]
                    if (col.render) {
                        const rendered = col.render(value, row, rowIndex)
                        if (typeof rendered === 'string') {
                            td.textContent = rendered
                        } else {
                            td.appendChild(rendered)
                        }
                    } else {
                        td.textContent = String(value ?? '')
                    }

                    tr.appendChild(td)
                })

                tbody.appendChild(tr)
            })
        }
    }

    renderTableBody()

    if (props.selectable) {
        const unsub = selectedIndices.subscribe(updateRowCheckboxes)
        registerCleanup(wrapper, unsub)
    }

    table.appendChild(tbody)
    wrapper.appendChild(table)

    return wrapper
}

export interface SimpleTableProps {
    headers: string[]
    rows: (string | HTMLElement)[][]
    striped?: boolean
    hoverable?: boolean
}

export function SimpleTable(props: SimpleTableProps): HTMLElement {
    const t = getTheme()

    const table = createElement('table', {
        style: { width: '100%', borderCollapse: 'collapse', fontSize: '14px' }
    })

    const thead = createElement('thead', {})
    const headerRow = createElement('tr', { style: { backgroundColor: t.bgSubtle } })
    props.headers.forEach(h => {
        headerRow.appendChild(createElement('th', {
            style: {
                padding: '12px 16px',
                textAlign: 'left',
                color: t.muted,
                fontWeight: '500',
                fontSize: '12px',
                textTransform: 'uppercase',
                borderBottom: `1px solid ${t.border}`
            }
        }, h))
    })
    thead.appendChild(headerRow)
    table.appendChild(thead)

    const tbody = createElement('tbody', {})
    props.rows.forEach((row, i) => {
        const tr = createElement('tr', {
            style: { backgroundColor: props.striped && i % 2 === 1 ? t.bgSubtle : 'transparent' }
        })

        if (props.hoverable !== false) {
            tr.addEventListener('mouseenter', () => { tr.style.backgroundColor = t.cardHover })
            tr.addEventListener('mouseleave', () => { tr.style.backgroundColor = props.striped && i % 2 === 1 ? t.bgSubtle : 'transparent' })
        }

        row.forEach(cell => {
            const td = createElement('td', {
                style: { padding: '12px 16px', borderBottom: `1px solid ${t.border}`, color: t.primary }
            })
            if (typeof cell === 'string') {
                td.textContent = cell
            } else {
                td.appendChild(cell)
            }
            tr.appendChild(td)
        })

        tbody.appendChild(tr)
    })
    table.appendChild(tbody)

    return table
}
