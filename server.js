import { creatApp } from './app.js'
import { ProductModel } from './models/product.js'
import { SupermarketModel } from './models/supermarket.js'

creatApp({ productModel: ProductModel, supermarketModel: SupermarketModel })
