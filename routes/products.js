import { Router } from 'express'
import { ProductController } from '../controllers/products.js'

export const createProductRouter = ({ productModel }) => {
  const productsRouter = Router()

  const productController = new ProductController({ productModel })

  productsRouter.get('/', productController.getAll)
  /*  productsRouter.get('/:id', productController.getById)
  productsRouter.post('/', productController.create)
  productsRouter.delete('/:id', productController.delete)
  productsRouter.patch('/:id', productController.update) */
  return productsRouter
}
