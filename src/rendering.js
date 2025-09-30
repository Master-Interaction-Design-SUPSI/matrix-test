import { getColourAtIndex } from './palette.js'
import {
  calculateHighlightRadius,
  createCircleHighlight,
  hasMeaningfulRadius,
  isCellInsideCircle,
} from './grid.js'
import { mapCursorToGridCell } from './cursor.js'
import { MINIMUM_RADIUS_DELTA } from './constants.js'

const resizeCanvasToDisplaySize = (canvas, context) => {
  const bounds = canvas.getBoundingClientRect()
  const ratio = window.devicePixelRatio || 1

  canvas.width = bounds.width * ratio
  canvas.height = bounds.height * ratio

  context.setTransform(1, 0, 0, 1, 0, 0)
  context.scale(ratio, ratio)

  return { width: bounds.width, height: bounds.height }
}

const createGridPainter = (context, gridSize) => (dimensions, activeCircle) => {
  const { width, height } = dimensions
  const cellWidth = width / gridSize
  const cellHeight = height / gridSize

  context.clearRect(0, 0, width, height)

  const baseColour = '#2a2a2a'
  const activeColour = activeCircle ? activeCircle.colour : '#3a3a3a'

  for (let row = 0; row < gridSize; row += 1) {
    for (let column = 0; column < gridSize; column += 1) {
      const cellIsActive = activeCircle && isCellInsideCircle(activeCircle, column, row)
      context.fillStyle = cellIsActive ? activeColour : baseColour
      context.fillRect(column * cellWidth, row * cellHeight, cellWidth, cellHeight)
    }
  }
}

const createDebugOverlayPainter = (context, gridSize) => (dimensions, overlay) => {
  if (!overlay) return

  const { width, height } = dimensions
  const cellWidth = width / gridSize
  const cellHeight = height / gridSize

  const x0 = overlay.column * cellWidth
  const y0 = overlay.row * cellHeight
  const x1 = x0 + cellWidth
  const y1 = y0 + cellHeight

  const cx = (x0 + x1) / 2
  const cy = (y0 + y1) / 2

  const strokeWidth = Math.min(cellWidth, cellHeight) * 0.02
  const margin = Math.min(cellWidth, cellHeight) * 0.18

  context.save()
  context.strokeStyle = overlay.colour
  context.lineWidth = strokeWidth
  context.lineCap = 'butt'
  context.lineJoin = 'miter'

  context.strokeRect(x0 + strokeWidth / 2, y0 + strokeWidth / 2, cellWidth - strokeWidth, cellHeight - strokeWidth)

  context.beginPath()
  context.moveTo(x0 + margin, cy)
  context.lineTo(x1 - margin, cy)
  context.stroke()

  context.beginPath()
  context.moveTo(cx, y0 + margin)
  context.lineTo(cx, y1 - margin)
  context.stroke()

  context.restore()
}

const circlesAreEqual = (current, next) => {
  if (!current && !next) return true
  if (!current || !next) return false
  const samePosition = current.column === next.column && current.row === next.row
  const sameRadius = Math.abs(current.radius - next.radius) < MINIMUM_RADIUS_DELTA
  const sameColour = current.colour === next.colour
  return samePosition && sameRadius && sameColour
}

const overlaysAreEqual = (current, next) => {
  if (!current && !next) return true
  if (!current || !next) return false
  const samePosition = current.column === next.column && current.row === next.row
  const sameColour = current.colour === next.colour
  return samePosition && sameColour
}

export const createCanvasRenderer = (canvas, gridSize, colours) => {
  const context = canvas.getContext('2d')
  if (!context) return () => {}

  const paintGrid = createGridPainter(context, gridSize)
  const paintOverlay = createDebugOverlayPainter(context, gridSize)

  let dimensions = resizeCanvasToDisplaySize(canvas, context)
  let activeCircle = null
  let activeOverlay = null

  const repaint = () => {
    paintGrid(dimensions, activeCircle)
    paintOverlay(dimensions, activeOverlay)
  }

  const update = (cursor, volume, colourIndex, debugEnabled) => {
    const cell = mapCursorToGridCell(cursor, gridSize)
    const radius = cell ? calculateHighlightRadius(volume, gridSize) : 0
    const highlightColour = getColourAtIndex(colourIndex, colours)
    const shouldShowCircle = cell && hasMeaningfulRadius(radius)
    const nextCircle = shouldShowCircle
      ? createCircleHighlight(cell.column, cell.row, radius, highlightColour)
      : null
    const nextOverlay = debugEnabled && cell ? { column: cell.column, row: cell.row, colour: highlightColour } : null

    if (circlesAreEqual(activeCircle, nextCircle) && overlaysAreEqual(activeOverlay, nextOverlay)) return

    activeCircle = nextCircle
    activeOverlay = nextOverlay
    repaint()
  }

  const handleResize = () => {
    dimensions = resizeCanvasToDisplaySize(canvas, context)
    repaint()
  }

  window.addEventListener('resize', handleResize)
  repaint()

  return update
}
