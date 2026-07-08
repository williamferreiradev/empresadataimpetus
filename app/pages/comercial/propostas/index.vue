<template>
  <div>
    <!-- Header -->
    <div class="flex justify-between items-center mb-8">
      <div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-zinc-100">Propostas</h2>
        <p class="text-gray-500 dark:text-zinc-400 text-sm mt-1">{{ propostas.length }} proposta{{ propostas.length !== 1 ? 's' : '' }} gerada{{ propostas.length !== 1 ? 's' : '' }}</p>
      </div>
      <button
        @click="showTipoModal = true"
        class="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl font-bold shadow-sm transition-all flex items-center hover:scale-105 active:scale-95"
      >
        <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Nova Proposta
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-20">
      <svg class="animate-spin h-8 w-8 text-orange-500" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>

    <!-- Empty State -->
    <div v-else-if="propostas.length === 0" class="bg-white dark:bg-zinc-800 rounded-xl border border-gray-100 dark:border-zinc-800 shadow-sm p-16 text-center">
      <div class="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <svg class="w-8 h-8 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <h3 class="text-xl font-bold text-gray-900 dark:text-zinc-100 mb-2">Nenhuma proposta ainda</h3>
      <p class="text-gray-500 dark:text-zinc-400 mb-6">Clique em "Nova Proposta" para gerar sua primeira proposta com IA.</p>
      <button @click="showTipoModal = true" class="inline-flex items-center px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-colors">
        Criar primeira proposta
      </button>
    </div>

    <!-- Table -->
    <div v-else class="bg-white dark:bg-zinc-800 rounded-xl border border-gray-100 dark:border-zinc-800 shadow-sm overflow-hidden">
      <!-- Table Header -->
      <div class="grid grid-cols-[1fr_120px_130px_120px_100px] gap-4 px-5 py-3 border-b border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900">
        <span class="text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Cliente</span>
        <span class="text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Segmento</span>
        <span class="text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Valor</span>
        <span class="text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Status</span>
        <span class="text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider text-right">Ações</span>
      </div>

      <!-- Rows -->
      <div
        v-for="p in propostas"
        :key="p.id"
        class="grid grid-cols-[1fr_120px_130px_120px_100px] gap-4 px-5 py-4 border-b border-gray-50 last:border-0 hover:bg-orange-50/30 transition-colors items-center group"
      >
        <div class="min-w-0 cursor-pointer" @click="abrirProposta(p)">
          <div class="flex items-center gap-2">
            <div class="w-2 h-2 rounded-full shrink-0" :class="statusColor(p.status)"></div>
            <p class="font-bold text-gray-900 dark:text-zinc-100 truncate">{{ p.cliente_nome || 'Sem nome' }}</p>
            <span v-if="p.cliente_empresa" class="text-gray-400 dark:text-zinc-500 text-sm truncate hidden xl:inline">/ {{ p.cliente_empresa }}</span>
          </div>
          <p class="text-xs text-gray-400 dark:text-zinc-500 mt-0.5 ml-4">{{ formatarData(p.criado_em) }}</p>
        </div>

        <div class="cursor-pointer" @click="abrirProposta(p)">
          <span v-if="p.segmento" class="text-xs px-2 py-1 bg-orange-50 text-orange-600 rounded-full font-medium">{{ p.segmento }}</span>
          <span v-else class="text-xs text-gray-300">—</span>
        </div>

        <div class="cursor-pointer" @click="abrirProposta(p)">
          <span v-if="p.valor_estimado" class="text-sm text-gray-700 dark:text-zinc-300 font-medium">{{ p.valor_estimado }}</span>
          <span v-else class="text-xs text-gray-300">—</span>
        </div>

        <div class="cursor-pointer" @click="abrirProposta(p)">
          <span class="text-xs px-2.5 py-1 rounded-lg font-bold" :class="statusBadge(p.status)">{{ statusLabel(p.status) }}</span>
        </div>

        <div class="flex items-center justify-end gap-1">
          <button @click.stop="abrirEdicao(p)" title="Editar" class="p-2 rounded-lg text-gray-400 dark:text-zinc-500 hover:text-blue-600 hover:bg-blue-50 transition-colors">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button @click.stop="confirmarDelete(p)" title="Apagar" class="p-2 rounded-lg text-gray-400 dark:text-zinc-500 hover:text-red-600 hover:bg-red-50 transition-colors">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
          <button @click.stop="abrirProposta(p)" title="Visualizar" class="p-2 rounded-lg text-gray-400 dark:text-zinc-500 hover:text-orange-600 hover:bg-orange-50 transition-colors">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- ===== MODAL ESCOLHA DE TIPO ===== -->
    <div v-if="showTipoModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm" @click="showTipoModal = false"></div>
      <div class="relative bg-white dark:bg-zinc-800 rounded-2xl shadow-2xl w-full max-w-2xl z-10 overflow-hidden">

        <!-- Header do modal -->
        <div class="flex items-center justify-between px-8 py-6 border-b border-gray-100 dark:border-zinc-800">
          <div>
            <h3 class="text-xl font-bold text-gray-900 dark:text-zinc-100">Nova Proposta</h3>
            <p class="text-sm text-gray-500 dark:text-zinc-400 mt-0.5">Escolha como deseja criar</p>
          </div>
          <button @click="showTipoModal = false" class="p-2 rounded-xl text-gray-400 dark:text-zinc-500 hover:text-gray-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-700 dark:bg-zinc-800 transition-colors">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Cards de opção -->
        <div class="grid grid-cols-2 gap-5 p-8">

          <!-- Card 1: Editar modelo site -->
          <button
            @click="irParaModelo"
            class="group flex flex-col items-center text-center p-8 rounded-2xl border-2 border-gray-100 dark:border-zinc-800 hover:border-purple-300 hover:bg-purple-50/50 transition-all duration-200 hover:shadow-lg hover:-translate-y-1"
          >
            <div class="w-16 h-16 rounded-2xl bg-purple-100 group-hover:bg-purple-200 flex items-center justify-center mb-5 transition-colors shadow-sm">
              <svg class="w-8 h-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h4 class="text-lg font-bold text-gray-900 dark:text-zinc-100 mb-2">Editar modelo site</h4>
            <p class="text-sm text-gray-500 dark:text-zinc-400 leading-relaxed">Personalize o layout e conteúdo do site de proposta que o cliente recebe</p>
          </button>

          <!-- Card 2: Criar proposta comercial -->
          <button
            @click="irParaNovaComercial"
            class="group flex flex-col items-center text-center p-8 rounded-2xl border-2 border-gray-100 dark:border-zinc-800 hover:border-orange-300 hover:bg-orange-50/50 transition-all duration-200 hover:shadow-lg hover:-translate-y-1"
          >
            <div class="w-16 h-16 rounded-2xl bg-orange-100 group-hover:bg-orange-200 flex items-center justify-center mb-5 transition-colors shadow-sm">
              <svg class="w-8 h-8 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h4 class="text-lg font-bold text-gray-900 dark:text-zinc-100 mb-2">Criar proposta comercial</h4>
            <p class="text-sm text-gray-500 dark:text-zinc-400 leading-relaxed">Preencha o briefing e a IA gera uma proposta personalizada com Gemini</p>
          </button>

        </div>
      </div>
    </div>

    <!-- Modal Editar Status -->
    <div v-if="modalEdicao" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="fixed inset-0 bg-gray-900/50" @click="modalEdicao = null"></div>
      <div class="relative bg-white dark:bg-zinc-800 rounded-2xl shadow-xl p-8 w-full max-w-md z-10">
        <h3 class="text-xl font-bold text-gray-900 dark:text-zinc-100 mb-1">Editar Proposta</h3>
        <p class="text-sm text-gray-500 dark:text-zinc-400 mb-6">{{ modalEdicao.cliente_nome }} / {{ modalEdicao.cliente_empresa }}</p>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-bold text-gray-700 dark:text-zinc-300 mb-2">Status</label>
            <select v-model="editForm.status" class="w-full border border-gray-300 dark:border-zinc-600 rounded-xl p-3 focus:ring-2 focus:ring-orange-500">
              <option value="rascunho">Rascunho</option>
              <option value="em_revisao">Em Revisão</option>
              <option value="aprovado">Aprovado</option>
              <option value="enviado">Enviado</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-bold text-gray-700 dark:text-zinc-300 mb-2">Valor estimado</label>
            <input v-model="editForm.valor_estimado" type="text" placeholder="Ex: R$ 4.800/mês" class="w-full border border-gray-300 dark:border-zinc-600 rounded-xl p-3 focus:ring-2 focus:ring-orange-500" />
          </div>
        </div>
        <div class="flex justify-end gap-3 mt-6">
          <button @click="modalEdicao = null" class="px-5 py-2.5 text-gray-500 dark:text-zinc-400 font-bold hover:text-gray-700 dark:hover:text-zinc-200 dark:text-zinc-300">Cancelar</button>
          <button @click="salvarEdicao" :disabled="salvando" class="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl disabled:opacity-50 transition-colors">
            {{ salvando ? 'Salvando...' : 'Salvar' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Confirmar Delete -->
    <div v-if="propostaParaDelete" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="fixed inset-0 bg-gray-900/50" @click="propostaParaDelete = null"></div>
      <div class="relative bg-white dark:bg-zinc-800 rounded-2xl shadow-xl p-8 w-full max-w-sm z-10 text-center">
        <div class="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-7 h-7 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </div>
        <h3 class="text-lg font-bold text-gray-900 dark:text-zinc-100 mb-2">Apagar proposta?</h3>
        <p class="text-gray-500 dark:text-zinc-400 text-sm mb-6">A proposta de <strong>{{ propostaParaDelete.cliente_nome }}</strong> será removida permanentemente.</p>
        <div class="flex gap-3 justify-center">
          <button @click="propostaParaDelete = null" class="px-5 py-2.5 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-700 dark:text-zinc-300 font-bold rounded-xl transition-colors">Cancelar</button>
          <button @click="executarDelete" :disabled="deletando" class="px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl disabled:opacity-50 transition-colors">
            {{ deletando ? 'Apagando...' : 'Apagar' }}
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { usePropostasStore } from '~/stores/propostas'
import { storeToRefs } from 'pinia'
import { useUserRole } from '#imports'

definePageMeta({ layout: 'comercial' })

const router = useRouter()
const store = usePropostasStore()
const { propostas, loading } = storeToRefs(store)

// Modal tipo
const showTipoModal = ref(false)

// Edit state
const modalEdicao = ref(null)
const editForm = ref({ status: '', valor_estimado: '' })
const salvando = ref(false)

// Delete state
const propostaParaDelete = ref(null)
const deletando = ref(false)

const { userViewAllLeads, userId } = useUserRole()

onMounted(() => store.fetchPropostas())

watch([userViewAllLeads, userId], () => {
  store.fetchPropostas()
})

function irParaModelo() {
  showTipoModal.value = false
  router.push('/comercial/propostas/modelos')
}

function irParaNovaComercial() {
  showTipoModal.value = false
  router.push('/comercial/propostas/nova-proposta')
}

function abrirProposta(p) {
  router.push(`/p/${p.id}`)
}

function abrirEdicao(p) {
  modalEdicao.value = p
  editForm.value = { status: p.status || 'rascunho', valor_estimado: p.valor_estimado || '' }
}

async function salvarEdicao() {
  if (!modalEdicao.value) return
  salvando.value = true
  try {
    await store.updateProposta(modalEdicao.value.id, {
      status: editForm.value.status,
      valor_estimado: editForm.value.valor_estimado,
    })
    modalEdicao.value = null
  } catch (e) {
    alert('Erro ao salvar: ' + e.message)
  } finally {
    salvando.value = false
  }
}

function confirmarDelete(p) {
  propostaParaDelete.value = p
}

async function executarDelete() {
  if (!propostaParaDelete.value) return
  deletando.value = true
  try {
    await store.deleteProposta(propostaParaDelete.value.id)
    propostaParaDelete.value = null
  } catch (e) {
    alert('Erro ao apagar: ' + e.message)
  } finally {
    deletando.value = false
  }
}

function formatarData(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
}

function statusColor(status) {
  const map = { rascunho: 'bg-gray-300', em_revisao: 'bg-yellow-400', aprovado: 'bg-green-500', enviado: 'bg-blue-500' }
  return map[status] || 'bg-gray-300'
}

function statusLabel(status) {
  const map = { rascunho: 'Rascunho', em_revisao: 'Em Revisão', aprovado: 'Aprovado', enviado: 'Enviado' }
  return map[status] || status || 'Rascunho'
}

function statusBadge(status) {
  const map = { rascunho: 'bg-gray-100 text-gray-600', em_revisao: 'bg-yellow-50 text-yellow-700', aprovado: 'bg-green-50 text-green-700', enviado: 'bg-blue-50 text-blue-700' }
  return map[status] || 'bg-gray-100 text-gray-600'
}
</script>
