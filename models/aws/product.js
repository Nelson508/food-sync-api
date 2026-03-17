import { executeQuery } from '../../config/db.js'

const ACCENTED_CHARS = '\u00e1\u00e9\u00ed\u00f3\u00fa\u00e0\u00e8\u00ec\u00f2\u00f9\u00e4\u00eb\u00ef\u00f6\u00fc\u00e2\u00ea\u00ee\u00f4\u00fb\u00f1'
const NORMALIZED_CHARS = 'aeiouaeiouaeiouaeioun'

function getIngredientNormalizedNamesSql (productAlias = 'p') {
  return `
        COALESCE((
          SELECT array_agg(DISTINCT i.nombre_normalizado ORDER BY i.nombre_normalizado)
          FROM producto_ingredientes pi
          JOIN ingredientes i ON i.id = pi.ingrediente_id
          WHERE pi.producto_id = ${productAlias}.id
            AND i.nombre_normalizado IS NOT NULL
        ), ARRAY[]::text[]) AS "ingredientNormalizedNames"
  `
}

function getProductSelectSql ({ categoryAlias = 'c' } = {}) {
  return `
        p.id,
        p.nombre,
        pf.imagen_url_fuente,
        p.marca,
        ${categoryAlias}.nombre AS categoria_nombre,
        ${categoryAlias}.image_key AS categoria_image_key,
        ${getIngredientNormalizedNamesSql('p')}
  `
}

function getSearchByNameSql (field = 'p.nombre', paramIndex = 1) {
  return `
      translate(lower(${field}), '${ACCENTED_CHARS}', '${NORMALIZED_CHARS}')
      LIKE '%' || translate(lower($${paramIndex}), '${ACCENTED_CHARS}', '${NORMALIZED_CHARS}') || '%'
  `
}

export class ProductModel {
  static async getAll ({ limit, offset }) {
    const sql = `
      SELECT
        ${getProductSelectSql()}
      FROM productos p
      LEFT JOIN producto_fuente pf ON pf.producto_id = p.id
      LEFT JOIN categorias c ON c.id = p.categoria_id
      WHERE p.activo = true
      ORDER BY p.nombre
      LIMIT $1 OFFSET $2;
    `
    const rows = await executeQuery(sql, [limit, offset])
    return rows.length === 0 ? null : rows
  }

  static async getByCategoryId ({ categoryId, limit, offset }) {
    const sql = `
      SELECT
        ${getProductSelectSql()}
      FROM productos p
      LEFT JOIN producto_fuente pf ON pf.producto_id = p.id
      LEFT JOIN categorias c ON c.id = p.categoria_id
      WHERE p.categoria_id = $1 AND p.activo = true
      ORDER BY p.id
      LIMIT $2 OFFSET $3;
    `
    return await executeQuery(sql, [categoryId, limit, offset])
  }

  static async getByCategoryChildOf ({ parentId, limit, offset }) {
    const sql = `
      SELECT
        ${getProductSelectSql()}
      FROM categorias AS c
      JOIN productos AS p ON p.categoria_id = c.id
      LEFT JOIN producto_fuente pf ON pf.producto_id = p.id
      WHERE c.parent_id = $1 AND p.activo = true
      ORDER BY p.nombre
      LIMIT $2 OFFSET $3;
    `
    return await executeQuery(sql, [parentId, limit, offset])
  }

  static async getByCategoryParentId ({ parentId, limit, offset }) {
    const sql = `
      SELECT
        ${getProductSelectSql({ categoryAlias: 'g' })}
      FROM categorias AS c
      JOIN categorias AS g ON g.parent_id = c.id
      JOIN productos AS p ON p.categoria_id = g.id
      LEFT JOIN producto_fuente pf ON pf.producto_id = p.id
      WHERE c.parent_id = $1 AND p.activo = true
      ORDER BY p.nombre
      LIMIT $2 OFFSET $3;
    `
    return await executeQuery(sql, [parentId, limit, offset])
  }

  static async getByMarca ({ marca, limit, offset }) {
    const sql = `
      SELECT
        ${getProductSelectSql()}
      FROM productos AS p
      LEFT JOIN producto_fuente pf ON pf.producto_id = p.id
      LEFT JOIN categorias c ON c.id = p.categoria_id
      WHERE LOWER(p.marca) = LOWER($1) AND p.activo = true
      ORDER BY p.nombre
      LIMIT $2 OFFSET $3;
    `
    const rows = await executeQuery(sql, [marca, limit, offset])
    return rows.length === 0 ? null : rows
  }

  static async getByBarcode ({ barcode, limit, offset }) {
    const sql = `
      SELECT
        ${getProductSelectSql()}
      FROM productos AS p
      LEFT JOIN producto_fuente pf ON pf.producto_id = p.id
      LEFT JOIN categorias c ON c.id = p.categoria_id
      WHERE ltrim(trim(p.codigo_barra), '0') = ltrim(trim($1::text), '0')
      AND p.activo = true
      ORDER BY p.nombre
      LIMIT $2 OFFSET $3;
    `
    const rows = await executeQuery(sql, [barcode, limit, offset])
    return rows.length === 0 ? null : rows
  }

  static async searchAll ({ q, limit, offset }) {
    const sql = `
      SELECT
        ${getProductSelectSql()}
      FROM productos AS p
      LEFT JOIN producto_fuente pf ON pf.producto_id = p.id
      LEFT JOIN categorias c ON c.id = p.categoria_id
      WHERE ${getSearchByNameSql('p.nombre', 1)}
      AND p.activo = true
      ORDER BY p.nombre
      LIMIT $2 OFFSET $3;
    `
    return await executeQuery(sql, [q, limit, offset])
  }

  static async searchByCategoryId ({ categoryId, q, marca, limit, offset }) {
    const hasMarca = marca && String(marca).trim() !== ''

    const sql = `
      SELECT
        ${getProductSelectSql()}
      FROM productos AS p
      LEFT JOIN producto_fuente pf ON pf.producto_id = p.id
      LEFT JOIN categorias c ON c.id = p.categoria_id
      WHERE p.categoria_id = $1
      AND p.activo = true
      AND ${getSearchByNameSql('p.nombre', 2)}
      ${hasMarca ? 'AND LOWER(p.marca) = LOWER($3)' : ''}
      ORDER BY p.nombre
      LIMIT $${hasMarca ? 4 : 3} OFFSET $${hasMarca ? 5 : 4};
    `

    const params = hasMarca
      ? [categoryId, q, marca, limit, offset]
      : [categoryId, q, limit, offset]

    return await executeQuery(sql, params)
  }

  static async searchByCategoryChildOf ({ parentId, q, marca, limit, offset }) {
    const hasMarca = marca && String(marca).trim() !== ''

    const sql = `
      SELECT
        ${getProductSelectSql()}
      FROM categorias AS c
      JOIN productos AS p ON p.categoria_id = c.id
      LEFT JOIN producto_fuente pf ON pf.producto_id = p.id
      WHERE c.parent_id = $1
      AND p.activo = true
      AND ${getSearchByNameSql('p.nombre', 2)}
      ${hasMarca ? 'AND LOWER(p.marca) = LOWER($3)' : ''}
      ORDER BY p.nombre
      LIMIT $${hasMarca ? 4 : 3} OFFSET $${hasMarca ? 5 : 4};
    `

    const params = hasMarca
      ? [parentId, q, marca, limit, offset]
      : [parentId, q, limit, offset]

    return await executeQuery(sql, params)
  }

  static async searchByCategoryParentId ({ parentId, q, marca, limit, offset }) {
    const hasMarca = marca && String(marca).trim() !== ''

    const sql = `
      SELECT
        ${getProductSelectSql({ categoryAlias: 'g' })}
      FROM categorias AS c
      JOIN categorias AS g ON g.parent_id = c.id
      JOIN productos AS p ON p.categoria_id = g.id
      LEFT JOIN producto_fuente pf ON pf.producto_id = p.id
      WHERE c.parent_id = $1
      AND p.activo = true
      AND ${getSearchByNameSql('p.nombre', 2)}
      ${hasMarca ? 'AND LOWER(p.marca) = LOWER($3)' : ''}
      ORDER BY p.nombre
      LIMIT $${hasMarca ? 4 : 3} OFFSET $${hasMarca ? 5 : 4};
    `

    const params = hasMarca
      ? [parentId, q, marca, limit, offset]
      : [parentId, q, limit, offset]

    return await executeQuery(sql, params)
  }

  static async searchByMarca ({ q, marca, limit, offset }) {
    const sql = `
      SELECT
        ${getProductSelectSql()}
      FROM productos AS p
      LEFT JOIN producto_fuente pf ON pf.producto_id = p.id
      LEFT JOIN categorias c ON c.id = p.categoria_id
      WHERE ${getSearchByNameSql('p.nombre', 1)}
      AND LOWER(p.marca) = LOWER($2)
      AND p.activo = true
      ORDER BY p.nombre
      LIMIT $3 OFFSET $4;
    `
    return await executeQuery(sql, [q, marca, limit, offset])
  }
}
