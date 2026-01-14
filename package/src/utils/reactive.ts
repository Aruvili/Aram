import { isState, type State } from '../core/state'
import { registerCleanup } from '../core/lifecycle'

export function bindValueToProperty(
    stateOrValue: State<any> | any,
    element: HTMLElement,
    property: string
): void {
    if (isState(stateOrValue)) {
        const update = () => {
            ; (element as any)[property] = stateOrValue.get()
        }
        update()
        const unsub = stateOrValue.subscribe(update)
        registerCleanup(element, unsub)
    } else {
        ; (element as any)[property] = stateOrValue
    }
}

export function bindValueToAttribute(
    stateOrValue: State<any> | any,
    element: HTMLElement,
    attribute: string
): void {
    if (isState(stateOrValue)) {
        const update = () => {
            element.setAttribute(attribute, String(stateOrValue.get()))
        }
        update()
        const unsub = stateOrValue.subscribe(update)
        registerCleanup(element, unsub)
    } else {
        element.setAttribute(attribute, String(stateOrValue))
    }
}

export function bindValueToStyle(
    stateOrValue: State<any> | any,
    element: HTMLElement,
    styleProperty: string
): void {
    if (isState(stateOrValue)) {
        const update = () => {
            ; (element.style as any)[styleProperty] = String(stateOrValue.get())
        }
        update()
        const unsub = stateOrValue.subscribe(update)
        registerCleanup(element, unsub)
    } else {
        ; (element.style as any)[styleProperty] = String(stateOrValue)
    }
}

export function subscribeWithCleanup<T>(
    state: State<T>,
    element: HTMLElement,
    callback: (value: T) => void
): void {
    const unsub = state.subscribe(() => callback(state.get()))
    registerCleanup(element, unsub)
    callback(state.get()) // Initial call
}
