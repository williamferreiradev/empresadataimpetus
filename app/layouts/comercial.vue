<template>
  <div class="flex h-screen bg-gray-50 font-sans text-gray-900 overflow-hidden">
    <!-- Sidebar -->
    <aside class="w-64 bg-white border-r border-gray-200 flex flex-col hidden md:flex">
      <!-- Logo -->
      <div class="h-16 flex items-center px-6 border-b border-gray-100 shrink-0">
        <NuxtLink to="/" class="flex items-center gap-2">
          <div class="w-8 h-8 bg-orange-500 rounded-md flex items-center justify-center shadow-sm">
            <span class="text-white font-bold text-lg">DI</span>
          </div>
          <span class="font-bold text-xl tracking-tight text-gray-800">Comercial</span>
        </NuxtLink>
      </div>
      
      <!-- Nav Links -->
      <nav class="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        <NuxtLink to="/comercial/inicio" active-class="bg-orange-50 text-orange-600" class="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-gray-700 hover:bg-orange-50 hover:text-orange-600 group transition-colors">
          <HomeIcon class="h-5 w-5 mr-3 text-gray-400 group-hover:text-orange-500 transition-colors" :class="{'text-orange-500': $route.path === '/comercial/inicio'}" />
          Início
        </NuxtLink>
        <NuxtLink to="/comercial/extracao" active-class="bg-orange-50 text-orange-600" class="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-gray-700 hover:bg-orange-50 hover:text-orange-600 group transition-colors">
          <MagnifyingGlassIcon class="h-5 w-5 mr-3 text-gray-400 group-hover:text-orange-500 transition-colors" :class="{'text-orange-500': $route.path.includes('/extracao')}" />
          Extração
        </NuxtLink>
        <NuxtLink to="/comercial/clientes" active-class="bg-orange-50 text-orange-600" class="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-gray-700 hover:bg-orange-50 hover:text-orange-600 group transition-colors">
          <UsersIcon class="h-5 w-5 mr-3 text-gray-400 group-hover:text-orange-500 transition-colors" :class="{'text-orange-500': $route.path.includes('/clientes')}" />
          Clientes
        </NuxtLink>
        <NuxtLink to="/comercial/pipeline" active-class="bg-orange-50 text-orange-600" class="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-gray-700 hover:bg-orange-50 hover:text-orange-600 group transition-colors">
          <ChartBarIcon class="h-5 w-5 mr-3 text-gray-400 group-hover:text-orange-500 transition-colors" :class="{'text-orange-500': $route.path.includes('/pipeline')}" />
          Pipeline
        </NuxtLink>
        <NuxtLink to="/comercial/propostas" active-class="bg-orange-50 text-orange-600" class="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-gray-700 hover:bg-orange-50 hover:text-orange-600 group transition-colors">
          <DocumentTextIcon class="h-5 w-5 mr-3 text-gray-400 group-hover:text-orange-500 transition-colors" :class="{'text-orange-500': $route.path.includes('/propostas')}" />
          Propostas
        </NuxtLink>
      </nav>
      
      <!-- Bottom Links -->
      <div class="p-4 border-t border-gray-200 space-y-1">
        <!-- Mostrar "Voltar ao Hub" apenas se o usuário tiver mais de 1 departamento -->
        <NuxtLink v-if="accessibleCount > 1" to="/" class="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-50 group transition-colors">
          <ArrowLeftIcon class="h-5 w-5 mr-3 text-gray-400 group-hover:text-gray-500" />
          Voltar ao Hub
        </NuxtLink>
        
        <!-- Mostrar Perfil do Usuário se tiver apenas 1 departamento -->
        <div v-else class="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-gray-700">
          <div class="h-8 w-8 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold mr-3 shrink-0">
            {{ userInitial }}
          </div>
          <div class="truncate">
            <p class="text-sm font-medium text-gray-900 truncate">{{ userFullName }}</p>
            <p class="text-xs text-gray-500 truncate">{{ user.email }}</p>
          </div>
        </div>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#FBFBFC]">
      <!-- Topbar -->
      <header class="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shrink-0">
        <h1 class="text-xl font-semibold text-gray-800 capitalize">{{ pageTitle }}</h1>
        
        <div class="flex items-center gap-6">
          <!-- Toggle Ver Todos os Leads -->
          <div class="hidden sm:flex items-center bg-gray-100 rounded-full p-1 shadow-inner border border-gray-200/50">
            <button 
              @click="userViewAllLeads ? toggleViewAllLeads() : null"
              :class="!userViewAllLeads ? 'bg-white shadow text-orange-600 font-bold' : 'text-gray-500 hover:text-gray-700 font-medium'"
              class="px-4 py-1.5 text-xs rounded-full transition-all"
            >
              Meus Leads
            </button>
            <button 
              @click="!userViewAllLeads ? toggleViewAllLeads() : null"
              :class="userViewAllLeads ? 'bg-white shadow text-orange-600 font-bold' : 'text-gray-500 hover:text-gray-700 font-medium'"
              class="px-4 py-1.5 text-xs rounded-full transition-all"
            >
              Todos
            </button>
          </div>

          <!-- Notifications & Profile -->
          <div class="flex items-center gap-4">
            <button class="relative p-1 rounded-full text-gray-500 hover:text-gray-600 focus:outline-none">
              <span class="absolute top-1 right-1 h-2 w-2 rounded-full bg-orange-500 border-2 border-white"></span>
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
  BriefcaseIcon, 
  ArrowLeftIcon,
  BellIcon,
  MagnifyingGlassIcon
} from '@heroicons/vue/24/outline'

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
  return 'Visão Geral'
})
</script>
