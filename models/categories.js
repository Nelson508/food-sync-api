import fetch from 'node-fetch'
import dotenv from 'dotenv'
dotenv.config()

const XATA_API_KEY = process.env.XATA_API_KEY
const DATABASE_URL = process.env.XATA_DATABASE_URL
const BRANCH = process.env.XATA_BRANCH

const XATA_SQL_URL = `${DATABASE_URL}:${BRANCH}/sql`

async function executeQuery (query, params = []) {
  const response = await fetch(XATA_SQL_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${XATA_API_KEY}`
    },
    body: JSON.stringify({ statement: query, params })
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Error ejecutando la consulta SQL: ${error}`)
  }

  return response.json()
}

export class CategoryModel {
  static async getAll () {
    const query = `
      SELECT id, nombre, parent_id
      FROM categorias
      order by id ASC;
    `
    const result = await executeQuery(query)

    return result.records
  }

  static async getRoots () {
    const query = `
      SELECT id, nombre
      FROM categorias
      WHERE parent_id IS NULL
      ORDER BY id ASC;
    `
    const result = await executeQuery(query)

    return result.records
  }

  static async getByParentId ({ parentId }) {
    const query = `
      SELECT id, nombre, parent_id
      FROM categorias
      WHERE parent_id = $1;
    `
    const result = await executeQuery(query, [parentId])

    return result.records
  }

  static async getGrandchildrenByParentId ({ parentId }) {
    const query = `
      SELECT g.id, g.nombre, g.parent_id
      FROM categorias AS c
      JOIN categorias AS g ON g.parent_id = c.id
      WHERE c.parent_id = $1
      ORDER BY g.id ASC;
    `
    const result = await executeQuery(query, [parentId])

    return result.records
  }

  static async getProductsByParentCategoryId ({ id }) {
    const query = `
      SELECT
        p.id,
        p.nombre,
        p.codigo_barra,
        p.imagen_url,
        p.detalle_nutricional,
        p.categoria_id,
        p.marca,
        p.url_producto
      FROM categorias AS c
      JOIN categorias AS g ON g.parent_id = c.id
      JOIN productos  AS p ON p.categoria_id = g.id
      WHERE c.parent_id = $1
      ORDER BY p.nombre;
    `
    const result = await executeQuery(query, [id])
    return result.records
  }
}
