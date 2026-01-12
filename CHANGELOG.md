# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.0] - 2025-01-12

### Added
- **Core Framework**
  - `AramApp` - Application wrapper
  - Reactive `state()` system with `$()` subscriptions
  - `createElement` and `mount` utilities

- **Layout Widgets**
  - `Box`, `Row`, `Column`, `Center`
  - `Header`, `Section`

- **Text Widgets**
  - `Title`, `Text`, `Link`

- **Input Widgets**
  - `Button` with type, disabled, and click handlers
  - `Input` with placeholder, type, and event handlers

- **Media Widgets**
  - `Image` with lazy loading and async decoding
  - `Video` with controls, autoplay, loop, muted, poster, preload
  - `Audio` with full playback controls
  - `Divider`, `Spacer`

- **Control Flow**
  - `For` - List rendering
  - `If`, `Show` - Conditional rendering

- **Feedback Widgets**
  - `Spinner`, `Progress`, `Badge`
  - `toast()` notifications

- **Tooling**
  - `create-aram` CLI for project scaffolding
  - Vite-based development setup
  - TypeScript support
