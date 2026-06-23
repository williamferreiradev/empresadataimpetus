import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const leads = body.leads || []

  if (!leads.length) {
    return { success: true, count: 0 }
  }

  const client = await serverSupabaseClient(event)
  const user = await serverSupabaseUser(event)

  const insertData = leads.map((lead: any) => ({
    nome: lead.title || 'Sem Nome',
    empresa: lead.title || null,
    telefone: lead.phoneUnformatted || lead.phone || null,
    segmento: lead.categoryName || 'Google Maps',
    origem: 'Google Maps',
    status: 'Extraído',
    responsavel: user?.id || null,
    CNPJ: null,
    Nome_Decisor: null,
    infoExtract: lead
  }))

  const { data, error } = await client
    .from('ibeia_clientes')
    .insert(insertData)
    .select()

  if (error) {
    console.error('Erro ao salvar leads no Supabase:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Erro ao salvar os leads no banco de dados'
    })
  }

  return { success: true, count: leads.length, leads_salvos: data }
})
