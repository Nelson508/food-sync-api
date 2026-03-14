import dotenv from 'dotenv'
dotenv.config()

const CDN_BASE_URL = (process.env.CDN_BASE_URL || '').replace(/\/+$/, '')

function buildImageUrl (imageKey) {
  if (!imageKey) return null

  const key = String(imageKey).replace(/^\/+/, '')
  return `${CDN_BASE_URL}/${key}`
}

function mapItem (item) {
  const categoriaImageKey = item.image_key ?? item.categoria_image_key ?? null
  return {
    ...item,
    cat_image_url: buildImageUrl(categoriaImageKey)
  }
}

export function mapItems (list) {
  return Array.isArray(list) ? list.map(mapItem) : []
}
