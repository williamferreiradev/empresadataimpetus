<template>
  <div>
    <div class="mb-6 flex items-center justify-between">
      <NuxtLink to="/comercial/ofertas" class="text-orange-500 hover:text-orange-600 flex items-center text-sm font-medium mb-4">
        &larr; Voltar para ofertas
      </NuxtLink>
      
      <div v-if="oferta" class="flex items-center gap-3">
        <button v-if="!isEditing" @click="transformarEmMapa" :disabled="isTransforming" class="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm disabled:opacity-50 flex items-center">
          <span v-if="isTransforming" class="flex items-center">
            <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            Por favor aguarde...
          </span>
          <span v-else class="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"></rect><path d="M8 12h8"></path><path d="M12 8v8"></path></svg>
            Transformar em Mapa Mental
          </span>
        </button>
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
          <div class="flex items-center gap-3 mb-2" v-if="oferta.tipo">
            <span class="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-xs font-medium rounded-full">
              {{ oferta.tipo }}
            </span>
          </div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-zinc-100">{{ oferta.title }}</h1>
          <p class="text-lg text-gray-600 dark:text-zinc-400 mt-2">{{ oferta.description }}</p>
        </div>

        <div class="p-8">
          <!-- Renderizando a hiperdescricao em HTML vindo do banco -->
          <article class="prose prose-sm sm:prose-base prose-orange dark:prose-invert dark:prose-dark max-w-none" v-html="oferta.hiperdescricao || '<p class=\'text-gray-400 dark:text-zinc-500 italic\'>Nenhum texto cadastrado para esta oferta.</p>'"></article>
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
            <label class="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Tipo de Oferta</label>
            <select v-model="editForm.tipo" class="w-full border border-gray-300 dark:border-zinc-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none">
              <option value="">Selecione o tipo...</option>
              <option value="Planejamento de marketing">Planejamento de marketing</option>
              <option value="Ecossitemas comercial">Ecossitemas comercial</option>
              <option value="Jornada de compra">Jornada de compra</option>
              <option value="Reativação de leads">Reativação de leads</option>
              <option value="Mentoria Curso Consultoria">Mentoria Curso Consultoria</option>
              <option value="Isca / cavalo de troia">Isca / cavalo de troia</option>
            </select>
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
const isTransforming = ref(false)

const transformarEmMapa = async () => {
  if (!oferta.value) return
  isTransforming.value = true

  const nodeRootId = `n-${crypto.randomUUID()}`
  let currentY = 100
  
  const nodes = [
    {
      id: nodeRootId,
      type: 'custom',
      position: { x: 100, y: 300 },
      data: { label: oferta.value.title || 'Oferta Central', shape: 'rectangle', category: 'core' }
    }
  ]
  
  const edges = []
  let categoryX = 500
  let itemX = 950

  // Create node for type
  if (oferta.value.tipo) {
    const nodeTipoId = `n-${crypto.randomUUID()}`
    nodes.push({
      id: nodeTipoId,
      type: 'custom',
      position: { x: categoryX, y: currentY },
      data: { label: oferta.value.tipo, shape: 'rectangle', category: 'vertical' }
    })
    
    edges.push({
      id: `e-${crypto.randomUUID()}`,
      type: 'custom',
      source: nodeRootId,
      sourceHandle: 'right-s',
      target: nodeTipoId,
      targetHandle: 'left-t',
      data: { routing: 'bezier', styleType: 'normal', color: '#64748b' }
    })
    currentY += 100
  }

  // Create node for description
  if (oferta.value.description) {
    const nodeDescId = `n-${crypto.randomUUID()}`
    nodes.push({
      id: nodeDescId,
      type: 'custom',
      position: { x: categoryX, y: currentY },
      data: { label: oferta.value.description, shape: 'rectangle', category: 'oferta' }
    })
    
    edges.push({
      id: `e-${crypto.randomUUID()}`,
      type: 'custom',
      source: nodeRootId,
      sourceHandle: 'right-s',
      target: nodeDescId,
      targetHandle: 'left-t',
      data: { routing: 'bezier', styleType: 'normal', color: '#64748b' }
    })
    currentY += 100
  }

  // Parse HTML
  if (oferta.value.hiperdescricao) {
    const parser = new DOMParser()
    const doc = parser.parseFromString(oferta.value.hiperdescricao, 'text/html')
    
    let currentCategoryId = null
    
    Array.from(doc.body.children).forEach(el => {
      const tagName = el.tagName.toLowerCase()
      const text = el.textContent.trim()
      if (!text) return
      
      const isHeader = /^h[1-6]$/.test(tagName) || 
                       (el.querySelector('strong') && text === el.querySelector('strong').textContent) ||
                       (text.length < 40 && !text.endsWith('.') && !text.endsWith(';') && !text.includes(', '));
      
      if (isHeader) {
        currentCategoryId = `n-${crypto.randomUUID()}`
        nodes.push({
          id: currentCategoryId,
          type: 'custom',
          position: { x: categoryX, y: currentY },
          data: { label: text, shape: 'rectangle', category: 'vertical' }
        })
        edges.push({
          id: `e-${crypto.randomUUID()}`,
          type: 'custom',
          source: nodeRootId,
          sourceHandle: 'right-s',
          target: currentCategoryId,
          targetHandle: 'left-t',
          data: { routing: 'bezier', styleType: 'normal', color: '#64748b' }
        })
        currentY += 80
      } else if (tagName === 'ul' || tagName === 'ol') {
        Array.from(el.querySelectorAll('li')).forEach(li => {
          const liText = li.textContent.trim()
          if (!liText) return
          const liId = `n-${crypto.randomUUID()}`
          nodes.push({
            id: liId,
            type: 'custom',
            position: { x: currentCategoryId ? itemX : categoryX, y: currentY },
            data: { label: liText, shape: 'rectangle', category: 'oferta' }
          })
          edges.push({
            id: `e-${crypto.randomUUID()}`,
            type: 'custom',
            source: currentCategoryId || nodeRootId,
            sourceHandle: 'right-s',
            target: liId,
            targetHandle: 'left-t',
            data: { routing: 'bezier', styleType: 'normal', color: '#64748b' }
          })
          currentY += 100
        })
        currentY += 20
      } else {
        const textId = `n-${crypto.randomUUID()}`
        nodes.push({
          id: textId,
          type: 'custom',
          position: { x: currentCategoryId ? itemX : categoryX, y: currentY },
          data: { label: text, shape: 'rectangle', category: 'oferta' }
        })
        edges.push({
          id: `e-${crypto.randomUUID()}`,
          type: 'custom',
          source: currentCategoryId || nodeRootId,
          sourceHandle: 'right-s',
          target: textId,
          targetHandle: 'left-t',
          data: { routing: 'bezier', styleType: 'normal', color: '#64748b' }
        })
        currentY += 120
      }
    })
  }

  // Adjust root node's Y to be roughly in the middle
  if (nodes[0].id === nodeRootId) {
    nodes[0].position.y = Math.max(150, currentY / 2)
  }

  const { data, error } = await supabase
    .from('ibeia_mapas_mentais')
    .insert([
      { 
        nome: `Mapa da Oferta: ${oferta.value.title}`, 
        elementos: [...nodes, ...edges]
      }
    ])
    .select()
    .single()
    
  isTransforming.value = false
  
  if (!error && data) {
    navigateTo(`/marketing/mapas-mentais/${data.id}`)
  } else {
    alert('Erro ao criar mapa mental a partir da oferta.')
  }
}

const editForm = ref({
  title: '',
  description: '',
  tipo: '',
  hiperdescricao: ''
})

// Quando os dados da oferta carregarem, preenche o formulário
watch(oferta, (newVal) => {
  if (newVal) {
    editForm.value = {
      title: newVal.title || '',
      description: newVal.description || '',
      tipo: newVal.tipo || '',
      hiperdescricao: newVal.hiperdescricao || ''
    }
  }
}, { immediate: true })

const cancelEdit = () => {
  if (oferta.value) {
    editForm.value = {
      title: oferta.value.title || '',
      description: oferta.value.description || '',
      tipo: oferta.value.tipo || '',
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
      tipo: editForm.value.tipo || null,
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
    oferta.value.tipo = editForm.value.tipo
    oferta.value.hiperdescricao = editForm.value.hiperdescricao
    isEditing.value = false
  }
}
</script>
