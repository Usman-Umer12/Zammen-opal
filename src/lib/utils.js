import { SITE } from './config'

export function formatPrice(value) {
  if (value === null || value === undefined || value === '') return 'Price on request'
  return `${SITE.currency} ${Number(value).toLocaleString('en-PK')}`
}

export function slugify(text) {
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function whatsappLink(message, number = SITE.whatsapp) {
  const digits = String(number || SITE.whatsapp).replace(/\D/g, '')
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`
}

export function formatDateTime(value) {
  if (!value) return ''
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return value
  return d.toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}