<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-zinc-100">Clientes</h2>
      <button 
        @click="openModal()" 
        class="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-colors"
      >
        Adicionar Cliente
      </button>
    </div>
    <!-- Filtros -->
    <div class="bg-white dark:bg-zinc-800 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-800 mb-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-sm font-semibold text-gray-700 dark:text-zinc-300 flex items-center">
          <svg class="w-4 h-4 mr-2 text-gray-500 dark:text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path></svg>
          Filtros
        </h3>
        <button @click="limparFiltros" class="text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors">Limpar Filtros</button>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-5">
        <div>
          <label class="block text-xs font-medium text-gray-500 dark:text-zinc-400 mb-1.5">Nome do Lead</label>
          <input v-model="filterNome" type="text" class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-shadow" placeholder="Buscar por nome">
        </div>

        <!-- Nicho Dropdown -->
        <div class="relative">
          <label class="block text-xs font-medium text-gray-500 dark:text-zinc-400 mb-1.5">Nicho (Segmento)</label>
          <button 
            @click="isNichoDropdownOpen = !isNichoDropdownOpen" 
            type="button" 
            class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-shadow bg-white dark:bg-zinc-800 flex justify-between items-center text-left"
          >
            <span class="truncate text-gray-500 dark:text-zinc-400" v-if="filterNicho.length === 0">Selecionar...</span>
            <span class="truncate text-gray-900 dark:text-zinc-100 font-medium" v-else>{{ filterNicho.join(', ') }}</span>
            <svg class="w-4 h-4 text-gray-400 dark:text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
          </button>
          <div v-if="isNichoDropdownOpen" class="fixed inset-0 z-[5]" @click="isNichoDropdownOpen = false"></div>
          <div v-if="isNichoDropdownOpen" class="absolute z-10 mt-1 w-full bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg shadow-lg max-h-48 overflow-y-auto">
            <div class="p-1.5 space-y-0.5">
              <label v-for="seg in uniqueSegmentos" :key="seg" class="flex items-center hover:bg-gray-50 dark:hover:bg-zinc-800 dark:bg-zinc-900 p-2 rounded-md cursor-pointer transition-colors">
                <input type="checkbox" :value="seg" v-model="filterNicho" class="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 dark:border-zinc-600 rounded cursor-pointer">
                <span class="ml-2 block text-sm text-gray-700 dark:text-zinc-300 select-none">{{ seg }}</span>
              </label>
              <div v-if="uniqueSegmentos.length === 0" class="text-sm text-gray-400 dark:text-zinc-500 italic p-2 text-center">Nenhum nicho</div>
            </div>
          </div>
        </div>

        <!-- Origem Dropdown -->
        <div class="relative">
          <label class="block text-xs font-medium text-gray-500 dark:text-zinc-400 mb-1.5">Origem</label>
          <button 
            @click="isOrigemDropdownOpen = !isOrigemDropdownOpen" 
            type="button" 
            class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-shadow bg-white dark:bg-zinc-800 flex justify-between items-center text-left"
          >
            <span class="truncate text-gray-500 dark:text-zinc-400" v-if="filterOrigem.length === 0">Selecionar...</span>
            <span class="truncate text-gray-900 dark:text-zinc-100 font-medium" v-else>{{ filterOrigem.join(', ') }}</span>
            <svg class="w-4 h-4 text-gray-400 dark:text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
          </button>
          <div v-if="isOrigemDropdownOpen" class="fixed inset-0 z-[5]" @click="isOrigemDropdownOpen = false"></div>
          <div v-if="isOrigemDropdownOpen" class="absolute z-10 mt-1 w-full bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg shadow-lg max-h-48 overflow-y-auto">
            <div class="p-1.5 space-y-0.5">
              <label v-for="orig in uniqueOrigens" :key="orig" class="flex items-center hover:bg-gray-50 dark:hover:bg-zinc-800 dark:bg-zinc-900 p-2 rounded-md cursor-pointer transition-colors">
                <input type="checkbox" :value="orig" v-model="filterOrigem" class="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 dark:border-zinc-600 rounded cursor-pointer">
                <span class="ml-2 block text-sm text-gray-700 dark:text-zinc-300 select-none">{{ orig }}</span>
              </label>
              <div v-if="uniqueOrigens.length === 0" class="text-sm text-gray-400 dark:text-zinc-500 italic p-2 text-center">Nenhuma origem</div>
            </div>
          </div>
        </div>

        <!-- Responsável Dropdown -->
        <div class="relative">
          <label class="block text-xs font-medium text-gray-500 dark:text-zinc-400 mb-1.5">Responsável</label>
          <button 
            @click="isResponsavelDropdownOpen = !isResponsavelDropdownOpen" 
            type="button" 
            class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-shadow bg-white dark:bg-zinc-800 flex justify-between items-center text-left"
          >
            <span class="truncate text-gray-500 dark:text-zinc-400" v-if="filterResponsaveis.length === 0">Selecionar...</span>
            <span class="truncate text-gray-900 dark:text-zinc-100 font-medium" v-else>{{ filterResponsaveis.join(', ') }}</span>
            <svg class="w-4 h-4 text-gray-400 dark:text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
          </button>

          <!-- Overlay para fechar ao clicar fora -->
          <div v-if="isResponsavelDropdownOpen" class="fixed inset-0 z-[5]" @click="isResponsavelDropdownOpen = false"></div>

          <!-- Dropdown List -->
          <div v-if="isResponsavelDropdownOpen" class="absolute z-10 mt-1 w-full bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg shadow-lg max-h-48 overflow-y-auto">
            <div class="p-1.5 space-y-0.5">
              <label v-for="resp in uniqueResponsaveis" :key="resp" class="flex items-center hover:bg-gray-50 dark:hover:bg-zinc-800 dark:bg-zinc-900 p-2 rounded-md cursor-pointer transition-colors">
                <input type="checkbox" :value="resp" v-model="filterResponsaveis" class="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 dark:border-zinc-600 rounded cursor-pointer">
                <span class="ml-2 block text-sm text-gray-700 dark:text-zinc-300 select-none">{{ resp }}</span>
              </label>
              <div v-if="uniqueResponsaveis.length === 0" class="text-sm text-gray-400 dark:text-zinc-500 italic p-2 text-center">Nenhum responsável</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabela de Clientes -->
    <div class="bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-800 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-100">
          <thead class="bg-gray-50 dark:bg-zinc-900">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Nome</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase tracking-wider">E-mail</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Telefone</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Empresa</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Segmento</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Origem</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Status</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Responsável</th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-zinc-800 divide-y divide-gray-100">
            <tr v-if="pending">
              <td colspan="9" class="px-6 py-8 text-center text-gray-500 dark:text-zinc-400 text-sm">Carregando clientes...</td>
            </tr>
            <tr v-else-if="!clientesFiltrados || clientesFiltrados.length === 0">
              <td colspan="9" class="px-6 py-8 text-center text-gray-500 dark:text-zinc-400 text-sm">
                <span v-if="clientes && clientes.length > 0">Nenhum cliente corresponde aos filtros aplicados.</span>
                <span v-else>Nenhum cliente cadastrado.</span>
              </td>
            </tr>
            <tr v-else v-for="cliente in clientesFiltrados" :key="cliente.id" class="hover:bg-gray-50 dark:hover:bg-zinc-800 dark:bg-zinc-900 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-zinc-100 max-w-[250px] truncate" :title="cliente.nome">{{ cliente.nome }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-zinc-400 max-w-[200px] truncate" :title="cliente.email || ''">{{ cliente.email || '-' }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-zinc-400">{{ cliente.telefone || '-' }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-zinc-400 max-w-[250px] truncate" :title="cliente.empresa || ''">{{ cliente.empresa || '-' }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-zinc-400 max-w-[150px] truncate" :title="cliente.segmento || ''">{{ cliente.segmento || '-' }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-zinc-400 max-w-[150px] truncate" :title="cliente.origem || ''">{{ cliente.origem || '-' }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                  {{ cliente.status || 'Novo' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-zinc-400 max-w-[150px] truncate" :title="(cliente as any).profiles?.full_name || ''">
                {{ (cliente as any).profiles?.full_name || 'Desconhecido' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex items-center justify-end space-x-3">
                <button @click="openModal(cliente)" class="text-blue-600 hover:text-blue-900" title="Editar">
                  <PencilSquareIcon class="h-5 w-5" />
                </button>
                <button @click="confirmDelete(cliente)" class="text-red-500 hover:text-red-700" title="Excluir">
                  <TrashIcon class="h-5 w-5" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Adicionar/Editar Cliente -->
    <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
      <div class="fixed inset-0 bg-gray-900 bg-opacity-50 transition-opacity" @click="closeModal"></div>
      
      <div class="relative w-full max-w-2xl mx-auto my-6 z-50">
        <div class="relative flex flex-col w-full bg-white dark:bg-zinc-800 border-0 rounded-xl shadow-xl outline-none focus:outline-none">
          <!-- Cabeçalho -->
          <div class="flex items-start justify-between p-5 border-b border-solid border-gray-200 dark:border-zinc-700 rounded-t-xl">
            <h3 class="text-xl font-bold text-gray-900 dark:text-zinc-100">
              {{ isEditing ? 'Editar Cliente' : 'Adicionar Cliente' }}
            </h3>
            <button class="p-1 ml-auto bg-transparent border-0 text-gray-400 dark:text-zinc-500 float-right text-3xl leading-none font-semibold outline-none focus:outline-none hover:text-gray-600 dark:text-zinc-400" @click="closeModal">
              <span class="bg-transparent h-6 w-6 text-2xl block outline-none focus:outline-none">×</span>
            </button>
          </div>
          
          <!-- Corpo do formulário -->
          <div class="relative p-6 flex-auto max-h-[calc(100vh-200px)] overflow-y-auto">
            <form @submit.prevent="saveClient" class="space-y-4">
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Nome *</label>
                  <input v-model="form.nome" type="text" required class="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500" placeholder="Nome do cliente">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Empresa</label>
                  <input v-model="form.empresa" type="text" class="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500" placeholder="Nome da empresa">
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">E-mail</label>
                  <input v-model="form.email" type="email" class="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500" placeholder="email@exemplo.com">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Telefone</label>
                  <input v-model="form.telefone" type="text" class="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500" placeholder="(11) 99999-9999">
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">CNPJ</label>
                  <input v-model="form.CNPJ" @input="formatarCNPJ" type="text" class="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500" placeholder="00.000.000/0000-00">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Nome do Decisor</label>
                  <input v-model="form.Nome_Decisor" type="text" class="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500" placeholder="Nome de quem toma a decisão">
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Segmento</label>
                  <select v-model="form.segmento" class="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white dark:bg-zinc-800">
                    <option value="">Selecione...</option>
                    <option>Cerimonialista</option>
                    <option>Imobiliaria alto padrão</option>
                    <option>Imobiliria Minha Casa Minha Vida</option>
                    <option>Concessionaria</option>
                    <option>Clinicas odontologicas</option>
                    <option>Clinicas estetica</option>
                    <option>Estetica automotiva</option>
                    <option>Auto Center</option>
                    <option>Energia solar</option>
                    <option>Assistência técnica</option>
                    <option>Chaveiro</option>
                    <option>Eletricista</option>
                    <option>Contabilidade</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Origem</label>
                  <select v-model="form.origem" class="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white dark:bg-zinc-800">
                    <option value="">Selecione...</option>
                    <option>Facebook ads</option>
                    <option>Google ADS</option>
                    <option>Indicação</option>
                    <option>Google maps</option>
                    <option>Instagram</option>
                    <option>Receita federal</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Status</label>
                  <select v-model="form.status" class="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white dark:bg-zinc-800">
                    <option v-for="status in statusOptions" :key="status" :value="status">{{ status }}</option>
                  </select>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Anotações</label>
                <textarea v-model="form.anotacao" rows="3" class="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500" placeholder="Observações, informações importantes sobre o lead..."></textarea>
              </div>

            </form>

            <!-- TAREFAS SECTION -->
            <div v-if="isEditing" class="mt-8 border-t border-gray-200 dark:border-zinc-700 pt-6">
              <h4 class="text-lg font-bold text-gray-900 dark:text-zinc-100 mb-4 flex items-center">
                <svg class="w-5 h-5 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>
                Tarefas / Lembretes
              </h4>
              
              <!-- Add Task Form -->
              <div class="flex flex-col md:flex-row gap-3 mb-5 items-end bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-4 rounded-xl">
                <div class="flex-1 w-full">
                  <label class="block text-xs font-medium text-gray-700 dark:text-zinc-300 mb-1.5">Título da Tarefa</label>
                  <input v-model="newTask.titulo" type="text" class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="Ex: Enviar proposta">
                </div>
                <div class="w-full md:w-auto">
                  <label class="block text-xs font-medium text-gray-700 dark:text-zinc-300 mb-1.5">Data e Hora</label>
                  <input v-model="newTask.data_hora" type="datetime-local" class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-zinc-800">
                </div>
                <button type="button" @click="addTask" :disabled="isAddingTask || !newTask.titulo || !newTask.data_hora" class="w-full md:w-auto bg-gray-900 hover:bg-black text-white px-5 py-2 rounded-lg font-medium shadow-sm transition-colors disabled:opacity-50 text-sm">
                  {{ isAddingTask ? 'Adicionando...' : 'Adicionar' }}
                </button>
              </div>

              <!-- Tasks List -->
              <div v-if="isTasksLoading" class="text-center py-6 text-sm text-gray-500 dark:text-zinc-400 flex flex-col items-center justify-center">
                <svg class="animate-spin h-5 w-5 text-gray-400 dark:text-zinc-500 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                Carregando tarefas...
              </div>
              <div v-else-if="clientTasks.length === 0" class="text-center py-8 text-sm text-gray-500 dark:text-zinc-400 italic border-2 border-dashed border-gray-200 dark:border-zinc-700 rounded-xl bg-gray-50 dark:bg-zinc-900">
                Nenhuma tarefa agendada para este lead.
              </div>
              <div v-else class="space-y-2.5">
                <div v-for="task in clientTasks" :key="task.id" class="flex items-center justify-between p-3 border border-gray-200 dark:border-zinc-700 rounded-xl hover:border-orange-300 transition-colors bg-white dark:bg-zinc-800 group" :class="{'opacity-60 bg-gray-50 dark:bg-zinc-900 border-gray-200 dark:border-zinc-700': task.concluida}">
                  <div class="flex items-center gap-3.5 overflow-hidden">
                    <input type="checkbox" :checked="task.concluida" @change="toggleTask(task)" class="h-4.5 w-4.5 text-orange-600 focus:ring-orange-500 border-gray-300 dark:border-zinc-600 rounded cursor-pointer mt-0.5">
                    <div class="overflow-hidden">
                      <p class="text-sm font-semibold text-gray-900 dark:text-zinc-100 truncate" :class="{'line-through text-gray-500 dark:text-zinc-400': task.concluida}">{{ task.titulo }}</p>
                      <p class="text-xs text-gray-500 dark:text-zinc-400 flex items-center mt-0.5">
                        <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        {{ new Date(task.data_hora).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }) }}
                      </p>
                    </div>
                  </div>
                  <button type="button" @click="deleteTask(task.id)" class="text-gray-400 dark:text-zinc-500 hover:text-red-600 p-1.5 ml-2 shrink-0 transition-colors opacity-0 group-hover:opacity-100 rounded-md hover:bg-red-50">
                    <TrashIcon class="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Rodapé -->
          <div class="flex items-center justify-end p-5 border-t border-solid border-gray-200 dark:border-zinc-700 rounded-b-xl">
            <button class="text-gray-500 dark:text-zinc-400 bg-transparent font-medium px-6 py-2 text-sm outline-none focus:outline-none mr-2 mb-1 ease-linear transition-all duration-150" type="button" @click="closeModal" :disabled="isSaving">
              Cancelar
            </button>
            <button class="bg-orange-500 text-white active:bg-orange-600 font-medium text-sm px-6 py-2 rounded-lg shadow hover:shadow-lg outline-none focus:outline-none mb-1 ease-linear transition-all duration-150" type="button" @click="saveClient" :disabled="isSaving">
              {{ isSaving ? 'Salvando...' : (isEditing ? 'Atualizar' : 'Salvar') }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Confirmação de Exclusão -->
    <div v-if="isDeleteModalOpen" class="fixed inset-0 z-[60] flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
      <div class="fixed inset-0 bg-gray-900 bg-opacity-50 transition-opacity" @click="cancelDelete"></div>
      
      <div class="relative w-full max-w-md mx-auto my-6 z-[60]">
        <div class="relative flex flex-col w-full bg-white dark:bg-zinc-800 border-0 rounded-xl shadow-xl outline-none focus:outline-none p-6">
          <div class="text-center">
            <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <TrashIcon class="h-6 w-6 text-red-600" aria-hidden="true" />
            </div>
            <h3 class="text-lg font-bold text-gray-900 dark:text-zinc-100 mb-2">Excluir Cliente</h3>
            <p class="text-sm text-gray-500 dark:text-zinc-400">
              Tem certeza que deseja excluir o cliente <strong>{{ clientToDelete?.nome }}</strong>? Esta ação não pode ser desfeita.
            </p>
          </div>
          <div class="mt-6 flex justify-center space-x-3">
            <button @click="cancelDelete" class="bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-600 text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800 dark:bg-zinc-900 font-medium px-4 py-2 rounded-lg text-sm transition-colors">
              Cancelar
            </button>
            <button @click="executeDelete" class="bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2 rounded-lg text-sm transition-colors shadow-sm">
              Sim, excluir
            </button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { PencilSquareIcon, TrashIcon } from '@heroicons/vue/24/outline'
import type { Database } from '~/types/database.types'

definePageMeta({
  layout: 'comercial'
})

const supabase = useSupabaseClient<Database>()
const { userViewAllLeads, userId } = useUserRole()

// Lista de Status solicitada
const statusOptions = [
  'Extraído',
  'Novo',
  'Mensagem',
  'Ligação',
  'Reunião',
  'Proposta enviada',
  'Follow-up',
  'Fechado',
  'Perdido'
]

// ----------------------------------------------------
// FETCH DATA
// ----------------------------------------------------
const { data: clientes, pending, refresh } = useAsyncData('todos-clientes', async () => {
  let query = supabase
    .from('ibeia_clientes')
    .select(`
      *,
      profiles:responsavel (
        full_name
      )
    `)
    .order('criado_em', { ascending: false });
    
  if (!userViewAllLeads.value && userId.value) {
    query = query.eq('responsavel', userId.value)
  }

  const { data, error } = await query
  if (error) console.error(error);
  return data || [];
}, { watch: [userViewAllLeads, userId] });

// ----------------------------------------------------
// FILTROS LOGIC
// ----------------------------------------------------
const filterNome = ref('')
const filterNicho = ref<string[]>([])
const filterOrigem = ref<string[]>([])
const filterResponsaveis = ref<string[]>([])

const isResponsavelDropdownOpen = ref(false)
const isNichoDropdownOpen = ref(false)
const isOrigemDropdownOpen = ref(false)

const uniqueSegmentos = computed(() => {
  if (!clientes.value) return [];
  const segs = clientes.value.map((c: any) => c.segmento);
  return [...new Set(segs)].filter(Boolean).sort();
});

const uniqueOrigens = computed(() => {
  if (!clientes.value) return [];
  const origs = clientes.value.map((c: any) => c.origem);
  return [...new Set(origs)].filter(Boolean).sort();
});

const uniqueResponsaveis = computed(() => {
  if (!clientes.value) return [];
  const names = clientes.value.map((c: any) => c.profiles?.full_name || 'Desconhecido');
  return [...new Set(names)].filter(Boolean).sort();
});

const clientesFiltrados = computed(() => {
  if (!clientes.value) return [];
  return clientes.value.filter((cliente: any) => {
    if (filterNome.value && !cliente.nome?.toLowerCase().includes(filterNome.value.toLowerCase())) return false;
    
    if (filterNicho.value.length > 0) {
      if (!cliente.segmento || !filterNicho.value.includes(cliente.segmento)) return false;
    }
    
    if (filterOrigem.value.length > 0) {
      if (!cliente.origem || !filterOrigem.value.includes(cliente.origem)) return false;
    }
    
    if (filterResponsaveis.value.length > 0) {
      const respName = cliente.profiles?.full_name || 'Desconhecido';
      // Case-insensitive inclusion match
      const match = filterResponsaveis.value.some((r: string) => respName.toLowerCase().includes(r.toLowerCase()));
      if (!match) return false;
    }
    
    return true;
  });
});

function limparFiltros() {
  filterNome.value = '';
  filterNicho.value = [];
  filterOrigem.value = [];
  filterResponsaveis.value = [];
}

// ----------------------------------------------------
// MODAL & FORM STATE
// ----------------------------------------------------
const isModalOpen = ref(false)
const isEditing = ref(false)
const isSaving = ref(false)

const initialForm = {
  id: '',
  nome: '',
  email: '',
  telefone: '',
  empresa: '',
  segmento: '',
  origem: '',
  status: 'Novo',
  CNPJ: '',
  Nome_Decisor: '',
  anotacao: ''
}

const form = ref({ ...initialForm })

function openModal(client?: any) {
  if (client) {
    isEditing.value = true
    form.value = {
      id: client.id,
      nome: client.nome,
      email: client.email || '',
      telefone: client.telefone || '',
      empresa: client.empresa || '',
      segmento: client.segmento || '',
      origem: client.origem || '',
      status: client.status || 'Novo',
      CNPJ: client.CNPJ || '',
      Nome_Decisor: client.Nome_Decisor || '',
      anotacao: client.anotacao || ''
    }
    fetchTasks(client.id)
  } else {
    isEditing.value = false
    form.value = { ...initialForm }
    clientTasks.value = []
    newTask.value = { titulo: '', data_hora: '' }
  }
  isModalOpen.value = true
}

function closeModal() {
  isModalOpen.value = false
}

function formatarCNPJ(event: Event) {
  const target = event.target as HTMLInputElement;
  let value = target.value.replace(/\D/g, ''); // Remove tudo que não for dígito

  // Limita a 14 dígitos numéricos
  if (value.length > 14) {
    value = value.slice(0, 14);
  }

  // Applica a máscara: 00.000.000/0000-00
  value = value.replace(/^(\d{2})(\d)/, '$1.$2');
  value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
  value = value.replace(/\.(\d{3})(\d)/, '.$1/$2');
  value = value.replace(/(\d{4})(\d)/, '$1-$2');

  form.value.CNPJ = value;
}

// ----------------------------------------------------
// TASKS LOGIC
// ----------------------------------------------------
const clientTasks = ref<any[]>([])
const isTasksLoading = ref(false)
const isAddingTask = ref(false)
const newTask = ref({ titulo: '', data_hora: '' })

async function fetchTasks(clienteId: string) {
  isTasksLoading.value = true
  try {
    const { data, error } = await supabase
      .from('ibeia_clientes_tarefas')
      .select('*')
      .eq('cliente_id', clienteId)
      .order('data_hora', { ascending: true })
      
    if (error) throw error
    clientTasks.value = data || []
  } catch (err) {
    console.error('Erro ao buscar tarefas:', err)
    clientTasks.value = []
  } finally {
    isTasksLoading.value = false
  }
}

async function addTask() {
  if (!newTask.value.titulo || !newTask.value.data_hora || !form.value.id) return
  
  isAddingTask.value = true
  try {
    const { error } = await supabase
      .from('ibeia_clientes_tarefas')
      .insert({
        cliente_id: form.value.id,
        titulo: newTask.value.titulo,
        data_hora: new Date(newTask.value.data_hora).toISOString()
      })
      
    if (error) throw error
    
    newTask.value = { titulo: '', data_hora: '' }
    await fetchTasks(form.value.id)
  } catch (err: any) {
    console.error("Erro ao adicionar tarefa:", err)
    alert('Erro ao adicionar tarefa: ' + (err.message || JSON.stringify(err)))
  } finally {
    isAddingTask.value = false
  }
}

async function toggleTask(task: any) {
  const originalStatus = task.concluida
  task.concluida = !originalStatus
  try {
    const { error } = await supabase
      .from('ibeia_clientes_tarefas')
      .update({ concluida: task.concluida })
      .eq('id', task.id)
      
    if (error) throw error
  } catch (err: any) {
    task.concluida = originalStatus
    console.error("Erro ao atualizar tarefa:", err)
    alert('Erro ao atualizar tarefa: ' + (err.message || JSON.stringify(err)))
  }
}

async function deleteTask(taskId: string) {
  if (!confirm('Deseja realmente excluir esta tarefa?')) return;
  
  try {
    const { error } = await supabase
      .from('ibeia_clientes_tarefas')
      .delete()
      .eq('id', taskId)
      
    if (error) throw error
    clientTasks.value = clientTasks.value.filter(t => t.id !== taskId)
  } catch (err: any) {
    console.error("Erro ao excluir tarefa:", err)
    alert('Erro ao excluir tarefa: ' + (err.message || JSON.stringify(err)))
  }
}

// ----------------------------------------------------
// DELETE LOGIC
// ----------------------------------------------------
const isDeleteModalOpen = ref(false)
const clientToDelete = ref<any>(null)

function confirmDelete(client: any) {
  clientToDelete.value = client
  isDeleteModalOpen.value = true
}

function cancelDelete() {
  isDeleteModalOpen.value = false
  clientToDelete.value = null
}

async function executeDelete() {
  if (!clientToDelete.value) return
  
  try {
    const { error } = await supabase
      .from('ibeia_clientes')
      .delete()
      .eq('id', clientToDelete.value.id)
      
    if (error) throw error
    
    await refresh()
    cancelDelete()
  } catch (err: any) {
    console.error("Erro ao deletar:", err)
    alert("Erro ao excluir: " + (err.message || JSON.stringify(err)))
  }
}

// ----------------------------------------------------
// SAVE LOGIC
// ----------------------------------------------------
async function saveClient() {
  if (!form.value.nome) {
    alert("O nome é obrigatório!");
    return;
  }
  
  isSaving.value = true;
  
  try {
    const payload = {
      nome: form.value.nome,
      email: form.value.email || null,
      telefone: form.value.telefone || null,
      empresa: form.value.empresa || null,
      segmento: form.value.segmento || null,
      origem: form.value.origem || null,
      status: form.value.status,
      CNPJ: form.value.CNPJ || null,
      Nome_Decisor: form.value.Nome_Decisor || null,
      anotacao: form.value.anotacao || null
    }

    if (isEditing.value) {
      const { error } = await supabase
        .from('ibeia_clientes')
        .update(payload)
        .eq('id', form.value.id)
        
      if (error) throw error
    } else {
      // Capturar o usuário completo logado para preencher o responsavel
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      if (authError) throw authError

      const { error } = await supabase
        .from('ibeia_clientes')
        .insert({
          ...payload,
          responsavel: user?.id || null
        })
        
      if (error) throw error
    }
    
    // Atualizar a tabela
    await refresh()
    closeModal()
    
  } catch (err: any) {
    console.error("Erro ao salvar cliente:", err)
    alert("Ocorreu um erro ao salvar o cliente: " + (err.message || JSON.stringify(err)))
  } finally {
    isSaving.value = false
  }
}
</script>
