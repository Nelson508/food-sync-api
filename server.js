import { creatApp } from './app.js'
import { ProductModel } from './models/aws/product.js'
import { SupermarketModel } from './models/aws/supermarket.js'
import { CategoryModel } from './models/aws/categories.js'
import { IngredientModel } from './models/aws/ingredient.js'

creatApp({ productModel: ProductModel, supermarketModel: SupermarketModel, categoryModel: CategoryModel, ingredientModel: IngredientModel })
