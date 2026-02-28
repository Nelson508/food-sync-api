import express, { json } from 'express' // require -> commonJS
import { createProductRouter } from './routes/products.js'
import { createSupermarketRouter } from './routes/supermarkets.js'
import { createCategoryRouter } from './routes/categories.js'

export const creatApp = ({ productModel, supermarketModel, categoryModel, ingredientModel }) => {
  const app = express()
  app.use(json())
  app.disable('x-powered-by') // deshabilitar el header X-Powered-By: Express

  app.use('/products', createProductRouter({ productModel, ingredientModel }))
  app.use('/supermarkets', createSupermarketRouter({ supermarketModel }))
  app.use('/categories', createCategoryRouter({ categoryModel }))

  const PORT = process.env.PORT ?? 1234

  app.listen(PORT, () => {
    console.log(`server listening on port http://localhost:${PORT}`)
  })
}
