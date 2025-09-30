# Interaction Demo Agent Brief

## Purpose
- Maintain a kiosk-grade browser experience that showcases coordinated mouse, keyboard, and microphone inputs.
- Keep the layout unbreakable on any viewport by respecting the calculated unit system already in `style.css`.
- Demonstrate functional-programming clarity in all runtime logic so the demo stays easy to reason about and extend.

## Design Principles
- **Functional first:** express behaviour as small pure functions, favour data-in/data-out helpers, and isolate side-effects (DOM, canvas, audio) at the edges.
- **Deterministic rendering:** canvas drawings should derive entirely from explicit state objects (`cursorState`, `volume`, `colourIndex`). No hidden globals, no imperative mutations mid-frame.
- **Viewport resilience:** never hardcode pixel dimensions; use the CSS custom properties and `resizeCanvas` utility to keep both panels perfectly squared and aligned.
- **Stateless styling:** avoid adding extra DOM wrappers or ad-hoc CSS. Extend the existing palette and surfaces only when absolutely necessary.

## Interaction Guidelines
- **Mouse:** treat pointer events as normalized 0–1 coordinates from `#ui` and translate downstream (grid cells, shapes) with pure transformers.
- **Keyboard:** continue key handling through declarative guards (`isLetterKey`, etc.). Each handler should update state, then trigger a single repaint via the shared `apply` pathway.
- **Microphone:** rely on the analyser-based volume stream. If adding audio features, keep processing within the existing animation frame loop and expose the result as a scalar or tagged state object.

## Extension Checklist
- Preserve the `apply()` pattern so every new state dimension flows through one render pass.
- Validate new state fields in the reducers before they reach canvas drawing.
- Prefer const and small helpers over class-like structures.
- Document new behaviours inline with concise comments rather than large blocks of prose.
- Test on multiple viewport sizes after each change; the kiosk assumption forbids scrollbars or layout drift.

## Anti-Goals
- No mutable singletons that hide state transitions.
- No third-party UI frameworks; keep dependencies minimal.
- No visual gaps or borders inside the grid unless explicitly required by the demo narrative.
- No silent failures: surface permission errors or unsupported APIs with lightweight, user-facing messaging if needed.
