import { creatApp } from './app.js'
import { ProductModel } from './models/xata/product.js'
import { SupermarketModel } from './models/xata/supermarket.js'
// import { CategoryModel } from './models/xata/categories.js'
import { CategoryModel } from './models/aws/categories.js'

creatApp({ productModel: ProductModel, supermarketModel: SupermarketModel, categoryModel: CategoryModel })
