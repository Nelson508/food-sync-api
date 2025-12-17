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
  static async getAll () {
    const query = `
      SELECT id, nombre, codigo_barra, imagen_url, detalle_nutricional, categoria_id, marca, url_producto
      FROM productos;
    `
    const result = await executeQuery(query)

    if (result.records.length === 0) return null
    return result.records
  }

  static async getAllMarca ({ marca }) {
    const query = `
      SELECT id, nombre, codigo_barra, imagen_url, detalle_nutricional, categoria_id, marca, url_producto
      FROM productos WHERE marca = $1;
    `
    const result = await executeQuery(query, [marca])

    if (result.records.length === 0) return null
    return result.records
  }
}
