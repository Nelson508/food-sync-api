import dotenv from 'dotenv'
dotenv.config()

const CDN_BASE_URL = (process.env.CDN_BASE_URL || '').replace(/\/+$/, '')

function buildImageUrl (imageKey) {
  if (!imageKey) return null

  const key = String(imageKey).replace(/^\/+/, '')
  return `${CDN_BASE_URL}/${key}`
}

function mapCategory (category) {
  const imageKey = category.image_key ?? category.imageKey ?? null
  return {
    ...category,
    image_url: buildImageUrl(imageKey)
  }
}

export function mapCategories (list) {
  return Array.isArray(list) ? list.map(mapCategory) : []
}
