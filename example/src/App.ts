import {state, AramApp, Box, Row, Column, Center, Title, Text, Button, Image} from 'aram'

export function App() {
    const count = state(0)

    return AramApp(
        Box({
            height: '100vh',
            bg: 'linear-gradient(135deg, #1a2e1bff 0%, #101a0fff 100%)'
        },
            Center({
                width: '100%',
                height: '100%'
            },
                Column({ gap: 32, align: 'center' },
                    Center({},
                        Image({src: '/assets/aruvili.svg', size: 100})
                    ),

                    Center({},
                        Title({ size: 56, weight: 'bold', color: 'white', align: 'center' },
                            'Aram'
                        )
                    ),

                    Center({},
                        Text({ size: 22, color: 'rgba(203, 34, 34, 0.7)', align: 'center' },
                            'UI Framework'
                        )
                    ),

                    Center({},
                        Box({},
                            Center({},
                                Row({ gap: 24 },
                                    Button({
                                        pad: 24,
                                        radius: 50,
                                        bg: '#ef5350',
                                        onClick: () => count.set(c => c - 1)
                                    }, '−'),
                                    Box({ width: 80, align: 'center' },
                                        Text({ size: 48, color: 'white', weight: 'bold', align: 'center' },
                                            count.$()
                                        )
                                    ),
                                    Button({
                                        pad: 24,
                                        radius: 50,
                                        bg: '#66bb6a',
                                        onClick: () => count.set(c => c + 1)
                                    }, '+')
                                )
                            )
                        )
                    ),

                    Center({},
                        Text({ size: 14, color: 'rgba(255,255,255,0.4)', align: 'center' },
                            '© 2025 Aruvili'
                        )
                    )
                )
            )
        )
    )
}
