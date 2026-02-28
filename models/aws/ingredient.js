import { executeQuery } from '../../config/db.js'

export class IngredientModel {
  static async getByProductId ({ productId }) {
    const sql = `
      SELECT
        i.id,
        i.nombre,
        i.nombre_normalizado
      FROM producto_ingredientes pi
      JOIN ingredientes i ON i.id = pi.ingrediente_id
      WHERE pi.producto_id = $1
      ORDER BY i.nombre ASC;
    `
    const result = await executeQuery(sql, [productId])
    console.log('Fetching ingredients for productId:', result)
    return result.length === 0 ? null : result
  }
}
