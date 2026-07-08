<template>
  <div>
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold text-gray-800 dark:text-zinc-100">Ofertas e Planos</h2>
        <p class="text-gray-500 dark:text-zinc-400 mt-1">Selecione uma oferta para ver os detalhes e planos disponíveis.</p>
      </div>
      <NuxtLink to="/comercial/ofertas/nova" class="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-orange-600 transition-colors shadow-sm flex items-center gap-2">
        + Nova Oferta
      </NuxtLink>
    </div>

    <div v-if="pending" class="py-12 text-center text-gray-500 dark:text-zinc-400">
      Carregando ofertas...
    </div>
    
    <div v-else-if="!ofertas || ofertas.length === 0" class="py-12 text-center text-gray-500 dark:text-zinc-400 bg-white dark:bg-zinc-800 rounded-xl border border-gray-200 dark:border-zinc-700 border-dashed">
      Nenhuma oferta cadastrada. Clique no botão acima para criar a primeira.
    </div>

    <div v-else class="flex flex-row flex-wrap gap-6">
      <NuxtLink 
        v-for="oferta in ofertas" 
        :key="oferta.id" 
        :to="`/comercial/ofertas/${oferta.slug}`"
        class="bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl p-6 shadow-sm hover:shadow-md hover:border-orange-200 dark:hover:border-orange-500 transition-all cursor-pointer flex-1 min-w-[300px] max-w-[400px] group"
      >
        <div class="flex items-start gap-4">
          <div class="p-3 bg-orange-50 dark:bg-orange-900/30 text-orange-500 rounded-lg group-hover:bg-orange-500 group-hover:text-white transition-colors">
            <component :is="getIcon(oferta.icon)" class="w-8 h-8" />
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-zinc-100 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">{{ oferta.title }}</h3>
            <p class="text-sm text-gray-500 dark:text-zinc-400 mt-2 line-clamp-3">{{ oferta.description }}</p>
          </div>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
import { definePageMeta, useSupabaseClient, useAsyncData } from '#imports'
import { SparklesIcon, BriefcaseIcon, BuildingOfficeIcon, RocketLaunchIcon, TagIcon } from '@heroicons/vue/24/outline'

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
</script>
