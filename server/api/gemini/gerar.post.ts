import { defineEventHandler, readBody } from 'h3'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const apiKey = config.geminiApiKey

  if (!apiKey) {
    throw createError({
      statusCode: 500,
      statusMessage: 'GEMINI_API_KEY is not configured on the server.',
    })
  }

  const body = await readBody(event)
  const { prompt } = body

  if (!prompt) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Prompt is required.',
    })
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`

  const payload = {
    contents: [
      {
        parts: [{ text: prompt }]
      }
    ],
    generationConfig: {
      maxOutputTokens: 8192,
      temperature: 0.4,
      responseMimeType: "application/json",
      responseSchema: {
        type: "OBJECT",
        properties: {
          hero: {
            type: "OBJECT",
            properties: {
              headline: { type: "STRING" },
              subheadline: { type: "STRING" },
            },
            required: ["headline", "subheadline"],
          },
          diagnostico: {
            type: "OBJECT",
            properties: {
              titulo: { type: "STRING" },
              intro: { type: "STRING" },
              pontos: {
                type: "ARRAY",
                items: {
                  type: "OBJECT",
                  properties: {
                    titulo: { type: "STRING" },
                    descricao: { type: "STRING" },
                  },
                  required: ["titulo", "descricao"],
                },
              },
            },
            required: ["titulo", "intro", "pontos"],
          },
          ancoragem: {
            type: "OBJECT",
            properties: {
              titulo: { type: "STRING" },
              subtitulo: { type: "STRING" },
              sem_solucao: {
                type: "OBJECT",
                properties: {
                  label: { type: "STRING" },
                  valor_total: { type: "STRING" },
                  valor_anual: { type: "STRING" },
                  itens: {
                    type: "ARRAY",
                    items: {
                      type: "OBJECT",
                      properties: {
                        label: { type: "STRING" },
                        valor: { type: "STRING" },
                        descricao: { type: "STRING" },
                      },
                      required: ["label", "valor", "descricao"],
                    },
                  },
                },
                required: ["label", "valor_total", "valor_anual", "itens"],
              },
              com_solucao: {
                type: "OBJECT",
                properties: {
                  label: { type: "STRING" },
                  valor_total: { type: "STRING" },
                  valor_anual: { type: "STRING" },
                  roi_percentual: { type: "STRING" },
                  payback: { type: "STRING" },
                  itens: {
                    type: "ARRAY",
                    items: {
                      type: "OBJECT",
                      properties: {
                        label: { type: "STRING" },
                        valor: { type: "STRING" },
                        descricao: { type: "STRING" },
                      },
                      required: ["label", "valor", "descricao"],
                    },
                  },
                },
                required: ["label", "valor_total", "valor_anual", "roi_percentual", "payback", "itens"],
              },
            },
            required: ["titulo", "subtitulo", "sem_solucao", "com_solucao"],
          },
          solucao: {
            type: "OBJECT",
            properties: {
              titulo: { type: "STRING" },
              intro: { type: "STRING" },
              nome_solucao: { type: "STRING" },
            },
            required: ["titulo", "intro", "nome_solucao"],
          },
          entregas: {
            type: "ARRAY",
            items: {
              type: "OBJECT",
              properties: {
                numero: { type: "INTEGER" },
                titulo: { type: "STRING" },
                descricao: { type: "STRING" },
                beneficio: { type: "STRING" },
              },
              required: ["numero", "titulo", "descricao", "beneficio"],
            },
          },
          resultados: {
            type: "ARRAY",
            items: {
              type: "OBJECT",
              properties: {
                valor: { type: "STRING" },
                label: { type: "STRING" },
              },
              required: ["valor", "label"],
            },
          },
          investimento: {
            type: "OBJECT",
            properties: {
              valor_principal: { type: "STRING" },
              prazo: { type: "STRING" },
              inclui: { type: "ARRAY", items: { type: "STRING" } },
            },
            required: ["valor_principal", "prazo", "inclui"],
          },
          proximos_passos: {
            type: "ARRAY",
            items: {
              type: "OBJECT",
              properties: {
                numero: { type: "INTEGER" },
                titulo: { type: "STRING" },
                descricao: { type: "STRING" },
              },
              required: ["numero", "titulo", "descricao"],
            },
          },
          accent_color: { type: "STRING" },
        },
        required: [
          "hero",
          "diagnostico",
          "ancoragem",
          "solucao",
          "entregas",
          "resultados",
          "investimento",
          "proximos_passos",
          "accent_color",
        ],
      }
    }
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Gemini API Error:', errorText)
      throw createError({
        statusCode: response.status,
        statusMessage: `Gemini API Error: ${response.statusText}`,
        data: errorText
      })
    }

    const data = await response.json()
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
    
    // O modelo deve retornar JSON puro, mas para evitar erros de markdown (```json ... ```):
    let cleanedText = rawText.trim()
    if (cleanedText.startsWith('```json')) {
      cleanedText = cleanedText.replace(/^```json/, '')
    }
    if (cleanedText.endsWith('```')) {
      cleanedText = cleanedText.replace(/```$/, '')
    }
    cleanedText = cleanedText.trim()

    const jsonParsed = JSON.parse(cleanedText)

    return jsonParsed
  } catch (error: any) {
    console.error('Erro ao chamar o Gemini:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Falha ao comunicar com o modelo Gemini',
      message: error.message
    })
  }
})
