<template>
  <div class="flex h-screen bg-gray-50 dark:bg-zinc-900 overflow-hidden">
    
    <!-- Left Sidebar: Form -->
    <div class="w-[400px] shrink-0 bg-white dark:bg-zinc-800 border-r border-gray-200 dark:border-zinc-700 flex flex-col h-full z-10 shadow-lg">
      <div class="p-6 border-b border-gray-100 dark:border-zinc-800 flex items-center justify-between shrink-0 bg-gray-50 dark:bg-zinc-900">
        <div>
          <h2 class="text-xl font-black text-gray-900 dark:text-zinc-100">Editor de Site</h2>
          <p class="text-sm text-gray-500 dark:text-zinc-400 font-medium">Configure a landing page do cliente</p>
        </div>
        <NuxtLink to="/comercial/propostas/modelos" class="p-2 text-gray-400 dark:text-zinc-500 hover:text-gray-700 dark:hover:text-zinc-200 dark:text-zinc-300 bg-white dark:bg-zinc-800 rounded-lg border hover:bg-gray-50 dark:hover:bg-zinc-800 dark:bg-zinc-900">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </NuxtLink>
      </div>

      <div class="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
        
        <!-- Text Inputs -->
        <div class="space-y-4">
          <!-- Dropdown de clientes com pesquisa -->
          <div class="relative" ref="dropdownRef">
            <label class="block text-sm font-bold text-gray-700 dark:text-zinc-300 mb-2">Lead existente</label>
            <div 
              @click="dropdownOpen = !dropdownOpen" 
              class="w-full border border-gray-300 dark:border-zinc-600 rounded-xl focus-within:ring-2 focus-within:ring-orange-500 focus-within:border-orange-500 p-3 bg-gray-50 dark:bg-zinc-900 cursor-pointer flex justify-between items-center"
            >
              <span class="truncate text-gray-700 dark:text-zinc-300">{{ selectedClienteNome || '-- Preencher manualmente ou selecionar --' }}</span>
              <svg class="w-5 h-5 text-gray-400 dark:text-zinc-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
            
            <div v-if="dropdownOpen" class="absolute z-50 w-full mt-1 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl shadow-lg max-h-60 overflow-y-auto">
              <div class="sticky top-0 bg-white dark:bg-zinc-800 p-2 border-b border-gray-100 dark:border-zinc-800">
                <input 
                  v-model="searchCliente" 
                  type="text" 
                  class="w-full border border-gray-300 dark:border-zinc-600 rounded-lg p-2 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none" 
                  placeholder="Pesquisar cliente..." 
                  @click.stop 
                />
              </div>
              <div 
                @click="selecionarDropdown('')" 
                class="px-4 py-3 hover:bg-orange-50 cursor-pointer text-sm text-gray-600 dark:text-zinc-400 border-b border-gray-100 dark:border-zinc-800"
              >
                -- Preencher manualmente ou limpar seleção --
              </div>
              <div 
                v-for="c in filteredClientes" 
                :key="c.id" 
                @click="selecionarDropdown(c)" 
                class="px-4 py-3 hover:bg-orange-50 cursor-pointer text-sm truncate text-gray-800 dark:text-zinc-100"
              >
                {{ c.nome }} {{ c.empresa ? `— ${c.empresa}` : '' }}
              </div>
              <div v-if="filteredClientes.length === 0" class="px-4 py-3 text-sm text-gray-500 dark:text-zinc-400 text-center">
                Nenhum cliente encontrado
              </div>
            </div>
          </div>

          <div>
            <label class="block text-sm font-bold text-gray-700 dark:text-zinc-300 mb-1">Nome do Cliente / Responsável <span class="text-red-500">*</span></label>
            <input v-model="content.nomeCliente" type="text" class="w-full px-4 py-2.5 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white dark:bg-zinc-800 transition-colors" placeholder="Ex: João Silva" />
          </div>
          <div>
            <label class="block text-sm font-bold text-gray-700 dark:text-zinc-300 mb-1">Nome da Empresa</label>
            <input v-model="content.nomeEmpresa" type="text" class="w-full px-4 py-2.5 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white dark:bg-zinc-800 transition-colors" placeholder="Ex: Barbearia do João" />
          </div>
          <div>
            <label class="block text-sm font-bold text-gray-700 dark:text-zinc-300 mb-1">Texto "Quem sou eu"</label>
            <textarea v-model="content.sobreTexto" rows="3" class="w-full px-4 py-2.5 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white dark:bg-zinc-800 transition-colors" placeholder="Ex: Olá, eu sou o Cauê Du'corte. Minha jornada..."></textarea>
          </div>
        </div>

        <!-- Image Uploads -->
        <div class="space-y-6">
          <h3 class="font-bold text-gray-900 dark:text-zinc-100 border-b pb-2">Imagens</h3>
          
          <!-- Logo -->
          <div>
            <label class="block text-sm font-bold text-gray-700 dark:text-zinc-300 mb-2">Logo da Empresa</label>
            <div class="flex items-center gap-4">
              <div class="w-16 h-16 rounded-xl border-2 border-dashed border-gray-300 dark:border-zinc-600 flex items-center justify-center bg-gray-50 dark:bg-zinc-900 overflow-hidden shrink-0">
                <img v-if="content.logoUrl" :src="content.logoUrl" class="w-full h-full object-contain" />
                <svg v-else class="w-6 h-6 text-gray-400 dark:text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              </div>
              <div class="flex-1">
                <input type="file" accept="image/*" @change="uploadImage($event, 'logoUrl')" class="hidden" id="upload-logo" :disabled="isUploading" />
                <label for="upload-logo" class="cursor-pointer inline-block bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-600 text-gray-700 dark:text-zinc-300 text-sm font-bold px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 dark:bg-zinc-900 transition-colors w-full text-center">
                  {{ isUploading === 'logoUrl' ? 'Enviando...' : 'Fazer Upload' }}
                </label>
              </div>
            </div>
          </div>

          <!-- Hero Image -->
          <div>
            <label class="block text-sm font-bold text-gray-700 dark:text-zinc-300 mb-2">Foto Principal (Hero)</label>
            <div class="flex flex-col gap-3">
              <div class="w-full h-32 rounded-xl border-2 border-dashed border-gray-300 dark:border-zinc-600 flex items-center justify-center bg-gray-50 dark:bg-zinc-900 overflow-hidden relative">
                <img v-if="content.heroUrl" :src="content.heroUrl" class="w-full h-full object-cover" />
                <div v-else class="text-center">
                  <svg class="w-8 h-8 text-gray-400 dark:text-zinc-500 mx-auto mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  <p class="text-xs text-gray-500 dark:text-zinc-400">Formato paisagem</p>
                </div>
              </div>
              <input type="file" accept="image/*" @change="uploadImage($event, 'heroUrl')" class="hidden" id="upload-hero" :disabled="isUploading" />
              <label for="upload-hero" class="cursor-pointer bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-600 text-gray-700 dark:text-zinc-300 text-sm font-bold px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 dark:bg-zinc-900 transition-colors text-center">
                {{ isUploading === 'heroUrl' ? 'Enviando...' : 'Fazer Upload da Foto' }}
              </label>
            </div>
          </div>

          <!-- Sobre Mim Image -->
          <div>
            <label class="block text-sm font-bold text-gray-700 dark:text-zinc-300 mb-2">Foto "Quem sou eu"</label>
            <div class="flex flex-col gap-3">
              <div class="w-full h-32 rounded-xl border-2 border-dashed border-gray-300 dark:border-zinc-600 flex items-center justify-center bg-gray-50 dark:bg-zinc-900 overflow-hidden relative">
                <img v-if="content.sobreUrl" :src="content.sobreUrl" class="w-full h-full object-cover" />
                <div v-else class="text-center">
                  <svg class="w-8 h-8 text-gray-400 dark:text-zinc-500 mx-auto mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  <p class="text-xs text-gray-500 dark:text-zinc-400">Foto perfil ou de trabalho</p>
                </div>
              </div>
              <input type="file" accept="image/*" @change="uploadImage($event, 'sobreUrl')" class="hidden" id="upload-sobre" :disabled="isUploading" />
              <label for="upload-sobre" class="cursor-pointer bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-600 text-gray-700 dark:text-zinc-300 text-sm font-bold px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 dark:bg-zinc-900 transition-colors text-center">
                {{ isUploading === 'sobreUrl' ? 'Enviando...' : 'Fazer Upload da Foto' }}
              </label>
            </div>
          </div>

        </div>
      </div>

      <!-- Footer Actions -->
      <div class="p-6 border-t border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 shrink-0">
        <button 
          @click="salvarProposta" 
          :disabled="isSaving"
          class="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg py-4 rounded-xl shadow-lg shadow-orange-500/30 transition-all flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg v-if="!isSaving" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
          <svg v-else class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          {{ isSaving ? 'Salvando...' : 'Salvar Proposta' }}
        </button>
      </div>
    </div>

    <!-- Right Area: Preview -->
    <div class="flex-1 bg-gray-900 relative overflow-hidden flex flex-col items-center">
      <!-- Faux Browser Header -->
      <div class="w-full h-14 bg-[#1e1e1e] border-b border-white/10 flex items-center px-4 gap-4 shrink-0 shadow-md z-10">
        <div class="flex gap-2">
          <div class="w-3 h-3 rounded-full bg-red-500"></div>
          <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div class="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div class="flex-1 flex justify-center">
          <div class="bg-black/40 px-4 py-1.5 rounded text-xs text-gray-400 dark:text-zinc-500 font-mono tracking-wide w-full max-w-lg text-center border border-white/5">
            https://dataimpetus.com/p/preview
          </div>
        </div>
        <div class="w-12 text-xs text-gray-500 dark:text-zinc-400 font-bold tracking-widest uppercase">Preview</div>
      </div>
      
      <!-- Preview Scroll Area -->
      <div class="flex-1 w-full overflow-y-auto custom-scrollbar relative">
        <!-- Scale down the preview slightly so it looks like a browser window inside the editor -->
        <SitePreview v-if="themeConfig" :theme="themeConfig" :content="content" />
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserRole } from '#imports'

definePageMeta({ layout: false }) // Uses an empty layout to take up the full screen

const route = useRoute()
const router = useRouter()
const supabase = useSupabaseClient()
const user = useSupabaseUser()
const { userViewAllLeads, userId } = useUserRole()

const isUploading = ref(false)
const isSaving = ref(false)

const clientes = ref([])
const selectedClienteId = ref('')

// Refs do dropdown customizado
const dropdownRef = ref(null)
const dropdownOpen = ref(false)
const searchCliente = ref('')
const selectedClienteNome = ref('')

const filteredClientes = computed(() => {
  if (!searchCliente.value) return clientes.value
  const query = searchCliente.value.toLowerCase()
  return clientes.value.filter(c => 
    c.nome.toLowerCase().includes(query) || 
    (c.empresa && c.empresa.toLowerCase().includes(query))
  )
})

function selecionarDropdown(c) {
  if (!c) {
    selectedClienteId.value = ''
    selectedClienteNome.value = ''
    content.value.nomeCliente = ''
    content.value.nomeEmpresa = ''
  } else {
    selectedClienteId.value = c.id
    selectedClienteNome.value = c.nome + (c.empresa ? ` — ${c.empresa}` : '')
    content.value.nomeCliente = c.nome || ''
    content.value.nomeEmpresa = c.empresa || ''
  }
  dropdownOpen.value = false
  searchCliente.value = ''
}

function closeDropdown(e) {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target)) {
    dropdownOpen.value = false
  }
}

onMounted(() => {
  fetchClientes()
  document.addEventListener('click', closeDropdown)
})

onUnmounted(() => {
  document.removeEventListener('click', closeDropdown)
})

watch([userViewAllLeads, userId], () => {
  fetchClientes()
})

async function fetchClientes() {
  let query = supabase
    .from('ibeia_clientes')
    .select('id, nome, empresa')
    .order('criado_em', { ascending: false })
    
  if (!userViewAllLeads.value && userId.value) {
    query = query.eq('responsavel', userId.value)
  }

  const { data, error } = await query
  if (error) console.warn('Erro ao buscar clientes:', error.message)
  if (data) clientes.value = data
}

// All available themes (copied from modelos.vue logic)
const temasBase = {
  'barbearia': {
    cor: '#eab308',
    temaEscuro: true,
    hero: { tagline: 'Tradição & Estilo', headline: 'Ousadia em', highlight: 'Cada Corte', subheadline: 'Experiência premium de cuidados masculinos.' }
  },
  'despachante': {
    cor: '#dc2626',
    temaEscuro: false,
    hero: { tagline: 'Despachante VIP', headline: 'Tudo em', highlight: 'Documentação', subheadline: 'Processos rápidos e sem burocracia veicular.' }
  },
  'dentista': {
    cor: '#0ea5e9',
    temaEscuro: false,
    hero: { tagline: 'Sorriso Perfeito', headline: 'A clínica', highlight: 'dos seus sonhos', subheadline: 'Tecnologia avançada para cuidar do seu sorriso.' }
  },
  'clinica-olhos': {
    cor: '#7c3aed',
    temaEscuro: false,
    hero: { tagline: 'Visão Clara', headline: 'Veja o mundo', highlight: 'com nitidez', subheadline: 'Oftalmologia avançada e cirurgias seguras.' }
  },
  'cerimonialista': {
    cor: '#be185d',
    temaEscuro: false,
    hero: { tagline: 'Momento Único', headline: 'O seu evento', highlight: 'inesquecível', subheadline: 'Planejamento e assessoria completa para casamentos.' }
  },
  'autocenter': {
    cor: '#d97706',
    temaEscuro: true,
    hero: { tagline: 'Confiança', headline: 'Seu carro', highlight: 'em boas mãos', subheadline: 'Revisão automotiva completa e garantida.' }
  }
}

const content = ref({
  nomeCliente: '',
  nomeEmpresa: '',
  logoUrl: '',
  heroUrl: '',
  sobreUrl: '',
  sobreTexto: ''
})

// Determined theme
const modeloId = computed(() => route.query.modelo || 'barbearia')
const themeConfig = computed(() => {
  const t = temasBase[modeloId.value] || temasBase['barbearia']
  return { ...t, id: modeloId.value }
})

// Upload logic
async function uploadImage(event, targetField) {
  const file = event.target.files[0]
  if (!file) return

  isUploading.value = targetField
  try {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
    const filePath = `public/${fileName}`

    const { data, error } = await supabase.storage
      .from('img')
      .upload(filePath, file)

    if (error) {
      console.error('Upload error:', error)
      alert(`Erro no upload: ${error.message}. Certifique-se que o bucket "img" existe e é público.`)
      return
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('img')
      .getPublicUrl(filePath)

    content.value[targetField] = urlData.publicUrl

  } catch (err) {
    console.error(err)
    alert('Ocorreu um erro ao enviar a imagem.')
  } finally {
    isUploading.value = false
  }
}

async function salvarProposta() {
  if (!content.value.nomeEmpresa) {
    alert('Preencha pelo menos o Nome da Empresa.')
    return
  }

  isSaving.value = true
  
  try {
    // Generate the JSON content holding the site metadata
    const siteConfig = {
      isSite: true,
      modelo: modeloId.value,
      theme: themeConfig.value,
      content: content.value
    }

    // Insert into existing `ibeia_propostas` table
    const { data, error } = await supabase
      .from('ibeia_propostas')
      .insert({
        cliente_nome: content.value.nomeCliente || 'Cliente Padrão',
        cliente_empresa: content.value.nomeEmpresa,
        segmento: 'Site: ' + modeloId.value,
        dores: 'Proposta de Site',
        escopo: 'Desenvolvimento Web',
        conteudo: JSON.stringify(siteConfig),
        status: 'rascunho',
        criado_por: user.value?.email || '',
        responsavel: user.value?.sub || user.value?.id || null
      })
      .select()
      .single()

    if (error) throw error

    // Go to public link or back to list
    alert('Proposta salva com sucesso!')
    router.push(`/comercial/proposta/${data.id}`)
    
  } catch (err) {
    console.error('Error saving proposal:', err)
    alert('Erro ao salvar: ' + err.message)
  } finally {
    isSaving.value = false
  }
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #4b5563; /* Tailwind gray-600 */
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: #9ca3af; /* Tailwind gray-400 */
}
</style>
