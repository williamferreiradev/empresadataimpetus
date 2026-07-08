<template>
  <div class="w-full px-6 md:px-12 mx-auto pb-28 pt-8">
    
    <!-- Breadcrumb / Header -->
    <div class="mb-6 flex items-center gap-4">
      <button @click="navigateTo('/comercial/extracao')" class="p-2 rounded-lg bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-500 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-zinc-200 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800 dark:bg-zinc-900 transition-colors shadow-sm">
        <ArrowLeftIcon class="w-5 h-5" />
      </button>
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-zinc-100 flex items-center gap-3">
          <UsersIcon class="w-7 h-7 text-pink-600" />
          Extração Instagram
        </h1>
      </div>
    </div>

    <!-- Container Principal -->
    <div class="bg-white dark:bg-zinc-800 rounded-2xl shadow-sm border border-gray-200 dark:border-zinc-700 overflow-hidden">
      <div class="p-10">
        
        <!-- Passo 1: Busca -->
        <div v-if="step === 'search'">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-zinc-100 mb-2">Buscar Perfil</h2>
          <p class="text-gray-500 dark:text-zinc-400 text-sm mb-8">Insira o @ do usuário ou o link do perfil do Instagram.</p>

          <div class="flex gap-4">
            <input 
              v-model="searchQuery" 
              type="text" 
              class="flex-1 px-4 py-3 rounded-xl border border-gray-300 dark:border-zinc-600 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-all shadow-sm"
              placeholder="ex: @neymarjr ou https://instagram.com/neymarjr"
              @keyup.enter="buscarPerfil"
            />
            <button 
              @click="buscarPerfil" 
              :disabled="!searchQuery || isLoading"
              class="bg-pink-600 hover:bg-pink-700 text-white font-medium px-6 py-3 rounded-xl shadow-sm transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <svg v-if="isLoading" class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              <MagnifyingGlassIcon v-else class="w-5 h-5" />
              Buscar
            </button>
          </div>
        </div>

        <!-- Passo 2: Confirmação do Perfil -->
        <div v-if="step === 'confirm'" class="max-w-2xl mx-auto">
          <div class="text-center mb-8">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-zinc-100">É esse perfil?</h2>
            <p class="text-gray-500 dark:text-zinc-400 mt-2">Confirme se as informações abaixo correspondem ao alvo desejado.</p>
          </div>

          <!-- Card do Perfil -->
          <div class="bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-2xl p-8 mb-8 text-center shadow-sm">
            <div class="w-24 h-24 mx-auto rounded-full bg-gray-200 border-4 border-white shadow-md overflow-hidden mb-4">
              <img 
                :src="profileData.foto" 
                alt="Foto do perfil" 
                class="w-full h-full object-cover" 
                @error="$event.target.src = `https://ui-avatars.com/api/?name=${profileData.username || 'User'}&background=random`"
              />
            </div>
            
            <h3 class="text-xl font-bold text-gray-900 dark:text-zinc-100">{{ profileData.nome }}</h3>
            <p class="text-pink-600 font-medium text-sm mb-6">@{{ profileData.username }}</p>

            <div class="flex justify-center gap-8 mb-6 border-y border-gray-200 dark:border-zinc-700 py-4">
              <div>
                <p class="text-lg font-bold text-gray-900 dark:text-zinc-100">{{ profileData.seguidores }}</p>
                <p class="text-xs text-gray-500 dark:text-zinc-400 uppercase tracking-wide">Seguidores</p>
              </div>
              <div class="w-px bg-gray-200"></div>
              <div>
                <p class="text-lg font-bold text-gray-900 dark:text-zinc-100">{{ profileData.seguindo }}</p>
                <p class="text-xs text-gray-500 dark:text-zinc-400 uppercase tracking-wide">Seguindo</p>
              </div>
              <div class="w-px bg-gray-200"></div>
              <div>
                <p class="text-lg font-bold text-gray-900 dark:text-zinc-100">{{ profileData.posts }}</p>
                <p class="text-xs text-gray-500 dark:text-zinc-400 uppercase tracking-wide">Posts</p>
              </div>
            </div>

            <div class="text-left bg-white dark:bg-zinc-800 p-4 rounded-xl border border-gray-100 dark:border-zinc-800">
              <p class="text-gray-800 dark:text-zinc-100 text-sm whitespace-pre-line mb-3">{{ profileData.bio }}</p>
              <a v-if="profileData.link" :href="profileData.link" target="_blank" class="text-blue-600 font-medium text-sm hover:underline flex items-center gap-1">
                <LinkIcon class="w-4 h-4 flex-shrink-0" />
                <span class="truncate">{{ profileData.link }}</span>
              </a>
            </div>
          </div>

          <!-- Botões de Ação -->
          <div class="flex gap-4 justify-center">
            <button @click="cancelarBusca" class="px-8 py-3 rounded-xl border border-gray-300 dark:border-zinc-600 text-gray-700 dark:text-zinc-300 font-bold hover:bg-gray-50 dark:hover:bg-zinc-800 dark:bg-zinc-900 transition-colors">
              Cancelar
            </button>
            <button @click="confirmarPerfil" class="px-8 py-3 rounded-xl bg-pink-600 text-white font-bold shadow-sm hover:bg-pink-700 transition-colors flex items-center gap-2">
              <CheckCircleIcon class="w-5 h-5" />
              Confirmar
            </button>
          </div>
        </div>

        <!-- Passo 3: Configuração da Extração -->
        <div v-if="step === 'config'">
          <div class="flex items-center gap-4 mb-8 border-b border-gray-100 dark:border-zinc-800 pb-6">
            <div class="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-200 dark:border-zinc-700">
              <img 
                :src="profileData.foto" 
                alt="Avatar" 
                class="w-full h-full object-cover" 
                @error="$event.target.src = `https://ui-avatars.com/api/?name=${profileData.username || 'User'}&background=random`"
              />
            </div>
            <div>
              <h2 class="text-xl font-bold text-gray-900 dark:text-zinc-100">Configurar Extração</h2>
              <p class="text-gray-500 dark:text-zinc-400 text-sm">Alvo: <span class="font-bold text-pink-600">@{{ profileData.username }}</span></p>
            </div>
          </div>

          <div class="max-w-xl">
            <div class="mb-6">
              <label class="block text-sm font-bold text-gray-700 dark:text-zinc-300 mb-2">O que você deseja extrair?</label>
              <select v-model="extractType" class="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-zinc-600 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none shadow-sm">
                <option value="seguidores">Apenas Seguidores</option>
                <option value="seguindo">Quem o perfil está seguindo</option>
              </select>
            </div>

            <div class="mb-8">
              <label class="block text-sm font-bold text-gray-700 dark:text-zinc-300 mb-2">Quantidade Máxima de Leads</label>
              <input 
                type="number" 
                v-model="maxLeads"
                class="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-zinc-600 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none shadow-sm"
                placeholder="Ex: 500"
              />
              <p class="text-xs text-gray-500 dark:text-zinc-400 mt-2">O Instagram limita o volume de dados. Recomendamos extrair até 2.000 por vez.</p>
            </div>

            <div class="flex gap-4">
              <button @click="step = 'search'" class="px-6 py-3 rounded-xl border border-gray-300 dark:border-zinc-600 text-gray-700 dark:text-zinc-300 font-bold hover:bg-gray-50 dark:hover:bg-zinc-800 dark:bg-zinc-900 transition-colors">
                Voltar
              </button>
              <button @click="iniciarExtracao" :disabled="isExtracting" class="px-8 py-3 rounded-xl bg-orange-500 text-white font-bold shadow-sm hover:bg-orange-600 transition-colors flex items-center gap-2 disabled:opacity-50">
                <svg v-if="isExtracting" class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                <BoltIcon v-else class="w-5 h-5" />
                {{ isExtracting ? 'Extraindo...' : 'Iniciar Extração Agora' }}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeftIcon, UsersIcon, MagnifyingGlassIcon, LinkIcon, CheckCircleIcon, BoltIcon } from '@heroicons/vue/24/outline'

definePageMeta({ layout: 'comercial' })

const router = useRouter()
const step = ref('search')
const searchQuery = ref('')
const isLoading = ref(false)
const isExtracting = ref(false)
const maxLeads = ref(100)
const extractType = ref('seguidores')

const profileData = ref({
  foto: '',
  nome: '',
  username: '',
  seguidores: '0',
  seguindo: '0',
  posts: '0',
  bio: '',
  link: ''
})

function formatNumber(num) {
  if (num === undefined || num === null) return '0'
  if (num >= 1000000) return (num / 1000000).toFixed(1).replace('.0', '') + 'M'
  if (num >= 1000) return (num / 1000).toFixed(1).replace('.0', '') + 'K'
  return num.toString()
}

async function buscarPerfil() {
  if (!searchQuery.value) return
  
  isLoading.value = true
  
  let user = searchQuery.value.trim()
  if (user.includes('instagram.com/')) {
    user = user.split('instagram.com/')[1].split('/')[0].split('?')[0]
  }
  user = user.replace('@', '')

  try {
    const response = await $fetch('/api/apify-instagram', {
      method: 'POST',
      body: { username: user }
    })
    
    profileData.value = {
      foto: response.profilePicUrlHD || response.profilePicUrl || `https://ui-avatars.com/api/?name=${user}`,
      nome: response.fullName || user,
      username: response.username || user,
      seguidores: formatNumber(response.followersCount),
      seguindo: formatNumber(response.followsCount),
      posts: formatNumber(response.postsCount),
      bio: response.biography || '',
      link: response.externalUrl || ''
    }

    step.value = 'confirm'
  } catch (error) {
    alert('Erro ao buscar perfil: ' + (error.data?.statusMessage || error.message))
  } finally {
    isLoading.value = false
  }
}

function cancelarBusca() {
  searchQuery.value = ''
  step.value = 'search'
}

function confirmarPerfil() {
  step.value = 'config'
}

async function iniciarExtracao() {
  isExtracting.value = true
  try {
    const res = await $fetch('/api/apify-extract-leads', {
      method: 'POST',
      body: { 
        username: profileData.value.username,
        type: extractType.value,
        maxLeads: maxLeads.value
      }
    })
    
    alert(res.message || 'Extração concluída!')
    router.push('/comercial/extracao')
  } catch (error) {
    alert('Erro ao extrair leads: ' + (error.data?.statusMessage || error.message))
  } finally {
    isExtracting.value = false
  }
}
</script>
