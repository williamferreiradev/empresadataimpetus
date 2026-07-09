<script setup lang="ts">
import type { CanvasNode } from '../types/canvas'
import { useCanvasNavigation } from '../composables/useCanvasNavigation'
import { ArrowLeft } from 'lucide-vue-next'

defineProps<{
  nodes: CanvasNode[]
  mapName: string
}>()

const emit = defineEmits<{
  (e: 'back'): void
}>()

const { focusNode } = useCanvasNavigation()
</script>

<template>
  <nav class="canvas-navbar">
    <div class="nav-left">
      <button class="btn btn-secondary back-btn" @click="emit('back')">
        <ArrowLeft :size="16" class="mr-1" /> Voltar
      </button>
      <div class="title-container">
        <span class="map-title">{{ mapName }}</span>
        <span class="map-mode-badge">Modo Canvas</span>
      </div>
    </div>

    <div class="nav-center">
      <span class="nav-label">Focar em:</span>
      <div v-if="nodes.length === 0" class="nav-empty">
        <i>Nenhum nó criado no canvas</i>
      </div>
      <div v-else class="nodes-nav-list">
        <button
          v-for="node in nodes"
          :key="node.id"
          class="btn nav-node-btn"
          :style="{ borderLeft: `3px solid var(--color-cat-${node.category}, var(--accent-primary))` }"
          @click="focusNode(node.id)"
          :title="`Focar em ${node.label}`"
        >
          {{ node.label }}
        </button>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.canvas-navbar {
  position: absolute;
  top: 1rem;
  left: 1rem;
  right: 1rem;
  height: 60px;
  background-color: rgba(13, 17, 28, 0.85);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: var(--radius-md);
  padding: 0 1.25rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  z-index: 50;
  box-shadow: var(--shadow-md);
}

.nav-left {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

.back-btn {
  padding: 0.4rem 0.85rem;
  font-size: 0.85rem;
}

.title-container {
  display: flex;
  flex-direction: column;
}

.map-title {
  font-family: var(--font-display);
  font-size: 1.15rem;
  font-weight: 600;
  color: var(--text-primary);
  line-height: 1.2;
}

.map-mode-badge {
  font-size: 0.7rem;
  color: var(--text-muted);
}

.nav-center {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  max-width: 60%;
  overflow: hidden;
}

.nav-label {
  font-size: 0.85rem;
  color: var(--text-secondary);
  font-weight: 500;
  white-space: nowrap;
}

.nav-empty {
  font-size: 0.85rem;
  color: var(--text-muted);
}

.nodes-nav-list {
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  padding: 0.25rem 0;
  /* hide scrollbar */
  scrollbar-width: none;
}
.nodes-nav-list::-webkit-scrollbar {
  display: none;
}

.nav-node-btn {
  background-color: var(--bg-primary);
  color: var(--text-primary);
  padding: 0.35rem 0.75rem;
  font-size: 0.8rem;
  white-space: nowrap;
  border: 1px solid var(--bg-tertiary);
  border-radius: var(--radius-sm);
  box-shadow: var(--shadow-sm);
}

.nav-node-btn:hover {
  background-color: var(--bg-secondary);
  border-color: var(--accent-primary);
  transform: translateY(-1px);
}
</style>
