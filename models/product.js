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

export class ProductModel {
  static async getAll ({ limit, offset }) {
    const query = `
      SELECT
        id,
        nombre,
        codigo_barra,
        imagen_url,
        detalle_nutricional,
        categoria_id,
        marca,
        url_producto
      FROM productos
      ORDER BY nombre
      LIMIT $1 OFFSET $2;
    `
    const result = await executeQuery(query, [limit, offset])

    if (result.records.length === 0) return null
    return result.records
  }

  static async getByCategoryId ({ categoryId, limit, offset }) {
    const query = `
      SELECT
        id,
        nombre,
        codigo_barra,
        imagen_url,
        detalle_nutricional,
        categoria_id,
        marca,
        url_producto
      FROM productos
      WHERE categoria_id = $1
      ORDER BY nombre
      LIMIT $2 OFFSET $3;
    `
    const result = await executeQuery(query, [categoryId, limit, offset])

    return result.records
  }

  static async getByCategoryParentId ({ parentId, limit, offset }) {
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
      ORDER BY p.nombre
      LIMIT $2 OFFSET $3;
    `
    const result = await executeQuery(query, [parentId, limit, offset])

    return result.records
  }

  static async getByMarca ({ marca, limit, offset }) {
    const query = `
      SELECT
        id,
        nombre,
        codigo_barra,
        imagen_url,
        detalle_nutricional,
        categoria_id,
        marca,
        url_producto
      FROM productos
      WHERE LOWER(marca) = LOWER($1)
      ORDER BY nombre
      LIMIT $2 OFFSET $3;
    `
    const result = await executeQuery(query, [marca, limit, offset])

    if (result.records.length === 0) return null
    return result.records
  }
}
