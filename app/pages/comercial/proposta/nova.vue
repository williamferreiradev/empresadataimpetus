<template>
  <div class="p-8 max-w-5xl mx-auto pb-24">
    <div class="mb-8">
      <h1 class="text-3xl font-black text-slate-900 mb-2">Nova proposta</h1>
      <p class="text-slate-500">Preencha o briefing da reunião e escolha como gerar a proposta.</p>
    </div>

    <!-- Alert for Missing Gemini Key -->
    <div v-if="!hasGeminiKey && isGeminiConfigChecked" class="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start text-red-800">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-3 shrink-0 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      <div>
        <p class="font-bold">Atenção: GEMINI_API_KEY não configurada!</p>
        <p class="text-sm mt-1">Abra o arquivo <code>.env</code> na raiz do projeto e insira a sua chave do Gemini para que a IA possa gerar a proposta automaticamente.</p>
      </div>
    </div>

    <form @submit.prevent="generateWithGemini">
      
      <!-- Seção: CLIENTE -->
      <div class="bg-white dark:bg-zinc-800 p-8 rounded-2xl shadow-sm border border-slate-200 mb-8">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-lg font-bold text-slate-800 flex items-center">
            <span class="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mr-3 text-sm">1</span>
            Cliente
          </h2>
          <button type="button" @click="showNewClientModal = true" class="text-orange-600 hover:text-orange-700 font-semibold text-sm flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
            </svg>
            Criar Cliente
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div class="md:col-span-2">
            <label class="block text-sm font-bold text-slate-700 mb-2">Selecionar Lead Existente</label>
            <select v-model="selectedClienteId" @change="fillClientData" class="w-full border-slate-300 rounded-xl focus:ring-orange-500 focus:border-orange-500 bg-slate-50 p-3">
              <option value="">-- Preencher manualmente ou selecionar --</option>
              <option v-for="c in clientes" :key="c.id" :value="c.id">
                {{ c.nome_completo || c.nome_empresa }} {{ c.nome_empresa ? `- ${c.nome_empresa}` : '' }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-bold text-slate-700 mb-2">Nome do contato <span class="text-red-500">*</span></label>
            <input v-model="form.cliente_nome" required type="text" placeholder="Ex: João Silva" class="w-full border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-zinc-100 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 p-3" />
          </div>
          <div>
            <label class="block text-sm font-bold text-slate-700 mb-2">Empresa <span class="text-red-500">*</span></label>
            <input v-model="form.cliente_empresa" required type="text" placeholder="Ex: Clínica Saúde+" class="w-full border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-zinc-100 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 p-3" />
          </div>
          <div class="md:col-span-2">
            <label class="block text-sm font-bold text-slate-700 mb-2">Segmento</label>
            <select v-model="form.segmento" class="w-full border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-zinc-100 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 p-3">
              <option value="">Selecione...</option>
              <option value="Clínica/Saúde">Clínica/Saúde</option>
              <option value="Imobiliária">Imobiliária</option>
              <option value="Concessionária">Concessionária</option>
              <option value="E-commerce">E-commerce</option>
              <option value="SaaS/Tech">SaaS/Tech</option>
              <option value="Varejo">Varejo</option>
              <option value="Educação">Educação</option>
              <option value="Jurídico">Jurídico</option>
              <option value="Outro">Outro</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Seção: BRIEFING DA REUNIÃO -->
      <div class="bg-white dark:bg-zinc-800 p-8 rounded-2xl shadow-sm border border-slate-200 mb-8">
        <h2 class="text-lg font-bold text-slate-800 flex items-center mb-6">
          <span class="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mr-3 text-sm">2</span>
          Briefing da reunião
        </h2>

        <div class="grid grid-cols-1 gap-6">
          <div>
            <label class="block text-sm font-bold text-slate-700 mb-2">Dores identificadas <span class="text-red-500">*</span></label>
            <textarea v-model="form.dores" required rows="3" placeholder="Ex: Perde 3h/dia criando propostas manualmente. Follow-up inconsistente. CRM desatualizado..." class="w-full border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-zinc-100 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 p-3"></textarea>
          </div>

          <div>
            <label class="block text-sm font-bold text-slate-700 mb-2">Escopo solicitado <span class="text-red-500">*</span></label>
            <textarea v-model="form.escopo" required rows="3" placeholder="Ex: Automação de propostas comerciais + follow-up via WhatsApp + integração com CRM existente" class="w-full border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-zinc-100 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 p-3"></textarea>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-bold text-slate-700 mb-2">Investimento estimado</label>
              <input v-model="form.valor_estimado" type="text" placeholder="Ex: R$ 4.800 / mês" class="w-full border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-zinc-100 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 p-3" />
            </div>
            <div>
              <label class="block text-sm font-bold text-slate-700 mb-2">Prazo de entrega</label>
              <input v-model="form.prazo_estimado" type="text" placeholder="Ex: 3 semanas" class="w-full border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-zinc-100 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 p-3" />
            </div>
          </div>

          <div>
            <label class="block text-sm font-bold text-slate-700 mb-2">Contexto adicional</label>
            <textarea v-model="form.contexto" rows="3" placeholder="Ex: Cliente já usa n8n. Tem urgência pro próximo trimestre. Concorre com fornecedor X." class="w-full border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-zinc-100 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 p-3"></textarea>
          </div>
        </div>
      </div>

      <!-- Action Bar (Sticky Bottom) -->
      <div class="fixed bottom-0 left-0 lg:left-64 right-0 bg-white dark:bg-zinc-800 border-t border-slate-200 p-4 px-8 flex justify-between items-center shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)] z-40">
        <div class="flex space-x-4">
          <button type="button" @click="salvarRascunho" :disabled="isSaving" class="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors flex items-center">
            <svg v-if="isSaving" class="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            <span v-else>Salvar rascunho</span>
          </button>
          
          <button type="button" @click="copiarPrompt" class="px-6 py-3 bg-white dark:bg-zinc-800 border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold rounded-xl transition-colors flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
            Copiar prompt
          </button>
        </div>

        <button type="submit" :disabled="isGenerating" class="px-8 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black rounded-xl transition-all shadow-lg shadow-orange-500/30 flex items-center text-lg transform hover:scale-105 active:scale-95">
          <svg v-if="isGenerating" class="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
          {{ isGenerating ? 'Gerando...' : 'Gerar com Gemini' }}
        </button>
      </div>
    </form>

    <!-- Modal Novo Cliente -->
    <div v-if="showNewClientModal" class="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white dark:bg-zinc-800 rounded-2xl p-8 max-w-md w-full shadow-2xl">
        <h3 class="text-xl font-bold text-slate-900 mb-6">Criar Cliente Rápido</h3>
        
        <div class="space-y-4 mb-6">
          <div>
            <label class="block text-sm font-bold text-slate-700 mb-1">Nome do Contato *</label>
            <input v-model="newClient.nome_completo" type="text" class="w-full border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-zinc-100 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 p-2" />
          </div>
          <div>
            <label class="block text-sm font-bold text-slate-700 mb-1">Empresa</label>
            <input v-model="newClient.nome_empresa" type="text" class="w-full border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-zinc-100 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 p-2" />
          </div>
          <div>
            <label class="block text-sm font-bold text-slate-700 mb-1">Telefone / WhatsApp</label>
            <input v-model="newClient.telefone" type="text" class="w-full border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-zinc-100 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 p-2" />
          </div>
        </div>
        
        <div class="flex justify-end space-x-3">
          <button @click="showNewClientModal = false" class="px-4 py-2 text-slate-500 hover:text-slate-700 font-bold">Cancelar</button>
          <button @click="criarCliente" :disabled="isCreatingClient" class="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl flex items-center">
            <svg v-if="isCreatingClient" class="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            Criar e Selecionar
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import type { Database } from '~/types/database.types'
import { usePropostasStore } from '~/stores/propostas'

definePageMeta({
  layout: 'comercial'
})

const supabase = useSupabaseClient<Database>()
const user = useSupabaseUser()
const router = useRouter()
const propostasStore = usePropostasStore()

// Refs do formulário
const clientes = ref<any[]>([])
const selectedClienteId = ref('')

const form = ref({
  cliente_nome: '',
  cliente_empresa: '',
  segmento: '',
  dores: '',
  escopo: '',
  valor_estimado: '',
  prazo_estimado: '',
  contexto: ''
})

// UI States
const isSaving = ref(false)
const isGenerating = ref(false)
const showNewClientModal = ref(false)
const isCreatingClient = ref(false)
const hasGeminiKey = ref(true) // assume true initially
const isGeminiConfigChecked = ref(false)

const newClient = ref({
  nome_completo: '',
  nome_empresa: '',
  telefone: ''
})

onMounted(async () => {
  await fetchClientes()
  
  // Apenas uma verificação simples no env. Não podemos ler o process.env direto no client, 
  // mas o servidor poderia retornar erro se falhar. 
  isGeminiConfigChecked.value = true
})

async function fetchClientes() {
  const { data, error } = await supabase
    .from('ibeia_clientes')
    .select('id, nome_completo, nome_empresa')
    .order('created_at', { ascending: false })
    
  if (data) {
    clientes.value = data
  }
}

function fillClientData() {
  const c = clientes.value.find(x => x.id === selectedClienteId.value)
  if (c) {
    form.value.cliente_nome = c.nome_completo || ''
    form.value.cliente_empresa = c.nome_empresa || ''
  } else {
    form.value.cliente_nome = ''
    form.value.cliente_empresa = ''
  }
}

async function criarCliente() {
  if (!newClient.value.nome_completo) return alert('Nome do contato é obrigatório')
  
  isCreatingClient.value = true
  try {
    const { data, error } = await supabase
      .from('ibeia_clientes')
      .insert({
        nome_completo: newClient.value.nome_completo,
        nome_empresa: newClient.value.nome_empresa,
        telefone: newClient.value.telefone,
        status: 'Novo',
        origem: 'Criado via Proposta'
      })
      .select()
      .single()
      
    if (error) throw error
    
    // Atualiza a lista e seleciona
    clientes.value.unshift(data)
    selectedClienteId.value = data.id
    fillClientData()
    showNewClientModal.value = false
    
    // Limpa
    newClient.value = { nome_completo: '', nome_empresa: '', telefone: '' }
  } catch (err) {
    console.error(err)
    alert('Erro ao criar cliente')
  } finally {
    isCreatingClient.value = false
  }
}

function montarPrompt() {
  const SEGMENT_COLORS: Record<string, string> = {
    'Imobiliária':    '#d97757',
    'Clínica/Saúde':  '#3B82F6',
    'SaaS/Tech':      '#8B5CF6',
    'E-commerce':     '#F59E0B',
    'Concessionária': '#10B981',
    'Varejo':         '#EC4899',
    'Educação':       '#6366F1',
    'Jurídico':       '#64748B',
  }

  const accent = SEGMENT_COLORS[form.value.segmento] || '#6366F1'
  const investimento = form.value.valor_estimado || 'a ser definido'
  const prazo        = form.value.prazo_estimado  || 'a ser definido'

  return `Você é o melhor especialista em propostas comerciais B2B de automação e inteligência artificial do Brasil.
Trabalha para a empresa Data Impetus e vai criar uma proposta EXCLUSIVA para este cliente específico.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DADOS REAIS DO CLIENTE (use exatamente estes dados, não invente outros)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
NOME DO CONTATO: ${form.value.cliente_nome}
EMPRESA: ${form.value.cliente_empresa}
SEGMENTO: ${form.value.segmento || 'Não informado'}
DORES IDENTIFICADAS NA REUNIÃO: ${form.value.dores}
ESCOPO SOLICITADO: ${form.value.escopo}
INVESTIMENTO ACORDADO: ${investimento}
PRAZO DE ENTREGA: ${prazo}
CONTEXTO ADICIONAL: ${form.value.contexto || 'Nenhum'}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

REGRAS OBRIGATÓRIAS — leia com atenção:
1. O campo "hero.headline" DEVE ser uma pergunta direta sobre a DOR PRINCIPAL de ${form.value.cliente_empresa}. Use o contexto real das dores acima.
2. O "diagnostico" DEVE nomear os problemas EXATOS que ${form.value.cliente_nome} mencionou, não problemas genéricos.
3. A "ancoragem" DEVE calcular perdas financeiras reais com base nas dores descritas. Estime valores conservadores mas realistas para o segmento ${form.value.segmento || 'B2B'}. Calcule horas desperdiçadas × custo médio de hora, oportunidades perdidas, retrabalho, etc.
4. O campo "com_solucao.roi_percentual" deve ser calculado assim: ((ganhos_mensais - custo_mensal) / custo_mensal) × 100. Use o investimento de ${investimento}.
5. A "solucao.nome_solucao" deve ser um nome comercial criativo baseado no escopo: "${form.value.escopo}".
6. As "entregas" devem ser os entregáveis REAIS do escopo "${form.value.escopo}", não genéricos.
7. O campo "investimento.valor_principal" deve ser EXATAMENTE "${investimento}".
8. O campo "investimento.prazo" deve ser EXATAMENTE "${prazo}".
9. Escreva em português brasileiro, tom profissional e direto.
10. NÃO invente dados do cliente. Use SOMENTE o que está no briefing acima.

Responda SOMENTE com o JSON abaixo preenchido. Sem texto antes, sem texto depois, sem blocos de código (\`\`\`).

{
  "hero": {
    "headline": "[Pergunta poderosa sobre a DOR PRINCIPAL de ${form.value.cliente_empresa} — máx 12 palavras]",
    "subheadline": "[O que a Data Impetus vai resolver para ${form.value.cliente_nome} em 1 frase direta]"
  },
  "diagnostico": {
    "titulo": "[Título impactante sobre o cenário atual de ${form.value.cliente_empresa}]",
    "intro": "[2 frases sobre os problemas reais que ${form.value.cliente_nome} descreveu na reunião]",
    "pontos": [
      { "titulo": "[Nome curto do problema 1 — extraído das dores]", "descricao": "[Impacto financeiro/operacional deste problema específico]" },
      { "titulo": "[Nome curto do problema 2 — extraído das dores]", "descricao": "[Impacto financeiro/operacional deste problema específico]" },
      { "titulo": "[Nome curto do problema 3 — extraído das dores]", "descricao": "[Impacto financeiro/operacional deste problema específico]" }
    ]
  },
  "ancoragem": {
    "titulo": "O custo real de não agir agora",
    "subtitulo": "Antes de ver a solução, veja o que está em jogo para ${form.value.cliente_empresa}",
    "sem_solucao": {
      "label": "O que ${form.value.cliente_empresa} perde por mês SEM a solução",
      "valor_total": "[Soma total das perdas mensais em R$]",
      "valor_anual": "[Soma anual das perdas em R$]",
      "itens": [
        { "label": "[Nome da perda 1]", "valor": "R$ X.XXX/mês", "descricao": "[Como foi calculado — horas, pessoas, custo/hora]" },
        { "label": "[Nome da perda 2]", "valor": "R$ X.XXX/mês", "descricao": "[Como foi calculado]" },
        { "label": "[Nome da perda 3]", "valor": "R$ X.XXX/mês", "descricao": "[Como foi calculado]" }
      ]
    },
    "com_solucao": {
      "label": "O que ${form.value.cliente_empresa} recupera COM a Data Impetus",
      "valor_total": "[Retorno mensal total estimado em R$]",
      "valor_anual": "[Retorno anual estimado em R$]",
      "roi_percentual": "[ROI calculado: (retorno - ${investimento}) / ${investimento} × 100, arredondado]",
      "payback": "[Quantos dias para recuperar o investimento de ${investimento}]",
      "itens": [
        { "label": "[Ganho 1]", "valor": "R$ X.XXX/mês", "descricao": "[Como será alcançado com a automação]" },
        { "label": "[Ganho 2]", "valor": "R$ X.XXX/mês", "descricao": "[Como será alcançado com a automação]" },
        { "label": "[Custo da solução]", "valor": "- ${investimento}", "descricao": "Investimento mensal na solução Data Impetus" }
      ]
    }
  },
  "solucao": {
    "titulo": "O que vamos construir para ${form.value.cliente_empresa}",
    "intro": "[2 frases explicando como a Data Impetus vai resolver especificamente: ${form.value.escopo}]",
    "nome_solucao": "[Nome comercial criativo para a solução — baseado no escopo solicitado]"
  },
  "entregas": [
    { "numero": 1, "titulo": "[Entrega 1 do escopo]", "descricao": "[O que será construído e como funciona — 2 frases técnicas]", "beneficio": "[Resultado direto para ${form.value.cliente_nome}]" },
    { "numero": 2, "titulo": "[Entrega 2 do escopo]", "descricao": "[O que será construído e como funciona — 2 frases técnicas]", "beneficio": "[Resultado direto para ${form.value.cliente_nome}]" },
    { "numero": 3, "titulo": "[Entrega 3 do escopo]", "descricao": "[O que será construído e como funciona — 2 frases técnicas]", "beneficio": "[Resultado direto para ${form.value.cliente_nome}]" },
    { "numero": 4, "titulo": "[Entrega 4 — suporte/treinamento/dashboard]", "descricao": "[Descrição]", "beneficio": "[Benefício]" }
  ],
  "resultados": [
    { "valor": "[Número/% baseado nas dores]", "label": "[O que muda na prática]" },
    { "valor": "[Número/% baseado nas dores]", "label": "[O que muda na prática]" },
    { "valor": "[Número/% baseado nas dores]", "label": "[O que muda na prática]" },
    { "valor": "[Número/% baseado nas dores]", "label": "[O que muda na prática]" }
  ],
  "investimento": {
    "valor_principal": "${investimento}",
    "prazo": "${prazo}",
    "inclui": [
      "[Item 1 do que está incluso — específico para o escopo]",
      "[Item 2]",
      "[Item 3]",
      "[Item 4]",
      "Suporte técnico por 30 dias após o go-live"
    ]
  },
  "proximos_passos": [
    { "numero": 1, "titulo": "Reunião de Kick-off", "descricao": "Alinhamento final de escopo, acessos e cronograma com ${form.value.cliente_nome}." },
    { "numero": 2, "titulo": "Desenvolvimento e Implementação", "descricao": "Nossa equipe constrói, configura e testa todas as automações — entrega em ${prazo}." },
    { "numero": 3, "titulo": "Treinamento e Go-Live", "descricao": "Capacitação do time de ${form.value.cliente_empresa} e ativação oficial da solução." }
  ],
  "accent_color": "${accent}"
}`
}

async function salvarNoBanco(status: string, conteudoJson: string | null = null) {
  // Pegamos o email do usuário logado se existir, senão um placeholder
  const criado_por = user.value?.email || 'Vendedor'
  
  const payload: any = {
    cliente_nome: form.value.cliente_nome,
    cliente_empresa: form.value.cliente_empresa,
    segmento: form.value.segmento,
    dores: form.value.dores,
    escopo: form.value.escopo,
    valor_estimado: form.value.valor_estimado,
    prazo_estimado: form.value.prazo_estimado,
    contexto: form.value.contexto,
    status: status,
    criado_por: criado_por,
  }

  if (selectedClienteId.value) {
    payload.cliente_id = selectedClienteId.value
  }
  
  if (conteudoJson) {
    payload.conteudo = conteudoJson
  }

  try {
    const saved = await propostasStore.createProposta(payload)
    return saved
  } catch (error) {
    console.error("Erro ao salvar:", error)
    throw error
  }
}

async function salvarRascunho() {
  if (!form.value.cliente_nome || !form.value.cliente_empresa || !form.value.dores || !form.value.escopo) {
    alert("Preencha os campos obrigatórios (*)")
    return
  }
  
  isSaving.value = true
  try {
    await salvarNoBanco('rascunho')
    router.push('/comercial/proposta/pipeline')
  } catch (err) {
    alert("Erro ao salvar rascunho.")
  } finally {
    isSaving.value = false
  }
}

async function copiarPrompt() {
  if (!form.value.cliente_nome || !form.value.cliente_empresa || !form.value.dores || !form.value.escopo) {
    alert("Preencha os campos obrigatórios primeiro para gerar um bom prompt.")
    return
  }
  
  const prompt = montarPrompt()
  try {
    await navigator.clipboard.writeText(prompt)
    alert("Prompt copiado para a área de transferência! Você pode colar no Claude ou ChatGPT.")
  } catch (err) {
    alert("Falha ao copiar.")
  }
}

async function generateWithGemini() {
  if (!form.value.cliente_nome || !form.value.cliente_empresa || !form.value.dores || !form.value.escopo) {
    alert("Preencha os campos obrigatórios (*)")
    return
  }
  
  isGenerating.value = true
  try {
    const prompt = montarPrompt()
    
    // 1. Chama API do Gemini
    const response = await fetch('/api/gemini/gerar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    })
    
    if (!response.ok) {
      if (response.status === 500) {
        hasGeminiKey.value = false // Provavelmente chave ausente
      }
      const err = await response.text()
      throw new Error(err)
    }
    
    const jsonResult = await response.json()
    
    // 2. Salva no banco com o status "em_revisao"
    const savedProposal = await salvarNoBanco('em_revisao', JSON.stringify(jsonResult))
    
    // 3. Redireciona para a view pública
    router.push(`/p/${savedProposal.id}`)
    
  } catch (err: any) {
    console.error(err)
    alert(`Erro ao gerar proposta: ${err.message}`)
  } finally {
    isGenerating.value = false
  }
}
</script>
