import { createBoundsReader, createCursorResetState, normalisePointerEvent } from './cursor.js'

export const attachPointerTracking = (host, handleCursorChange) => {
  const readBounds = createBoundsReader(host)
  const toCursorState = normalisePointerEvent(readBounds)

  const emitCursorState = (event) => handleCursorChange(toCursorState(event))
  const emitCursorReset = () => handleCursorChange(createCursorResetState())

  host.addEventListener('mousemove', emitCursorState)
  host.addEventListener('mouseleave', emitCursorReset)

  return () => {
    host.removeEventListener('mousemove', emitCursorState)
    host.removeEventListener('mouseleave', emitCursorReset)
  }
}
