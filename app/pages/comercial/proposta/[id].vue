<template>
  <div class="max-w-5xl mx-auto pb-12">
    
    <div class="mb-6">
      <NuxtLink to="/comercial/pipeline" class="text-orange-500 hover:text-orange-600 flex items-center text-sm font-medium mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Voltar ao Pipeline
      </NuxtLink>
      
      <h2 class="text-2xl font-bold text-gray-900 dark:text-zinc-100 flex items-center">
        Nova Proposta
        <span v-if="cliente" class="ml-2 text-gray-500 dark:text-zinc-400 font-normal">para {{ cliente.nome }}</span>
      </h2>
    </div>

    <div v-if="pending" class="flex justify-center py-20">
      <svg class="animate-spin h-8 w-8 text-orange-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>

    <form v-else @submit.prevent="saveProposal" class="bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-800 overflow-hidden">
      <!-- Section 1: Cabeçalho da Proposta -->
      <div class="p-6 border-b border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900">
        <h3 class="text-lg font-bold text-gray-900 dark:text-zinc-100 mb-4">Informações Gerais</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Empresa do Cliente</label>
            <input v-model="form.cliente_empresa" type="text" required class="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white dark:bg-zinc-800" placeholder="Nome da empresa">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Segmento / Serviço</label>
            <input v-model="form.segmento" type="text" class="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white dark:bg-zinc-800" placeholder="Ex: Criação de Landing Page">
          </div>
        </div>
      </div>

      <!-- Section 2: Diagnóstico -->
      <div class="p-6 border-b border-gray-100 dark:border-zinc-800">
        <h3 class="text-lg font-bold text-gray-900 dark:text-zinc-100 mb-4">Diagnóstico</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Contexto Atual</label>
            <textarea v-model="form.contexto" rows="3" class="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500" placeholder="Qual a situação atual do cliente?"></textarea>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Dores (Pain Points) *</label>
            <textarea v-model="form.dores" required rows="3" class="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500" placeholder="Quais os principais problemas que ele enfrenta?"></textarea>
          </div>
        </div>
      </div>

      <!-- Section 3: Solução -->
      <div class="p-6 border-b border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900">
        <h3 class="text-lg font-bold text-gray-900 dark:text-zinc-100 mb-4">A Solução</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Escopo do Projeto *</label>
            <textarea v-model="form.escopo" required rows="4" class="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500" placeholder="O que exatamente será entregue?"></textarea>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Conteúdo Adicional / Observações</label>
            <textarea v-model="form.conteudo" rows="3" class="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500" placeholder="Anotações extras ou links"></textarea>
          </div>
        </div>
      </div>

      <!-- Section 4: Fechamento -->
      <div class="p-6">
        <h3 class="text-lg font-bold text-gray-900 dark:text-zinc-100 mb-4">Prazos e Valores</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Valor Estimado</label>
            <input v-model="form.valor_estimado" type="text" class="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500" placeholder="Ex: R$ 5.000,00">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Prazo Estimado</label>
            <input v-model="form.prazo_estimado" type="text" class="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500" placeholder="Ex: 30 dias">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Status Inicial</label>
            <select v-model="form.status" class="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white dark:bg-zinc-800">
              <option value="rascunho">Rascunho</option>
              <option value="em_revisao">Em Revisão</option>
              <option value="enviado">Enviado</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Footer Buttons -->
      <div class="p-6 border-t border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900 flex justify-end space-x-3">
        <button type="button" @click="navigateTo('/comercial/pipeline')" class="px-5 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg text-sm font-medium text-gray-700 dark:text-zinc-300 bg-white dark:bg-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800 dark:bg-zinc-900 transition-colors">
          Cancelar
        </button>
        <button type="submit" :disabled="isSaving" class="px-5 py-2 rounded-lg text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 transition-colors shadow-sm disabled:opacity-50 flex items-center">
          <svg v-if="isSaving" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ isSaving ? 'Salvando...' : 'Salvar Proposta' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Database } from '~/types/database.types'

definePageMeta({
  layout: 'comercial'
})

const route = useRoute()
const clientId = route.params.id as string
const supabase = useSupabaseClient<Database>()

const cliente = ref<any>(null)
const pending = ref(true)
const isSaving = ref(false)

const form = ref({
  cliente_nome: '',
  cliente_empresa: '',
  segmento: '',
  contexto: '',
  dores: '',
  escopo: '',
  conteudo: '',
  valor_estimado: '',
  prazo_estimado: '',
  status: 'rascunho'
})

// Buscar cliente para preencher cabeçalho inicial
onMounted(async () => {
  if (!clientId) return
  
  try {
    const { data, error } = await supabase
      .from('ibeia_clientes')
      .select('*')
      .eq('id', clientId)
      .single()
      
    if (error) throw error
    
    cliente.value = data
    
    // Auto preencher
    form.value.cliente_nome = data.nome
    form.value.cliente_empresa = data.empresa || ''
    form.value.segmento = data.segmento || ''
    
  } catch (err) {
    console.error('Erro ao buscar cliente:', err)
  } finally {
    pending.value = false
  }
})

// Salvar proposta
async function saveProposal() {
  isSaving.value = true
  
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    const payload = {
      ...form.value,
      cliente_id: clientId,
      criado_por: user?.email || 'Sistema',
      responsavel: user?.id || null
    }

    const { error } = await supabase
      .from('ibeia_propostas')
      .insert(payload)
      
    if (error) throw error
    
    alert('Proposta salva com sucesso!')
    navigateTo('/comercial/pipeline')
    
  } catch (err: any) {
    console.error('Erro ao salvar proposta:', err)
    alert('Ocorreu um erro ao salvar: ' + (err.message || JSON.stringify(err)))
  } finally {
    isSaving.value = false
  }
}
</script>
