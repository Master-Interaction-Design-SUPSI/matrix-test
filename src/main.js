import './style.css'

import { GRID_SIZE, HIGHLIGHT_COLOURS } from './constants.js'
import { createCanvasRenderer } from './rendering.js'
import { attachPointerTracking } from './pointerTracking.js'
import { createCursorResetState } from './cursor.js'
import { queryElement, createCursorReadout, clearCursorReadout } from './dom.js'
import { startMicrophoneVolumeTracking } from './audio.js'
import { preventGestureZoom } from './gestures.js'
import { getNextColourIndex } from './palette.js'
import { isColourShortcut, isDebugShortcut } from './keyboard.js'

const initialiseApplication = () => {
  const canvas = queryElement('#grid-canvas')
  const controlSurface = queryElement('#control-panel')
  if (!canvas || !controlSurface) return

  const renderCanvas = createCanvasRenderer(canvas, GRID_SIZE, HIGHLIGHT_COLOURS)

  let cursorState = createCursorResetState()
  let microphoneVolume = 0
  let colourIndex = 0
  let debugOverlayEnabled = false

  const readout = createCursorReadout(controlSurface)

  const renderReadout = () => {
    clearCursorReadout(readout)
  }

  const renderScene = () => {
    renderCanvas(cursorState, microphoneVolume, colourIndex, debugOverlayEnabled)
  }

  const detachPointerTracking = attachPointerTracking(controlSurface, (nextCursorState) => {
    cursorState = nextCursorState
    renderReadout()
    renderScene()
  })

  const stopVolumeTracking = startMicrophoneVolumeTracking((nextVolume) => {
    microphoneVolume = nextVolume
    renderScene()
  })

  const releaseGestureBlocker = preventGestureZoom()

  window.addEventListener('keydown', (event) => {
    const { key } = event

    if (isColourShortcut(key)) {
      colourIndex = getNextColourIndex(colourIndex, HIGHLIGHT_COLOURS)
      renderScene()
      return
    }

    if (isDebugShortcut(key)) {
      debugOverlayEnabled = !debugOverlayEnabled
      renderScene()
    }
  })

  window.addEventListener(
    'beforeunload',
    () => {
      stopVolumeTracking()
      releaseGestureBlocker()
      detachPointerTracking()
    },
    { once: true }
  )

  renderReadout()
  renderScene()
}

initialiseApplication()
