export const computeRootMeanSquareVolume = (samples) => {
  const total = samples.reduce((sum, sample) => {
    const centred = (sample - 128) / 128
    return sum + centred * centred
  }, 0)

  return Math.sqrt(total / samples.length)
}

export const startMicrophoneVolumeTracking = (onVolume) => {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return () => {}

  const context = new AudioContext()
  const resumeContext = () => context.resume()
  document.addEventListener('click', resumeContext, { once: true })
  document.addEventListener('touchstart', resumeContext, { once: true })

  let animationFrame = null
  let cleanup = () => {}

  navigator.mediaDevices
    .getUserMedia({ audio: true })
    .then((stream) => {
      const source = context.createMediaStreamSource(stream)
      const analyser = context.createAnalyser()
      analyser.fftSize = 256
      const samples = new Uint8Array(analyser.fftSize)

      source.connect(analyser)

      const readVolume = () => {
        analyser.getByteTimeDomainData(samples)
        onVolume(computeRootMeanSquareVolume(samples))
        animationFrame = requestAnimationFrame(readVolume)
      }

      readVolume()

      cleanup = () => {
        if (animationFrame) cancelAnimationFrame(animationFrame)
        analyser.disconnect()
        source.disconnect()
        stream.getTracks().forEach((track) => track.stop())
        context.close()
      }
    })
    .catch(() => {})

  return () => cleanup()
}
