<template>
  <div class="h-full min-h-[calc(100vh-120px)] flex flex-col">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-zinc-100">Calendário Editorial</h2>
      <!-- Ajustei a cor para orange-500 para combinar com o tema -->
      <button @click="creationStep = 'choice'" class="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 shadow-md hover:shadow-lg active:scale-95">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
        Novo Conteúdo
      </button>
    </div>
    
    <!-- Kanban Board -->
    <div class="flex flex-1 gap-5 overflow-x-auto pb-4 items-stretch scrollbar-hide">
      <div v-for="col in columns" :key="col.id" 
           class="flex flex-col flex-1 bg-gray-50 dark:bg-zinc-900 rounded-2xl min-w-[280px] h-full border border-gray-100 dark:border-zinc-800 shadow-sm"
           @dragover.prevent
           @dragenter.prevent
           @drop="onDrop($event, col.id)">
        <div class="p-4 font-bold text-gray-800 dark:text-zinc-100 border-b border-gray-100 dark:border-zinc-800/80 rounded-t-2xl flex justify-between items-center">
          <span class="flex items-center gap-2.5">
            <span class="w-2.5 h-2.5 rounded-full" :class="col.color"></span>
            {{ col.label }}
          </span>
          <span class="bg-white dark:bg-zinc-800 border border-gray-100 dark:border-zinc-800 text-gray-500 dark:text-zinc-400 px-2.5 py-0.5 rounded-full text-xs font-bold">{{ tasks.filter(t => t.status === col.id).length }}</span>
        </div>
        
        <div class="flex-1 p-3 overflow-y-auto space-y-3">
          <div v-for="task in tasks.filter(t => t.status === col.id)" :key="task.id"
               draggable="true"
               @dragstart="onDragStart($event, task)"
               @click.self="openTaskView(task)"
               class="bg-white dark:bg-zinc-800 dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-800 dark:border-gray-700 cursor-grab active:cursor-grabbing hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-md transition-all group relative">
            
            <div class="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <button @click="deleteTask(task.id)" class="text-gray-300 hover:text-red-500 transition-colors bg-white dark:bg-zinc-800/80 rounded p-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
              </button>
            </div>

            <h4 class="font-bold text-gray-800 dark:text-zinc-100 mb-1.5 pr-6 leading-tight">{{ task.title }}</h4>
            <p class="text-sm text-gray-500 dark:text-zinc-400 line-clamp-2 mb-4 leading-relaxed" v-if="task.description">{{ task.description }}</p>
            
            <div class="flex items-end justify-between mt-3 pt-3 border-t border-gray-50">
              <div class="flex flex-col gap-1.5 text-xs">
                 <div class="flex items-center text-gray-500 dark:text-zinc-400">
                   <svg class="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                   Previsto: <span class="font-semibold text-gray-700 dark:text-zinc-300 ml-1">{{ formatDate(task.dateToPost) }}</span>
                 </div>
                 <div v-if="task.datePosted" class="flex items-center text-emerald-600 bg-emerald-50 px-2 py-1.5 rounded-lg -ml-1 mt-1 border border-emerald-100/50">
                   <svg class="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                   Postado: <span class="font-bold ml-1">{{ formatDateTime(task.datePosted) }}</span>
                 </div>
              </div>
              
              <div v-if="task.userInitial" class="w-7 h-7 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs font-bold shadow-sm" :title="task.userName ? 'Usuário: ' + task.userName : 'ID: ' + task.user_id">
                {{ task.userInitial }}
              </div>
            </div>
          </div>

          <!-- Botão extra para adicionar card no final da coluna 'Novo' -->
          <button v-if="col.id === 'novo'" @click="creationStep = 'choice'" class="w-full mt-2 py-3 border-2 border-dashed border-gray-300 dark:border-zinc-600 dark:border-gray-700 rounded-xl text-gray-500 dark:text-zinc-400 dark:text-gray-400 dark:text-zinc-500 font-bold hover:border-orange-500 dark:hover:border-orange-500 hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-500/10 transition-all flex items-center justify-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
            Adicionar Card
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Novo Conteúdo (Fluxo) -->
    <div v-if="creationStep !== null" class="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div class="bg-white dark:bg-zinc-800 rounded-3xl w-full shadow-2xl overflow-hidden transform transition-all flex flex-col max-h-[90vh]"
           :class="creationStep === 'choice' ? 'max-w-2xl' : 'max-w-md'">
        <div class="p-5 border-b border-gray-100 dark:border-zinc-800 flex justify-between items-center bg-gray-50 dark:bg-zinc-900/50 shrink-0">
          <h3 class="text-xl font-bold text-gray-800 dark:text-zinc-100 flex items-center gap-2">
            <button v-if="creationStep !== 'choice' && creationStep !== 'processing'" @click="creationStep = 'choice'" class="text-gray-400 dark:text-zinc-500 hover:text-orange-500 transition-colors p-1">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
            </button>
            {{ creationStep === 'choice' ? 'Como deseja criar?' : (creationStep === 'manual' ? 'Novo Conteúdo' : (creationStep === 'processing' ? 'Aguarde a IA...' : 'IA Implementadora')) }}
          </h3>
          <button v-if="creationStep !== 'processing'" @click="closeModal" class="text-gray-400 dark:text-zinc-500 hover:text-gray-600 dark:text-zinc-400 bg-white dark:bg-zinc-800 p-2 rounded-full shadow-sm border border-gray-100 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800 dark:bg-zinc-900 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        
        <!-- STEP: CHOICE -->
        <div v-if="creationStep === 'choice'" class="p-8 grid grid-cols-1 sm:grid-cols-2 gap-6 overflow-y-auto">
          <!-- Opção Manual -->
          <div @click="creationStep = 'manual'" class="group cursor-pointer p-6 border-2 border-gray-100 dark:border-zinc-800 rounded-3xl hover:border-orange-500 hover:bg-orange-50 hover:shadow-lg transition-all flex flex-col items-center text-center bg-white dark:bg-zinc-800 gap-4">
            <div class="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 group-hover:bg-orange-100 group-hover:text-orange-500 transition-colors">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
            </div>
            <div>
              <h4 class="font-bold text-gray-800 dark:text-zinc-100 text-lg mb-2 group-hover:text-orange-600 transition-colors">Eu mesmo crio</h4>
              <p class="text-sm text-gray-500 dark:text-zinc-400 leading-relaxed">Preencha título, descrição e datas manualmente para adicionar ao seu calendário.</p>
            </div>
          </div>
          
          <!-- Opção IA -->
          <div @click="creationStep = 'ai'" class="group cursor-pointer p-6 border-2 border-gray-100 dark:border-zinc-800 rounded-3xl hover:border-orange-500 hover:bg-orange-50 hover:shadow-lg transition-all flex flex-col items-center text-center bg-white dark:bg-zinc-800 gap-4">
            <div class="w-16 h-16 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center shrink-0 group-hover:bg-orange-100 group-hover:text-orange-500 transition-colors shadow-inner">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
            </div>
            <div>
              <h4 class="font-bold text-gray-800 dark:text-zinc-100 text-lg mb-2 group-hover:text-orange-600 transition-colors">A IA cria por mim</h4>
              <p class="text-sm text-gray-500 dark:text-zinc-400 leading-relaxed">Fale ou escreva o que você deseja e a inteligência artificial cuida de tudo para você.</p>
            </div>
          </div>
        </div>

        <!-- STEP: MANUAL -->
        <form v-else-if="creationStep === 'manual'" @submit.prevent="saveNewTask" class="p-6 space-y-5 overflow-y-auto">
          <div>
            <label class="block text-sm font-bold text-gray-700 dark:text-zinc-300 mb-1.5">Título <span class="text-red-500">*</span></label>
            <input v-model="newTask.title" type="text" required placeholder="Ex: Dicas de Vendas" class="w-full border-gray-200 dark:border-zinc-700 rounded-xl shadow-sm focus:border-orange-500 focus:ring-orange-500 px-4 py-3 border outline-none transition-shadow text-gray-800 dark:text-zinc-100" />
          </div>
          
          <div>
            <label class="block text-sm font-bold text-gray-700 dark:text-zinc-300 mb-1.5">Descrição</label>
            <textarea v-model="newTask.description" rows="3" placeholder="Detalhes do que será abordado..." class="w-full border-gray-200 dark:border-zinc-700 rounded-xl shadow-sm focus:border-orange-500 focus:ring-orange-500 px-4 py-3 border outline-none transition-shadow text-gray-800 dark:text-zinc-100 resize-none"></textarea>
          </div>
          
          <div>
            <label class="block text-sm font-bold text-gray-700 dark:text-zinc-300 mb-1.5">Data Prevista de Postagem <span class="text-red-500">*</span></label>
            <input v-model="newTask.dateToPost" type="date" required class="w-full border-gray-200 dark:border-zinc-700 rounded-xl shadow-sm focus:border-orange-500 focus:ring-orange-500 px-4 py-3 border outline-none transition-shadow text-gray-800 dark:text-zinc-100" />
          </div>
          
          <div class="pt-5 flex gap-3 justify-end border-t border-gray-100 dark:border-zinc-800 mt-2">
            <button type="button" @click="closeModal" class="px-5 py-3 text-sm font-bold text-gray-600 dark:text-zinc-400 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-800 dark:bg-zinc-900 hover:text-gray-900 dark:hover:text-zinc-100 dark:text-zinc-100 transition-colors">Cancelar</button>
            <button type="submit" class="px-5 py-3 text-sm font-bold text-white bg-orange-500 rounded-xl hover:bg-orange-600 transition-colors shadow-md flex items-center justify-center gap-2">
              <span v-if="isSaving">Salvando...</span>
              <span v-else>Criar Conteúdo</span>
            </button>
          </div>
        </form>

        <!-- STEP: AI -->
        <div v-else-if="creationStep === 'ai'" class="p-6 space-y-6 overflow-y-auto flex flex-col">
          <div>
            <label class="block text-sm font-bold text-gray-700 dark:text-zinc-300 mb-1.5">Instruções para a IA</label>
            <textarea v-model="aiPrompt" rows="3" placeholder="Explique para a IA que público você quer atingir e qual o intuito de gerar esse conteúdo..." class="w-full border-gray-200 dark:border-zinc-700 rounded-xl shadow-sm focus:border-orange-500 focus:ring-orange-500 px-4 py-3 border outline-none transition-shadow text-gray-800 dark:text-zinc-100 resize-none"></textarea>
          </div>

          <div class="flex flex-col items-center bg-gray-50 dark:bg-zinc-900 rounded-2xl p-6 border border-gray-100 dark:border-zinc-800">
            <!-- Canvas para visualizador de áudio -->
            <canvas ref="audioVisualizer" class="w-full h-16 mb-6 rounded-lg opacity-80"></canvas>

            <!-- Player Nativão -->
            <audio v-if="audioUrl" :src="audioUrl" controls class="w-full mb-6"></audio>
            
            <div class="flex gap-4 w-full">
              <!-- Botão Gravar / Parar Gravação -->
              <button v-if="!audioUrl" @click="isRecording ? stopRecording() : startRecording()" 
                      class="flex-1 py-3 px-4 rounded-xl font-bold text-white transition-all shadow-md flex justify-center items-center gap-2"
                      :class="isRecording ? 'bg-red-500 hover:bg-red-600 animate-pulse' : 'bg-purple-600 hover:bg-purple-700'">
                <svg v-if="!isRecording" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path></svg>
                <svg v-else class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 6h12v12H6z"></path></svg>
                {{ isRecording ? 'Parar Gravação' : 'Gravar Áudio' }}
              </button>

              <!-- Botões Ação quando tem Áudio -->
              <template v-else>
                <button @click="discardAudio" :disabled="isGeneratingAI" class="flex-1 py-3 px-4 rounded-xl font-bold text-gray-600 dark:text-zinc-400 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 hover:bg-red-50 hover:text-red-600 transition-colors flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                  Excluir
                </button>
                <button @click="generateWithAI" :disabled="isGeneratingAI" class="flex-1 py-3 px-4 rounded-xl font-bold text-white transition-colors shadow-md flex justify-center items-center gap-2" :class="isGeneratingAI ? 'bg-orange-400 cursor-not-allowed' : 'bg-orange-500 hover:bg-orange-600'">
                  <svg v-if="!isGeneratingAI" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                  <svg v-else class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  {{ isGeneratingAI ? 'Enviando...' : 'Gerar' }}
                </button>
              </template>
            </div>
            
            <!-- Botão de gerar se ele não gravou áudio mas já escreveu algo -->
            <button v-if="!audioUrl && aiPrompt" @click="generateWithAI" :disabled="isGeneratingAI" class="w-full mt-4 py-3 px-4 rounded-xl font-bold text-white transition-colors shadow-md flex justify-center items-center gap-2" :class="isGeneratingAI ? 'bg-orange-400 cursor-not-allowed' : 'bg-orange-500 hover:bg-orange-600'">
              <svg v-if="!isGeneratingAI" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
              <svg v-else class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              {{ isGeneratingAI ? 'Enviando...' : 'Gerar (apenas texto)' }}
            </button>
            
            <p v-if="isRecording" class="text-sm text-red-500 font-semibold mt-4">Gravando... (fale agora)</p>
          </div>
        </div>

        <!-- STEP: PROCESSING -->
        <div v-else-if="creationStep === 'processing'" class="p-8 flex flex-col items-center justify-center space-y-6 text-center">
          <div class="relative w-24 h-24 flex items-center justify-center">
            <svg v-if="!isProcessingFinished" class="w-full h-full text-orange-500 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            <span v-if="!isProcessingFinished" class="absolute font-bold text-orange-600 text-lg">{{ processingTimeLeft }}s</span>
            <svg v-else class="w-16 h-16 text-emerald-500 absolute" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
          </div>
          
          <div class="space-y-3">
            <h3 class="text-2xl font-bold text-gray-800 dark:text-zinc-100 transition-colors">{{ processingTitle }}</h3>
            <p class="text-base text-gray-500 dark:text-zinc-400 max-w-sm">{{ processingMessage }}</p>
          </div>

          <div class="mt-8 w-full transition-opacity duration-500" :class="isProcessingFinished ? 'opacity-100' : 'opacity-0 pointer-events-none'">
            <button :disabled="!isProcessingFinished" @click="concluirEVerConteudo" class="w-full px-5 py-4 text-base font-bold text-white bg-emerald-500 rounded-xl hover:bg-emerald-600 transition-colors shadow-lg flex items-center justify-center gap-2">
              Ver Conteúdos
            </button>
          </div>
        </div>

      </div>
    </div>

    <!-- Modal Visualização de Tarefa / Conteúdo -->
    <div v-if="viewingTask" class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div class="bg-white dark:bg-zinc-800 dark:bg-gray-800 rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        <!-- Header -->
        <div class="p-6 border-b border-gray-100 dark:border-zinc-800 dark:border-gray-700 flex justify-between items-center shrink-0">
          <div>
            <h3 class="text-2xl font-bold text-gray-900 dark:text-zinc-100 dark:text-white">{{ viewingTask.title }}</h3>
            <p class="text-sm text-gray-500 dark:text-zinc-400 dark:text-gray-400 dark:text-zinc-500 mt-1">Previsto: {{ formatDate(viewingTask.dateToPost) }}</p>
          </div>
          <button @click="closeTaskView" class="text-gray-400 dark:text-zinc-500 hover:text-gray-600 dark:text-zinc-400 dark:hover:text-gray-300 bg-white dark:bg-zinc-800 dark:bg-gray-700 p-2 rounded-full shadow-sm border border-gray-100 dark:border-zinc-800 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-zinc-800 dark:bg-zinc-900 dark:hover:bg-gray-600 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <!-- Content -->
        <div class="p-8 flex-1 overflow-y-auto bg-gray-50 dark:bg-zinc-900/50 dark:bg-gray-900/50" id="pdf-content">
          <div class="prose dark:prose-invert max-w-none" v-html="renderMarkdown(viewingTask.description)"></div>
        </div>

        <!-- Footer / Ações -->
        <div class="p-6 border-t border-gray-100 dark:border-zinc-800 dark:border-gray-700 flex justify-end gap-4 shrink-0 bg-white dark:bg-zinc-800 dark:bg-gray-800">
          <button @click="closeTaskView" class="px-5 py-2.5 font-bold text-gray-600 dark:text-zinc-400 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-700 dark:bg-zinc-800 dark:hover:bg-gray-700 rounded-xl transition-colors">Fechar</button>
          <button @click="generatePDF" class="px-5 py-2.5 font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md transition-colors flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            Gerar PDF
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, watch } from 'vue'
import { marked } from 'marked'

definePageMeta({
  layout: 'marketing'
})

const supabase = useSupabaseClient()
const user = useSupabaseUser()

const columns = [
  { id: 'novo', label: 'Novo', color: 'bg-blue-400' },
  { id: 'em_producao', label: 'Em Produção', color: 'bg-yellow-400' },
  { id: 'produzido', label: 'Produzido', color: 'bg-orange-400' },
  { id: 'postado', label: 'Postado', color: 'bg-emerald-500' }
]

const tasks = ref([])
const isLoading = ref(true)

// Configuração do markdown
marked.setOptions({
  breaks: true,
  gfm: true
})
const renderMarkdown = (text) => {
  if (!text) return '<p class="text-gray-500 dark:text-zinc-400 italic">Sem conteúdo detalhado.</p>'
  return marked(text)
}

// Visualização e Exportação de PDF
const viewingTask = ref(null)

const openTaskView = (task) => {
  viewingTask.value = task
}

const closeTaskView = () => {
  viewingTask.value = null
}

const generatePDF = async () => {
  if (typeof window !== 'undefined') {
    const html2pdf = (await import('html2pdf.js')).default
    const element = document.getElementById('pdf-content')
    const opt = {
      margin:       10,
      filename:     `${viewingTask.value?.title || 'Conteudo'}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    }
    html2pdf().set(opt).from(element).save()
  }
}

onMounted(async () => {
  await fetchTasks()
})

const fetchTasks = async () => {
  isLoading.value = true
  try {
    if (!user.value) return
    const { data, error } = await supabase
      .from('ibeia_marketing_calendar')
      .select('*')
      .order('created_at', { ascending: false })
      
    if (!error && data) {
      // Buscar os nomes dos donos na tabela profiles para mostrar a inicial certa
      const userIds = [...new Set(data.map(t => t.user_id).filter(Boolean))]
      const profilesMap = {}
      
      if (userIds.length > 0) {
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('id, full_name')
          .in('id', userIds)
          
        if (profilesData) {
          profilesData.forEach(p => {
            profilesMap[p.id] = p.full_name || '?'
          })
        }
      }

      tasks.value = data.map(t => {
        const userName = t.user_id ? profilesMap[t.user_id] : null
        const initial = userName && userName !== '?' ? userName.charAt(0).toUpperCase() : (t.user_id ? t.user_id.substring(0,1).toUpperCase() : '')
        
        return {
          id: t.id,
          title: t.title,
          description: t.description,
          status: t.status,
          dateToPost: t.date_to_post,
          datePosted: t.date_posted,
          user_id: t.user_id,
          userName: userName,
          userInitial: initial
        }
      })
    }
  } catch (err) {
    console.error('Erro ao buscar calendário', err)
  } finally {
    isLoading.value = false
  }
}

const onDragStart = (event, task) => {
  event.dataTransfer.effectAllowed = 'move'
  // Passamos o ID como string para o dataTransfer
  event.dataTransfer.setData('taskId', task.id.toString())
}

const onDrop = async (event, newStatus) => {
  const taskId = event.dataTransfer.getData('taskId')
  if (!taskId) return
  
  // O id pode ser UUID ou número, vamos comparar como string no find
  const task = tasks.value.find(t => t.id.toString() === taskId)
  if (task && task.status !== newStatus) {
    // Atualiza otimista na tela
    task.status = newStatus
    
    if (newStatus === 'postado') {
      task.datePosted = new Date().toISOString()
    } else {
      task.datePosted = null
    }

    // Persiste no banco
    const { error } = await supabase
      .from('ibeia_marketing_calendar')
      .update({ 
        status: task.status, 
        date_posted: task.datePosted 
      })
      .eq('id', task.id)
      
    if (error) {
      console.error('Erro ao mover tarefa', error)
      // Se der erro seria ideal reverter o visual, mas por simplicidade mostramos só no console.
    }
  }
}

const creationStep = ref(null) // null, 'choice', 'manual', 'ai'
const isSaving = ref(false)
const newTask = ref({
  title: '',
  description: '',
  dateToPost: ''
})

const closeModal = () => {
  creationStep.value = null
  if (isRecording.value) stopRecording()
  aiPrompt.value = ''
  discardAudio()
}

// ------------------------------------
// STATE DA IA E ÁUDIO
// ------------------------------------
const aiPrompt = ref('')
const isRecording = ref(false)
const isGeneratingAI = ref(false)
const audioUrl = ref(null)
const audioBlob = ref(null)
const audioVisualizer = ref(null)

let mediaRecorder = null
let audioChunks = []
let audioContext = null
let analyser = null
let dataArray = null
let animationFrameId = null
let streamGlobal = null

const startRecording = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    streamGlobal = stream
    mediaRecorder = new MediaRecorder(stream)
    
    audioContext = new (window.AudioContext || window.webkitAudioContext)()
    const source = audioContext.createMediaStreamSource(stream)
    analyser = audioContext.createAnalyser()
    analyser.fftSize = 256
    source.connect(analyser)
    dataArray = new Uint8Array(analyser.frequencyBinCount)
    
    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) audioChunks.push(e.data)
    }
    
    mediaRecorder.onstop = () => {
      audioBlob.value = new Blob(audioChunks, { type: 'audio/webm' })
      audioUrl.value = URL.createObjectURL(audioBlob.value)
      audioChunks = []
      
      if (streamGlobal) {
        streamGlobal.getTracks().forEach(track => track.stop())
      }
      if (audioContext) audioContext.close()
      if (animationFrameId) cancelAnimationFrame(animationFrameId)
      drawIdleVisualizer()
    }
    
    mediaRecorder.start()
    isRecording.value = true
    drawVisualizer()
  } catch (err) {
    console.error('Erro ao acessar microfone:', err)
    alert('Não foi possível acessar o microfone para gravar áudio.')
  }
}

const stopRecording = () => {
  if (mediaRecorder && mediaRecorder.state !== 'inactive') {
    mediaRecorder.stop()
    isRecording.value = false
  }
}

const discardAudio = () => {
  if (audioUrl.value) URL.revokeObjectURL(audioUrl.value)
  audioUrl.value = null
  audioBlob.value = null
  drawIdleVisualizer()
}

const drawVisualizer = () => {
  if (!audioVisualizer.value || !analyser) return
  const canvas = audioVisualizer.value
  const ctx = canvas.getContext('2d')
  const width = canvas.width
  const height = canvas.height
  
  const draw = () => {
    animationFrameId = requestAnimationFrame(draw)
    analyser.getByteFrequencyData(dataArray)
    
    ctx.clearRect(0, 0, width, height)
    
    const barWidth = (width / dataArray.length) * 2.5
    let barHeight
    let x = 0
    
    for (let i = 0; i < dataArray.length; i++) {
      barHeight = dataArray[i] / 2
      
      ctx.fillStyle = `rgb(249, 115, 22)` // tailwind orange-500
      ctx.fillRect(x, height - barHeight, barWidth, barHeight)
      x += barWidth + 1
    }
  }
  
  draw()
}

const drawIdleVisualizer = () => {
  if (!audioVisualizer.value) return
  const canvas = audioVisualizer.value
  const ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = '#e5e7eb' // gray-200
  ctx.fillRect(0, canvas.height / 2 - 1, canvas.width, 2)
}

const isProcessingFinished = ref(false)
const processingTimeLeft = ref(120)
const processingTitle = ref('Carregando...')
const processingMessage = ref('Aguarde enquanto analisamos seu pedido.')
let processingTimer = null;
let phraseTimer = null;

const startProcessingUI = () => {
  creationStep.value = 'processing'
  isProcessingFinished.value = false
  processingTimeLeft.value = 120

  const titles = [
    "Analisando seu pedido...",
    "Estruturando o conteúdo...",
    "Aplicando o método RETINA...",
    "Gerando cópias e roteiros...",
    "Finalizando o calendário..."
  ]
  const messages = [
    "A IA está processando suas informações para entregar o melhor resultado.",
    "Buscando as melhores polêmicas e ganchos para o seu nicho.",
    "Construindo o equilíbrio perfeito de relacionamento e vendas.",
    "Isso pode demorar um pouquinho devido à complexidade das instruções.",
    "Já estamos nos toques finais, quase lá!"
  ]

  let stepIndex = 0;
  processingTitle.value = titles[0]
  processingMessage.value = messages[0]

  phraseTimer = setInterval(() => {
    stepIndex++
    if (stepIndex >= titles.length) stepIndex = 0
    processingTitle.value = titles[stepIndex]
    processingMessage.value = messages[stepIndex]
  }, 10000)

  processingTimer = setInterval(() => {
    if (processingTimeLeft.value > 0) {
      processingTimeLeft.value--
    }
  }, 1000)
}

const finishProcessingUI = () => {
  if (processingTimer) clearInterval(processingTimer)
  if (phraseTimer) clearInterval(phraseTimer)
  
  processingTitle.value = "Tudo Pronto! 🚀"
  processingMessage.value = "Seu calendário editorial foi criado com sucesso. Clique abaixo para visualizar os novos cards."
  isProcessingFinished.value = true
}

const concluirEVerConteudo = async () => {
  closeModal()
  await fetchTasks()
}

const generateWithAI = async () => {
  if (!user.value) {
    alert("Usuário não autenticado.")
    return
  }
  
  const userId = user.value.sub || user.value.id
  
  if (!aiPrompt.value && !audioBlob.value) {
    alert("Por favor, grave um áudio ou escreva instruções antes de gerar.")
    return
  }

  startProcessingUI()

  try {
    const formData = new FormData()
    formData.append("user_id", userId)
    formData.append("e_audio", audioBlob.value ? "true" : "false")
    
    if (aiPrompt.value) {
      formData.append("prompt", aiPrompt.value)
    }
    if (audioBlob.value) {
      formData.append("audio", audioBlob.value, "audio.webm")
    }

    const response = await fetch("https://n8n.srv1098076.hstgr.cloud/webhook/criarconteudo", {
      method: "POST",
      body: formData
    })

    if (!response.ok) {
      throw new Error(`Erro na API: ${response.statusText}`)
    }

    finishProcessingUI()
  } catch (error) {
    console.error("Erro ao gerar conteúdo:", error)
    alert("Ocorreu um erro ao enviar para a IA. Tente novamente.")
    closeModal()
  }
}

watch(creationStep, async (newVal) => {
  if (newVal === 'ai') {
    await nextTick()
    const canvas = audioVisualizer.value
    if (canvas) {
      // ajusta o canvas pro tamanho responsivo
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      drawIdleVisualizer()
    }
  }
})

// ------------------------------------

const saveNewTask = async () => {
  if (!user.value) return
  isSaving.value = true
  
  try {
    const userId = user.value.sub || user.value.id
    const { data, error } = await supabase
      .from('ibeia_marketing_calendar')
      .insert({
        title: newTask.value.title,
        description: newTask.value.description,
        status: 'novo',
        date_to_post: newTask.value.dateToPost,
        user_id: userId
      })
      .select()
      .single()
      
    if (!error && data) {
      tasks.value.unshift({
        id: data.id,
        title: data.title,
        description: data.description,
        status: data.status,
        dateToPost: data.date_to_post,
        datePosted: data.date_posted,
        user_id: data.user_id
      })
      
      closeModal()
      newTask.value = {
        title: '',
        description: '',
        dateToPost: ''
      }
    }
  } catch (err) {
    console.error('Erro ao salvar conteúdo', err)
  } finally {
    isSaving.value = false
  }
}

const deleteTask = async (id) => {
  if (confirm('Tem certeza que deseja excluir este conteúdo?')) {
    const { error } = await supabase
      .from('ibeia_marketing_calendar')
      .delete()
      .eq('id', id)
      
    if (!error) {
      tasks.value = tasks.value.filter(t => t.id !== id)
    }
  }
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const d = new Date(dateString.includes('T') ? dateString : dateString + 'T00:00:00')
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short' }).format(d)
}

const formatDateTime = (isoString) => {
  if (!isoString) return ''
  const date = new Date(isoString)
  return new Intl.DateTimeFormat('pt-BR', { 
    day: '2-digit', 
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}
</script>
