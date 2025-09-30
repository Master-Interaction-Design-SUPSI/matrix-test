export const queryElement = (selector) => document.querySelector(selector)

export const createCursorReadout = (host) => {
  const readout = document.createElement('span')
  readout.id = 'cursor-position'
  host.append(readout)
  return readout
}

export const clearCursorReadout = (target) => {
  target.textContent = ''
}
