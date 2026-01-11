import {
    state,
    AramApp,
    Header, Section, Box, Row, Column, Center,
    Title, Text,
    Button, Input,
    For, If,
    Badge, Spinner, Progress, toast,
    Divider
} from 'aram'

export function App() {
    const count = state(0)
    const level = state(1)
    const loading = state(false)
    const name = state('')

    const handleLoad = () => {
        loading.set(true)
        setTimeout(() => {
            loading.set(false)
            toast('loaded!', { type: 'success' })
        }, 2000)
    }

    return AramApp(
        Header({
            pad: 24,
            bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            align: 'center'
        },
            Title({ size: 32, weight: 'bold', color: 'white' }, 'Aram Test'),
            Text({ size: 16, color: 'rgba(255,255,255,0.8)', margin: 4 }, 'UI Framwork'),
            Row({ gap: 8 },
                Badge({ bg: '#00C853' }, 'v0.2.0')
            )
        ),

        Section({ pad: 24 },
            Box({ bg: 'rgba(255,255,255,0.1)', pad: 20, radius: 16 },
                Title({ size: 20, color: 'white' }, 'Counter'),
                Center({},
                    Row({ gap: 16 },
                        Button({ bg: '#F44336', onClick: () => count.set((c: number) => c - 1) }, '−'),
                        Text({ size: 48, color: 'white', weight: 'bold' }, String(count.get())),
                        Button({ bg: '#4CAF50', onClick: () => count.set((c: number) => c + 1) }, '+')
                    )
                )
            ),

            Divider({ color: 'rgba(255,255,255,0.1)', margin: 16 }),

            Box({ bg: 'rgba(255,255,255,0.1)', pad: 20, radius: 16 },
                Title({ size: 20, color: 'white' }, 'Level selector'),
                Row({ gap: 8 },
                    For([1, 2, 3, 4, 5], (n: number) =>
                        Button({
                            bg: level.get() === n ? '#FF4081' : 'rgba(255,255,255,0.2)',
                            onClick: () => { level.set(n); toast(`Level ${n}!`, { type: 'info' }) }
                        }, `${n}`)
                    )
                ),
                Progress({ value: level.get() * 20, color: '#FF4081' })
            ),

            Divider({ color: 'rgba(255,255,255,0.1)', margin: 16 }),

            Box({ bg: 'rgba(255,255,255,0.1)', pad: 20, radius: 16 },
                Title({ size: 20, color: 'white' }, 'Input'),
                Column({ gap: 12 },
                    Input({ placeholder: 'Your name...', onInput: (e: InputEvent) => name.set((e.target as HTMLInputElement).value) }),
                    If(name.get().length > 0,
                        () => Text({ color: '#4CAF50' }, `hello, ${name.get()}!`),
                        () => Text({ color: 'rgba(255,255,255,0.5)' }, 'type something...')
                    )
                )
            ),

            Divider({ color: 'rgba(255,255,255,0.1)', margin: 16 }),

            Box({ bg: 'rgba(255,255,255,0.1)', pad: 20, radius: 16 },
                Title({ size: 20, color: 'white' }, 'async'),
                Center({},
                    If(loading.get(),
                        () => Spinner({ size: 32, color: '#667eea' }),
                        () => Button({ bg: '#667eea', onClick: handleLoad }, 'load')
                    )
                )
            )
        )
    )
}
