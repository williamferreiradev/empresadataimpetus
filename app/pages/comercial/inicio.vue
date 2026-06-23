<template>
  <div>
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div class="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-sm font-medium text-gray-500 mb-1">Novas Propostas (Mês)</p>
            <h3 class="text-2xl font-bold text-gray-900">{{ novasPropostas }}</h3>
          </div>
          <div class="p-2 bg-orange-50 rounded-lg">
            <DocumentTextIcon class="h-6 w-6 text-orange-500" />
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-sm font-medium text-gray-500 mb-1">Valor no Pipeline</p>
            <h3 class="text-2xl font-bold text-gray-900">{{ formatCurrency(valorPipeline) }}</h3>
          </div>
          <div class="p-2 bg-blue-50 rounded-lg">
            <ChartBarIcon class="h-6 w-6 text-blue-500" />
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-sm font-medium text-gray-500 mb-1">Fechamentos (Mês)</p>
            <h3 class="text-2xl font-bold text-gray-900">{{ fechamentosMes }}</h3>
          </div>
          <div class="p-2 bg-emerald-50 rounded-lg">
            <BriefcaseIcon class="h-6 w-6 text-emerald-500" />
          </div>
        </div>
      </div>
      
      <div class="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-sm font-medium text-gray-500 mb-1">Valor Fechado (Mês)</p>
            <h3 class="text-2xl font-bold text-gray-900">{{ formatCurrency(valorFechadoMes) }}</h3>
          </div>
          <div class="p-2 bg-green-50 rounded-lg">
            <BanknotesIcon class="h-6 w-6 text-green-500" />
          </div>
        </div>
      </div>
    </div>
    
    <!-- Charts Section -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      <!-- Gráfico 1 -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-lg font-bold text-gray-800">Propostas por Dia (Sem. Atual)</h3>
        </div>
        
        <!-- CSS Bar Chart -->
        <div class="flex items-end justify-between h-40 pt-4">
          <div v-for="(day, index) in chartPropostasAtual" :key="index" class="flex flex-col items-center w-full group cursor-pointer">
            <div class="relative flex justify-center w-full h-full items-end">
              <span class="absolute -top-6 text-xs font-bold text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">{{ day.formatted }}</span>
              <div class="w-10 bg-orange-200 rounded-t-md group-hover:bg-orange-300 transition-colors" :style="{ height: day.percentage }"></div>
            </div>
            <span class="text-xs text-gray-400 mt-2 font-medium">{{ day.label }}</span>
          </div>
        </div>
      </div>

      <!-- Gráfico 2 -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-lg font-bold text-gray-800">Propostas por Dia (Sem. Passada)</h3>
        </div>
        
        <!-- CSS Bar Chart -->
        <div class="flex items-end justify-between h-40 pt-4">
          <div v-for="(day, index) in chartPropostasPassada" :key="index" class="flex flex-col items-center w-full group cursor-pointer">
            <div class="relative flex justify-center w-full h-full items-end">
              <span class="absolute -top-6 text-xs font-bold text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">{{ day.formatted }}</span>
              <div class="w-10 bg-gray-200 rounded-t-md group-hover:bg-gray-300 transition-colors" :style="{ height: day.percentage }"></div>
            </div>
            <span class="text-xs text-gray-400 mt-2 font-medium">{{ day.label }}</span>
          </div>
        </div>
      </div>

      <!-- Gráfico 3 -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-lg font-bold text-gray-800">Valor Fechado (Sem. Atual)</h3>
        </div>
        
        <!-- CSS Bar Chart -->
        <div class="flex items-end justify-between h-40 pt-4">
          <div v-for="(day, index) in chartValorFechado" :key="index" class="flex flex-col items-center w-full group cursor-pointer">
            <div class="relative flex justify-center w-full h-full items-end">
              <span class="absolute -top-6 text-xs font-bold text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">{{ day.formatted }}</span>
              <div class="w-10 bg-green-300 rounded-t-md group-hover:bg-green-400 transition-colors" :style="{ height: day.percentage }"></div>
            </div>
            <span class="text-xs text-gray-400 mt-2 font-medium">{{ day.label }}</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Clientes Adicionados -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="p-6 border-b border-gray-100 flex justify-between items-center">
        <h3 class="text-lg font-bold text-gray-800">Clientes Adicionados (Esse Mês)</h3>
        <NuxtLink to="/comercial/clientes" class="text-sm font-semibold text-orange-500 hover:text-orange-600 transition-colors">
          Ver todos &rarr;
        </NuxtLink>
      </div>
      
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-100">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data de Adição</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Origem</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-100">
            <tr v-if="pendingClientes">
              <td colspan="4" class="px-6 py-8 text-center text-gray-500 text-sm">Carregando clientes...</td>
            </tr>
            <tr v-else-if="!clientes || clientes.length === 0">
              <td colspan="4" class="px-6 py-8 text-center text-gray-500 text-sm">Nenhum cliente adicionado recentemente.</td>
            </tr>
            <tr v-else v-for="cliente in clientes" :key="cliente.id" class="hover:bg-gray-50 transition-colors cursor-pointer">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                    {{ cliente.nome.charAt(0).toUpperCase() }}
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ cliente.nome }}</div>
                    <div class="text-sm text-gray-500">{{ cliente.email || 'Sem e-mail' }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatDate(cliente.criado_em) }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ cliente.origem || '-' }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getStatusClass(cliente.status)" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                  {{ formatStatus(cliente.status) }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { 
  DocumentTextIcon, 
  ChartBarIcon, 
  BriefcaseIcon,
  BanknotesIcon
} from '@heroicons/vue/24/outline'
import type { Database } from '~/types/database.types'

definePageMeta({
  layout: 'comercial'
})

const supabase = useSupabaseClient<Database>()

// ----------------------------------------------------
// FETCH DATA
// ----------------------------------------------------
const { data: propostas, pending: pendingPropostas } = useAsyncData('inicio-propostas', async () => {
  const { data, error } = await supabase
    .from('ibeia_propostas')
    .select('*')
    .order('criado_em', { ascending: false });
  if (error) console.error(error);
  return data || [];
});

const { data: clientes, pending: pendingClientes } = useAsyncData('inicio-clientes', async () => {
  const { data, error } = await supabase
    .from('ibeia_clientes')
    .select('*')
    .order('criado_em', { ascending: false })
    .limit(10);
  if (error) console.error(error);
  return data || [];
});

// ----------------------------------------------------
// UTILS
// ----------------------------------------------------
function parseCurrency(val: string | null | undefined): number {
  if (!val) return 0;
  const cleanStr = val.replace(/[^\d,-]/g, '').replace(',', '.');
  const num = parseFloat(cleanStr);
  return isNaN(num) ? 0 : num;
}

function formatCurrency(val: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return '';
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date(dateStr));
}

// ----------------------------------------------------
// KPIs COMPUTEDS
// ----------------------------------------------------
const now = new Date();
const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

const propostasMes = computed(() => {
  return (propostas.value || []).filter(p => p.criado_em && new Date(p.criado_em) >= firstDayOfMonth);
});

const novasPropostas = computed(() => propostasMes.value.length);

const valorPipeline = computed(() => {
  const pipeline = (propostas.value || []).filter(p => p.status === 'em_revisao' || p.status === 'enviado');
  return pipeline.reduce((acc, p) => acc + parseCurrency(p.valor_estimado), 0);
});

const fechamentosMes = computed(() => {
  return propostasMes.value.filter(p => p.status === 'aprovado').length;
});

const valorFechadoMes = computed(() => {
  const fechadas = propostasMes.value.filter(p => p.status === 'aprovado');
  return fechadas.reduce((acc, p) => acc + parseCurrency(p.valor_estimado), 0);
});

// ----------------------------------------------------
// CHARTS LOGIC
// ----------------------------------------------------
function getWeekData(dateOffset: number, isCurrency: boolean = false) {
  const start = new Date(now);
  start.setDate(now.getDate() - now.getDay() + 1 + (dateOffset * 7)); // Segunda-feira
  start.setHours(0, 0, 0, 0);
  
  const end = new Date(start);
  end.setDate(start.getDate() + 4); // Sexta-feira
  end.setHours(23, 59, 59, 999);
  
  const days = [0, 0, 0, 0, 0]; // Seg a Sex
  
  (propostas.value || []).forEach(p => {
    if (!p.criado_em) return;
    const pDate = new Date(p.criado_em);
    if (pDate >= start && pDate <= end) {
      const dayIdx = pDate.getDay() - 1; // 0 = Segunda
      if (dayIdx >= 0 && dayIdx < 5) {
        if (isCurrency && p.status === 'aprovado') {
          days[dayIdx] += parseCurrency(p.valor_estimado);
        } else if (!isCurrency) {
          days[dayIdx] += 1;
        }
      }
    }
  });
  
  const max = Math.max(...days, 1);
  const labels = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex'];
  
  return days.map((val, idx) => ({
    label: labels[idx],
    value: val,
    formatted: isCurrency ? formatCurrency(val) : val.toString(),
    percentage: Math.round((val / max) * 100) + '%'
  }));
}

const chartPropostasAtual = computed(() => getWeekData(0));
const chartPropostasPassada = computed(() => getWeekData(-1));
const chartValorFechado = computed(() => getWeekData(0, true));

// ----------------------------------------------------
// UI HELPERS
// ----------------------------------------------------
const statusColors = {
  lead: 'bg-gray-100 text-gray-800',
  qualificacao: 'bg-blue-100 text-blue-800',
  negociacao: 'bg-yellow-100 text-yellow-800',
  fechado: 'bg-green-100 text-green-800',
  perdido: 'bg-red-100 text-red-800'
} as Record<string, string>;

function getStatusClass(status: string | null) {
  if (!status) return statusColors.lead;
  return statusColors[status.toLowerCase()] || statusColors.lead;
}

function formatStatus(status: string | null) {
  if (!status) return 'Lead';
  return status.charAt(0).toUpperCase() + status.slice(1);
}
</script>
