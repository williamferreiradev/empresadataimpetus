<template>
  <div class="max-w-7xl mx-auto">
    <!-- Header Section -->
    <div class="text-center mb-10 mt-4">
      <h2 class="text-3xl font-bold text-gray-900 mb-6">
        Qual <span class="text-orange-500">Departamento</span> você gostaria de acessar hoje?
      </h2>
      
      <!-- Filters (Pills) -->
      <div class="flex flex-wrap justify-center gap-3">
        <button 
          v-for="filter in ['Todos', 'Comercial', 'Operações', 'Administrativo']"
          :key="filter"
          @click="activeFilter = filter"
          :class="[
            'px-5 py-2 rounded-full text-sm font-medium shadow-sm transition-all duration-200 hover:scale-105',
            activeFilter === filter 
              ? 'bg-orange-500 text-white border border-orange-500' 
              : 'bg-white border border-gray-200 text-gray-600 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200'
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
      <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
        <MagnifyingGlassIcon class="h-8 w-8 text-gray-400" />
      </div>
      <h3 class="text-lg font-medium text-gray-900">Nenhum departamento encontrado</h3>
      <p class="mt-1 text-gray-500">Tente ajustar seus filtros ou termo de busca.</p>
      <button @click="resetFilters" class="mt-4 text-emerald-600 font-medium hover:text-emerald-500">
        Limpar filtros
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
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

const searchQuery = useState('searchQuery', () => '')
const activeFilter = ref('Todos')

const departments = [
  {
    title: 'Marketing',
    category: 'Comercial',
    description: 'Acompanhe métricas de funil, campanhas, anúncios, SEO e anomalias em seu stack de marketing.',
    icon: MegaphoneIcon,
    to: '/marketing'
  },
  {
    title: 'Comercial',
    category: 'Comercial',
    description: 'Gerencie oportunidades no pipeline, propostas, negociações e fechamento de novos contratos.',
    icon: BriefcaseIcon,
    to: '/comercial'
  },
  {
    title: 'Pré-vendas',
    category: 'Comercial',
    description: 'Qualificação de leads inbound e outbound, agendamento de reuniões e primeiro contato comercial.',
    icon: PhoneIcon,
    to: '/pre-vendas'
  },
  {
    title: 'Entrega',
    category: 'Operações',
    description: 'Acompanhamento de projetos, logística, implantação técnica e onboarding de novos clientes.',
    icon: TruckIcon,
    to: '/entrega'
  },
  {
    title: 'Customer Success',
    category: 'Operações',
    description: 'Gestão de satisfação, retenção de clientes, suporte ativo e expansão de contas base (upsell/cross-sell).',
    icon: HeartIcon,
    to: '/customer-success'
  },
  {
    title: 'Financeiro',
    category: 'Administrativo',
    description: 'Controle de faturamento, fluxo de caixa, contas a pagar, contas a receber e relatórios financeiros detalhados.',
    icon: BanknotesIcon,
    to: '/financeiro'
  },
  {
    title: 'Administrativo',
    category: 'Administrativo',
    description: 'Gestão de recursos humanos, controle de infraestrutura, processos internos, auditorias e contabilidade.',
    icon: BuildingOfficeIcon,
    to: '/administrativo'
  }
]

const filteredDepartments = computed(() => {
  return departments.filter(dept => {
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
