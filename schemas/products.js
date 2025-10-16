import z from 'zod'

const productSchema = z.object({
  title: z.string({
    invalid_type_error: 'El título del producto debe ser un string',
    required_error: 'Se requiere el título del producto'
  }),
  year: z.number().int().min(1900).max(2024),
  director: z.string(),
  duration: z.number().int().positive(),
  rate: z.number().min(0).max(10).default(5.5),
  poster: z.string().url({
    message: 'El póster debe ser una URL válida.'
  }),
  genre: z.array(
    z.enum(['Action', 'Adventure', 'Animation', 'Biography', 'Comedy', 'Crime', 'Drama', 'Fantasy', 'Horror', 'Thriller', 'Romance', 'Sci-Fi']),
    {
      required_error: 'Se requiere el genero',
      invalid_type_error: 'El género de la película debe ser un array de enum de Género'
    }
  )
})

export function validateProduct (input) {
  return productSchema.safeParse(input)
}

export function validatePartialProduct (input) {
  return productSchema.partial().safeParse(input)
}
