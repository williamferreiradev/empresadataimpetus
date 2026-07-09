<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { Smile } from 'lucide-vue-next'

const props = withDefaults(defineProps<{
  placement?: 'top' | 'bottom'
}>(), {
  placement: 'top'
})

const emit = defineEmits<{
  (e: 'select', emoji: string): void
}>()

const isOpen = ref(false)
const pickerRef = ref<HTMLElement | null>(null)

const popularEmojis = [
  '💡', '🚀', '🎯', '📊', '📝', '💻', '👥', '📅', 
  '🔑', '⚡', '🎨', '🔥', '🌍', '🛠️', '📈', '🔔', 
  '✅', '❌', '⚠️', '⭐', '🧠', '💼', '📌', '🔍',
  '😀', '😂', '👍', '🙌', '🎉', '❤️', '👏', '🤝'
]

function handleSelect(emoji: string) {
  emit('select', emoji)
  isOpen.value = false
}

function handleClickOutside(event: MouseEvent) {
  if (pickerRef.value && !pickerRef.value.contains(event.target as Node)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div ref="pickerRef" class="emoji-picker-container">
    <button 
      type="button" 
      class="btn btn-secondary emoji-trigger-btn" 
      @click="isOpen = !isOpen"
      title="Inserir Emoji"
    >
      <Smile :size="16" />
    </button>
    
    <Transition name="fade-fast">
      <div 
        v-if="isOpen" 
        class="emoji-dropdown" 
        :class="placement === 'bottom' ? 'placement-bottom' : 'placement-top'"
      >
        <button 
          v-for="emoji in popularEmojis" 
          :key="emoji" 
          type="button"
          class="emoji-item"
          @click="handleSelect(emoji)"
        >
          {{ emoji }}
        </button>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.emoji-picker-container {
  position: relative;
  display: inline-block;
}

.emoji-trigger-btn {
  padding: 0.45rem 0.65rem;
  font-size: 1.05rem;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
  border: 1px solid var(--bg-tertiary);
}

.emoji-dropdown {
  position: absolute;
  right: 0;
  background-color: rgba(30, 41, 59, 0.95);
  backdrop-filter: blur(12px);
  border: 1px solid var(--bg-tertiary);
  border-radius: var(--radius-md);
  padding: 0.5rem;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 0.25rem;
  box-shadow: var(--shadow-lg);
  z-index: 110;
  width: 210px;
}

.emoji-dropdown.placement-top {
  bottom: 100%;
  margin-bottom: 0.5rem;
}

.emoji-dropdown.placement-bottom {
  top: 100%;
  margin-top: 0.5rem;
}

.emoji-item {
  background: none;
  border: none;
  font-size: 1.15rem;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color var(--transition-fast);
}

.emoji-item:hover {
  background-color: var(--bg-tertiary);
}

/* Fast fade transition */
.fade-fast-enter-active,
.fade-fast-leave-active {
  transition: opacity 0.15s ease;
}

.fade-fast-enter-from,
.fade-fast-leave-to {
  opacity: 0;
}
</style>
