import { MINIMUM_RADIUS_DELTA, VOLUME_GAIN, VOLUME_THRESHOLD } from './constants.js'

export const createGridCell = (column, row) => ({ column, row })

export const createCircleHighlight = (column, row, radius, colour) => ({
  column,
  row,
  radius,
  colour,
})

export const calculateHighlightRadius = (volume, gridSize) => {
  const audibleVolume = Math.max(0, volume - VOLUME_THRESHOLD)
  const amplifiedVolume = Math.sqrt(audibleVolume) * VOLUME_GAIN
  return Math.min(gridSize / 2, amplifiedVolume)
}

export const hasMeaningfulRadius = (radius) => radius > MINIMUM_RADIUS_DELTA

export const isCellInsideCircle = (circle, column, row) => {
  const offsetX = column - circle.column
  const offsetY = row - circle.row
  return Math.hypot(offsetX, offsetY) <= circle.radius
}
