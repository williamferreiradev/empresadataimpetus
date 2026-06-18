<template>
  <div class="flex h-screen bg-gray-50 font-sans text-gray-900 overflow-hidden">
    <!-- Sidebar -->
    <aside class="w-64 bg-white border-r border-gray-200 flex flex-col hidden md:flex">
      <!-- Logo -->
      <div class="h-16 flex items-center px-6 border-b border-gray-100">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 bg-gray-900 rounded-md flex items-center justify-center">
            <span class="text-white font-bold text-lg">DI</span>
          </div>
          <span class="font-bold text-xl tracking-tight">Impetus</span>
        </div>
      </div>
      
      <!-- Nav Links -->
      <nav class="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        <NuxtLink to="/" class="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg bg-gray-100 text-gray-900 group">
          <RocketLaunchIcon class="h-5 w-5 mr-3 text-gray-500" />
          Departamentos
        </NuxtLink>
      </nav>
      
      <!-- Bottom Links -->
      <div class="p-4 border-t border-gray-200 space-y-1">
        <a href="#" class="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-50 group">
          <Cog8ToothIcon class="h-5 w-5 mr-3 text-gray-400 group-hover:text-gray-500" />
          Configurações
        </a>
        <button @click="logout" class="w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-red-600 hover:bg-red-50 group">
          <ArrowLeftOnRectangleIcon class="h-5 w-5 mr-3 text-red-400 group-hover:text-red-500" />
          Sair
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#FBFBFC]">
      <!-- Topbar -->
      <header class="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shrink-0">
        <h1 class="text-xl font-semibold text-gray-800">Departamentos</h1>
        
        <div class="flex items-center gap-6">
          <!-- Search -->
          <div class="relative hidden sm:block">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon class="h-4 w-4 text-gray-400" />
            </div>
            <input type="text" v-model="searchQuery" placeholder="Buscar departamento..." class="block w-64 pl-10 pr-3 py-2 border border-gray-200 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 bg-gray-50" />
            <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span class="text-xs text-gray-400 font-mono">⌘/</span>
            </div>
          </div>
          
          <!-- Notifications & Profile -->
          <div class="flex items-center gap-4">
            <button class="relative p-1 rounded-full text-gray-500 hover:text-gray-600 focus:outline-none">
              <span class="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500 border-2 border-white"></span>
              <BellIcon class="h-6 w-6" />
            </button>
            <div class="h-8 w-8 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold cursor-pointer shadow-sm">
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
import { 
  HomeIcon, 
  MagnifyingGlassIcon, 
  ClockIcon, 
  BellIcon, 
  RocketLaunchIcon, 
  Squares2X2Icon, 
  Cog8ToothIcon, 
  ArrowLeftOnRectangleIcon 
} from '@heroicons/vue/24/outline'

const user = useSupabaseUser()
const supabase = useSupabaseClient()
const searchQuery = useState('searchQuery', () => '')

const userInitial = computed(() => {
  return user.value?.email?.charAt(0).toUpperCase() || 'U'
})

async function logout() {
  await supabase.auth.signOut()
  navigateTo('/login')
}
</script>
