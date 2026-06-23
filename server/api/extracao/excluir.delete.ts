import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const id = query.id

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'ID é obrigatório' })
  }

  const client = await serverSupabaseClient(event)

  const { error } = await client
    .from('ibeia_clientes')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Erro ao excluir lead no Supabase:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Erro ao excluir o lead no banco de dados'
    })
  }

  return { success: true }
})
