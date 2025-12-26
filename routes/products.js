import { Router } from 'express'
import { ProductController } from '../controllers/products.js'

export const createProductRouter = ({ productModel }) => {
  const productsRouter = Router()

  const productController = new ProductController({ productModel })

  productsRouter.get('/', productController.getProducts)
  productsRouter.get('?categoryParentId=5', productController.getByCategoryId)
  return productsRouter
}
