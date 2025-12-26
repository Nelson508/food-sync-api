import { validateProduct, validatePartialProduct } from '../schemas/products.js'

export class ProductController {
  constructor ({ productModel }) {
    this.productModel = productModel
  }

  getProducts = async (req, res) => {
    try {
      const { marca, categoryId, categoryParentId, limit, offset } = req.query

      const filters = {
        marca: marca?.trim() || null,
        categoryId: categoryId?.trim() || null,
        categoryParentId: categoryParentId?.trim() || null,
        limit: limit ? Number(limit) : 10,
        offset: offset ? Number(offset) : 0
      }

      if (!Number.isFinite(filters.limit) || filters.limit <= 0) {
        return res.status(400).json({ message: 'limit inválido' })
      }
      if (!Number.isFinite(filters.offset) || filters.offset < 0) {
        return res.status(400).json({ message: 'offset inválido' })
      }

      let products

      if (filters.categoryParentId) {
        products = await this.productModel.getByCategoryParentId({
          parentId: filters.categoryParentId,
          marca: filters.marca,
          limit: filters.limit,
          offset: filters.offset
        })
        return res.json(products)
      }

      if (filters.categoryId) {
        products = await this.productModel.getByCategoryId({
          categoryId: filters.categoryId,
          marca: filters.marca,
          limit: filters.limit,
          offset: filters.offset
        })
        return res.json(products)
      }

      if (filters.marca) {
        products = await this.productModel.getByMarca({
          marca: filters.marca,
          limit: filters.limit,
          offset: filters.offset
        })
        return res.json(products)
      }

      products = await this.productModel.getAll({
        limit: filters.limit,
        offset: filters.offset
      })
      return res.json(products)
    } catch (e) {
      return res.status(500).json({ message: 'Error fetching products' })
    }
  }

  getById = async (req, res) => {
    const { id } = req.params
    const product = await this.productModel.getById({ id })
    if (product) return res.json(product)

    res.status(404).json({ message: 'Product not found' })
  }

  getByCategoryId = async (req, res) => {
    const { categoryId } = req.params
    const product = await this.productModel.getByCategoryId({ categoryId })
    return res.json(product)
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
