import { Router } from 'express'
import { SupermercadoController } from '../controllers/supermercados.js'

export const createSupermercadoRouter = ({ supermercadoModel }) => {
  const supermercadosRouter = Router()

  const supermercadoController = new SupermercadoController({ supermercadoModel })

  supermercadosRouter.get('/', supermercadoController.getAll)
  return supermercadosRouter
}
