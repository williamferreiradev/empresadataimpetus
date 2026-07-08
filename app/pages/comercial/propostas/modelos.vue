<template>
  <div class="flex flex-col h-full bg-gray-50 dark:bg-zinc-900">

    <!-- Header -->
    <div class="flex items-center justify-between mb-6 px-8 pt-8">
      <div class="flex items-center">
        <NuxtLink to="/comercial/propostas" class="mr-4 p-2.5 rounded-xl bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800 dark:bg-zinc-900 text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-100 dark:text-zinc-100 transition-all shadow-sm">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </NuxtLink>
        <div>
          <h1 class="text-2xl font-black text-gray-900 dark:text-zinc-100 tracking-tight">Modelos de Site</h1>
          <p class="text-sm text-gray-500 dark:text-zinc-400 mt-1 font-medium">Selecione um layout base para a proposta do cliente</p>
        </div>
      </div>
      <NuxtLink 
        v-if="modeloSelecionado"
        :to="{ 
          path: '/comercial/propostas/editor-site', 
          query: { modelo: modeloSelecionado.id } 
        }"
        class="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl shadow-lg shadow-orange-500/20 transition-all hover:-translate-y-0.5 active:translate-y-0 flex items-center"
      >
        <span class="mr-2">Usar modelo {{ modeloSelecionado.nome }}</span>
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </NuxtLink>
    </div>

    <!-- Layout Split -->
    <div class="flex gap-8 flex-1 min-h-0 px-8 pb-8">

      <!-- Grid de modelos (Sidebar) -->
      <div class="w-[340px] shrink-0 flex flex-col gap-3 overflow-y-auto pr-2 custom-scrollbar">
        <button
          v-for="modelo in modelos"
          :key="modelo.id"
          @click="modeloSelecionado = modelo"
          class="w-full flex items-start gap-4 p-5 rounded-2xl border-2 text-left transition-all duration-300 relative overflow-hidden group"
          :class="modeloSelecionado?.id === modelo.id
            ? 'border-orange-500 bg-white dark:bg-zinc-800 shadow-md'
            : 'border-transparent bg-white dark:bg-zinc-800 shadow-sm hover:border-orange-200 hover:shadow-md'"
        >
          <!-- Badge de Seleção -->
          <div v-if="modeloSelecionado?.id === modelo.id" class="absolute top-0 right-0 w-12 h-12 bg-orange-500 flex items-start justify-end p-2" style="clip-path: polygon(100% 0, 0 0, 100% 100%);">
            <svg class="w-4 h-4 text-white -mt-1 -mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <!-- Ícone -->
          <div class="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 text-2xl shadow-inner transition-transform group-hover:scale-105" :style="{ backgroundColor: modelo.cor + '15', color: modelo.cor }">
            {{ modelo.emoji }}
          </div>
          
          <!-- Info -->
          <div class="flex-1 min-w-0 pt-1">
            <h3 class="font-bold text-gray-900 dark:text-zinc-100 text-base mb-1">{{ modelo.nome }}</h3>
            <p class="text-sm text-gray-500 dark:text-zinc-400 leading-relaxed line-clamp-2">{{ modelo.descricao }}</p>
            <div class="mt-3 flex items-center gap-2">
              <span class="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md" :style="{ backgroundColor: modelo.cor + '10', color: modelo.cor }">{{ modelo.estilo }}</span>
            </div>
          </div>
        </button>
      </div>

      <!-- Preview Area -->
      <div class="flex-1 bg-white dark:bg-zinc-800 rounded-3xl border border-gray-200 dark:border-zinc-700 shadow-xl overflow-hidden flex flex-col relative">

        <!-- Sem seleção -->
        <div v-if="!modeloSelecionado" class="h-full flex flex-col items-center justify-center text-center p-12 bg-gray-50 dark:bg-zinc-900/50">
          <div class="w-24 h-24 bg-white dark:bg-zinc-800 shadow-sm border border-gray-100 dark:border-zinc-800 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <svg class="w-10 h-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-900 dark:text-zinc-100 mb-2">Selecione um modelo</h3>
          <p class="text-gray-500 dark:text-zinc-400 max-w-md">O preview do site aparecerá aqui. Você pode usar a imagem do template real que o cliente vai receber.</p>
        </div>

        <!-- Preview do modelo -->
        <div v-else class="h-full flex flex-col bg-gray-100 dark:bg-zinc-800">
          <!-- Browser Bar -->
          <div class="flex items-center gap-3 px-5 py-3 bg-white dark:bg-zinc-800 border-b border-gray-200 dark:border-zinc-700 shrink-0 z-10">
            <div class="flex gap-1.5">
              <div class="w-3 h-3 rounded-full bg-red-400"></div>
              <div class="w-3 h-3 rounded-full bg-yellow-400"></div>
              <div class="w-3 h-3 rounded-full bg-green-400"></div>
            </div>
            <div class="flex-1 flex justify-center">
              <div class="bg-gray-100 dark:bg-zinc-800/80 rounded-lg px-4 py-1.5 text-xs text-gray-500 dark:text-zinc-400 font-medium font-mono w-full max-w-md text-center border border-gray-200 dark:border-zinc-700/50 shadow-inner">
                <span class="text-gray-400 dark:text-zinc-500">https://</span>proposta.dataimpetus.com/{{ modeloSelecionado.id }}
              </div>
            </div>
            <div class="w-12"></div> <!-- Spacer for balance -->
          </div>

          <!-- Container do Site (Scrollável) -->
          <div class="flex-1 overflow-y-auto relative w-full h-full custom-scrollbar bg-gray-50 dark:bg-zinc-900">
            
            <!-- SE FOR BARBEARIA (MOCKUP REALISTA BASEADO NO PRINT) -->
            <div v-if="modeloSelecionado.id === 'barbearia'" class="w-full bg-[#050505] min-h-full font-sans text-white">
              <!-- Header Barbearia -->
              <header class="flex justify-between items-center px-12 py-6 border-b border-white/5">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-[#eab308] text-black font-black flex items-center justify-center text-xl rounded-sm">B</div>
                  <div>
                    <h2 class="font-serif font-bold text-lg leading-tight tracking-wide text-[#eab308]">CAUÊ DU'CORTE</h2>
                    <p class="text-[10px] tracking-widest text-gray-400 dark:text-zinc-500 uppercase">Barbearia Premium</p>
                  </div>
                </div>
                <nav class="hidden md:flex gap-8 text-xs font-bold tracking-widest uppercase text-gray-300">
                  <a href="#" class="text-[#eab308] border-b-2 border-[#eab308] pb-1">Home</a>
                  <a href="#" class="hover:text-white transition-colors">Portfolio</a>
                  <a href="#" class="hover:text-white transition-colors">Sobre</a>
                  <a href="#" class="hover:text-white transition-colors">Contato</a>
                </nav>
                <button class="bg-[#eab308] text-black font-bold text-xs uppercase tracking-wider px-6 py-3 hover:bg-yellow-400 transition-colors flex items-center gap-2">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  Reservar Agora
                </button>
              </header>

              <!-- Hero Barbearia -->
              <div class="flex items-center px-12 py-20 gap-12">
                <div class="flex-1">
                  <p class="text-[#eab308] text-sm font-bold tracking-[0.2em] uppercase mb-4">Tradição & Estilo</p>
                  <p class="italic text-gray-300 mb-6 text-xl font-serif">Bem-vindo à Barbearia Cauê Du'corte</p>
                  <h1 class="text-6xl md:text-7xl font-serif font-bold text-white leading-[1.1] mb-8">
                    Ousadia em<br><span class="text-[#eab308]">Cada Corte.</span>
                  </h1>
                  <p class="text-gray-400 dark:text-zinc-500 text-lg mb-10 max-w-md leading-relaxed">
                    Experiência premium de cuidados masculinos. Combinamos técnicas clássicas com o luxo contemporâneo para esculpir sua melhor versão.
                  </p>
                  <div class="flex gap-4">
                    <button class="bg-[#eab308] text-black font-bold px-8 py-4 text-sm uppercase tracking-wider hover:bg-yellow-400 transition-colors">Agendar Horário</button>
                    <button class="border border-[#eab308]/30 text-[#eab308] font-bold px-8 py-4 text-sm uppercase tracking-wider hover:bg-[#eab308]/10 transition-colors">Ver Portfolio</button>
                  </div>
                  
                  <div class="grid grid-cols-3 gap-8 mt-20 pt-10 border-t border-white/10 max-w-lg">
                    <div>
                      <p class="text-3xl font-bold text-[#eab308] mb-1">5k<span class="text-xl">+</span></p>
                      <p class="text-[10px] uppercase tracking-widest text-gray-500 dark:text-zinc-400">Clientes</p>
                    </div>
                    <div>
                      <p class="text-3xl font-bold text-[#eab308] mb-1">15</p>
                      <p class="text-[10px] uppercase tracking-widest text-gray-500 dark:text-zinc-400">Barbeiros</p>
                    </div>
                    <div>
                      <p class="text-3xl font-bold text-[#eab308] mb-1">100%</p>
                      <p class="text-[10px] uppercase tracking-widest text-gray-500 dark:text-zinc-400">Satisfação</p>
                    </div>
                  </div>
                </div>
                
                <!-- Hero Image Placeholder -->
                <div class="flex-1 relative">
                  <div class="absolute inset-0 border border-[#eab308]/30 -translate-x-6 translate-y-6"></div>
                  <div class="bg-gray-900 h-[600px] w-full relative z-10 overflow-hidden group">
                    <!-- Fake image pattern -->
                    <div class="absolute inset-0 bg-gradient-to-tr from-gray-800 to-gray-900 opacity-50"></div>
                    <div class="absolute inset-0 flex items-center justify-center">
                      <svg class="w-24 h-24 text-gray-700 dark:text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <!-- Badge 15+ anos -->
                    <div class="absolute bottom-0 right-0 bg-[#eab308] text-black p-6 w-48">
                      <p class="text-3xl font-bold mb-1">15+</p>
                      <p class="text-[10px] uppercase tracking-widest font-bold">Anos de Experiência</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- SE FOR DESPACHANTE (MOCKUP REALISTA BASEADO NO PRINT) -->
            <div v-else-if="modeloSelecionado.id === 'despachante' || modeloSelecionado.id === 'autocenter'" class="w-full bg-white dark:bg-zinc-800 min-h-full font-sans">
              <!-- Header Despachante -->
              <header class="flex justify-between items-center px-12 py-4 border-b border-gray-100 dark:border-zinc-800">
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 rounded-full bg-red-600 text-white font-black flex items-center justify-center text-sm">DC</div>
                  <h2 class="font-black text-xl italic tracking-tighter text-gray-900 dark:text-zinc-100">Despachante<br><span class="text-red-600 text-lg leading-none block -mt-1">Conexão</span></h2>
                </div>
                <nav class="hidden md:flex gap-8 text-sm font-semibold text-gray-500 dark:text-zinc-400">
                  <a href="#" class="text-red-600">Sobre</a>
                  <a href="#" class="hover:text-gray-900 dark:hover:text-zinc-100 dark:text-zinc-100">Serviços</a>
                  <a href="#" class="hover:text-gray-900 dark:hover:text-zinc-100 dark:text-zinc-100">Parceiros</a>
                  <a href="#" class="hover:text-gray-900 dark:hover:text-zinc-100 dark:text-zinc-100">Contato</a>
                </nav>
                <button class="bg-gray-900 text-white font-bold text-sm px-6 py-2.5 rounded-full hover:bg-gray-800 transition-colors flex items-center gap-2">
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                  WhatsApp
                </button>
              </header>

              <!-- Hero Despachante -->
              <div class="flex items-center px-12 py-20 gap-12 bg-gray-50 dark:bg-zinc-900/50">
                <div class="flex-1">
                  <p class="text-gray-400 dark:text-zinc-500 text-xs font-bold tracking-widest uppercase mb-4 flex items-center gap-2">
                    <span class="w-2 h-2 bg-red-600 rounded-full"></span>
                    Despachante número 1 do Tocantins
                  </p>
                  <h1 class="text-5xl font-black text-gray-900 dark:text-zinc-100 leading-[1.1] mb-6 tracking-tight">
                    Tudo em<br><span class="text-red-600 underline decoration-red-200 underline-offset-4">Documentação</span><br>Veicular!!!
                  </h1>
                  <p class="text-gray-600 dark:text-zinc-400 text-lg mb-8 max-w-md leading-relaxed">
                    Com anos de experiência e agilidade comprovada, entregamos confiança e transparência em todos os processos veiculares. Seu documento rápido e sem burocracia.
                  </p>
                  <div class="flex gap-4 items-center">
                    <button class="bg-red-600 text-white font-bold px-8 py-3.5 rounded-full hover:bg-red-700 transition-colors flex items-center gap-2 shadow-lg shadow-red-600/20">
                      Fale Conosco <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </button>
                    <button class="bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-zinc-300 font-bold px-8 py-3.5 rounded-full hover:bg-gray-50 dark:hover:bg-zinc-800 dark:bg-zinc-900 transition-colors">
                      Ver Serviços
                    </button>
                  </div>
                  <p class="text-xs text-gray-400 dark:text-zinc-500 mt-6 font-medium flex items-center gap-1">
                    <svg class="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    CREDENCIADO DETRAN
                  </p>
                </div>
                
                <!-- Hero Image Circle -->
                <div class="flex-1 relative flex justify-center">
                  <div class="w-[450px] h-[450px] rounded-full border border-gray-200 dark:border-zinc-700 relative flex items-center justify-center bg-white dark:bg-zinc-800 shadow-xl shadow-gray-200/50">
                    <div class="absolute -top-4 right-10 w-3 h-3 bg-red-600 rounded-full"></div>
                    <!-- Logo / Graphic placeholder -->
                    <h2 class="font-black text-5xl italic tracking-tighter text-gray-900 dark:text-zinc-100 text-center">
                      <span class="text-gray-300">DESPACHANTE</span><br>
                      <span class="text-red-600 text-6xl leading-none">Conexão</span>
                    </h2>
                    
                    <!-- Floating badge -->
                    <div class="absolute -bottom-6 right-10 bg-white dark:bg-zinc-800 rounded-xl shadow-xl border border-gray-100 dark:border-zinc-800 p-4 flex items-center gap-3">
                      <div class="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-500">
                        <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      </div>
                      <div>
                        <p class="font-black text-gray-900 dark:text-zinc-100 text-lg leading-none">100%</p>
                        <p class="text-[9px] uppercase tracking-wider text-gray-500 dark:text-zinc-400 font-bold mt-0.5">Veículos Regularizados</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- OUTROS MODELOS (Layout Genérico Premium) -->
            <div v-else class="w-full bg-white dark:bg-zinc-800 min-h-full">
              <!-- Header -->
              <header class="flex justify-between items-center px-10 py-5 border-b border-gray-100 dark:border-zinc-800">
                <div class="font-black text-xl flex items-center gap-2" :style="{ color: modeloSelecionado.corEscura }">
                  <div class="w-8 h-8 rounded-lg flex items-center justify-center text-white" :style="{ backgroundColor: modeloSelecionado.cor }">{{ modeloSelecionado.emoji }}</div>
                  {{ modeloSelecionado.nome }}
                </div>
                <nav class="hidden md:flex gap-8 text-sm font-bold text-gray-500 dark:text-zinc-400">
                  <a href="#" :style="{ color: modeloSelecionado.cor }">Home</a>
                  <a href="#">Serviços</a>
                  <a href="#">Contato</a>
                </nav>
                <button class="text-white font-bold text-sm px-6 py-2.5 rounded-xl shadow-sm transition-transform hover:scale-105" :style="{ backgroundColor: modeloSelecionado.cor }">
                  Fale Conosco
                </button>
              </header>

              <!-- Hero -->
              <div class="px-10 py-20 flex flex-col items-center text-center max-w-4xl mx-auto">
                <span class="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6" :style="{ backgroundColor: modeloSelecionado.cor + '15', color: modeloSelecionado.cor }">
                  Proposta Exclusiva
                </span>
                <h1 class="text-5xl font-black text-gray-900 dark:text-zinc-100 leading-tight mb-6 tracking-tight">
                  {{ modeloSelecionado.hero.headline }}
                </h1>
                <p class="text-xl text-gray-500 dark:text-zinc-400 mb-10 max-w-2xl leading-relaxed">
                  {{ modeloSelecionado.hero.subheadline }}
                </p>
                <div class="w-full aspect-video rounded-3xl bg-gray-100 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 flex items-center justify-center shadow-inner overflow-hidden relative">
                   <div class="absolute inset-0 opacity-10" :style="{ backgroundImage: 'radial-gradient(' + modeloSelecionado.cor + ' 2px, transparent 2px)', backgroundSize: '30px 30px' }"></div>
                   <div class="w-20 h-20 rounded-full bg-white dark:bg-zinc-800 shadow-xl flex items-center justify-center relative z-10 text-4xl">
                     {{ modeloSelecionado.emoji }}
                   </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

definePageMeta({ layout: 'comercial' })

const router = useRouter()

const modeloSelecionado = ref(null)

// Adicionei os modelos mantendo o estilo de design de cada segmento
const modelos = [
  {
    id: 'barbearia',
    nome: 'Barbearia Cauê',
    emoji: '✂️',
    estilo: 'Dark / Gold',
    descricao: 'Layout escuro premium focado em barbearias de alto padrão e agendamentos.',
    cor: '#eab308', // amarelo gold
    corEscura: '#ca8a04',
    hero: {
      headline: 'Sua barbearia cheia de segunda a sábado',
      subheadline: 'Automatizamos agendamentos e confirmações.',
    }
  },
  {
    id: 'despachante',
    nome: 'Despachante',
    emoji: '📄',
    estilo: 'Clean / Light',
    descricao: 'Layout limpo e direto, focado em conversão e confiança para despachantes.',
    cor: '#dc2626', // vermelho
    corEscura: '#991b1b',
    hero: {
      headline: 'Tudo em Documentação Veicular',
      subheadline: 'Processos rápidos e sem burocracia.',
    }
  },
  {
    id: 'dentista',
    nome: 'Clínica Odonto',
    emoji: '🦷',
    estilo: 'Saúde / Trust',
    descricao: 'Focado em confirmações, retornos e captação de pacientes para dentistas.',
    cor: '#0ea5e9',
    corEscura: '#0369a1',
    hero: {
      headline: 'Reduza faltas em 60%',
      subheadline: 'Confirmação automática via WhatsApp.',
    }
  },
  {
    id: 'clinica-olhos',
    nome: 'Clínica dos Olhos',
    emoji: '👁️',
    estilo: 'Saúde / Tech',
    descricao: 'Pré-consultas, exames e follow-up cirúrgico de alta conversão.',
    cor: '#7c3aed',
    corEscura: '#5b21b6',
    hero: {
      headline: 'Mais cirurgias, menos no-show',
      subheadline: 'Do primeiro contato até o pós-operatório com IA.',
    }
  },
  {
    id: 'cerimonialista',
    nome: 'Cerimonialista',
    emoji: '💍',
    estilo: 'Elegance / Luxo',
    descricao: 'Captação e nutrição de casais, focado em fechar mais eventos.',
    cor: '#be185d',
    corEscura: '#9d174d',
    hero: {
      headline: 'Feche mais eventos',
      subheadline: 'Nutrição automática de casais indecisos.',
    }
  },
  {
    id: 'autocenter',
    nome: 'Auto Center',
    emoji: '🚗',
    estilo: 'Industrial',
    descricao: 'Revisões automáticas, recall e reativação de clientes perdidos.',
    cor: '#d97706',
    corEscura: '#b45309',
    hero: {
      headline: 'Traga seu cliente de volta',
      subheadline: 'Lembretes automáticos de revisão e troca de óleo.',
    }
  },
]

function usarModelo() {
  if (!modeloSelecionado.value) return
  // Navega para editar a proposta de site
  router.push({
    path: '/comercial/propostas/editor-site',
    query: { modelo: modeloSelecionado.value.id }
  })
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #e5e7eb;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: #d1d5db;
}
</style>
