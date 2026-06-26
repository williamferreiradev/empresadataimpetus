<template>
  <div 
    class="relative rounded border-2 shadow-sm min-w-[200px] min-h-[80px] flex items-center justify-center p-3 transition-colors group"
    :class="[
      colorClasses,
      selected ? 'ring-2 ring-orange-400 border-orange-400' : '',
      data.shape === 'circle' ? 'rounded-full aspect-square min-w-[120px] min-h-[120px]' : 'rounded-lg'
    ]"
    @dblclick="startEditing"
  >
    <!-- Toolbar de Formatação (Visível apenas quando selecionado) -->
    <div v-if="selected" class="absolute -top-14 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white border border-gray-200 shadow-md rounded-md p-1.5 z-50 whitespace-nowrap">
      
      <!-- Typography -->
      <div class="flex items-center gap-1 border-r border-gray-300 pr-2">
        <button @click.stop="changeTypography('h1')" class="px-2 py-0.5 rounded font-bold hover:bg-gray-100 text-gray-800 transition-colors" :class="{'bg-gray-200': typography === 'h1'}" title="Título Principal">H1</button>
        <button @click.stop="changeTypography('h2')" class="px-2 py-0.5 rounded font-semibold hover:bg-gray-100 text-gray-800 transition-colors" :class="{'bg-gray-200': typography === 'h2'}" title="Subtítulo">H2</button>
        <button @click.stop="changeTypography('body')" class="px-2 py-0.5 rounded text-sm hover:bg-gray-100 text-gray-800 transition-colors" :class="{'bg-gray-200': typography === 'body'}" title="Texto Padrão">T</button>
      </div>

      <!-- Colors -->
      <div class="flex items-center gap-1 pl-1">
        <button @click.stop="changeColor('default')" class="w-5 h-5 rounded-full bg-white border border-gray-300 hover:ring-2 ring-gray-400" title="Padrão"></button>
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
      <textarea 
        v-model="internalLabel"
        @blur="finishEditing"
        @keydown.enter.prevent="finishEditing"
        ref="inputRef"
        class="w-full text-center bg-transparent outline-none resize-none overflow-hidden text-inherit p-0 m-0 border-none leading-tight"
        :class="typographyClasses"
        rows="1"
      ></textarea>
    </div>
    <div v-else class="text-center break-words whitespace-pre-wrap select-none pointer-events-none leading-tight" :class="typographyClasses">
      {{ data.label || 'Duplo clique p/ editar' }}
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick, computed } from 'vue'
import { Handle, useVueFlow } from '@vue-flow/core'

const props = defineProps({
  id: { type: String, required: true },
  data: { type: Object, required: true },
  selected: { type: Boolean, default: false },
  position: { type: Object, default: () => ({x: 0, y: 0}) }
})

const isEditing = ref(false)
const internalLabel = ref(props.data.label)
const inputRef = ref(null)

const { addNodes, addEdges, findNode } = useVueFlow()

const colorClasses = computed(() => {
  const c = props.data?.color || 'default'
  switch (c) {
    case 'dark': return 'bg-gray-900 border-gray-700 text-white'
    case 'navy': return 'bg-slate-800 border-slate-600 text-white'
    case 'emerald': return 'bg-teal-800 border-teal-600 text-white'
    case 'gold': return 'bg-amber-600 border-amber-500 text-white'
    case 'wine': return 'bg-rose-900 border-rose-700 text-white'
    default: return 'bg-white border-gray-300 text-gray-800'
  }
})

const typography = computed(() => props.data?.typography || 'body')

const typographyClasses = computed(() => {
  switch (typography.value) {
    case 'h1': return 'text-2xl font-bold'
    case 'h2': return 'text-lg font-semibold'
    case 'body':
    default: return 'text-sm font-medium'
  }
})

const changeColor = (color) => {
  if (props.data) {
    props.data.color = color
  }
}

const changeTypography = (type) => {
  if (props.data) {
    props.data.typography = type
  }
}

const startEditing = async () => {
  isEditing.value = true
  await nextTick()
  if (inputRef.value) {
    inputRef.value.focus()
    inputRef.value.select()
  }
}

const finishEditing = () => {
  isEditing.value = false
  if (props.data) {
    props.data.label = internalLabel.value
  }
}

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

  const newId = `node_${Date.now()}`
  
  const newNode = {
    id: newId,
    type: 'custom',
    position: { x: pos.x + dx, y: pos.y + dy },
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
    style: { strokeWidth: 2, stroke: '#9ca3af' }
  }

  addNodes([newNode])
  addEdges([newEdge])
}

watch(() => props.data?.label, (newVal) => {
  internalLabel.value = newVal
})
</script>
