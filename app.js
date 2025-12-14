import express, { json } from 'express' // require -> commonJS
import { createProductRouter } from './routes/products.js'

export const creatApp = ({ productModel }) => {
  const app = express()
  app.use(json())
  app.disable('x-powered-by') // deshabilitar el header X-Powered-By: Express

  app.use('/products', createProductRouter({ productModel }))

  const PORT = process.env.PORT ?? 1234

  app.listen(PORT, () => {
    console.log(`server listening on port http://localhost:${PORT}`)
  })
}
