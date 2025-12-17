export class SupermarketController {
  constructor ({ supermarketModel }) {
    this.supermarketModel = supermarketModel
  }

  getAll = async (_req, res) => {
    const supermarkets = await this.supermarketModel.getAll()

    res.json(supermarkets)
  }
}
