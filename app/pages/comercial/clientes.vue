<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-gray-900">Clientes</h2>
      <button 
        @click="openModal()" 
        class="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-colors"
      >
        Adicionar Cliente
      </button>
    </div>

    <!-- Tabela de Clientes -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-100">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">E-mail</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Telefone</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Empresa</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Segmento</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Origem</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Responsável</th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-100">
            <tr v-if="pending">
              <td colspan="9" class="px-6 py-8 text-center text-gray-500 text-sm">Carregando clientes...</td>
            </tr>
            <tr v-else-if="!clientes || clientes.length === 0">
              <td colspan="9" class="px-6 py-8 text-center text-gray-500 text-sm">Nenhum cliente cadastrado.</td>
            </tr>
            <tr v-else v-for="cliente in clientes" :key="cliente.id" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ cliente.nome }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ cliente.email || '-' }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ cliente.telefone || '-' }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ cliente.empresa || '-' }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ cliente.segmento || '-' }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ cliente.origem || '-' }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                  {{ cliente.status || 'Novo' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ (cliente as any).profiles?.full_name || 'Desconhecido' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex items-center justify-end space-x-3">
                <button @click="openModal(cliente)" class="text-blue-600 hover:text-blue-900" title="Editar">
                  <PencilSquareIcon class="h-5 w-5" />
                </button>
                <button @click="confirmDelete(cliente)" class="text-red-500 hover:text-red-700" title="Excluir">
                  <TrashIcon class="h-5 w-5" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Adicionar/Editar Cliente -->
    <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
      <div class="fixed inset-0 bg-gray-900 bg-opacity-50 transition-opacity" @click="closeModal"></div>
      
      <div class="relative w-full max-w-2xl mx-auto my-6 z-50">
        <div class="relative flex flex-col w-full bg-white border-0 rounded-xl shadow-xl outline-none focus:outline-none">
          <!-- Cabeçalho -->
          <div class="flex items-start justify-between p-5 border-b border-solid border-gray-200 rounded-t-xl">
            <h3 class="text-xl font-bold text-gray-900">
              {{ isEditing ? 'Editar Cliente' : 'Adicionar Cliente' }}
            </h3>
            <button class="p-1 ml-auto bg-transparent border-0 text-gray-400 float-right text-3xl leading-none font-semibold outline-none focus:outline-none hover:text-gray-600" @click="closeModal">
              <span class="bg-transparent h-6 w-6 text-2xl block outline-none focus:outline-none">×</span>
            </button>
          </div>
          
          <!-- Corpo do formulário -->
          <div class="relative p-6 flex-auto">
            <form @submit.prevent="saveClient" class="space-y-4">
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
                  <input v-model="form.nome" type="text" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500" placeholder="Nome do cliente">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Empresa</label>
                  <input v-model="form.empresa" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500" placeholder="Nome da empresa">
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                  <input v-model="form.email" type="email" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500" placeholder="email@exemplo.com">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                  <input v-model="form.telefone" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500" placeholder="(11) 99999-9999">
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Segmento</label>
                  <input v-model="form.segmento" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500" placeholder="Ex: Varejo">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Origem</label>
                  <input v-model="form.origem" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500" placeholder="Ex: Indicação">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select v-model="form.status" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white">
                    <option v-for="status in statusOptions" :key="status" :value="status">{{ status }}</option>
                  </select>
                </div>
              </div>

            </form>
          </div>
          
          <!-- Rodapé -->
          <div class="flex items-center justify-end p-5 border-t border-solid border-gray-200 rounded-b-xl">
            <button class="text-gray-500 bg-transparent font-medium px-6 py-2 text-sm outline-none focus:outline-none mr-2 mb-1 ease-linear transition-all duration-150" type="button" @click="closeModal" :disabled="isSaving">
              Cancelar
            </button>
            <button class="bg-orange-500 text-white active:bg-orange-600 font-medium text-sm px-6 py-2 rounded-lg shadow hover:shadow-lg outline-none focus:outline-none mb-1 ease-linear transition-all duration-150" type="button" @click="saveClient" :disabled="isSaving">
              {{ isSaving ? 'Salvando...' : (isEditing ? 'Atualizar' : 'Salvar') }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Confirmação de Exclusão -->
    <div v-if="isDeleteModalOpen" class="fixed inset-0 z-[60] flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
      <div class="fixed inset-0 bg-gray-900 bg-opacity-50 transition-opacity" @click="cancelDelete"></div>
      
      <div class="relative w-full max-w-md mx-auto my-6 z-[60]">
        <div class="relative flex flex-col w-full bg-white border-0 rounded-xl shadow-xl outline-none focus:outline-none p-6">
          <div class="text-center">
            <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <TrashIcon class="h-6 w-6 text-red-600" aria-hidden="true" />
            </div>
            <h3 class="text-lg font-bold text-gray-900 mb-2">Excluir Cliente</h3>
            <p class="text-sm text-gray-500">
              Tem certeza que deseja excluir o cliente <strong>{{ clientToDelete?.nome }}</strong>? Esta ação não pode ser desfeita.
            </p>
          </div>
          <div class="mt-6 flex justify-center space-x-3">
            <button @click="cancelDelete" class="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium px-4 py-2 rounded-lg text-sm transition-colors">
              Cancelar
            </button>
            <button @click="executeDelete" class="bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2 rounded-lg text-sm transition-colors shadow-sm">
              Sim, excluir
            </button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { PencilSquareIcon, TrashIcon } from '@heroicons/vue/24/outline'
import type { Database } from '~/types/database.types'

definePageMeta({
  layout: 'comercial'
})

const supabase = useSupabaseClient<Database>()

// Lista de Status solicitada
const statusOptions = [
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
const { data: clientes, pending, refresh } = useAsyncData('todos-clientes', async () => {
  const { data, error } = await supabase
    .from('ibeia_clientes')
    .select(`
      *,
      profiles:responsavel (
        full_name
      )
    `)
    .order('criado_em', { ascending: false });
    
  if (error) console.error(error);
  return data || [];
});

// ----------------------------------------------------
// MODAL & FORM STATE
// ----------------------------------------------------
const isModalOpen = ref(false)
const isEditing = ref(false)
const isSaving = ref(false)

const initialForm = {
  id: '',
  nome: '',
  email: '',
  telefone: '',
  empresa: '',
  segmento: '',
  origem: '',
  status: 'Novo'
}

const form = ref({ ...initialForm })

function openModal(client?: any) {
  if (client) {
    isEditing.value = true
    form.value = {
      id: client.id,
      nome: client.nome,
      email: client.email || '',
      telefone: client.telefone || '',
      empresa: client.empresa || '',
      segmento: client.segmento || '',
      origem: client.origem || '',
      status: client.status || 'Novo'
    }
  } else {
    isEditing.value = false
    form.value = { ...initialForm }
  }
  isModalOpen.value = true
}

function closeModal() {
  isModalOpen.value = false
}

// ----------------------------------------------------
// DELETE LOGIC
// ----------------------------------------------------
const isDeleteModalOpen = ref(false)
const clientToDelete = ref<any>(null)

function confirmDelete(client: any) {
  clientToDelete.value = client
  isDeleteModalOpen.value = true
}

function cancelDelete() {
  isDeleteModalOpen.value = false
  clientToDelete.value = null
}

async function executeDelete() {
  if (!clientToDelete.value) return
  
  try {
    const { error } = await supabase
      .from('ibeia_clientes')
      .delete()
      .eq('id', clientToDelete.value.id)
      
    if (error) throw error
    
    await refresh()
    cancelDelete()
  } catch (err: any) {
    console.error("Erro ao deletar:", err)
    alert("Erro ao excluir: " + (err.message || JSON.stringify(err)))
  }
}

// ----------------------------------------------------
// SAVE LOGIC
// ----------------------------------------------------
async function saveClient() {
  if (!form.value.nome) {
    alert("O nome é obrigatório!");
    return;
  }
  
  isSaving.value = true;
  
  try {
    const payload = {
      nome: form.value.nome,
      email: form.value.email || null,
      telefone: form.value.telefone || null,
      empresa: form.value.empresa || null,
      segmento: form.value.segmento || null,
      origem: form.value.origem || null,
      status: form.value.status
    }

    if (isEditing.value) {
      const { error } = await supabase
        .from('ibeia_clientes')
        .update(payload)
        .eq('id', form.value.id)
        
      if (error) throw error
    } else {
      // Capturar o usuário completo logado para preencher o responsavel
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      if (authError) throw authError

      const { error } = await supabase
        .from('ibeia_clientes')
        .insert({
          ...payload,
          responsavel: user?.id || null
        })
        
      if (error) throw error
    }
    
    // Atualizar a tabela
    await refresh()
    closeModal()
    
  } catch (err: any) {
    console.error("Erro ao salvar cliente:", err)
    alert("Ocorreu um erro ao salvar o cliente: " + (err.message || JSON.stringify(err)))
  } finally {
    isSaving.value = false
  }
}
</script>
