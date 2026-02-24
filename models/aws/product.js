import { executeQuery } from '../../config/db.js'

export class ProductModel {
  static async getAll ({ limit, offset }) {
    const sql = `
      SELECT 
        p.id,
        p.nombre,
        p.codigo_barra,
        pf.imagen_url_fuente,
        p.detalle_nutricional,
        p.categoria_id,
        p.marca,
        pf.url_producto
      FROM productos p
      LEFT JOIN producto_fuente pf ON pf.producto_id  = p.id
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
        p.id,
        p.nombre, 
        p.codigo_barra,
        pf.imagen_url_fuente ,
        p.detalle_nutricional,
        p.categoria_id,
        p.marca,
        pf.url_producto
      FROM productos p
      LEFT JOIN producto_fuente pf ON pf.producto_id  = p.id
      WHERE p.categoria_id = $1 AND p.activo = true  
      ORDER BY p.id
      LIMIT $2 OFFSET $3;
    `
    return await executeQuery(sql, [categoryId, limit, offset])
  }

  static async getByCategoryChildOf ({ parentId, limit, offset }) {
    const sql = `
      SELECT
        p.id,
        p.nombre,
        p.codigo_barra,
        pf.imagen_url_fuente ,
        p.detalle_nutricional,
        p.categoria_id,
        p.marca,
        pf.url_producto
      FROM categorias AS c
      JOIN productos  AS p ON p.categoria_id = c.id
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
        p.id,
        p.nombre,
        p.codigo_barra,
        pf.imagen_url_fuente,
        p.detalle_nutricional,
        p.categoria_id,
        p.marca,
        pf.url_producto
      FROM categorias AS c
      JOIN categorias AS g ON g.parent_id = c.id
      JOIN productos  AS p ON p.categoria_id = g.id
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
        p.id,
        p.nombre,
        p.codigo_barra,
        pf.imagen_url_fuente,
        p.detalle_nutricional,
        p.categoria_id,
        p.marca,
        pf.url_producto
      FROM productos AS p
      LEFT JOIN producto_fuente pf ON pf.producto_id  = p.id
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
        p.id,
        p.nombre,
        p.codigo_barra,
        pf.imagen_url_fuente,
        p.detalle_nutricional,
        p.categoria_id,
        p.marca,
        pf.url_producto
      FROM productos AS p
      LEFT JOIN producto_fuente pf ON pf.producto_id = p.id
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
        p.id,
        p.nombre,
        p.codigo_barra,
        pf.imagen_url_fuente,
        p.detalle_nutricional,
        p.categoria_id,
        p.marca,
        pf.url_producto
      FROM productos AS p
      LEFT JOIN producto_fuente pf ON pf.producto_id  = p.id
      WHERE translate(lower(p.nombre),
        'áéíóúàèìòùäëïöüâêîôûñ',
        'aeiouaeiouaeiouaeioun'
      ) LIKE '%' || translate(lower($1),
        'áéíóúàèìòùäëïöüâêîôûñ',
        'aeiouaeiouaeiouaeioun'
      ) || '%'
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
        p.id,
        p.nombre,
        p.codigo_barra,
        pf.imagen_url_fuente,
        p.detalle_nutricional,
        p.categoria_id,
        p.marca,
        pf.url_producto
      FROM productos AS p
      LEFT JOIN producto_fuente pf
      ON pf.producto_id  = p.id
      WHERE p.categoria_id = $1
      AND p.activo = true
      AND translate(lower(p.nombre),
        'áéíóúàèìòùäëïöüâêîôûñ',
        'aeiouaeiouaeiouaeioun'
      ) LIKE '%' || translate(lower($2),
        'áéíóúàèìòùäëïöüâêîôûñ',
        'aeiouaeiouaeiouaeioun'
      ) || '%'
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
        p.id,
        p.nombre,
        p.codigo_barra,
        pf.imagen_url_fuente,
        p.detalle_nutricional,
        p.categoria_id,
        p.marca,
        pf.url_producto
      FROM categorias AS c
      JOIN productos  AS p ON p.categoria_id = c.id
      LEFT JOIN producto_fuente pf ON pf.producto_id = p.id
      WHERE c.parent_id = $1
      AND p.activo = true
      AND translate(lower(p.nombre),
        'áéíóúàèìòùäëïöüâêîôûñ',
        'aeiouaeiouaeiouaeioun'
      ) LIKE '%' || translate(lower($2),
        'áéíóúàèìòùäëïöüâêîôûñ',
        'aeiouaeiouaeiouaeioun'
      ) || '%'
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
        p.id,
        p.nombre,
        p.codigo_barra,
        pf.imagen_url_fuente,
        p.detalle_nutricional,
        p.categoria_id,
        p.marca,
        pf.url_producto
      FROM categorias AS c
      JOIN categorias AS g ON g.parent_id = c.id
      JOIN productos  AS p ON p.categoria_id = g.id
      LEFT JOIN producto_fuente pf ON pf.producto_id = p.id
      WHERE c.parent_id = $1
      AND p.activo = true
      AND translate(lower(p.nombre),
        'áéíóúàèìòùäëïöüâêîôûñ',
        'aeiouaeiouaeiouaeioun'
      ) LIKE '%' || translate(lower($2),
        'áéíóúàèìòùäëïöüâêîôûñ',
        'aeiouaeiouaeiouaeioun'
      ) || '%'
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
        p.id,
        p.nombre,
        p.codigo_barra,
        pf.imagen_url_fuente,
        p.detalle_nutricional,
        p.categoria_id,
        p.marca,
        pf.url_producto
      FROM productos AS p
      LEFT JOIN producto_fuente pf ON pf.producto_id  = p.id
      WHERE translate(lower(p.nombre),
        'áéíóúàèìòùäëïöüâêîôûñ',
        'aeiouaeiouaeiouaeioun'
      ) LIKE '%' || translate(lower($1),
        'áéíóúàèìòùäëïöüâêîôûñ',
        'aeiouaeiouaeiouaeioun'
      ) || '%'
      AND LOWER(p.marca) = LOWER($2)
      AND p.activo = true
      ORDER BY p.nombre
      LIMIT $3 OFFSET $4;
    `
    return await executeQuery(sql, [q, marca, limit, offset])
  }
}
