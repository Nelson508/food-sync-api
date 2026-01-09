import { query } from '../../config/db.js'

export class CategoryModel {
  static async getAll () {
    const sql = `
      SELECT id, nombre, parent_id, image_key
      FROM categorias
      ORDER BY id ASC;
    `
    return await query(sql)
  }

  static async getRoots () {
    const sql = `
      SELECT id, nombre, image_key
      FROM categorias
      WHERE parent_id IS NULL
      ORDER BY id ASC;
    `
    return await query(sql)
  }

  static async getByParentId ({ parentId }) {
    const sql = `
      SELECT id, nombre, parent_id, image_key
      FROM categorias
      WHERE parent_id = $1
      ORDER BY id ASC;
    `
    return await query(sql, [parentId])
  }

  static async getGrandchildrenByParentId ({ parentId }) {
    const sql = `
      SELECT g.id, g.nombre, g.parent_id, g.image_key
      FROM categorias AS c
      JOIN categorias AS g ON g.parent_id = c.id
      WHERE c.parent_id = $1
      ORDER BY g.id ASC;
    `
    return await query(sql, [parentId])
  }
}
