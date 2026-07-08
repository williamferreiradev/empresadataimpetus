<template>
  <div>
    <div class="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h2 class="text-2xl font-bold text-gray-800 dark:text-zinc-100">Ofertas e Planos</h2>
        <p class="text-gray-500 dark:text-zinc-400 mt-1">Selecione uma oferta para ver os detalhes e planos disponíveis.</p>
      </div>
      <div class="flex items-center gap-4">
        <select v-model="selectedTipo" class="border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-700 dark:text-zinc-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 outline-none text-sm shadow-sm transition-colors">
          <option value="">Todos os Tipos</option>
          <option value="Planejamento de marketing">Planejamento de marketing</option>
          <option value="Ecossitemas comercial">Ecossitemas comercial</option>
          <option value="Jornada de compra">Jornada de compra</option>
          <option value="Reativação de leads">Reativação de leads</option>
          <option value="Mentoria Curso Consultoria">Mentoria Curso Consultoria</option>
          <option value="Isca / cavalo de troia">Isca / cavalo de troia</option>
        </select>
        <NuxtLink to="/comercial/ofertas/nova" class="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-orange-600 transition-colors shadow-sm flex items-center gap-2 shrink-0">
          + Nova Oferta
        </NuxtLink>
      </div>
    </div>

    <div v-if="pending" class="py-12 text-center text-gray-500 dark:text-zinc-400">
      Carregando ofertas...
    </div>
    
    <div v-else-if="!ofertas || ofertas.length === 0" class="py-12 text-center text-gray-500 dark:text-zinc-400 bg-white dark:bg-zinc-800 rounded-xl border border-gray-200 dark:border-zinc-700 border-dashed">
      Nenhuma oferta cadastrada. Clique no botão acima para criar a primeira.
    </div>

    <div v-else class="flex flex-row flex-wrap gap-6">
      <NuxtLink 
        v-for="oferta in filteredOfertas" 
        :key="oferta.id" 
        :to="`/comercial/ofertas/${oferta.slug}`"
        class="bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl p-6 shadow-sm hover:shadow-md hover:border-orange-200 dark:hover:border-orange-500 transition-all cursor-pointer flex-1 min-w-[300px] max-w-[400px] group flex flex-col justify-between"
      >
        <div class="flex items-start justify-between gap-4">
          <div class="flex items-start gap-4">
            <div class="p-3 bg-orange-50 dark:bg-orange-900/30 text-orange-500 rounded-lg group-hover:bg-orange-500 group-hover:text-white transition-colors shrink-0">
              <component :is="getIcon(oferta.icon)" class="w-8 h-8" />
            </div>
            <div>
              <div class="flex items-center gap-2 mb-1" v-if="oferta.tipo">
                <span class="px-2 py-0.5 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-[10px] font-bold rounded uppercase tracking-wider">
                  {{ oferta.tipo }}
                </span>
              </div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-zinc-100 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">{{ oferta.title }}</h3>
              <p class="text-sm text-gray-500 dark:text-zinc-400 mt-2 line-clamp-3">{{ oferta.description }}</p>
            </div>
          </div>
          
          <button @click.prevent="confirmDelete(oferta)" class="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors shrink-0" title="Excluir Oferta">
            <TrashIcon class="w-5 h-5" />
          </button>
        </div>
      </NuxtLink>
    </div>

    <!-- Modal Confirmar Exclusão -->
    <div v-if="ofertaToDelete" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-white dark:bg-zinc-800 rounded-2xl shadow-xl p-6 w-full max-w-md border border-gray-100 dark:border-zinc-700 animate-in fade-in zoom-in duration-200">
        <h3 class="text-xl font-bold text-gray-900 dark:text-zinc-100 mb-2">Excluir Oferta?</h3>
        <p class="text-gray-600 dark:text-zinc-400 mb-6">
          Tem certeza que deseja excluir a oferta <strong>{{ ofertaToDelete.title }}</strong>? Esta ação não pode ser desfeita.
        </p>
        <div class="flex justify-end gap-3">
          <button @click="ofertaToDelete = null" class="px-4 py-2 font-medium text-gray-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-lg transition-colors">
            Cancelar
          </button>
          <button @click="deleteOferta" :disabled="isDeleting" class="px-4 py-2 font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg shadow-sm transition-colors disabled:opacity-50">
            {{ isDeleting ? 'Excluindo...' : 'Sim, excluir' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { definePageMeta, useSupabaseClient, useAsyncData } from '#imports'
import { SparklesIcon, BriefcaseIcon, BuildingOfficeIcon, RocketLaunchIcon, TagIcon, TrashIcon } from '@heroicons/vue/24/outline'

definePageMeta({
  layout: 'comercial'
})

const supabase = useSupabaseClient()

// Mapa de ícones
const iconMap = {
  SparklesIcon,
  BriefcaseIcon,
  BuildingOfficeIcon,
  RocketLaunchIcon,
  TagIcon
}

function getIcon(name) {
  return iconMap[name] || TagIcon
}

// Buscar dados do Supabase
const { data: ofertas, pending } = useAsyncData('lista-ofertas', async () => {
  const { data, error } = await supabase
    .from('ibeia_ofertas')
    .select('*')
    .order('criado_em', { ascending: false })
    
  if (error) {
    console.error('Erro ao buscar ofertas:', error)
    return []
  }
  
  return data || []
})

// Filtro
const selectedTipo = ref('')

const filteredOfertas = computed(() => {
  if (!ofertas.value) return []
  if (!selectedTipo.value) return ofertas.value
  return ofertas.value.filter(o => o.tipo === selectedTipo.value)
})

// Exclusão
const ofertaToDelete = ref(null)
const isDeleting = ref(false)

const confirmDelete = (oferta) => {
  ofertaToDelete.value = oferta
}

const deleteOferta = async () => {
  if (!ofertaToDelete.value) return
  isDeleting.value = true
  
  const { error } = await supabase
    .from('ibeia_ofertas')
    .delete()
    .eq('id', ofertaToDelete.value.id)
    
  isDeleting.value = false
  
  if (error) {
    alert('Erro ao excluir oferta: ' + error.message)
  } else {
    // Remove localmente
    ofertas.value = ofertas.value.filter(o => o.id !== ofertaToDelete.value.id)
    ofertaToDelete.value = null
  }
}
</script>
