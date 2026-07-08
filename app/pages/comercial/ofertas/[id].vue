<template>
  <div>
    <div class="mb-6 flex items-center justify-between">
      <NuxtLink to="/comercial/ofertas" class="text-orange-500 hover:text-orange-600 flex items-center text-sm font-medium mb-4">
        &larr; Voltar para ofertas
      </NuxtLink>
      
      <div v-if="oferta" class="flex items-center gap-3">
        <button v-if="!isEditing" @click="isEditing = true" class="bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-zinc-300 dark:text-zinc-200 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50 dark:hover:bg-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-700 transition-colors shadow-sm">
          Editar Oferta
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="pending" class="py-12 text-center text-gray-500 dark:text-zinc-400">
      Carregando oferta...
    </div>

    <!-- Not Found State -->
    <div v-else-if="!oferta" class="py-12 text-center text-gray-500 dark:text-zinc-400 bg-white dark:bg-zinc-800 rounded-xl border border-gray-200 dark:border-zinc-700">
      <h2 class="text-xl font-bold mb-2 text-gray-900 dark:text-zinc-100">Oferta não encontrada</h2>
      <p>A oferta que você tentou acessar não existe ou foi removida.</p>
    </div>

    <!-- Content / Edit State -->
    <div v-else class="bg-white dark:bg-zinc-800 rounded-xl border border-gray-200 dark:border-zinc-700 shadow-sm overflow-hidden">
      
      <!-- VIEW MODE -->
      <template v-if="!isEditing">
        <div class="bg-gray-50 dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-700 p-8">
          <h1 class="text-3xl font-bold text-gray-900 dark:text-zinc-100">{{ oferta.title }}</h1>
          <p class="text-lg text-gray-600 dark:text-zinc-400 mt-2">{{ oferta.description }}</p>
        </div>

        <div class="p-8">
          <!-- Renderizando a hiperdescricao em HTML vindo do banco -->
          <article class="prose prose-sm sm:prose-base prose-orange dark:prose-invert max-w-none" v-html="oferta.hiperdescricao || '<p class=\'text-gray-400 dark:text-zinc-500 italic\'>Nenhum texto cadastrado para esta oferta.</p>'"></article>
        </div>
      </template>

      <!-- EDIT MODE -->
      <template v-else>
        <div class="p-6 space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Título da Oferta</label>
              <input type="text" v-model="editForm.title" class="w-full border border-gray-300 dark:border-zinc-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none">
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Breve Descrição</label>
              <input type="text" v-model="editForm.description" class="w-full border border-gray-300 dark:border-zinc-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none">
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Hiperdescrição (Cópia da Landing Page)</label>
            <RichTextEditor v-model="editForm.hiperdescricao" />
          </div>

          <div class="pt-6 border-t border-gray-100 dark:border-zinc-800 dark:border-zinc-700 flex justify-end gap-3">
            <button @click="cancelEdit" class="px-6 py-2.5 rounded-lg font-medium text-gray-600 dark:text-zinc-400 hover:bg-gray-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 transition-colors">
              Cancelar
            </button>
            <button @click="salvarEdicao" :disabled="isSaving" class="bg-orange-500 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-orange-600 transition-colors shadow-sm disabled:opacity-50">
              {{ isSaving ? 'Salvando...' : 'Salvar Alterações' }}
            </button>
          </div>
        </div>
      </template>

    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { definePageMeta, useSupabaseClient, useAsyncData } from '#imports'

definePageMeta({
  layout: 'comercial'
})

const route = useRoute()
const slug = route.params.id
const supabase = useSupabaseClient()

// Busca os dados da oferta pelo slug
const { data: oferta, pending } = useAsyncData(`oferta-${slug}`, async () => {
  const { data, error } = await supabase
    .from('ibeia_ofertas')
    .select('*')
    .eq('slug', slug)
    .single()
    
  if (error) {
    console.error('Erro ao buscar a oferta:', error)
    return null
  }
  
  return data
})

const isEditing = ref(false)
const isSaving = ref(false)

const editForm = ref({
  title: '',
  description: '',
  hiperdescricao: ''
})

// Quando os dados da oferta carregarem, preenche o formulário
watch(oferta, (newVal) => {
  if (newVal) {
    editForm.value = {
      title: newVal.title || '',
      description: newVal.description || '',
      hiperdescricao: newVal.hiperdescricao || ''
    }
  }
}, { immediate: true })

const cancelEdit = () => {
  if (oferta.value) {
    editForm.value = {
      title: oferta.value.title || '',
      description: oferta.value.description || '',
      hiperdescricao: oferta.value.hiperdescricao || ''
    }
  }
  isEditing.value = false
}

const salvarEdicao = async () => {
  if (!editForm.value.title) return alert('O título é obrigatório.')

  isSaving.value = true

  const { error } = await supabase
    .from('ibeia_ofertas')
    .update({
      title: editForm.value.title,
      description: editForm.value.description,
      hiperdescricao: editForm.value.hiperdescricao,
      atualizado_em: new Date().toISOString()
    })
    .eq('id', oferta.value.id)

  isSaving.value = false

  if (error) {
    console.error('Erro ao salvar edições:', error)
    alert('Erro ao salvar as edições: ' + error.message)
  } else {
    // Atualiza a view
    oferta.value.title = editForm.value.title
    oferta.value.description = editForm.value.description
    oferta.value.hiperdescricao = editForm.value.hiperdescricao
    isEditing.value = false
  }
}
</script>
