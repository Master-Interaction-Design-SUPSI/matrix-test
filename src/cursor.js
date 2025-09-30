import { clampToUnitInterval, safeDivide } from './math.js'
import { createGridCell } from './grid.js'

export const createCursorState = (x, y, inside) => ({ x, y, inside })

export const createCursorResetState = () => createCursorState(0, 0, false)

export const createBoundsReader = (element) => () => element.getBoundingClientRect()

export const normalisePointerEvent = (boundsReader) => (event) => {
  const bounds = boundsReader()
  const offsetX = event.clientX - bounds.left
  const offsetY = event.clientY - bounds.top

  const x = clampToUnitInterval(safeDivide(offsetX, bounds.width))
  const y = clampToUnitInterval(safeDivide(offsetY, bounds.height))

  return createCursorState(x, y, true)
}

export const mapCursorToGridCell = (cursor, gridSize) => {
  if (!cursor.inside) return null

  const column = Math.min(gridSize - 1, Math.floor(cursor.x * gridSize))
  const row = Math.min(gridSize - 1, Math.floor(cursor.y * gridSize))

  return createGridCell(column, row)
}
