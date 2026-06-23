<template>
  <div class="h-full flex flex-col">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-gray-900">Pipeline de Vendas</h2>
      <NuxtLink to="/comercial/clientes" class="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-colors">
        Gerenciar Clientes
      </NuxtLink>
    </div>

    <div v-if="pending" class="flex justify-center items-center py-20">
      <p class="text-gray-500 font-medium">Carregando pipeline...</p>
    </div>

    <!-- Kanban Board -->
    <div v-else class="flex overflow-x-auto pb-6 space-x-4 min-h-[70vh] items-start">
      <!-- Coluna -->
      <div 
        v-for="status in columns" 
        :key="status"
        class="flex-shrink-0 w-80 bg-gray-100 rounded-xl flex flex-col max-h-[80vh]"
        @dragover.prevent
        @drop="onDrop($event, status)"
      >
        <!-- Header da Coluna -->
        <div class="p-4 font-bold text-gray-800 flex justify-between items-center border-b border-gray-200 bg-gray-50 rounded-t-xl">
          <span class="uppercase text-sm tracking-wide">{{ status }}</span>
          <span class="bg-gray-200 text-gray-700 text-xs py-1 px-2 rounded-full font-bold">
            {{ getClientsByStatus(status).length }}
          </span>
        </div>
        
        <!-- Área Soltável (Cards) -->
        <div class="p-3 flex-1 overflow-y-auto space-y-3 custom-scrollbar min-h-[150px]">
          <div 
            v-for="cliente in getClientsByStatus(status)" 
            :key="cliente.id"
            draggable="true"
            @dragstart="onDragStart($event, cliente.id)"
            @click="openClientDetails(cliente)"
            class="bg-white p-4 rounded-lg shadow-sm border border-gray-200 cursor-grab active:cursor-grabbing hover:border-orange-300 hover:shadow-md transition-all group"
          >
            <div class="flex justify-between items-start mb-2">
              <div class="font-bold text-gray-900 text-sm group-hover:text-orange-600 transition-colors">{{ cliente.nome }}</div>
            </div>
            
            <div class="text-xs text-gray-500 mb-3 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              {{ cliente.empresa || 'Sem empresa' }}
            </div>
            
            <div class="flex justify-between items-center mt-4">
              <span class="text-[10px] uppercase font-bold tracking-wider bg-blue-50 text-blue-600 px-2 py-1 rounded-md">
                {{ cliente.origem || 'Lead' }}
              </span>
              
              <!-- Avatar do responsável -->
              <div class="flex items-center" v-if="(cliente as any).profiles?.full_name">
                <div class="h-6 w-6 rounded-full bg-orange-100 flex items-center justify-center text-orange-700 text-xs font-bold border border-white shadow-sm" :title="(cliente as any).profiles.full_name">
                  {{ (cliente as any).profiles.full_name.charAt(0).toUpperCase() }}
                </div>
              </div>
            </div>
          </div>
          
          <!-- State Vazio -->
          <div v-if="getClientsByStatus(status).length === 0" class="h-full flex items-center justify-center py-6 border-2 border-dashed border-gray-200 rounded-lg">
            <span class="text-xs text-gray-400 font-medium">Solte cards aqui</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Modal Detalhes do Lead -->
    <div v-if="isDetailsModalOpen" class="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
      <div class="fixed inset-0 bg-gray-900 bg-opacity-50 transition-opacity" @click="closeClientDetails"></div>
      
      <div class="relative w-full max-w-2xl mx-auto my-6 z-50">
        <div class="relative flex flex-col w-full bg-white border-0 rounded-xl shadow-xl outline-none focus:outline-none">
          <!-- Cabeçalho -->
          <div class="flex items-start justify-between p-5 border-b border-solid border-gray-200 rounded-t-xl bg-gray-50">
            <div>
              <h3 class="text-xl font-bold text-gray-900">
                Detalhes do Lead
              </h3>
              <p class="text-sm text-gray-500 mt-1">Visão geral do cliente e propostas geradas</p>
            </div>
            <button class="p-1 ml-auto bg-transparent border-0 text-gray-400 float-right text-3xl leading-none font-semibold outline-none focus:outline-none hover:text-gray-600" @click="closeClientDetails">
              <span class="bg-transparent h-6 w-6 text-2xl block outline-none focus:outline-none">×</span>
            </button>
          </div>
          
          <!-- Corpo do modal -->
          <div class="relative p-6 flex-auto max-h-[70vh] overflow-y-auto custom-scrollbar">
            <div v-if="selectedClient" class="space-y-6">
              
              <!-- Info Básica + Score -->
              <div class="flex items-center justify-between bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <div>
                  <h4 class="text-lg font-bold text-gray-900">{{ selectedClient.nome }}</h4>
                  <div class="flex items-center text-sm text-gray-500 mt-1">
                    <span class="mr-3 flex items-center">
                      <svg class="h-4 w-4 mr-1 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      {{ selectedClient.empresa || 'Nenhuma empresa' }}
                    </span>
                    <span class="mr-3 flex items-center">
                      <svg class="h-4 w-4 mr-1 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      {{ selectedClient.email || 'Sem e-mail' }}
                    </span>
                  </div>
                  <div class="flex items-center text-sm text-gray-500 mt-1">
                    <span class="flex items-center">
                      <svg class="h-4 w-4 mr-1 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      {{ selectedClient.telefone || 'Sem telefone' }}
                    </span>
                  </div>
                </div>
                
                <div class="text-center">
                  <div class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Score</div>
                  <div class="h-14 w-14 rounded-full flex items-center justify-center font-black text-2xl mx-auto" 
                    :class="[
                      calculateScore(selectedClient.status) === 'F' ? 'bg-red-100 text-red-600 border-4 border-red-200' : 
                      calculateScore(selectedClient.status) === '10' ? 'bg-green-100 text-green-600 border-4 border-green-200' :
                      'bg-orange-100 text-orange-600 border-4 border-orange-200'
                    ]"
                  >
                    {{ calculateScore(selectedClient.status) }}
                  </div>
                </div>
              </div>

              <!-- Lista de Propostas -->
              <div>
                <div class="mb-3">
                  <h4 class="text-lg font-bold text-gray-900 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Propostas Geradas
                  </h4>
                </div>
                
                <div v-if="isLoadingProposals" class="py-6 text-center text-gray-500">
                  <svg class="animate-spin h-6 w-6 text-orange-500 mx-auto mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Buscando propostas...
                </div>
                
                <div v-else-if="clientProposals.length === 0" class="bg-gray-50 border border-dashed border-gray-300 rounded-lg p-6 text-center text-gray-500">
                  Nenhuma proposta encontrada para "{{ selectedClient.nome }}".
                </div>
                
                <div v-else-if="clientProposals.length > 0" class="space-y-3">
                  <NuxtLink 
                    v-for="proposta in clientProposals" 
                    :key="proposta.id" 
                    :to="`/p/${proposta.id}`"
                    target="_blank"
                    class="block p-3 border border-gray-100 bg-white rounded-lg hover:shadow-md hover:border-orange-200 cursor-pointer transition-all"
                  >
                    <div class="flex justify-between items-start mb-2">
                      <div>
                        <p class="font-medium text-gray-900 text-sm">{{ proposta.segmento || 'Projeto sem título' }}</p>
                        <p class="text-xs text-gray-500 mt-0.5">Criada em {{ new Date(proposta.criado_em).toLocaleDateString('pt-BR') }}</p>
                      </div>
                      <span class="px-2 py-1 text-[10px] font-bold rounded-full uppercase tracking-wide"
                        :class="{
                          'bg-gray-100 text-gray-600': proposta.status === 'rascunho',
                          'bg-blue-100 text-blue-600': proposta.status === 'em_revisao',
                          'bg-purple-100 text-purple-600': proposta.status === 'enviado',
                          'bg-green-100 text-green-600': proposta.status === 'aprovado'
                        }">
                        {{ proposta.status.replace('_', ' ') }}
                      </span>
                    </div>
                    <div class="flex justify-between items-center text-xs">
                      <span class="text-gray-600 font-medium">{{ proposta.valor_estimado || 'Valor não definido' }}</span>
                      <span class="text-gray-400">{{ proposta.prazo_estimado ? 'Prazo: ' + proposta.prazo_estimado : 'Prazo a definir' }}</span>
                    </div>
                  </NuxtLink>
                </div>
              </div>

              <!-- TAREFAS SECTION -->
              <div class="border-t border-gray-200 pt-6">
                <h4 class="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <svg class="w-5 h-5 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>
                  Tarefas / Lembretes
                </h4>
                
                <!-- Add Task Form -->
                <div class="flex flex-col md:flex-row gap-3 mb-5 items-end bg-gray-50 border border-gray-100 p-4 rounded-xl">
                  <div class="flex-1 w-full">
                    <label class="block text-xs font-medium text-gray-700 mb-1.5">Título da Tarefa</label>
                    <input v-model="newTask.titulo" type="text" class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="Ex: Ligar para confirmar envio">
                  </div>
                  <div class="w-full md:w-auto">
                    <label class="block text-xs font-medium text-gray-700 mb-1.5">Data e Hora</label>
                    <input v-model="newTask.data_hora" type="datetime-local" class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white">
                  </div>
                  <button type="button" @click="addTask" :disabled="isAddingTask || !newTask.titulo || !newTask.data_hora" class="w-full md:w-auto bg-gray-900 hover:bg-black text-white px-5 py-2 rounded-lg font-medium shadow-sm transition-colors disabled:opacity-50 text-sm">
                    {{ isAddingTask ? 'Adicionando...' : 'Adicionar' }}
                  </button>
                </div>

                <!-- Tasks List -->
                <div v-if="isTasksLoading" class="text-center py-6 text-sm text-gray-500 flex flex-col items-center justify-center">
                  <svg class="animate-spin h-5 w-5 text-gray-400 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Carregando tarefas...
                </div>
                <div v-else-if="clientTasks.length === 0" class="text-center py-8 text-sm text-gray-500 italic border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
                  Nenhuma tarefa agendada para este lead.
                </div>
                <div v-else class="space-y-2.5">
                  <div v-for="task in clientTasks" :key="task.id" class="flex items-center justify-between p-3 border border-gray-200 rounded-xl hover:border-orange-300 transition-colors bg-white group" :class="{'opacity-60 bg-gray-50 border-gray-200': task.concluida}">
                    <div class="flex items-center gap-3.5 overflow-hidden">
                      <input type="checkbox" :checked="task.concluida" @change="toggleTask(task)" class="h-4.5 w-4.5 text-orange-600 focus:ring-orange-500 border-gray-300 rounded cursor-pointer mt-0.5">
                      <div class="overflow-hidden">
                        <p class="text-sm font-semibold text-gray-900 truncate" :class="{'line-through text-gray-500': task.concluida}">{{ task.titulo }}</p>
                        <p class="text-xs text-gray-500 flex items-center mt-0.5">
                          <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                          {{ new Date(task.data_hora).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }) }}
                        </p>
                      </div>
                    </div>
                    <button type="button" @click="deleteTask(task.id)" class="text-gray-400 hover:text-red-600 p-1.5 ml-2 shrink-0 transition-colors opacity-0 group-hover:opacity-100 rounded-md hover:bg-red-50">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              
            </div>
          </div>
          
          <!-- Rodapé -->
          <div class="flex items-center justify-end p-5 border-t border-solid border-gray-200 rounded-b-xl">
            <button class="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium px-4 py-2 rounded-lg text-sm transition-colors" @click="closeClientDetails">
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Database } from '~/types/database.types'

definePageMeta({
  layout: 'comercial'
})

const supabase = useSupabaseClient<Database>()
const { userViewAllLeads, userId } = useUserRole()

// Colunas Exatas Solicitadas
const columns = [
  'Extraído',
  'Novo',
  'Mensagem',
  'Ligação',
  'Reunião',
  'Proposta enviada',
  'Follow-up',
  'Fechado',
  'Perdido'
]

// ----------------------------------------------------
// FETCH DATA
// ----------------------------------------------------
const { data: clientes, pending, refresh } = useAsyncData('pipeline-clientes', async () => {
  let query = supabase
    .from('ibeia_clientes')
    .select(`
      *,
      profiles:responsavel (
        full_name
      )
    `)
    .order('updated_at', { ascending: false });
    
  if (!userViewAllLeads.value && userId.value) {
    query = query.eq('responsavel', userId.value)
  }

  const { data, error } = await query
  if (error) console.error(error);
  return data || [];
}, { watch: [userViewAllLeads, userId] });

// Helper para agrupar
function getClientsByStatus(status: string) {
  if (!clientes.value) return []
  // Se o cliente nao tiver status e for a coluna 'Novo', mostra ele
  return clientes.value.filter(c => {
    const cStatus = c.status || 'Novo'
    return cStatus.toLowerCase() === status.toLowerCase()
  })
}

// ----------------------------------------------------
// DRAG AND DROP NATIVO (HTML5)
// ----------------------------------------------------
function onDragStart(event: DragEvent, clientId: string) {
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'move'
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('clientId', clientId)
  }
}

async function onDrop(event: DragEvent, newStatus: string) {
  const clientId = event.dataTransfer?.getData('clientId')
  if (!clientId || !clientes.value) return

  // Atualização Otimista
  const clienteIndex = clientes.value.findIndex(c => c.id === clientId)
  
  if (clienteIndex !== -1 && clientes.value[clienteIndex].status !== newStatus) {
    const oldStatus = clientes.value[clienteIndex].status
    clientes.value[clienteIndex].status = newStatus
    
    // Força a reatividade do Vue a redesenhar a tela instantaneamente
    clientes.value = [...clientes.value]
    
    // Atualizar no Banco
    const { error } = await supabase
      .from('ibeia_clientes')
      .update({ 
        status: newStatus
      })
      .eq('id', clientId)
      
    if (error) {
      console.error('Erro ao atualizar status:', error)
      alert('Erro do Banco de Dados: ' + (error.message || JSON.stringify(error)))
      // Reverter alteração otimista em caso de erro
      clientes.value[clienteIndex].status = oldStatus
      clientes.value = [...clientes.value]
      refresh()
    }
  }
}

// ----------------------------------------------------
// LEAD DETAILS MODAL & SCORE
// ----------------------------------------------------
const isDetailsModalOpen = ref(false)
const selectedClient = ref<any>(null)
const clientProposals = ref<any[]>([])
const isLoadingProposals = ref(false)

// TASKS STATE
const clientTasks = ref<any[]>([])
const isTasksLoading = ref(false)
const isAddingTask = ref(false)
const newTask = ref({ titulo: '', data_hora: '' })

function calculateScore(status: string) {
  const scores: Record<string, string> = {
    'Extraído': '1',
    'Novo': '2',
    'Mensagem': '3',
    'Ligação': '4',
    'Reunião': '5',
    'Proposta enviada': '6',
    'Follow-up': '7',
    'Fechado': '10',
    'Perdido': 'F'
  }
  return scores[status] || '1'
}

async function openClientDetails(cliente: any) {
  selectedClient.value = cliente
  isDetailsModalOpen.value = true
  isLoadingProposals.value = true
  clientProposals.value = []
  
  // Limpa tarefas
  clientTasks.value = []
  newTask.value = { titulo: '', data_hora: '' }
  
  // Busca Propostas
  try {
    const { data, error } = await supabase
      .from('ibeia_propostas')
      .select('*')
      .eq('cliente_id', cliente.id)
      .order('criado_em', { ascending: false })
      
    if (error) throw error
    clientProposals.value = data || []
  } catch (err) {
    console.error('Erro ao buscar propostas:', err)
  } finally {
    isLoadingProposals.value = false
  }

  // Busca Tarefas
  fetchTasks(cliente.id)
}

function closeClientDetails() {
  isDetailsModalOpen.value = false
  selectedClient.value = null
}

// ----------------------------------------------------
// TASKS LOGIC
// ----------------------------------------------------
async function fetchTasks(clienteId: string) {
  isTasksLoading.value = true
  try {
    const { data, error } = await supabase
      .from('ibeia_clientes_tarefas')
      .select('*')
      .eq('cliente_id', clienteId)
      .order('data_hora', { ascending: true })
      
    if (error) throw error
    clientTasks.value = data || []
  } catch (err) {
    console.error('Erro ao buscar tarefas:', err)
    clientTasks.value = []
  } finally {
    isTasksLoading.value = false
  }
}

async function addTask() {
  if (!newTask.value.titulo || !newTask.value.data_hora || !selectedClient.value?.id) return
  
  isAddingTask.value = true
  try {
    const { error } = await supabase
      .from('ibeia_clientes_tarefas')
      .insert({
        cliente_id: selectedClient.value.id,
        titulo: newTask.value.titulo,
        data_hora: new Date(newTask.value.data_hora).toISOString()
      })
      
    if (error) throw error
    
    newTask.value = { titulo: '', data_hora: '' }
    await fetchTasks(selectedClient.value.id)
  } catch (err: any) {
    console.error("Erro ao adicionar tarefa:", err)
    alert('Erro ao adicionar tarefa: ' + (err.message || JSON.stringify(err)))
  } finally {
    isAddingTask.value = false
  }
}

async function toggleTask(task: any) {
  const originalStatus = task.concluida
  task.concluida = !originalStatus
  try {
    const { error } = await supabase
      .from('ibeia_clientes_tarefas')
      .update({ concluida: task.concluida })
      .eq('id', task.id)
      
    if (error) throw error
  } catch (err: any) {
    task.concluida = originalStatus
    console.error("Erro ao atualizar tarefa:", err)
    alert('Erro ao atualizar tarefa: ' + (err.message || JSON.stringify(err)))
  }
}

async function deleteTask(taskId: string) {
  if (!confirm('Deseja realmente excluir esta tarefa?')) return;
  
  try {
    const { error } = await supabase
      .from('ibeia_clientes_tarefas')
      .delete()
      .eq('id', taskId)
      
    if (error) throw error
    clientTasks.value = clientTasks.value.filter(t => t.id !== taskId)
  } catch (err: any) {
    console.error("Erro ao excluir tarefa:", err)
    alert('Erro ao excluir tarefa: ' + (err.message || JSON.stringify(err)))
  }
}
</script>

<style scoped>
/* Scrollbar customizada para as colunas */
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent; 
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e5e7eb; 
  border-radius: 4px;
}
.custom-scrollbar:hover::-webkit-scrollbar-thumb {
  background: #d1d5db; 
}
</style>
