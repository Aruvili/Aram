# Aram

A UI framework for the Web.

## Quick Start

```typescript
import { AramApp, Box, Title, Text, Button, state } from 'aram'

function App() {
    const count = state(0)

    return AramApp(
        Box({ pad: 24 },
            Title({}, 'Hello Aram!'),
            Text({}, count.$()),
            Button({ onClick: () => count.set(c => c + 1) }, 'Click me')
        )
    )
}

App()
```

## Features

### Layout Widgets
- `Box` - Container with padding, margin, background
- `Row` / `Column` - Flexbox layouts
- `Center` - Center content
- `Header` / `Section` - Semantic containers

### Text Widgets
- `Title` - Headings with size, weight, color
- `Text` - Paragraphs
- `Link` - Anchor links

### Input Widgets
- `Button` - Clickable buttons with styles
- `Input` - Text inputs with events

### Media Widgets
- `Image` - Lazy loading, async decoding
- `Video` - Controls, autoplay, poster
- `Audio` - Full playback controls
- `Divider` / `Spacer` - Visual separators

### Control Flow
- `For` - List rendering
- `If` / `Show` - Conditional rendering

### Feedback
- `Spinner` / `Progress` - Loading states
- `Badge` - Labels
- `toast()` - Notifications

### Reactivity
- `state()` - Reactive state
- `.$()` - Subscribe to changes
- `.set()` - Update state

## License

MIT © Aruvili