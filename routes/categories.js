import { Router } from 'express'
import { CategoryController } from '../controllers/categories.js'

export const createCategoryRouter = ({ categoryModel }) => {
  const categoriesRouter = Router()

  const categoryController = new CategoryController({ categoryModel })

  categoriesRouter.get('/', categoryController.getAll)
  return categoriesRouter
}
