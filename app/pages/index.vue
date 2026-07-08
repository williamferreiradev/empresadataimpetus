<template>
  <div class="w-full px-6 md:px-12 mx-auto">
    <div class="mb-10 mt-4 text-left">
      <p class="text-sm font-medium text-gray-500 dark:text-zinc-400 mb-1 tracking-wide uppercase">Olá, {{ userFullName }}</p>
      <h2 class="text-3xl font-bold text-gray-900 dark:text-zinc-100 mb-6">
        Qual <span class="text-orange-500">Departamento</span> você gostaria de acessar hoje?
      </h2>
      
      <!-- Filters (Pills) -->
      <div class="flex flex-wrap justify-start gap-3">
        <button 
          v-for="filter in ['Todos', 'Comercial', 'Operações', 'Administrativo']"
          :key="filter"
          @click="activeFilter = filter"
          :class="[
            'px-5 py-2 rounded-full text-sm font-medium shadow-sm transition-all duration-200 hover:scale-105',
            activeFilter === filter 
              ? 'bg-orange-500 text-white border border-orange-500' 
              : 'bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-zinc-400 hover:bg-orange-50 dark:hover:bg-zinc-700 hover:text-orange-600 dark:hover:text-orange-400 hover:border-orange-200 dark:hover:border-zinc-600'
          ]"
        >
          {{ filter }}
        </button>
      </div>
    </div>

    <!-- Grid Section -->
    <div v-if="filteredDepartments.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <DepartmentCard 
        v-for="(dept, index) in filteredDepartments" 
        :key="index"
        :title="dept.title"
        :description="dept.description"
        :icon="dept.icon"
        :to="dept.to"
      />
    </div>
    
    <!-- Empty State -->
    <div v-else class="text-center py-20">
      <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-zinc-800 mb-4">
        <MagnifyingGlassIcon class="h-8 w-8 text-gray-400 dark:text-zinc-500" />
      </div>
      <h3 class="text-lg font-medium text-gray-900 dark:text-zinc-100">Nenhum departamento encontrado</h3>
      <p class="mt-1 text-gray-500 dark:text-zinc-400">Tente ajustar seus filtros ou termo de busca.</p>
      <button @click="resetFilters" class="mt-4 text-emerald-600 font-medium hover:text-emerald-500">
        Limpar filtros
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { 
  MegaphoneIcon, 
  BriefcaseIcon, 
  PhoneIcon, 
  TruckIcon, 
  HeartIcon, 
  BanknotesIcon, 
  BuildingOfficeIcon,
  MagnifyingGlassIcon
} from '@heroicons/vue/24/outline'

const { userFullName, fetchRoles, hasRole } = useUserRole()

const searchQuery = useState('searchQuery', () => '')
const activeFilter = ref('Todos')

const departments = [
  {
    title: 'Marketing',
    category: 'Comercial',
    description: 'Acompanhe métricas de funil, campanhas, anúncios, SEO e anomalias em seu stack de marketing.',
    icon: MegaphoneIcon,
    to: '/marketing',
    allowedRoles: ['Marketing']
  },
  {
    title: 'Comercial',
    category: 'Comercial',
    description: 'Gerencie oportunidades no pipeline, propostas, negociações e fechamento de novos contratos.',
    icon: BriefcaseIcon,
    to: '/comercial',
    allowedRoles: ['Comercial']
  },
  {
    title: 'Pré-vendas',
    category: 'Comercial',
    description: 'Qualificação de leads inbound e outbound, agendamento de reuniões e primeiro contato comercial.',
    icon: PhoneIcon,
    to: '/pre-vendas',
    allowedRoles: ['Pré-vendas']
  },
  {
    title: 'Entrega',
    category: 'Operações',
    description: 'Acompanhamento de projetos, logística, implantação técnica e onboarding de novos clientes.',
    icon: TruckIcon,
    to: '/entrega',
    allowedRoles: ['Entrega']
  },
  {
    title: 'Customer Success',
    category: 'Operações',
    description: 'Gestão de satisfação, retenção de clientes, suporte ativo e expansão de contas base (upsell/cross-sell).',
    icon: HeartIcon,
    to: '/customer-success',
    allowedRoles: ['Customer Success']
  },
  {
    title: 'Financeiro',
    category: 'Administrativo',
    description: 'Controle de faturamento, fluxo de caixa, contas a pagar, contas a receber e relatórios financeiros detalhados.',
    icon: BanknotesIcon,
    to: '/financeiro',
    allowedRoles: ['Financeiro']
  },
  {
    title: 'Administrativo',
    category: 'Administrativo',
    description: 'Gestão de recursos humanos, controle de infraestrutura, processos internos, auditorias e contabilidade.',
    icon: BuildingOfficeIcon,
    to: '/administrativo',
    allowedRoles: ['Administrativo']
  }
]

// Garante que o fetch ocorra, caso não venha já cacheadinho do middleware
onMounted(async () => {
  await fetchRoles()
})

const accessibleDepartments = computed(() => {
  return departments.filter(dept => hasRole(dept.allowedRoles))
})

const filteredDepartments = computed(() => {
  return accessibleDepartments.value.filter(dept => {
    const matchCategory = activeFilter.value === 'Todos' || dept.category === activeFilter.value
    const search = searchQuery.value.toLowerCase().trim()
    const matchSearch = search === '' || 
      dept.title.toLowerCase().includes(search) || 
      dept.description.toLowerCase().includes(search)
      
    return matchCategory && matchSearch
  })
})

function resetFilters() {
  activeFilter.value = 'Todos'
  searchQuery.value = ''
}
</script>
