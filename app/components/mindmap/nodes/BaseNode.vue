<template>
  <div 
    class="relative rounded border-2 shadow-sm min-w-[200px] min-h-[80px] w-full h-full flex items-center justify-center p-3 transition-colors group"
    :class="[
      colorClasses,
      shapeClasses,
      selected ? 'ring-2 ring-orange-400 border-orange-400' : ''
    ]"
    @dblclick="startEditing"
  >
    <NodeResizer min-width="120" min-height="60" :is-visible="selected" handle-class="bg-orange-500 border-2 border-white rounded-md w-3 h-3" />

    <!-- Toolbar de Formatação (Visível apenas quando selecionado) -->
    <div v-if="selected" class="absolute -top-14 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 shadow-md rounded-md p-1.5 z-50 whitespace-nowrap">
      
      <!-- Rich Text Actions -->
      <div class="flex items-center gap-1 border-r border-gray-300 dark:border-zinc-600 pr-2">
        <button @click.stop="formatText('formatBlock', 'H1')" class="px-2 py-0.5 rounded font-bold hover:bg-gray-100 dark:hover:bg-zinc-700 dark:bg-zinc-800 text-gray-800 dark:text-zinc-100 transition-colors" title="Título Principal">H1</button>
        <button @click.stop="formatText('formatBlock', 'H2')" class="px-2 py-0.5 rounded font-semibold hover:bg-gray-100 dark:hover:bg-zinc-700 dark:bg-zinc-800 text-gray-800 dark:text-zinc-100 transition-colors" title="Subtítulo">H2</button>
        <button @click.stop="formatText('formatBlock', 'P')" class="px-2 py-0.5 rounded text-sm hover:bg-gray-100 dark:hover:bg-zinc-700 dark:bg-zinc-800 text-gray-800 dark:text-zinc-100 transition-colors" title="Texto Padrão">P</button>
        <div class="w-px h-4 bg-gray-300 mx-1"></div>
        <button @click.stop="formatText('bold')" class="px-2 py-0.5 rounded font-bold hover:bg-gray-100 dark:hover:bg-zinc-700 dark:bg-zinc-800 text-gray-800 dark:text-zinc-100 transition-colors" title="Negrito">B</button>
        <button @click.stop="formatText('italic')" class="px-2 py-0.5 rounded italic hover:bg-gray-100 dark:hover:bg-zinc-700 dark:bg-zinc-800 text-gray-800 dark:text-zinc-100 transition-colors" title="Itálico">I</button>
        <div class="w-px h-4 bg-gray-300 mx-1"></div>
        <button @click.stop="formatText('justifyLeft')" class="px-2 py-0.5 rounded hover:bg-gray-100 dark:hover:bg-zinc-700 dark:bg-zinc-800 text-gray-800 dark:text-zinc-100 transition-colors" title="Alinhar à Esquerda">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h10M4 18h16" /></svg>
        </button>
        <button @click.stop="formatText('justifyCenter')" class="px-2 py-0.5 rounded hover:bg-gray-100 dark:hover:bg-zinc-700 dark:bg-zinc-800 text-gray-800 dark:text-zinc-100 transition-colors" title="Centralizar">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M7 12h10M4 18h16" /></svg>
        </button>
        <button @click.stop="formatText('justifyRight')" class="px-2 py-0.5 rounded hover:bg-gray-100 dark:hover:bg-zinc-700 dark:bg-zinc-800 text-gray-800 dark:text-zinc-100 transition-colors" title="Alinhar à Direita">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M10 12h10M4 18h16" /></svg>
        </button>
        <button @click.stop="formatText('justifyFull')" class="px-2 py-0.5 rounded hover:bg-gray-100 dark:hover:bg-zinc-700 dark:bg-zinc-800 text-gray-800 dark:text-zinc-100 transition-colors" title="Justificar">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
        </button>
      </div>

      <!-- Colors -->
      <div class="flex items-center gap-1 pl-1 flex-wrap w-[180px]">
        <button @click.stop="changeColor('default')" class="w-5 h-5 rounded-full bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-600 hover:ring-2 ring-gray-400" title="Padrão"></button>
        <button @click.stop="changeColor('sticky-yellow')" class="w-5 h-5 rounded-full bg-yellow-200 border border-yellow-300 hover:ring-2 ring-yellow-400" title="Amarelo (Sticky)"></button>
        <button @click.stop="changeColor('sticky-pink')" class="w-5 h-5 rounded-full bg-pink-200 border border-pink-300 hover:ring-2 ring-pink-400" title="Rosa (Sticky)"></button>
        <button @click.stop="changeColor('sticky-blue')" class="w-5 h-5 rounded-full bg-blue-200 border border-blue-300 hover:ring-2 ring-blue-400" title="Azul (Sticky)"></button>
        <button @click.stop="changeColor('dark')" class="w-5 h-5 rounded-full bg-gray-900 border border-gray-700 hover:ring-2 ring-gray-900" title="Dark"></button>
        <button @click.stop="changeColor('navy')" class="w-5 h-5 rounded-full bg-slate-800 border border-slate-600 hover:ring-2 ring-slate-800" title="Navy"></button>
        <button @click.stop="changeColor('emerald')" class="w-5 h-5 rounded-full bg-teal-800 border border-teal-600 hover:ring-2 ring-teal-800" title="Emerald"></button>
        <button @click.stop="changeColor('gold')" class="w-5 h-5 rounded-full bg-amber-600 border border-amber-500 hover:ring-2 ring-amber-600" title="Gold"></button>
        <button @click.stop="changeColor('wine')" class="w-5 h-5 rounded-full bg-rose-900 border border-rose-700 hover:ring-2 ring-rose-900" title="Wine"></button>
      </div>
    </div>

    <!-- Connect Handles - Todos os 4 lados podem receber e enviar conexões -->
    <Handle id="top-t" type="target" position="top" class="w-3 h-3 border-2 border-white bg-orange-400 opacity-0 group-hover:opacity-100 transition-opacity z-20" />
    <Handle id="top-s" type="source" position="top" class="w-3 h-3 border-2 border-white bg-orange-400 opacity-0 group-hover:opacity-100 transition-opacity z-20" />
    
    <Handle id="bottom-t" type="target" position="bottom" class="w-3 h-3 border-2 border-white bg-orange-400 opacity-0 group-hover:opacity-100 transition-opacity z-20" />
    <Handle id="bottom-s" type="source" position="bottom" class="w-3 h-3 border-2 border-white bg-orange-400 opacity-0 group-hover:opacity-100 transition-opacity z-20" />
    
    <Handle id="left-t" type="target" position="left" class="w-3 h-3 border-2 border-white bg-orange-400 opacity-0 group-hover:opacity-100 transition-opacity z-20" />
    <Handle id="left-s" type="source" position="left" class="w-3 h-3 border-2 border-white bg-orange-400 opacity-0 group-hover:opacity-100 transition-opacity z-20" />
    
    <Handle id="right-t" type="target" position="right" class="w-3 h-3 border-2 border-white bg-orange-400 opacity-0 group-hover:opacity-100 transition-opacity z-20" />
    <Handle id="right-s" type="source" position="right" class="w-3 h-3 border-2 border-white bg-orange-400 opacity-0 group-hover:opacity-100 transition-opacity z-20" />
    
    <!-- Quick Create Buttons com ponte transparente para não perder o hover -->
    <div class="absolute -top-10 left-1/2 -translate-x-1/2 w-10 h-10 flex items-start justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-auto cursor-pointer" @click.stop="quickCreate('top')">
      <div class="w-6 h-6 bg-orange-500 rounded-full text-white font-bold flex items-center justify-center hover:scale-125 transition-transform shadow-md">+</div>
    </div>
    
    <div class="absolute -bottom-10 left-1/2 -translate-x-1/2 w-10 h-10 flex items-end justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-auto cursor-pointer" @click.stop="quickCreate('bottom')">
      <div class="w-6 h-6 bg-orange-500 rounded-full text-white font-bold flex items-center justify-center hover:scale-125 transition-transform shadow-md">+</div>
    </div>
    
    <div class="absolute -left-10 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-start opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-auto cursor-pointer" @click.stop="quickCreate('left')">
      <div class="w-6 h-6 bg-orange-500 rounded-full text-white font-bold flex items-center justify-center hover:scale-125 transition-transform shadow-md">+</div>
    </div>
    
    <div class="absolute -right-10 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-end opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-auto cursor-pointer" @click.stop="quickCreate('right')">
      <div class="w-6 h-6 bg-orange-500 rounded-full text-white font-bold flex items-center justify-center hover:scale-125 transition-transform shadow-md">+</div>
    </div>
    
    <!-- Area de texto editavel -->
    <div v-if="isEditing" class="w-full h-full flex items-center justify-center">
      <div 
        ref="inputRef"
        contenteditable="true"
        @blur="finishEditing"
        @input="onInput"
        @keydown.stop
        class="w-full text-center bg-transparent outline-none overflow-hidden text-inherit p-1 m-0 border-none leading-tight rich-text-node cursor-text"
      ></div>
    </div>
    <div v-else class="text-center break-words select-none pointer-events-none leading-tight rich-text-node" v-html="data.label || 'Duplo clique p/ editar'">
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick, computed, onMounted, onBeforeUnmount } from 'vue'
import { Handle, useVueFlow } from '@vue-flow/core'
import { NodeResizer } from '@vue-flow/node-resizer'
import '@vue-flow/node-resizer/dist/style.css'

const props = defineProps({
  id: { type: String, required: true },
  data: { type: Object, required: true },
  selected: { type: Boolean, default: false },
  position: { type: Object, default: () => ({x: 0, y: 0}) }
})

const isEditing = ref(false)
const internalLabel = ref(props.data.label)
const inputRef = ref(null)

const { addNodes, addEdges, findNode, updateNodeData, getNodes } = useVueFlow()

const colorClasses = computed(() => {
  const c = props.data?.color || 'default'
  switch (c) {
    case 'dark': return 'bg-gray-900 border-gray-700 text-white'
    case 'navy': return 'bg-slate-800 border-slate-600 text-white'
    case 'emerald': return 'bg-teal-800 border-teal-600 text-white'
    case 'gold': return 'bg-amber-600 border-amber-500 text-white'
    case 'wine': return 'bg-rose-900 border-rose-700 text-white'
    case 'sticky-yellow': return 'bg-yellow-100 border-yellow-300 text-gray-800'
    case 'sticky-pink': return 'bg-pink-100 border-pink-300 text-gray-800'
    case 'sticky-blue': return 'bg-blue-100 border-blue-300 text-gray-800'
    default: return 'bg-white border-gray-300 text-gray-800'
  }
})

const shapeClasses = computed(() => {
  if (props.data?.shape === 'circle') {
    return 'rounded-full aspect-square min-w-[120px] min-h-[120px]'
  }
  if (props.data?.shape === 'sticky') {
    return 'rounded-none shadow-md'
  }
  return 'rounded-lg'
})

const formatText = (command, value = null) => {
  document.execCommand(command, false, value)
  if (inputRef.value) {
    inputRef.value.focus()
  }
}

const changeColor = (color) => {
  updateNodeData(props.id, { color })
}

const onInput = (e) => {
  internalLabel.value = e.target.innerHTML
}

const startEditing = async () => {
  isEditing.value = true
  await nextTick()
  if (inputRef.value) {
    inputRef.value.innerHTML = internalLabel.value || ''
    inputRef.value.focus()
    // Select all text natively for contenteditable
    const range = document.createRange()
    range.selectNodeContents(inputRef.value)
    const sel = window.getSelection()
    sel.removeAllRanges()
    sel.addRange(range)
  }
}

const finishEditing = () => {
  isEditing.value = false
  if (inputRef.value) {
    internalLabel.value = inputRef.value.innerHTML
  }
  updateNodeData(props.id, { label: internalLabel.value })
}

const handleKeydown = (e) => {
  if (props.selected && e.key === 'Tab' && !isEditing.value) {
    e.preventDefault()
    quickCreate('right')
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
})

const quickCreate = (direction) => {
  const currentNode = findNode(props.id)
  const pos = currentNode ? currentNode.position : props.position
  
  let dx = 0, dy = 0;
  let sourceHandle = null;
  let targetHandle = null;
  
  if (direction === 'right') {
    dx = 250;
    sourceHandle = 'right-s';
    targetHandle = 'left-t';
  }
  if (direction === 'left') {
    dx = -250;
    sourceHandle = 'left-s';
    targetHandle = 'right-t';
  }
  if (direction === 'bottom') {
    dy = 150;
    sourceHandle = 'bottom-s';
    targetHandle = 'top-t';
  }
  if (direction === 'top') {
    dy = -150;
    sourceHandle = 'top-s';
    targetHandle = 'bottom-t';
  }

  // Lógica inteligente para empilhar se já houver um irmão naquela posição
  const allNodes = getNodes.value
  let finalX = pos.x + dx
  let finalY = pos.y + dy

  // Encontra filhos que o nó atual já criou naquela direção
  // Aqui fazemos uma busca simplificada: vemos se tem algum nó muito próximo da coordenada esperada
  const isOverlap = (tx, ty) => allNodes.some(n => Math.abs(n.position.x - tx) < 50 && Math.abs(n.position.y - ty) < 50)
  
  // Se houver sobreposição, joga o próximo card um pouco mais para baixo (empilhando)
  while (isOverlap(finalX, finalY)) {
    finalY += (props.data.shape === 'circle' ? 140 : 100) // Desce o equivalente à altura do nó + margem
  }

  const newId = `node_${Date.now()}`
  
  const newNode = {
    id: newId,
    type: 'custom',
    position: { x: finalX, y: finalY },
    data: { label: 'Nova Ideia', shape: props.data.shape, color: props.data.color || 'default' }
  }

  const newEdge = {
    id: `edge_${props.id}_${newId}`,
    source: props.id,
    target: newId,
    sourceHandle,
    targetHandle,
    updatable: true,
    type: 'customEdge',
    animated: false,
    style: { strokeWidth: 2, stroke: '#9ca3af' } // A cor vai ser atualizada automaticamente no onNodesChange pelo getEdgeColor
  }

  addNodes([newNode])
  addEdges([newEdge])
}

watch(() => props.data?.label, (newVal) => {
  if (internalLabel.value !== newVal) {
    internalLabel.value = newVal
  }
})
</script>

<style>
.rich-text-node h1 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
}
.rich-text-node h2 {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}
.rich-text-node p {
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
}
.rich-text-node b, .rich-text-node strong {
  font-weight: 700;
}
.rich-text-node i, .rich-text-node em {
  font-style: italic;
}
.rich-text-node:empty:before {
  content: "Digite algo...";
  color: #9ca3af;
  pointer-events: none;
}
</style>
