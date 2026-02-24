import { executeQuery } from '../../config/db.js'

export class SupermarketModel {
  static async getAll () {
    const sql = `
      SELECT id, nombre
      FROM supermercados
      ORDER BY id ASC;
    `
    const rows = await executeQuery(sql)
    return rows.length === 0 ? null : rows
  }
}
