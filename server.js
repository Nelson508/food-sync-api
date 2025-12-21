import { creatApp } from './app.js'
import { ProductModel } from './models/product.js'
import { SupermarketModel } from './models/supermarket.js'
import { CategoryModel } from './models/categories.js'

creatApp({ productModel: ProductModel, supermarketModel: SupermarketModel, categoryModel: CategoryModel })
