<template>
  <aside class="w-64 bg-white dark:bg-zinc-800 dark:bg-gray-900 border-r border-gray-200 dark:border-zinc-700 dark:border-gray-800 flex flex-col hidden md:flex shrink-0 transition-colors duration-200">
    <!-- Logo -->
    <div class="h-16 flex items-center px-6 border-b border-gray-100 dark:border-zinc-800 dark:border-gray-800 shrink-0">
      <NuxtLink to="/" class="flex items-center gap-2">
        <div class="w-8 h-8 bg-orange-500 rounded-md flex items-center justify-center shadow-sm">
          <span class="text-white font-bold text-lg">DI</span>
        </div>
        <span class="font-bold text-xl tracking-tight text-gray-800 dark:text-zinc-100 dark:text-white transition-colors">Marketing</span>
      </NuxtLink>
    </div>
    
    <!-- Nav Links -->
    <nav class="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
      <NuxtLink to="/marketing/inicio" active-class="bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-500" class="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-gray-700 dark:text-zinc-300 hover:bg-orange-50 dark:hover:bg-orange-500/10 hover:text-orange-600 dark:hover:text-orange-500 group transition-colors">
        <HomeIcon class="h-5 w-5 mr-3 text-gray-400 dark:text-zinc-500 group-hover:text-orange-500 transition-colors" :class="{'text-orange-500': $route.path === '/marketing/inicio'}" />
        Dashboard
      </NuxtLink>
      <NuxtLink to="/marketing/clientes" active-class="bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-500" class="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-gray-700 dark:text-zinc-300 hover:bg-orange-50 dark:hover:bg-orange-500/10 hover:text-orange-600 dark:hover:text-orange-500 group transition-colors">
        <UsersIcon class="h-5 w-5 mr-3 text-gray-400 dark:text-zinc-500 group-hover:text-orange-500 transition-colors" :class="{'text-orange-500': $route.path.includes('/clientes')}" />
        Clientes
      </NuxtLink>
      <NuxtLink to="/marketing/calendario" active-class="bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-500" class="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-gray-700 dark:text-zinc-300 hover:bg-orange-50 dark:hover:bg-orange-500/10 hover:text-orange-600 dark:hover:text-orange-500 group transition-colors">
        <CalendarIcon class="h-5 w-5 mr-3 text-gray-400 dark:text-zinc-500 group-hover:text-orange-500 transition-colors" :class="{'text-orange-500': $route.path.includes('/calendario')}" />
        Calendário Editorial
      </NuxtLink>
      <NuxtLink to="/marketing/mapas-mentais" active-class="bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-500" class="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-gray-700 dark:text-zinc-300 hover:bg-orange-50 dark:hover:bg-orange-500/10 hover:text-orange-600 dark:hover:text-orange-500 group transition-colors">
        <LightBulbIcon class="h-5 w-5 mr-3 text-gray-400 dark:text-zinc-500 group-hover:text-orange-500 transition-colors" :class="{'text-orange-500': $route.path.includes('/mapas-mentais')}" />
        Mapas Mentais
      </NuxtLink>
      <NuxtLink to="/marketing/configuracoes" active-class="bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-500" class="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-gray-700 dark:text-zinc-300 hover:bg-orange-50 dark:hover:bg-orange-500/10 hover:text-orange-600 dark:hover:text-orange-500 group transition-colors">
        <Cog6ToothIcon class="h-5 w-5 mr-3 text-gray-400 dark:text-zinc-500 group-hover:text-orange-500 transition-colors" :class="{'text-orange-500': $route.path.includes('/configuracoes')}" />
        Configurações
      </NuxtLink>
    </nav>
    
    <!-- Bottom Links -->
    <div class="p-4 border-t border-gray-200 dark:border-zinc-700 dark:border-gray-800 space-y-1 transition-colors">
      
      <button @click="toggleTheme" class="w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-gray-700 dark:text-zinc-300 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800 dark:bg-zinc-900 dark:hover:bg-gray-800 transition-colors mb-2">
        <SunIcon v-if="colorMode.value === 'dark'" class="h-5 w-5 mr-3 text-yellow-500" />
        <MoonIcon v-else class="h-5 w-5 mr-3 text-gray-400 dark:text-zinc-500" />
        {{ colorMode.value === 'dark' ? 'Modo Claro' : 'Modo Escuro' }}
      </button>

      <button @click="handleLogout" class="w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors mb-2">
        <ArrowRightOnRectangleIcon class="h-5 w-5 mr-3 text-red-500 dark:text-red-400" />
        Sair da Conta
      </button>

      <NuxtLink v-if="accessibleCount > 1" to="/" class="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-gray-700 dark:text-zinc-300 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800 dark:bg-zinc-900 dark:hover:bg-gray-800 group transition-colors">
        <ArrowLeftIcon class="h-5 w-5 mr-3 text-gray-400 dark:text-zinc-500 dark:text-gray-500 dark:text-zinc-400 group-hover:text-gray-500 dark:text-zinc-400 dark:group-hover:text-gray-400 dark:text-zinc-500" />
        Voltar ao Hub
      </NuxtLink>
      
      <div v-else class="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-gray-700 dark:text-zinc-300">
        <div class="h-8 w-8 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold mr-3 shrink-0">
          {{ userInitial }}
        </div>
        <div class="truncate">
          <p class="text-sm font-medium text-gray-900 dark:text-zinc-100 truncate">{{ userFullName }}</p>
          <p class="text-xs text-gray-500 dark:text-zinc-400 truncate">{{ user?.email }}</p>
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
  ArrowRightOnRectangleIcon,
  MoonIcon,
  SunIcon
} from '@heroicons/vue/24/outline'

const supabase = useSupabaseClient()
const user = useSupabaseUser()
const route = useRoute()
const colorMode = useColorMode()
const { userRoles, userFullName, fetchRoles } = useUserRole()

const toggleTheme = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}

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
