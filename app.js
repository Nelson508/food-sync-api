import express, { json } from 'express' // require -> commonJS
import { createProductRouter } from './routes/products.js'
import { createSupermercadoRouter } from './routes/supermercados.js'

export const creatApp = ({ productModel, supermercadoModel }) => {
  const app = express()
  app.use(json())
  app.disable('x-powered-by') // deshabilitar el header X-Powered-By: Express

  app.use('/products', createProductRouter({ productModel }))
  app.use('/supermercados', createSupermercadoRouter({ supermercadoModel }))

  const PORT = process.env.PORT ?? 1234

  app.listen(PORT, () => {
    console.log(`server listening on port http://localhost:${PORT}`)
  })
}
