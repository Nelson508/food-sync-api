import { Router } from 'express'
import { ProductController } from '../controllers/products.js'
import { IngredientController } from '../controllers/ingredients.js'

export const createProductRouter = ({ productModel, ingredientModel }) => {
  const productsRouter = Router()

  const productController = new ProductController({ productModel })
  const ingredientController = new IngredientController({ ingredientModel })

  productsRouter.get('/', productController.getProducts)
  productsRouter.get('/:id/ingredients', ingredientController.getIngredientsByProductId)
  return productsRouter
}
