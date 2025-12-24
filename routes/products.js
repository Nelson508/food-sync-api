import { Router } from 'express'
import { ProductController } from '../controllers/products.js'

export const createProductRouter = ({ productModel }) => {
  const productsRouter = Router()

  const productController = new ProductController({ productModel })

  productsRouter.get('/', productController.getAll)
  productsRouter.get('/', productController.getAllMarca)
  productsRouter.get('/:categoryId/category', productController.getByCategoryId)
  return productsRouter
}
