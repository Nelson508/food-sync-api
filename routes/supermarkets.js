import { Router } from 'express'
import { SupermarketController } from '../controllers/supermarkets.js'

export const createSupermarketRouter = ({ supermarketModel }) => {
  const supermarketsRouter = Router()

  const supermarketController = new SupermarketController({ supermarketModel })

  supermarketsRouter.get('/', supermarketController.getAll)
  return supermarketsRouter
}
