import { mapItems } from '../utils/cdn.js'

export class CategoryController {
  constructor ({ categoryModel }) {
    this.categoryModel = categoryModel
  }

  getCategories = async (req, res) => {
    try {
      const { parentId, grandchildrenOf } = req.query

      const hasParentId = parentId !== undefined && String(parentId).trim() !== ''
      const hasGrandchildren = grandchildrenOf !== undefined && String(grandchildrenOf).trim() !== ''

      // No permitimos ambos a la vez (para que sea claro)
      if (hasParentId && hasGrandchildren) {
        return res.status(400).json({ message: 'Usa solo uno: parentId o grandchildrenOf' })
      }

      if (hasParentId) {
        const categories = await this.categoryModel.getByParentId({
          parentId: String(parentId).trim()
        })
        return res.json(mapItems(categories))
      }

      if (hasGrandchildren) {
        const categories = await this.categoryModel.getGrandchildrenByParentId({
          parentId: String(grandchildrenOf).trim()
        })
        return res.json(mapItems(categories))
      }

      const categories = await this.categoryModel.getAll()
      return res.json(mapItems(categories))
    } catch (e) {
      return res.status(500).json({ message: 'Error fetching categories' })
    }
  }

  getRoots = async (_req, res) => {
    try {
      const categories = await this.categoryModel.getRoots()
      return res.json(mapItems(categories))
    } catch (e) {
      return res.status(500).json({ message: 'Error fetching root categories' })
    }
  }

  getTree = async (_req, res) => {
    try {
      const categories = await this.categoryModel.getAll()
      return res.json(buildCategoryTree(mapItems(categories)))
    } catch (e) {
      return res.status(500).json({ message: 'Error building category tree' })
    }
  }
}

function normalizeParentId (value) {
  if (value === null || value === undefined) return null

  const s = String(value).trim()
  if (s === '' || s.toLowerCase() === 'null') return null

  return s
}

function buildCategoryTree (categories) {
  const byId = new Map()
  const roots = []

  for (const c of categories) {
    const id = String(c.id).trim()
    byId.set(id, {
      id: c.id,
      nombre: c.nombre,
      children: []
    })
  }

  for (const c of categories) {
    const id = String(c.id).trim()
    const node = byId.get(id)

    const parentId = normalizeParentId(c.parent_id)

    if (parentId === null) {
      roots.push(node)
    } else {
      const parent = byId.get(parentId)
      if (parent) parent.children.push(node)
      else roots.push(node)
    }
  }

  return roots
}
