export class CategoryController {
  constructor ({ categoryModel }) {
    this.categoryModel = categoryModel
  }

  getAll = async (_req, res) => {
    const categories = await this.categoryModel.getAll()
    res.json(categories)
  }

  getRoots = async (_req, res) => {
    const categories = await this.categoryModel.getRoots()
    res.json(categories)
  }

  getByParentId = async (req, res) => {
    const { parentId } = req.params

    const categories = await this.categoryModel.getByParentId({ parentId })
    return res.json(categories)
  }
}
