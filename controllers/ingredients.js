export class IngredientController {
  constructor ({ ingredientModel }) {
    this.ingredientModel = ingredientModel
  }

  getIngredientsByProductId = async (req, res) => {
    try {
      const { id } = req.params

      const productId = String(id).trim()
      if (productId === '') {
        return res.status(400).json({ message: 'productId inválido' })
      }

      const ingredients = await this.ingredientModel.getByProductId({ productId })
      console.log('Resultado para productId:', ingredients)
      return res.json(ingredients)
    } catch (e) {
      return res.status(500).json({ message: 'Error fetching product ingredients' })
    }
  }
}
