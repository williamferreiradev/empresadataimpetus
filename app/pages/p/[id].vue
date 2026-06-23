<template>
  <div class="min-h-screen bg-gray-50 font-sans text-gray-800 print:bg-white flex flex-col items-center pb-20 sm:pb-0">
    
    <!-- Loading State -->
    <div v-if="pending" class="flex justify-center items-center h-screen print:hidden">
      <svg class="animate-spin h-10 w-10 text-orange-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>

    <!-- Error State -->
    <div v-else-if="!proposta || !parsedData" class="w-full max-w-4xl p-10 mt-10 bg-white rounded-xl shadow-sm text-center print:hidden">
      <h2 class="text-2xl font-bold text-gray-900 mb-2">Proposta não encontrada</h2>
      <p class="text-gray-500">O link é inválido ou a proposta ainda não possui conteúdo gerado.</p>
    </div>

    <!-- SITE PROPOSAL -->
    <div v-else-if="parsedData.isSite" class="w-full min-h-screen bg-white">
      <SitePreview :theme="parsedData.theme" :content="parsedData.content" />
    </div>

    <!-- DOCUMENT WRAPPER (COMMERCIAL PROPOSAL) -->
    <div v-else class="w-full max-w-[1000px] bg-white shadow-2xl print:shadow-none print:w-full print:max-w-none my-0 sm:my-10 overflow-hidden rounded-none sm:rounded-2xl document-container">
      
      <!-- 1. HERO SECTION (DARK) -->
      <section class="bg-[#0B1120] text-white p-10 md:p-16 relative">
        <div class="mb-10 text-xs font-bold tracking-[0.2em] text-gray-400 uppercase flex items-center">
          DATA IMPETUS <span class="mx-3 text-orange-500">•</span> PROPOSTA COMERCIAL EXCLUSIVA
        </div>
        
        <h1 class="text-4xl md:text-5xl lg:text-6xl font-extrabold text-orange-500 leading-tight mb-6 tracking-tight">
          {{ parsedData.hero.headline }}
        </h1>
        
        <p class="text-lg md:text-xl text-gray-300 max-w-3xl leading-relaxed mb-16">
          {{ parsedData.hero.subheadline }}
        </p>
        
        <!-- Divider -->
        <div class="h-px w-full bg-slate-700/50 mb-10"></div>
        
        <!-- Client Info Grid -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-left">
          <div>
            <p class="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Para</p>
            <p class="text-lg font-bold text-white">{{ proposta.cliente_nome }}</p>
          </div>
          <div>
            <p class="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Empresa</p>
            <p class="text-lg font-bold text-white">{{ proposta.cliente_empresa }}</p>
          </div>
          <div>
            <p class="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Segmento</p>
            <p class="text-lg font-bold text-white">{{ proposta.segmento || 'Não informado' }}</p>
          </div>
          <div>
            <p class="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Data</p>
            <p class="text-lg font-bold text-white">{{ new Date(proposta.criado_em).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' }) }}</p>
          </div>
        </div>
      </section>

      <!-- 2. DIAGNÓSTICO -->
      <section class="p-10 md:p-16 bg-white">
        <div class="inline-block px-3 py-1 bg-orange-50 text-orange-600 text-xs font-black uppercase tracking-widest rounded-full mb-6 border border-orange-100">
          Diagnóstico
        </div>
        <h2 class="text-3xl font-extrabold text-slate-900 mb-4">{{ parsedData.diagnostico.titulo }}</h2>
        <p class="text-lg text-gray-600 mb-10 max-w-3xl leading-relaxed">{{ parsedData.diagnostico.intro }}</p>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="(ponto, i) in parsedData.diagnostico.pontos" :key="i" class="bg-gray-50 rounded-2xl p-6 border border-gray-100 shadow-sm page-break-inside-avoid">
            <div class="flex items-center mb-3">
              <div class="w-2.5 h-2.5 rounded-full bg-orange-500 mr-3"></div>
              <h3 class="font-bold text-slate-900 text-lg">{{ ponto.titulo }}</h3>
            </div>
            <p class="text-gray-600 text-sm leading-relaxed">{{ ponto.descricao }}</p>
          </div>
        </div>
      </section>

      <!-- 4. SOLUÇÃO E ENTREGAS -->
      <section class="bg-gray-50 text-slate-900 p-10 md:p-16 page-break-inside-avoid">
        <div class="inline-block px-3 py-1 bg-orange-100 text-orange-600 text-xs font-black uppercase tracking-widest rounded-full mb-6">
          A Solução
        </div>
        <h2 class="text-3xl font-extrabold text-slate-900 mb-8">{{ parsedData.solucao.titulo }}</h2>
        
        <div class="bg-white rounded-2xl p-8 shadow-sm border border-orange-200 border-l-8 border-l-orange-500 mb-12 page-break-inside-avoid">
          <p class="text-xs font-bold text-orange-500 uppercase tracking-widest mb-2">Solução Proposta</p>
          <h3 class="text-2xl md:text-3xl font-black text-slate-900">{{ parsedData.solucao.nome_solucao }}</h3>
        </div>
      </section>

      <!-- ENTREGAS NO FUNDO ESCURO -->
      <section class="bg-[#0B1120] text-white p-10 md:p-16 page-break-inside-avoid">
        <div class="inline-block px-3 py-1 bg-slate-800 text-slate-400 text-xs font-black uppercase tracking-widest rounded-full mb-6 border border-slate-700">
          O que você vai receber
        </div>
        <h3 class="text-3xl font-extrabold text-white mb-8">Entregas incluídas na proposta</h3>

        <div class="space-y-4">
          <div v-for="(entrega, index) in parsedData.entregas" :key="index" class="bg-slate-800/40 border border-slate-700 rounded-2xl p-6 flex items-start page-break-inside-avoid">
            <div class="bg-orange-500 text-white font-black w-10 h-10 rounded flex items-center justify-center shrink-0 mt-0.5 text-lg">
              {{ entrega.numero }}
            </div>
            <div class="ml-5">
              <h4 class="text-xl font-bold text-white mb-2">{{ entrega.titulo }}</h4>
              <p class="text-slate-400 text-sm mb-4 leading-relaxed">{{ entrega.descricao }}</p>
              <div class="flex items-center text-orange-400 text-sm font-bold bg-orange-500/10 inline-flex px-3 py-1.5 rounded-lg border border-orange-500/20">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
                {{ entrega.beneficio }}
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 5. RESULTADOS ESPERADOS (LIGHT) -->
      <section class="p-10 md:p-16 bg-white page-break-inside-avoid">
        <div class="inline-block px-3 py-1 bg-orange-50 text-orange-600 text-xs font-black uppercase tracking-widest rounded-full mb-6 border border-orange-100">
          Resultados
        </div>
        <h2 class="text-3xl font-extrabold text-slate-900 mb-8">O que muda na prática</h2>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div v-for="(resultado, i) in parsedData.resultados" :key="i" class="text-center p-6 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col justify-center items-center page-break-inside-avoid">
            <!-- Quebra automática de texto para valores grandes divididos por espaço -->
            <div class="font-black text-orange-500 mb-3 leading-none flex flex-col items-center">
              <span class="text-4xl md:text-5xl lg:text-[50px]">{{ resultado.valor.split(' ')[0] }}</span>
              <span v-if="resultado.valor.split(' ').length > 1" class="text-xl lg:text-2xl mt-2 font-bold">{{ resultado.valor.substring(resultado.valor.indexOf(' ') + 1) }}</span>
            </div>
            <div class="text-sm font-medium text-slate-500 leading-snug px-2">{{ resultado.label }}</div>
          </div>
        </div>
      </section>

      <!-- 3. ANÁLISE DE IMPACTO FINANCEIRO (ANCORAGEM) -->
      <section v-if="parsedData.ancoragem" class="bg-[#0B1120] text-white p-10 md:p-16 page-break-inside-avoid">
        <div class="inline-block px-3 py-1 bg-slate-800 text-orange-400 text-xs font-black uppercase tracking-widest rounded-full mb-6 border border-slate-700">
          Análise de Impacto Financeiro
        </div>
        <h2 class="text-3xl font-extrabold text-white mb-2">O que isso custa vs. o que vamos gerar</h2>
        <p class="text-slate-400 mb-10 text-lg">Comparativo financeiro real</p>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          
          <!-- Card Situação Atual (Vermelho Escuro) -->
          <div class="bg-[#1A161A] border border-red-900/30 rounded-3xl p-8 relative overflow-hidden page-break-inside-avoid">
            <div class="flex items-center text-red-500 font-black uppercase tracking-widest text-xs mb-4">
              <div class="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center mr-2">
                <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
              </div>
              {{ parsedData.ancoragem.sem_solucao.label }}
            </div>
            
            <div class="text-5xl font-black text-red-400 mb-1">R$ {{ parsedData.ancoragem.sem_solucao.valor_anual }}</div>
            <div class="text-slate-500 text-sm mb-8">desperdício anual</div>
            
            <div class="space-y-4">
              <div v-for="(item, i) in parsedData.ancoragem.sem_solucao.itens" :key="i" class="flex justify-between items-start border-t border-red-900/20 pt-4">
                <div>
                  <div class="text-slate-300 font-semibold">{{ item.label }}</div>
                  <div class="text-slate-500 text-xs mt-1">{{ item.descricao }}</div>
                </div>
                <div class="text-red-500 font-bold whitespace-nowrap ml-4">{{ item.valor }}</div>
              </div>
            </div>
          </div>

          <!-- Card Com Data Impetus (Laranja) -->
          <div class="bg-[#1A161A] border border-orange-900/30 rounded-3xl p-8 relative overflow-hidden page-break-inside-avoid">
            <!-- Efeito de brilho de fundo -->
            <div class="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            
            <div class="flex items-center text-orange-500 font-black uppercase tracking-widest text-xs mb-4 relative z-10">
              <div class="w-5 h-5 rounded-full bg-orange-500/20 flex items-center justify-center mr-2">
                <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" /></svg>
              </div>
              {{ parsedData.ancoragem.com_solucao.label }}
            </div>
            
            <div class="text-5xl font-black text-white mb-1 relative z-10">R$ {{ parsedData.ancoragem.com_solucao.valor_anual }}</div>
            <div class="text-slate-500 text-sm mb-6 relative z-10">retorno anual estimado</div>
            
            <div class="flex space-x-4 mb-8 relative z-10">
              <div class="bg-slate-800/50 rounded-xl p-3 border border-slate-700 text-center flex-1">
                <div class="text-xl font-black text-orange-500">{{ parsedData.ancoragem.com_solucao.roi_percentual }}</div>
                <div class="text-[10px] text-slate-400 font-bold uppercase tracking-widest">ROI</div>
              </div>
              <div class="bg-slate-800/50 rounded-xl p-3 border border-slate-700 text-center flex-1">
                <div class="text-xl font-black text-white">{{ parsedData.ancoragem.com_solucao.payback }}</div>
                <div class="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Payback</div>
              </div>
            </div>
            
            <div class="space-y-4 relative z-10">
              <div v-for="(item, i) in parsedData.ancoragem.com_solucao.itens" :key="i" class="flex justify-between items-start border-t border-slate-800 pt-4">
                <div>
                  <div class="text-slate-300 font-semibold">{{ item.label }}</div>
                  <div class="text-slate-500 text-xs mt-1">{{ item.descricao }}</div>
                </div>
                <div class="text-orange-400 font-bold whitespace-nowrap ml-4">{{ item.valor }}</div>
              </div>
            </div>
          </div>
          
        </div>

        <!-- Banner Payback -->
        <div class="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6 flex items-start page-break-inside-avoid">
          <svg class="w-8 h-8 text-orange-500 mr-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          <div>
            <div class="font-bold text-white text-lg mb-1">O investimento se paga em <span class="text-orange-500">{{ parsedData.ancoragem.com_solucao.payback }}</span></div>
            <div class="text-slate-400 text-sm">A cada mês sem a solução, você deixa dinheiro na mesa. O retorno começa no primeiro mês.</div>
          </div>
        </div>
      </section>

      <!-- 6. INVESTIMENTO (DARK E FULL WIDTH) -->
      <section class="p-10 md:p-16 bg-[#080C17] text-white page-break-inside-avoid border-t border-slate-800">
        <div class="inline-block px-3 py-1 bg-red-950/40 text-orange-500 text-xs font-black uppercase tracking-widest rounded-full mb-6 border border-orange-900/50">
          Investimento
        </div>
        <h2 class="text-3xl font-extrabold text-white mb-8">O valor desta transformação</h2>

        <div class="bg-slate-900 border border-slate-700/60 p-8 md:p-10 rounded-3xl shadow-2xl grid grid-cols-1 md:grid-cols-2 gap-12 page-break-inside-avoid">
          
          <!-- Lista Esquerda -->
          <div>
            <div class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">O que está incluído</div>
            <ul class="space-y-4">
              <li v-for="(item, i) in parsedData.investimento.inclui" :key="i" class="flex items-start text-slate-300">
                <svg class="h-5 w-5 text-orange-500 mr-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span class="text-lg">{{ item }}</span>
              </li>
            </ul>
          </div>

          <!-- Valor Direita -->
          <div class="flex flex-col justify-center items-center text-center md:border-l md:border-slate-800 md:pl-12">
            
            <div v-if="!valueRevealed" class="print:hidden w-full">
              <button @click="valueRevealed = true" class="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-5 rounded-2xl transition-colors shadow-lg shadow-orange-500/20 text-lg flex justify-center items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Revelar Investimento
              </button>
            </div>

            <div :class="{ 'hidden print:block w-full': !valueRevealed, 'block w-full animate-fade-in': valueRevealed }">
              <div class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Investimento Total</div>
              <div class="flex items-baseline justify-center mb-6">
                <span class="text-3xl font-bold text-slate-300 mr-2">R$</span>
                <span class="text-5xl lg:text-6xl font-black text-white tracking-tight">{{ formatarMoeda(parsedData.investimento.valor_principal) }}</span>
              </div>
              
              <div class="h-px w-full bg-slate-800 mb-6"></div>
              
              <div class="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Prazo de Entrega</div>
              <div class="text-orange-500 font-bold text-xl">{{ parsedData.investimento.prazo }}</div>
            </div>

          </div>
        </div>
      </section>

      <!-- 7. PRÓXIMOS PASSOS (LIGHT) -->
      <section class="p-10 md:p-16 bg-white page-break-inside-avoid">
        <div class="inline-block px-3 py-1 bg-orange-50 text-orange-600 text-xs font-black uppercase tracking-widest rounded-full mb-6 border border-orange-100">
          Próximos Passos
        </div>
        <h2 class="text-3xl font-extrabold text-slate-900 mb-12">Como começamos</h2>

        <div class="space-y-6 md:space-y-0 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-orange-200 before:to-transparent">
          
          <div v-for="passo in parsedData.proximos_passos" :key="passo.numero" class="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active page-break-inside-avoid my-4">
            <!-- Ícone / Número centralizado (desktop) -->
            <div class="flex items-center justify-center w-12 h-12 rounded-full border-4 border-white bg-orange-500 text-white font-black shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-md z-10 text-xl">
              {{ passo.numero }}
            </div>
            
            <!-- Card de Conteúdo -->
            <div class="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] bg-gray-50 p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 class="text-xl font-black text-slate-900 mb-2">{{ passo.titulo }}</h3>
              <p class="text-slate-600 leading-relaxed">{{ passo.descricao }}</p>
            </div>
          </div>

        </div>
      </section>

      <!-- FOOTER -->
      <footer class="bg-slate-900 text-slate-400 py-10 px-16 text-center text-sm border-t-[6px] border-orange-500">
        <div class="font-black text-white tracking-[0.2em] mb-4">DATA IMPETUS</div>
        <p>Automação • Dados • Inteligência Artificial</p>
        <div class="mt-8 pt-8 border-t border-slate-800 flex justify-between items-center text-xs uppercase tracking-widest">
          <span>Elaborado por {{ proposta.criado_por }}</span>
          <span>{{ new Date(proposta.criado_em).toLocaleDateString('pt-BR') }}</span>
        </div>
      </footer>

    </div>

    <!-- Floating Print Button (Hidden in Print Mode) -->
    <button 
      v-if="proposta && parsedData"
      @click="printPDF" 
      class="fixed bottom-6 right-6 md:bottom-8 md:right-8 bg-orange-500 hover:bg-orange-600 text-white px-5 md:px-6 py-3 md:py-4 rounded-full shadow-2xl print-button flex items-center transition-transform hover:scale-105 font-bold z-50 text-sm md:text-base"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
      </svg>
      Exportar PDF
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { usePropostasStore } from '~/stores/propostas'

definePageMeta({
  layout: false
})

const route = useRoute()
const propostaId = route.params.id as string
const propostasStore = usePropostasStore()

const pending = ref(true)
const proposta = ref<any>(null)
const valueRevealed = ref(false)

// Mock JSON Baseado na instrução do usuário (Usado como Fallback)
const mockJsonFallback = {
  "hero": {
    "headline": "Quanto tempo sua equipe perde que poderia estar fechando negócios?",
    "subheadline": "Automatizamos propostas, follow-ups e CRM para imobiliárias que querem vender mais com menos esforço."
  },
  "diagnostico": {
    "titulo": "O Custo Oculto da Operação Manual",
    "intro": "",
    "pontos": [
      {
        "titulo": "Propostas Lentas",
        "descricao": "4h/dia criando propostas manualmente."
      },
      {
        "titulo": "Follow-up Inconsistente",
        "descricao": "Leads esfriam e oportunidades são perdidas."
      },
      {
        "titulo": "CRM Desatualizado",
        "descricao": "Funil vira caixa preta impossível de gerir."
      }
    ]
  },
  "ancoragem": {
    "titulo": "O custo real de não agir agora",
    "subtitulo": "Antes de ver a solução, veja o que está em jogo",
    "sem_solucao": {
      "label": "O que você perde por mês SEM a solução",
      "valor_total": "14.000",
      "valor_anual": "168.000",
      "itens": [
        {"label": "Horas em propostas manuais", "descricao": "4h/dia x 15 vendedores", "valor": "R$ 72.000/ano"},
        {"label": "Leads perdidos", "descricao": "2 fechamentos/mês perdidos", "valor": "R$ 60.000/ano"},
        {"label": "Retrabalho CRM", "descricao": "Decisões com dados errados", "valor": "R$ 36.000/ano"}
      ]
    },
    "com_solucao": {
      "label": "O que você recupera COM a Data Impetus",
      "valor_total": "14.000",
      "valor_anual": "168.000",
      "roi_percentual": "300%",
      "payback": "45 dias",
      "itens": [
        {"label": "Economia em horas", "descricao": "Time focado em vender", "valor": "R$ 72.000/ano"},
        {"label": "Receita adicional", "descricao": "Follow-up → mais fechamentos", "valor": "R$ 96.000/ano"},
        {"label": "Investimento", "descricao": "Implantação + manutenção", "valor": "- R$ 42.000/ano"}
      ]
    }
  },
  "solucao": {
    "titulo": "O que vamos construir juntos",
    "intro": "",
    "nome_solucao": "SalesFlow AI: Acelerador de Vendas Imobiliárias"
  },
  "entregas": [
    {
      "numero": 1,
      "titulo": "Motor de Propostas com IA",
      "descricao": "Propostas personalizadas em minutos a partir do briefing.",
      "beneficio": "4h diárias da equipe liberadas."
    },
    {
      "numero": 2,
      "titulo": "Follow-up via WhatsApp",
      "descricao": "Fluxo automático — nenhum lead esquecido.",
      "beneficio": "Mais conversões com menos esforço."
    },
    {
      "numero": 3,
      "titulo": "Integração Pipedrive",
      "descricao": "CRM atualizado automaticamente.",
      "beneficio": "Funil sempre preciso e confiável."
    }
  ],
  "resultados": [
    { "valor": "291%", "label": "Retorno sobre o Investimento (ROI) em 12 meses" },
    { "valor": "10 dias", "label": "Tempo de Payback do investimento" },
    { "valor": "80 horas/mês", "label": "Tempo recuperado por vendedor, focado em vendas" },
    { "valor": "30%+", "label": "Aumento na taxa de conversão de leads qualificados" }
  ],
  "investimento": {
    "valor_principal": "3500",
    "prazo": "8 dias",
    "inclui": [
      "Motor de Propostas IA",
      "Follow-up WhatsApp",
      "Integração Pipedrive",
      "Treinamento da equipe",
      "Suporte 30 dias"
    ]
  },
  "proximos_passos": [
    { "numero": 1, "titulo": "Kick-off", "descricao": "Alinhamento de escopo." },
    { "numero": 2, "titulo": "Desenvolvimento", "descricao": "Construção e configuração." },
    { "numero": 3, "titulo": "Go-Live", "descricao": "Treinamento e lançamento." }
  ]
}

const parsedData = computed(() => {
  if (!proposta.value) return null
  
  // Se houver um JSON válido salvo no 'conteudo', usa ele. Senão, usa o mock fallback.
  if (proposta.value.conteudo) {
    try {
      const parsed = typeof proposta.value.conteudo === 'string' 
        ? JSON.parse(proposta.value.conteudo) 
        : proposta.value.conteudo;
      if (parsed.isSite) {
        return parsed
      }
      if (parsed.hero && parsed.diagnostico) {
        return parsed
      }
    } catch (e) {
      console.warn("Conteudo não era um JSON válido, usando fallback.", e)
    }
  }
  return mockJsonFallback
})

onMounted(async () => {
  if (!propostaId) return
  
  try {
    const data = await propostasStore.fetchPropostaById(propostaId)
    if (data) {
      proposta.value = data
    } else {
      console.warn('Proposta não encontrada no cache nem no banco.')
    }
  } catch (err) {
    console.error('Erro ao buscar proposta:', err)
  } finally {
    pending.value = false
  }
})

function formatarMoeda(valor: string | number) {
  const num = typeof valor === 'string' ? parseFloat(valor.replace(/[^0-9,-]+/g, '').replace(',', '.')) : valor
  if (isNaN(num)) return valor
  return num.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function printPDF() {
  window.print()
}
</script>

<style scoped>
@media print {
  .print-button {
    display: none !important;
  }
  body, html {
    background-color: white !important;
    padding: 0 !important;
    margin: 0 !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
  .document-container {
    max-width: 100% !important;
    padding: 0 !important;
    margin: 0 !important;
    box-shadow: none !important;
    border: none !important;
  }
  .page-break-inside-avoid {
    page-break-inside: avoid;
    break-inside: avoid;
  }
  @page {
    size: landscape;
    margin: 10mm;
  }
}

.animate-fade-in {
  animation: fadeIn 0.4s ease-out forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
