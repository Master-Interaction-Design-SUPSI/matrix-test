export const getColourAtIndex = (index, colours) => colours[index % colours.length]

export const getNextColourIndex = (currentIndex, colours) => (currentIndex + 1) % colours.length
