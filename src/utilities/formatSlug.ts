import type { FieldHook } from 'payload'

const format = (val: string): string =>
  val
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '')
    .toLowerCase()

// Turkish character replacement map
const trMap: { [key: string]: string } = {
  'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u',
  'Ç': 'c', 'Ğ': 'g', 'İ': 'i', 'Ö': 'o', 'Ş': 's', 'Ü': 'u',
}

const slugify = (text: string): string => {
  let result = text
  for (const key in trMap) {
    result = result.replace(new RegExp(key, 'g'), trMap[key])
  }
  return format(result)
}

export const formatSlug =
  (fallback: string): FieldHook =>
  ({ value, originalDoc, data }) => {
    if (typeof value === 'string' && value.trim() !== '') {
      return slugify(value)
    }
    const fallbackData = data?.[fallback] || originalDoc?.[fallback]
    if (fallbackData && typeof fallbackData === 'string') {
      return slugify(fallbackData)
    }
    return value
  }
