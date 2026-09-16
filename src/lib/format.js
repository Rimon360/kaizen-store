const oneDecimal = new Intl.NumberFormat("es", { maximumFractionDigits: 1 })
const wholeNumber = new Intl.NumberFormat("es", { maximumFractionDigits: 0 })
const longDate = new Intl.DateTimeFormat("es", { day: "numeric", month: "long", year: "numeric" })

/** 432109876 → "412,1 MB" */
export function formatBytes(bytes) {
  if (!Number.isFinite(bytes) || bytes <= 0) return ""
  const units = ["B", "KB", "MB", "GB"]
  const i = Math.min(units.length - 1, Math.floor(Math.log(bytes) / Math.log(1024)))
  const value = bytes / 1024 ** i
  return `${(value >= 100 || i === 0 ? wholeNumber : oneDecimal).format(value)} ${units[i]}`
}

/** "17 de septiembre de 2026" */
export function formatDate(value) {
  const date = value ? new Date(value) : null
  return date && !Number.isNaN(date.getTime()) ? longDate.format(date) : ""
}
