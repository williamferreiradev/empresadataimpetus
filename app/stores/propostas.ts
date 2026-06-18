import { defineStore } from 'pinia'
import { ref } from 'vue'

const LS_KEY = 'di_propostas'

function loadLocal() {
  if (import.meta.client) {
    try { return JSON.parse(localStorage.getItem(LS_KEY) || '[]') } catch { return [] }
  }
  return []
}

function saveLocal(list: any[]) {
  if (import.meta.client) {
    localStorage.setItem(LS_KEY, JSON.stringify(list))
  }
}

export const usePropostasStore = defineStore('propostas', () => {
  const supabase = useSupabaseClient()
  const propostas = ref<any[]>(loadLocal())
  const loading   = ref(false)
  const error     = ref<string | null>(null)

  async function fetchPropostas() {
    loading.value = true
    error.value   = null
    
    try {
      const { data, error: err } = await supabase
        .from('ibeia_propostas')
        .select('*')
        .order('criado_em', { ascending: false })
        
      if (err) throw err
      
      // Supabase retornou dados reais — substitui tudo (não mistura com cache)
      propostas.value = data
      saveLocal(data)
    } catch (err: any) {
      // Supabase falhou (RLS ou offline) → usa cache local, sem misturar
      console.warn("Supabase Fetch Falhou (RLS/Offline). Usando cache local.", err)
      error.value = null
      const local = loadLocal()
      propostas.value = local
    } finally {
      loading.value = false
    }
  }

  async function createProposta(payload: any) {
    const local = {
      ...payload,
      id: `local_${Date.now()}`,
      criado_em: new Date().toISOString(),
    }

    try {
      // Tenta Supabase primeiro
      const { data, error: err } = await supabase
        .from('ibeia_propostas')
        .insert(payload)
        .select()
        .single()

      if (err) throw err
      
      if (data) {
        propostas.value.unshift(data)
        saveLocal(propostas.value)
        return data
      }
    } catch (err) {
      console.warn("Falha no Insert Supabase, usando fallback local.", err)
    }

    // Fallback local
    propostas.value.unshift(local)
    saveLocal(propostas.value)
    return local
  }

  async function updateProposta(id: string, payload: any) {
    try {
      // Tenta Supabase
      const { data, error: err } = await supabase
        .from('ibeia_propostas')
        .update(payload)
        .eq('id', id)
        .select()
        .single()
        
      if (err) throw err
      
      if (data) {
        const idx = propostas.value.findIndex(p => p.id === id)
        if (idx !== -1) propostas.value[idx] = data
        saveLocal(propostas.value)
        return data
      }
    } catch (err) {
      console.warn("Falha no Update Supabase, atualizando local apenas.", err)
    }

    const updated = { ...propostas.value.find(p => p.id === id), ...payload }
    const idx = propostas.value.findIndex(p => p.id === id)
    if (idx !== -1) propostas.value[idx] = updated
    saveLocal(propostas.value)
    return updated
  }

  async function deleteProposta(id: string) {
    try {
      await supabase.from('ibeia_propostas').delete().eq('id', id)
    } catch (err) {
      console.warn("Falha ao deletar no Supabase.", err)
    }
    
    propostas.value = propostas.value.filter(p => p.id !== id)
    saveLocal(propostas.value)
  }
  
  // Função helper para buscar 1 proposta específica (útil para a view /p/[id])
  async function fetchPropostaById(id: string) {
    try {
      const { data, error: err } = await supabase
        .from('ibeia_propostas')
        .select('*')
        .eq('id', id)
        .single()
        
      if (err) throw err
      if (data) return data
    } catch (err) {
      console.warn("Falha ao buscar proposta por ID via Supabase, buscando local.", err)
    }
    
    return propostas.value.find(p => p.id === id) || null
  }

  return { 
    propostas, 
    loading, 
    error, 
    fetchPropostas, 
    createProposta, 
    updateProposta, 
    deleteProposta,
    fetchPropostaById
  }
})
