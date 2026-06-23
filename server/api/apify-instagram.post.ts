import { defineEventHandler, readBody, createError } from 'h3'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { username } = body

  if (!username) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Username é obrigatório',
    })
  }

  const apifyToken = process.env.APIFY_API_TOKEN
  if (!apifyToken) {
    throw createError({
      statusCode: 500,
      statusMessage: 'APIFY_API_TOKEN não configurado no .env',
    })
  }

  try {
    // Executa a extração síncrona e já pega os resultados da nuvem
    const response = await fetch(`https://api.apify.com/v2/acts/apify~instagram-profile-scraper/run-sync-get-dataset-items?token=${apifyToken}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        usernames: [username],
      })
    })

    if (!response.ok) {
      const err = await response.text()
      throw new Error(`Apify error: ${response.status} - ${err}`)
    }

    const data = await response.json()
    
    if (data && data.length > 0) {
      return data[0] // Retorna o primeiro perfil extraído
    } else {
      throw createError({
        statusCode: 404,
        statusMessage: 'Perfil não encontrado ou privado',
      })
    }

  } catch (error: any) {
    console.error('Erro no Apify Instagram:', error)
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Erro ao conectar no Apify',
    })
  }
})
