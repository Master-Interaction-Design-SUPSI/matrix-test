export const preventGestureZoom = () => {
  const blockGesture = (event) => event.preventDefault()
  const listenerOptions = { passive: false }

  window.addEventListener('gesturestart', blockGesture, listenerOptions)
  window.addEventListener('gesturechange', blockGesture, listenerOptions)
  window.addEventListener('gestureend', blockGesture, listenerOptions)

  return () => {
    window.removeEventListener('gesturestart', blockGesture, listenerOptions)
    window.removeEventListener('gesturechange', blockGesture, listenerOptions)
    window.removeEventListener('gestureend', blockGesture, listenerOptions)
  }
}
