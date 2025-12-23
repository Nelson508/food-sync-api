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
      order by id ASC;
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
}
