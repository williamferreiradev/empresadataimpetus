<template>
  <aside class="w-64 bg-white border-r border-gray-200 flex flex-col hidden md:flex shrink-0">
    <!-- Logo -->
    <div class="h-16 flex items-center px-6 border-b border-gray-100 shrink-0">
      <NuxtLink to="/" class="flex items-center gap-2">
        <div class="w-8 h-8 bg-orange-500 rounded-md flex items-center justify-center shadow-sm">
          <span class="text-white font-bold text-lg">DI</span>
        </div>
        <span class="font-bold text-xl tracking-tight text-gray-800">Marketing</span>
      </NuxtLink>
    </div>
    
    <!-- Nav Links -->
    <nav class="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
      <NuxtLink to="/marketing/inicio" active-class="bg-orange-50 text-orange-600" class="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-gray-700 hover:bg-orange-50 hover:text-orange-600 group transition-colors">
        <HomeIcon class="h-5 w-5 mr-3 text-gray-400 group-hover:text-orange-500 transition-colors" :class="{'text-orange-500': $route.path === '/marketing/inicio'}" />
        Dashboard
      </NuxtLink>
      <NuxtLink to="/marketing/clientes" active-class="bg-orange-50 text-orange-600" class="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-gray-700 hover:bg-orange-50 hover:text-orange-600 group transition-colors">
        <UsersIcon class="h-5 w-5 mr-3 text-gray-400 group-hover:text-orange-500 transition-colors" :class="{'text-orange-500': $route.path.includes('/clientes')}" />
        Clientes
      </NuxtLink>
      <NuxtLink to="/marketing/calendario" active-class="bg-orange-50 text-orange-600" class="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-gray-700 hover:bg-orange-50 hover:text-orange-600 group transition-colors">
        <CalendarIcon class="h-5 w-5 mr-3 text-gray-400 group-hover:text-orange-500 transition-colors" :class="{'text-orange-500': $route.path.includes('/calendario')}" />
        Calendário Editorial
      </NuxtLink>
      <NuxtLink to="/marketing/mapas-mentais" active-class="bg-orange-50 text-orange-600" class="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-gray-700 hover:bg-orange-50 hover:text-orange-600 group transition-colors">
        <LightBulbIcon class="h-5 w-5 mr-3 text-gray-400 group-hover:text-orange-500 transition-colors" :class="{'text-orange-500': $route.path.includes('/mapas-mentais')}" />
        Mapas Mentais
      </NuxtLink>
      <NuxtLink to="/marketing/configuracoes" active-class="bg-orange-50 text-orange-600" class="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-gray-700 hover:bg-orange-50 hover:text-orange-600 group transition-colors">
        <Cog6ToothIcon class="h-5 w-5 mr-3 text-gray-400 group-hover:text-orange-500 transition-colors" :class="{'text-orange-500': $route.path.includes('/configuracoes')}" />
        Configurações
      </NuxtLink>
    </nav>
    
    <!-- Bottom Links -->
    <div class="p-4 border-t border-gray-200 space-y-1">
      <button @click="handleLogout" class="w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-red-600 hover:bg-red-50 transition-colors mb-2">
        <ArrowRightOnRectangleIcon class="h-5 w-5 mr-3 text-red-500" />
        Sair da Conta
      </button>

      <NuxtLink v-if="accessibleCount > 1" to="/" class="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-50 group transition-colors">
        <ArrowLeftIcon class="h-5 w-5 mr-3 text-gray-400 group-hover:text-gray-500" />
        Voltar ao Hub
      </NuxtLink>
      
      <div v-else class="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-gray-700">
        <div class="h-8 w-8 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold mr-3 shrink-0">
          {{ userInitial }}
        </div>
        <div class="truncate">
          <p class="text-sm font-medium text-gray-900 truncate">{{ userFullName }}</p>
          <p class="text-xs text-gray-500 truncate">{{ user?.email }}</p>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { 
  HomeIcon, 
  UsersIcon, 
  CalendarIcon, 
  LightBulbIcon, 
  Cog6ToothIcon, 
  ArrowLeftIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/vue/24/outline'

const supabase = useSupabaseClient()
const user = useSupabaseUser()
const route = useRoute()
const { userRoles, userFullName, fetchRoles } = useUserRole()

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

const handleLogout = async () => {
  try {
    await supabase.auth.signOut()
    navigateTo('/login')
  } catch (error) {
    console.error('Erro ao sair da conta:', error)
  }
}
</script>
