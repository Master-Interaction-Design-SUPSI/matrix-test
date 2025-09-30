export const clampToUnitInterval = (value) => Math.min(1, Math.max(0, value))

export const safeDivide = (numerator, denominator) => (denominator === 0 ? 0 : numerator / denominator)
