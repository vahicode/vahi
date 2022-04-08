// Generic rounding method
export const round = (val, decimals = 1) =>
  Math.round(val * Math.pow(10, decimals)) / Math.pow(10, decimals)

// Capitalize string
export const capitalize = (string) => string.charAt(0).toUpperCase() + string.slice(1)
