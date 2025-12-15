export class SupermercadoController {
  constructor ({ supermercadoModel }) {
    this.supermercadoModel = supermercadoModel
  }

  getAll = async (_req, res) => {
    const supermercados = await this.supermercadoModel.getAll()

    res.json(supermercados)
  }
}
