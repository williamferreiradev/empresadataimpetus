export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { nicho, regiao, maxLeads } = body

  if (!nicho || !regiao) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Nicho e Região são obrigatórios'
    })
  }

  const token = process.env.APIFY_API_TOKEN
  if (!token) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Token do Apify não configurado no servidor (.env)'
    })
  }

  const searchString = `${nicho} ${regiao}`

  try {
    const response = await $fetch(`https://api.apify.com/v2/acts/compass~crawler-google-places/runs?token=${token}`, {
      method: 'POST',
      body: {
        searchStringsArray: [nicho],
        locationQuery: regiao,
        maxCrawledPlacesPerSearch: maxLeads || 10,
        language: 'pt-BR',
        maxImages: 0,
        maxReviews: 0
      }
    })

    return {
      success: true,
      runId: response.data.id,
      datasetId: response.data.defaultDatasetId
    }
  } catch (error) {
    console.error('Erro ao iniciar scraper no Apify:', error.data || error.message)
    throw createError({
      statusCode: 500,
      statusMessage: 'Falha ao comunicar com o Apify'
    })
  }
})
