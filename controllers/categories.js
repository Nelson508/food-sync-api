export class CategoryController {
  constructor ({ categoryModel }) {
    this.categoryModel = categoryModel
  }

  getAll = async (_req, res) => {
    const categories = await this.categoryModel.getAll()
    res.json(categories)
  }
}
