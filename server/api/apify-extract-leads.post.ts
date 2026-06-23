import { defineEventHandler, readBody, createError } from 'h3'
import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { username, type, maxLeads } = body // type: 'seguidores' | 'seguindo'

  if (!username) {
    throw createError({ statusCode: 400, statusMessage: 'Username é obrigatório' })
  }

  const apifyToken = process.env.APIFY_API_TOKEN
  if (!apifyToken) {
    throw createError({ statusCode: 500, statusMessage: 'APIFY_API_TOKEN não configurado no .env' })
  }

  // Usamos o Client normal que pega a sessão do usuário logado
  const supabase = await serverSupabaseClient(event)
  const user = await serverSupabaseUser(event)

  try {
    // IMPORTANTE: Estamos usando o actor apidojo/instagram-user-scraper
    // Se você tiver assinado outro ator no Apify, altere a URL abaixo.
    const actorName = 'apidojo~instagram-user-scraper'
    
    // Payload otimizado para cobrir os padrões de diferentes scrapers do Apify
    const payload: any = {
      usernames: [username],
      search: username, // alguns usam search
      startUrls: [{ url: `https://www.instagram.com/${username}/` }], // a maioria aceita startUrls
      resultsLimit: maxLeads ? parseInt(maxLeads) : 50,
      maxItems: maxLeads ? parseInt(maxLeads) : 50, // variação de nome de limite
    }
    
    if (type === 'seguidores') {
      payload.scrapeFollowers = true
      payload.extractFollowers = true
    } else {
      payload.scrapeFollowing = true
      payload.extractFollowing = true
    }

    // Usamos run-sync-get-dataset-items para o Nuxt ficar aguardando o resultado
    // Cuidado: Pode dar timeout no Vercel (10-60s limit) se extrair 2000 leads
    const response = await fetch(`https://api.apify.com/v2/acts/${actorName}/run-sync-get-dataset-items?token=${apifyToken}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })

    if (!response.ok) {
      const err = await response.text()
      throw new Error(`Apify erro: ${response.status} - ${err}`)
    }

    const data = await response.json()

    if (!data || data.length === 0) {
      return { success: true, inserted: 0, message: 'Nenhum lead retornado pelo Apify' }
    }

    // Filtra para pegar os dados do objeto do seguidor (o Apify pode retornar os perfis principais também)
    // No apidojo, os seguidores costumam vir num array "followers" ou no root level
    // Vou processar assumindo o padrão mais comum onde cada item no dataset é um perfil
    const leadsReais = data.filter((item: any) => item.username && item.username !== username)

    if (leadsReais.length === 0) {
       return { success: true, inserted: 0, message: 'Apify executou, mas não retornou a lista de seguidores. Verifique o output do Actor.' }
    }

    // Formata para o Supabase
    const clientesToInsert = leadsReais.map((item: any) => ({
      nome: item.fullName || item.username || 'Usuário Desconhecido',
      email: item.publicEmail || item.businessEmail || null,
      telefone: item.contactPhoneNumber || null,
      empresa: null,
      segmento: `Seguidor de @${username}`,
      origem: 'Instagram',
      status: 'Extraído',
      "Nome_Decisor": item.fullName || null,
      infoExtract: item,
      responsavel: user?.id || null
    }))

    // Inserir no Supabase (Isso também vai disparar o Trigger pro N8N que você configurou!)
    const { error } = await supabase
      .from('ibeia_clientes')
      .insert(clientesToInsert)

    if (error) {
      console.error('Erro ao inserir leads no Supabase:', error)
      throw new Error(`Supabase erro: ${error.message}`)
    }

    return { 
      success: true, 
      inserted: clientesToInsert.length,
      message: `${clientesToInsert.length} leads extraídos e salvos no banco com sucesso!`
    }

  } catch (error: any) {
    console.error('Erro na extração Apify Leads:', error)
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Erro interno na extração de leads',
    })
  }
})
