export class CategoryController {
  constructor ({ categoryModel }) {
    this.categoryModel = categoryModel
  }

  getAll = async (_req, res) => {
    const categories = await this.categoryModel.getAll()
    res.json(categories)
  }

  getRoots = async (_req, res) => {
    const categories = await this.categoryModel.getRoots()
    res.json(categories)
  }

  getByParentId = async (req, res) => {
    const { parentId } = req.params

    const categories = await this.categoryModel.getByParentId({ parentId })
    return res.json(categories)
  }

  getTree = async (_req, res) => {
    const categories = await this.categoryModel.getAll()
    return res.json(buildCategoryTree(categories))
  }

  getGrandchildrenByParentId = async (req, res) => {
    const { parentId } = req.params

    const categories = await this.categoryModel.getGrandchildrenByParentId({ parentId })
    return res.json(categories)
  }

  getProductsByParentCategoryId = async (req, res) => {
    const { id } = req.params

    const categories = await this.categoryModel.getProductsByParentCategoryId({ id })
    return res.json(categories)
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

  // 1) Crear nodos
  for (const c of categories) {
    const id = String(c.id).trim()
    byId.set(id, {
      id: c.id,
      nombre: c.nombre,
      children: []
    })
  }

  // 2) Conectar padres/hijos
  for (const c of categories) {
    const id = String(c.id).trim()
    const node = byId.get(id)

    const parentId = normalizeParentId(c.parent_id)

    if (parentId === null) {
      roots.push(node)
    } else {
      const parent = byId.get(parentId)
      if (parent) parent.children.push(node)
      else roots.push(node) // huérfano => lo dejamos como root para no perderlo
    }
  }

  return roots
}
