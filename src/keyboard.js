export const matchesKey = (key, expected) => key.toLowerCase() === expected

export const isColourShortcut = (key) => matchesKey(key, 'c')

export const isDebugShortcut = (key) => matchesKey(key, 'd')
