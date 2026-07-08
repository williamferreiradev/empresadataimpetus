<template>
  <div class="flex h-screen bg-gray-50 dark:bg-zinc-900 font-sans text-gray-900 dark:text-zinc-100 overflow-hidden transition-colors duration-200">
    <!-- Sidebar -->
    <aside class="w-64 bg-white dark:bg-zinc-800 dark:bg-zinc-950 border-r border-gray-200 dark:border-zinc-700 dark:border-zinc-800 flex flex-col hidden md:flex transition-colors duration-200">
      <!-- Logo -->
      <div class="h-16 flex items-center px-6 border-b border-gray-100 dark:border-zinc-800 shrink-0">
        <NuxtLink to="/" class="flex items-center gap-2">
          <div class="w-8 h-8 bg-orange-500 rounded-md flex items-center justify-center shadow-sm">
            <span class="text-white font-bold text-lg">DI</span>
          </div>
          <span class="font-bold text-xl tracking-tight text-gray-800 dark:text-zinc-100 dark:text-white">Comercial</span>
        </NuxtLink>
      </div>
      
      <!-- Nav Links -->
      <nav class="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        <NuxtLink to="/comercial/inicio" active-class="bg-orange-50 dark:bg-zinc-800 text-orange-600 dark:text-orange-400" class="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-gray-700 dark:text-zinc-300 hover:bg-orange-50 dark:hover:bg-zinc-800 hover:text-orange-600 dark:hover:text-orange-400 group transition-colors">
          <HomeIcon class="h-5 w-5 mr-3 text-gray-400 dark:text-zinc-500 group-hover:text-orange-500 dark:group-hover:text-orange-400 transition-colors" :class="{'text-orange-500 dark:text-orange-400': $route.path === '/comercial/inicio'}" />
          Início
        </NuxtLink>
        <NuxtLink to="/comercial/extracao" active-class="bg-orange-50 dark:bg-zinc-800 text-orange-600 dark:text-orange-400" class="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-gray-700 dark:text-zinc-300 hover:bg-orange-50 dark:hover:bg-zinc-800 hover:text-orange-600 dark:hover:text-orange-400 group transition-colors">
          <MagnifyingGlassIcon class="h-5 w-5 mr-3 text-gray-400 dark:text-zinc-500 group-hover:text-orange-500 dark:group-hover:text-orange-400 transition-colors" :class="{'text-orange-500 dark:text-orange-400': $route.path.includes('/extracao')}" />
          Extração
        </NuxtLink>
        <NuxtLink to="/comercial/clientes" active-class="bg-orange-50 dark:bg-zinc-800 text-orange-600 dark:text-orange-400" class="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-gray-700 dark:text-zinc-300 hover:bg-orange-50 dark:hover:bg-zinc-800 hover:text-orange-600 dark:hover:text-orange-400 group transition-colors">
          <UsersIcon class="h-5 w-5 mr-3 text-gray-400 dark:text-zinc-500 group-hover:text-orange-500 dark:group-hover:text-orange-400 transition-colors" :class="{'text-orange-500 dark:text-orange-400': $route.path.includes('/clientes')}" />
          Clientes
        </NuxtLink>
        <NuxtLink to="/comercial/pipeline" active-class="bg-orange-50 dark:bg-zinc-800 text-orange-600 dark:text-orange-400" class="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-gray-700 dark:text-zinc-300 hover:bg-orange-50 dark:hover:bg-zinc-800 hover:text-orange-600 dark:hover:text-orange-400 group transition-colors">
          <ChartBarIcon class="h-5 w-5 mr-3 text-gray-400 dark:text-zinc-500 group-hover:text-orange-500 dark:group-hover:text-orange-400 transition-colors" :class="{'text-orange-500 dark:text-orange-400': $route.path.includes('/pipeline')}" />
          Pipeline
        </NuxtLink>
        <NuxtLink to="/comercial/propostas" active-class="bg-orange-50 dark:bg-zinc-800 text-orange-600 dark:text-orange-400" class="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-gray-700 dark:text-zinc-300 hover:bg-orange-50 dark:hover:bg-zinc-800 hover:text-orange-600 dark:hover:text-orange-400 group transition-colors">
          <DocumentTextIcon class="h-5 w-5 mr-3 text-gray-400 dark:text-zinc-500 group-hover:text-orange-500 dark:group-hover:text-orange-400 transition-colors" :class="{'text-orange-500 dark:text-orange-400': $route.path.includes('/propostas')}" />
          Propostas
        </NuxtLink>
        <NuxtLink to="/comercial/ofertas" active-class="bg-orange-50 dark:bg-zinc-800 text-orange-600 dark:text-orange-400" class="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-gray-700 dark:text-zinc-300 hover:bg-orange-50 dark:hover:bg-zinc-800 hover:text-orange-600 dark:hover:text-orange-400 group transition-colors">
          <TagIcon class="h-5 w-5 mr-3 text-gray-400 dark:text-zinc-500 group-hover:text-orange-500 dark:group-hover:text-orange-400 transition-colors" :class="{'text-orange-500 dark:text-orange-400': $route.path.includes('/ofertas')}" />
          Ofertas
        </NuxtLink>
      </nav>
      
      <!-- Bottom Links -->
      <div class="p-4 border-t border-gray-200 dark:border-zinc-700 dark:border-zinc-800 space-y-1">
        <!-- Sair da Conta -->
        <button @click="handleLogout" class="w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors mb-2">
          <ArrowRightOnRectangleIcon class="h-5 w-5 mr-3 text-red-500 dark:text-red-400" />
          Sair da Conta
        </button>

        <!-- Mostrar "Voltar ao Hub" apenas se o usuário tiver mais de 1 departamento -->
        <NuxtLink v-if="accessibleCount > 1" to="/" class="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:bg-zinc-900 dark:hover:bg-zinc-800 group transition-colors">
          <ArrowLeftIcon class="h-5 w-5 mr-3 text-gray-400 dark:text-zinc-500 group-hover:text-gray-500 dark:text-zinc-400 dark:group-hover:text-zinc-400" />
          Voltar ao Hub
        </NuxtLink>
        
        <!-- Mostrar Perfil do Usuário se tiver apenas 1 departamento -->
        <div v-else class="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-gray-700 dark:text-zinc-300">
          <div class="h-8 w-8 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold mr-3 shrink-0">
            {{ userInitial }}
          </div>
          <div class="truncate">
            <p class="text-sm font-medium text-gray-900 dark:text-zinc-100 dark:text-white truncate">{{ userFullName }}</p>
            <p class="text-xs text-gray-500 dark:text-zinc-400 truncate">{{ user.email }}</p>
          </div>
        </div>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#FBFBFC] dark:bg-zinc-900 transition-colors duration-200">
      <!-- Topbar -->
      <header class="h-16 bg-white dark:bg-zinc-800 dark:bg-zinc-950 border-b border-gray-200 dark:border-zinc-700 dark:border-zinc-800 flex items-center justify-between px-8 shrink-0 transition-colors duration-200">
        <h1 class="text-xl font-semibold text-gray-800 dark:text-zinc-100 dark:text-white capitalize">{{ pageTitle }}</h1>
        
        <div class="flex items-center gap-6">
          <!-- Toggle Ver Todos os Leads (Ocultar em Ofertas) -->
          <div v-if="!$route.path.includes('/ofertas')" class="hidden sm:flex items-center bg-gray-100 dark:bg-zinc-800 rounded-full p-1 shadow-inner border border-gray-200/50 dark:border-zinc-700/50">
            <button 
              @click="userViewAllLeads ? toggleViewAllLeads() : null"
              :class="!userViewAllLeads ? 'bg-white dark:bg-zinc-800 dark:bg-zinc-700 shadow text-orange-600 dark:text-orange-400 font-bold' : 'text-gray-500 dark:text-zinc-400 hover:text-gray-700 dark:text-zinc-300 dark:hover:text-zinc-200 font-medium'"
              class="px-4 py-1.5 text-xs rounded-full transition-all"
            >
              Meus Leads
            </button>
            <button 
              @click="!userViewAllLeads ? toggleViewAllLeads() : null"
              :class="userViewAllLeads ? 'bg-white dark:bg-zinc-800 dark:bg-zinc-700 shadow text-orange-600 dark:text-orange-400 font-bold' : 'text-gray-500 dark:text-zinc-400 hover:text-gray-700 dark:text-zinc-300 dark:hover:text-zinc-200 font-medium'"
              class="px-4 py-1.5 text-xs rounded-full transition-all"
            >
              Todos
            </button>
          </div>

          <!-- Notifications, Dark Mode & Profile -->
          <div class="flex items-center gap-4">
            
            <!-- Dark Mode Toggle -->
            <ClientOnly>
              <button 
                @click="$colorMode.preference = $colorMode.value === 'dark' ? 'light' : 'dark'" 
                class="p-1 rounded-full text-gray-500 dark:text-zinc-400 hover:text-gray-600 dark:hover:text-zinc-300 focus:outline-none transition-colors"
                title="Alternar Tema"
              >
                <SunIcon v-if="$colorMode.value === 'dark'" class="h-6 w-6" />
                <MoonIcon v-else class="h-6 w-6" />
              </button>
            </ClientOnly>

            <!-- Notifications -->
            <button class="relative p-1 rounded-full text-gray-500 dark:text-zinc-400 hover:text-gray-600 dark:hover:text-zinc-300 focus:outline-none transition-colors">
              <span class="absolute top-1 right-1 h-2 w-2 rounded-full bg-orange-500 border-2 border-white dark:border-zinc-950"></span>
              <BellIcon class="h-6 w-6" />
            </button>
            
            <div class="h-8 w-8 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold cursor-pointer shadow-sm">
              {{ userInitial }}
            </div>
          </div>
        </div>
      </header>
      
      <!-- Page Content -->
      <div class="flex-1 overflow-y-auto p-8">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { 
  HomeIcon, 
  UsersIcon, 
  DocumentTextIcon, 
  ChartBarIcon, 
  ArrowLeftIcon,
  BellIcon,
  MagnifyingGlassIcon,
  ArrowRightOnRectangleIcon,
  TagIcon,
  SunIcon,
  MoonIcon
} from '@heroicons/vue/24/outline'

const supabase = useSupabaseClient()
const user = useSupabaseUser()
const route = useRoute()
const { userRoles, userFullName, userViewAllLeads, toggleViewAllLeads, fetchRoles } = useUserRole()

// Busca os papéis caso ainda não estejam no cache
import { onMounted } from 'vue'
onMounted(() => {
  fetchRoles()
})

const accessibleCount = computed(() => {
  if (userRoles.value.includes('AdmDono')) return 7
  return userRoles.value.length
})

const userInitial = computed(() => {
  return user.value?.email?.charAt(0).toUpperCase() || 'U'
})

const pageTitle = computed(() => {
  const path = route.path
  if (path.includes('nova')) return 'Nova Proposta'
  if (path.includes('propostas')) return 'Propostas'
  if (path.includes('extracao')) return 'Extração de Leads'
  if (path.includes('clientes')) return 'Clientes'
  if (path.includes('pipeline')) return 'Pipeline'
  if (path.includes('crm')) return 'CRM'
  if (path.includes('ofertas')) return 'Ofertas'
  return 'Visão Geral'
})

const handleLogout = async () => {
  try {
    await supabase.auth.signOut()
    navigateTo('/login')
  } catch (error) {
    console.error('Erro ao sair da conta:', error)
  }
}
</script>
