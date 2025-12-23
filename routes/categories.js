import { Router } from 'express'
import { CategoryController } from '../controllers/categories.js'

export const createCategoryRouter = ({ categoryModel }) => {
  const categoriesRouter = Router()

  const categoryController = new CategoryController({ categoryModel })

  categoriesRouter.get('/', categoryController.getAll)
  categoriesRouter.get('/tree', categoryController.getTree)
  categoriesRouter.get('/roots', categoryController.getRoots)
  categoriesRouter.get('/:parentId', categoryController.getByParentId)
  return categoriesRouter
}
