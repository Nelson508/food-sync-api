import { validateProduct, validatePartialProduct } from '../schemas/products.js'

export class ProductController {
  constructor ({ productModel }) {
    this.productModel = productModel
  }

  getProducts = async (req, res) => {
    try {
      const { categoryId, categoryChildOf, categoryParentId, marca, q, limit, offset } = req.query

      const used = [categoryId, categoryChildOf, categoryParentId]
        .filter(v => v !== undefined && String(v).trim() !== '').length

      if (used > 1) {
        return res.status(400).json({ message: 'Usa solo uno: categoryId, categoryChildOf o categoryParentId' })
      }

      const lim = limit ? Number(limit) : 50
      const off = offset ? Number(offset) : 0
      const query = q ? String(q).trim() : null

      // ✅ Si hay query, usa búsqueda dentro del scope que corresponda
      if (query) {
        if (categoryParentId) {
          return res.json(await this.productModel.searchByCategoryParentId({ parentId: String(categoryParentId).trim(), marca, q: query, limit: lim, offset: off }))
        }
        if (categoryChildOf) {
          return res.json(await this.productModel.searchByCategoryChildOf({ parentId: String(categoryChildOf).trim(), marca, q: query, limit: lim, offset: off }))
        }
        if (categoryId) {
          return res.json(await this.productModel.searchByCategoryId({ categoryId: String(categoryId).trim(), marca, q: query, limit: lim, offset: off }))
        }
        if (marca) {
          return res.json(await this.productModel.searchByMarca({ marca: String(marca).trim(), q: query, limit: lim, offset: off }))
        }
        return res.json(await this.productModel.searchAll({ q: query, limit: lim, offset: off }))
      }

      // ✅ comportamiento actual intacto
      if (categoryParentId) {
        return res.json(await this.productModel.getByCategoryParentId({ parentId: String(categoryParentId).trim(), marca, limit: lim, offset: off }))
      }

      if (categoryChildOf) {
        return res.json(await this.productModel.getByCategoryChildOf({ parentId: String(categoryChildOf).trim(), marca, limit: lim, offset: off }))
      }

      if (categoryId) {
        return res.json(await this.productModel.getByCategoryId({ categoryId: String(categoryId).trim(), marca, limit: lim, offset: off }))
      }

      if (marca) {
        return res.json(await this.productModel.getByMarca({ marca: String(marca).trim(), limit: lim, offset: off }))
      }

      return res.json(await this.productModel.getAll({ limit: lim, offset: off }))
    } catch (e) {
      return res.status(500).json({ message: 'Error fetching products' })
    }
  }

  create = async (req, res) => {
    const result = validateProduct(req.body)

    if (result.error) {
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }

    const newProduct = await this.productModel.create({ input: result.data })

    res.status(201).json(newProduct)
  }

  delete = async (req, res) => {
    const { id } = req.params

    const result = await this.productModel.delete({ id })

    if (result === false) {
      return res.status(404).json({ message: 'Product not found' })
    }

    return res.json({ message: 'Product deleted' })
  }

  update = async (req, res) => {
    const result = validatePartialProduct(req.body)

    if (!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }

    const { id } = req.params

    const updateMovie = await this.movieModel.update({ id, input: result.data })

    if (updateMovie === false) {
      return res.status(404).json({ message: 'Movie not found' })
    }

    return res.json(updateMovie)
  }
}
