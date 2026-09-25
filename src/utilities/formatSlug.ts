import type { FieldHook } from 'payload'

// Comprehensive Turkish character replacement map (lowercase + uppercase)
const trMap: { [key: string]: string } = {
  'ç': 'c', 'Ç': 'c',
  'ğ': 'g', 'Ğ': 'g',
  'ı': 'i', 'I': 'i',
  'İ': 'i',
  'ö': 'o', 'Ö': 'o',
  'ş': 's', 'Ş': 's',
  'ü': 'u', 'Ü': 'u',
}

const slugify = (text: string): string => {
  let result = text
  // 1. Replace Turkish characters first (before lowercasing, to catch İ→i, I→i etc.)
  for (const key in trMap) {
    result = result.split(key).join(trMap[key])
  }
  // 2. Lowercase
  result = result.toLowerCase()
  // 3. Replace spaces and special chars
  result = result
    .replace(/\s+/g, '-')       // spaces → hyphens
    .replace(/[^a-z0-9-]/g, '') // remove anything that's not alphanumeric or hyphen
    .replace(/-+/g, '-')        // collapse multiple hyphens
    .replace(/^-|-$/g, '')      // trim leading/trailing hyphens
  return result
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

