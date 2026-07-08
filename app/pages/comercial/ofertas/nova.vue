<template>
  <div>
    <div class="mb-6">
      <NuxtLink to="/comercial/ofertas" class="text-orange-500 hover:text-orange-600 flex items-center text-sm font-medium mb-4">
        &larr; Voltar para ofertas
      </NuxtLink>
      <h2 class="text-2xl font-bold text-gray-800 dark:text-zinc-100">Criar Nova Oferta</h2>
      <p class="text-gray-500 dark:text-zinc-400 mt-1">Preencha os dados da oferta. Você pode usar a barra de ferramentas para formatar o texto ou apenas colar de outro lugar.</p>
    </div>

    <div class="bg-white dark:bg-zinc-800 rounded-xl border border-gray-200 dark:border-zinc-700 shadow-sm p-6">
      <div class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Título da Oferta</label>
            <input type="text" v-model="form.title" class="w-full border border-gray-300 dark:border-zinc-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-shadow" placeholder="Ex: Diagnóstico Digital">
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Breve Descrição (Subtítulo)</label>
            <input type="text" v-model="form.description" class="w-full border border-gray-300 dark:border-zinc-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-shadow" placeholder="Uma frase curta sobre a oferta">
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Tipo de Oferta</label>
          <select v-model="form.tipo" class="w-full border border-gray-300 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-shadow">
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
          <label class="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Hiperdescrição (Cópia / VSL / Landing Page)</label>
          <p class="text-xs text-gray-500 dark:text-zinc-400 mb-3">Use o editor abaixo para formatar o texto como se fosse o Word, ou apenas cole o texto já formatado da IA.</p>
          
          <RichTextEditor v-model="form.hiperdescricao" />
        </div>

        <div class="pt-6 border-t border-gray-100 dark:border-zinc-800 dark:border-zinc-700 flex justify-end gap-3">
          <NuxtLink to="/comercial/ofertas" class="px-6 py-2.5 rounded-lg font-medium text-gray-600 dark:text-zinc-400 hover:bg-gray-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 transition-colors">
            Cancelar
          </NuxtLink>
          <button @click="salvarOferta" :disabled="isSaving" class="bg-orange-500 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-orange-600 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed">
            {{ isSaving ? 'Salvando...' : 'Criar Oferta' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { definePageMeta, useSupabaseClient, useRouter } from '#imports'

definePageMeta({
  layout: 'comercial'
})

const supabase = useSupabaseClient()
const router = useRouter()
const isSaving = ref(false)

const form = ref({
  title: '',
  description: '',
  tipo: '',
  hiperdescricao: ''
})

const salvarOferta = async () => {
  if (!form.value.title) {
    alert('O título da oferta é obrigatório.')
    return
  }

  isSaving.value = true

  // Gerar um slug amigável a partir do título
  const slug = form.value.title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')

  const { error } = await supabase
    .from('ibeia_ofertas')
    .insert({
      title: form.value.title,
      slug: slug,
      description: form.value.description,
      tipo: form.value.tipo || null,
      hiperdescricao: form.value.hiperdescricao,
      icon: 'TagIcon' // Ícone padrão. Pode ser alterado no futuro.
    })

  isSaving.value = false

  if (error) {
    console.error('Erro ao salvar:', error)
    alert('Erro ao salvar a oferta: ' + error.message)
  } else {
    router.push('/comercial/ofertas')
  }
}
</script>
