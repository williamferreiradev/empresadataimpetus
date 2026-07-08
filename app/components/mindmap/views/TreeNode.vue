<template>
  <div class="mb-1">
    <div 
      class="flex items-center py-1 group"
      :style="{ paddingLeft: `${level * 1.5}rem` }"
    >
      <div 
        class="w-2 h-2 rounded-full mr-3 shrink-0"
        :class="bulletColor"
      ></div>
      <span 
        class="text-gray-800 dark:text-zinc-100 break-words rich-text-node"
        v-html="node.data?.label || '(Sem texto)'"
      >
      </span>
    </div>
    
    <div v-if="node.children && node.children.length > 0">
      <TreeNode 
        v-for="child in node.children" 
        :key="child.id" 
        :node="child" 
        :level="level + 1" 
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  node: {
    type: Object,
    required: true
  },
  level: {
    type: Number,
    default: 0
  }
})



const bulletColor = computed(() => {
  const c = props.node.data?.color || 'default'
  switch (c) {
    case 'dark': return 'bg-gray-700'
    case 'navy': return 'bg-slate-600'
    case 'emerald': return 'bg-teal-500'
    case 'gold': return 'bg-amber-500'
    case 'wine': return 'bg-rose-700'
    default: return 'bg-gray-300'
  }
})
</script>
