export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const { runId, datasetId } = query

  if (!runId || !datasetId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'runId e datasetId são obrigatórios'
    })
  }

  const token = process.env.APIFY_API_TOKEN
  if (!token) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Token do Apify não configurado no servidor (.env)'
    })
  }

  try {
    // 1. Checar status da execução
    const runResponse = await $fetch(`https://api.apify.com/v2/actor-runs/${runId}?token=${token}`)
    const status = runResponse.data.status

    if (status !== 'SUCCEEDED') {
      return {
        status,
        finished: false
      }
    }

    // 2. Se finalizou, buscar os dados
    const datasetResponse = await $fetch(`https://api.apify.com/v2/datasets/${datasetId}/items?token=${token}&clean=true`)
    
    return {
      status,
      finished: true,
      items: datasetResponse
    }
    
  } catch (error) {
    console.error('Erro ao verificar status do Apify:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Falha ao verificar status no Apify'
    })
  }
})
