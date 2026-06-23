export async function enrichLeadsInBatch(leads: any[]) {
  const enrichedLeads = []
  
  const batchSize = 3
  for (let i = 0; i < leads.length; i += batchSize) {
    const batch = leads.slice(i, i + batchSize)
    
    const batchPromises = batch.map(async (lead) => {
      try {
        return await enrichSingleLead(lead)
      } catch (err) {
        console.error(`Erro inesperado ao enriquecer lead ${lead.title}:`, err)
        return lead
      }
    })
    
    const results = await Promise.all(batchPromises)
    enrichedLeads.push(...results)
    
    if (i + batchSize < leads.length) {
      await delay(1200) // Pausa de 1.2s para evitar Rate Limit
    }
  }
  
  return enrichedLeads
}

async function enrichSingleLead(lead: any) {
  const uf = getUfFromLead(lead) || ''
  const nome = lead.title || ''
  
  if (!nome) return lead
  
  // 1. Buscar CNPJ
  const cnpjCandidatos = await fetchCnpjByName(nome, uf)
  if (!cnpjCandidatos || cnpjCandidatos.length === 0) return lead
  
  // 2. Similarity Score (Evita pegar CNPJ errado para nomes genéricos)
  let melhorCnpj = null
  let melhorScore = 0
  let razaoSocialEncontrada = ''
  
  for (const candidato of cnpjCandidatos) {
    const score = calculateSimilarity(nome, candidato.razao_social || candidato.nome_fantasia || '')
    if (score > melhorScore) {
      melhorScore = score
      melhorCnpj = candidato.cnpj
      razaoSocialEncontrada = candidato.razao_social || candidato.nome_fantasia
    }
  }
  
  // Se o score for alto o suficiente (> 0.4)
  if (melhorCnpj && melhorScore >= 0.4) {
    // 3. Buscar Dados Detalhados na BrasilAPI
    const brasilApiData = await fetchBrasilAPI(melhorCnpj)
    if (brasilApiData) {
      // Anexar no lead original
      lead.cnpj = melhorCnpj
      lead.razaoSocial = razaoSocialEncontrada
      lead.capitalSocial = brasilApiData.capital_social
      lead.cnae = brasilApiData.cnae_fiscal_descricao
      lead.socios = brasilApiData.qsa // Array de sócios
      
      console.log(`✅ Lead Enriquecido: ${nome} -> CNPJ: ${melhorCnpj}`)
    }
  } else {
    console.log(`⚠️ CNPJ não confiável ou não encontrado para: ${nome} (Score: ${melhorScore})`)
  }
  
  return lead
}

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function getUfFromLead(lead: any) {
  // Tentar encontrar UF no address do Google Maps (ex: "... - SP, 01000-000...")
  if (lead.address) {
    const match = lead.address.match(/- ([A-Z]{2}),/)
    if (match) return match[1]
  }
  return lead.state || ''
}

async function fetchCnpjByName(nome: string, uf: string) {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 8000)
    
    // URL hipotética informada (pode mudar por não ser documentada)
    const url = `https://publica.cnpj.ws/?nome=${encodeURIComponent(nome)}&uf=${encodeURIComponent(uf)}`
    
    const response = await $fetch<any>(url, {
      signal: controller.signal as any
    }).catch(() => null)
    
    clearTimeout(timeoutId)
    
    if (Array.isArray(response)) return response
    if (response && Array.isArray(response.data)) return response.data
    return []
  } catch (error) {
    return []
  }
}

async function fetchBrasilAPI(cnpj: string) {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 8000)
    
    const limpo = cnpj.replace(/\D/g, '')
    const response = await $fetch<any>(`https://brasilapi.com.br/api/cnpj/v1/${limpo}`, {
      signal: controller.signal as any
    }).catch(() => null)
    
    clearTimeout(timeoutId)
    return response
  } catch (error) {
    return null
  }
}

function calculateSimilarity(str1: string, str2: string) {
  if (!str1 || !str2) return 0
  const s1 = str1.toLowerCase().trim()
  const s2 = str2.toLowerCase().trim()
  
  if (s1 === s2) return 1.0
  if (s1.includes(s2) || s2.includes(s1)) return 0.8
  
  // Similaridade de Jaccard por palavras
  const words1 = s1.split(/\s+/)
  const words2 = s2.split(/\s+/)
  const intersection = words1.filter(w => words2.includes(w))
  const union = new Set([...words1, ...words2])
  
  return intersection.length / union.size
}
