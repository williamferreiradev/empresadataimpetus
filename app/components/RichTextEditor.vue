<template>
  <div class="border border-gray-300 dark:border-zinc-600 dark:border-zinc-700 rounded-lg overflow-hidden bg-white dark:bg-zinc-800 dark:bg-zinc-900 flex flex-col">
    <!-- Toolbar -->
    <div v-if="editor" class="bg-gray-50 dark:bg-zinc-900 dark:bg-zinc-800 border-b border-gray-200 dark:border-zinc-700 p-2 flex flex-wrap gap-1 items-center">
      <button @click="editor.chain().focus().toggleHeading({ level: 1 }).run()" :class="{ 'bg-gray-200 text-gray-900 dark:bg-zinc-700 dark:text-zinc-100': editor.isActive('heading', { level: 1 }) }" class="p-1.5 rounded text-gray-600 dark:text-zinc-400 hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors" title="Título 1">
        <span class="font-bold">H1</span>
      </button>
      <button @click="editor.chain().focus().toggleHeading({ level: 2 }).run()" :class="{ 'bg-gray-200 text-gray-900 dark:bg-zinc-700 dark:text-zinc-100': editor.isActive('heading', { level: 2 }) }" class="p-1.5 rounded text-gray-600 dark:text-zinc-400 hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors" title="Título 2">
        <span class="font-bold">H2</span>
      </button>
      <button @click="editor.chain().focus().toggleHeading({ level: 3 }).run()" :class="{ 'bg-gray-200 text-gray-900 dark:bg-zinc-700 dark:text-zinc-100': editor.isActive('heading', { level: 3 }) }" class="p-1.5 rounded text-gray-600 dark:text-zinc-400 hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors" title="Título 3">
        <span class="font-bold">H3</span>
      </button>
      <div class="w-px h-6 bg-gray-300 dark:bg-zinc-600 mx-1"></div>
      <button @click="editor.chain().focus().toggleBold().run()" :class="{ 'bg-gray-200 text-gray-900 dark:bg-zinc-700 dark:text-zinc-100': editor.isActive('bold') }" class="p-1.5 rounded text-gray-600 dark:text-zinc-400 hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors" title="Negrito">
        <strong class="font-serif">B</strong>
      </button>
      <button @click="editor.chain().focus().toggleItalic().run()" :class="{ 'bg-gray-200 text-gray-900 dark:bg-zinc-700 dark:text-zinc-100': editor.isActive('italic') }" class="p-1.5 rounded text-gray-600 dark:text-zinc-400 hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors" title="Itálico">
        <em class="font-serif">I</em>
      </button>
      <button @click="editor.chain().focus().toggleUnderline().run()" :class="{ 'bg-gray-200 text-gray-900 dark:bg-zinc-700 dark:text-zinc-100': editor.isActive('underline') }" class="p-1.5 rounded text-gray-600 dark:text-zinc-400 hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors" title="Sublinhado">
        <u class="font-serif">U</u>
      </button>
      <div class="w-px h-6 bg-gray-300 dark:bg-zinc-600 mx-1"></div>
      <button @click="editor.chain().focus().toggleBulletList().run()" :class="{ 'bg-gray-200 text-gray-900 dark:bg-zinc-700 dark:text-zinc-100': editor.isActive('bulletList') }" class="p-1.5 rounded text-gray-600 dark:text-zinc-400 hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors" title="Lista de Marcadores">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M4 5a2 2 0 11-4 0 2 2 0 014 0zm8 0a1 1 0 011-1h6a1 1 0 110 2h-6a1 1 0 01-1-1zm-8 5a2 2 0 11-4 0 2 2 0 014 0zm8 0a1 1 0 011-1h6a1 1 0 110 2h-6a1 1 0 01-1-1zm-8 5a2 2 0 11-4 0 2 2 0 014 0zm8 0a1 1 0 011-1h6a1 1 0 110 2h-6a1 1 0 01-1-1z" clip-rule="evenodd" />
        </svg>
      </button>
      <button @click="editor.chain().focus().toggleOrderedList().run()" :class="{ 'bg-gray-200 text-gray-900 dark:bg-zinc-700 dark:text-zinc-100': editor.isActive('orderedList') }" class="p-1.5 rounded text-gray-600 dark:text-zinc-400 hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors" title="Lista Numerada">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-0.5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z" />
        </svg>
      </button>
      <button @click="editor.chain().focus().toggleBlockquote().run()" :class="{ 'bg-gray-200 text-gray-900 dark:bg-zinc-700 dark:text-zinc-100': editor.isActive('blockquote') }" class="p-1.5 rounded text-gray-600 dark:text-zinc-400 hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors" title="Citação">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z" clip-rule="evenodd" />
        </svg>
      </button>
      <div class="w-px h-6 bg-gray-300 dark:bg-zinc-600 mx-1"></div>
      <button @click="editor.chain().focus().undo().run()" class="p-1.5 rounded text-gray-600 dark:text-zinc-400 hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors" title="Desfazer">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" /></svg>
      </button>
      <button @click="editor.chain().focus().redo().run()" class="p-1.5 rounded text-gray-600 dark:text-zinc-400 hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors" title="Refazer">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>
      </button>
    </div>
    <!-- Editor Area -->
    <client-only>
      <editor-content :editor="editor" class="p-6 min-h-[500px] max-h-[800px] overflow-y-auto prose prose-sm sm:prose-base prose-orange dark:prose-invert max-w-none focus:outline-none bg-white dark:bg-zinc-800 dark:bg-zinc-900" />
    </client-only>
  </div>
</template>

<script setup>
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import { watch, onBeforeUnmount } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update:modelValue'])

const editor = useEditor({
  content: props.modelValue,
  extensions: [
    StarterKit,
    Underline,
  ],
  onUpdate: ({ editor }) => {
    emit('update:modelValue', editor.getHTML())
  },
  editorProps: {
    attributes: {
      class: 'focus:outline-none prose prose-sm sm:prose-base prose-orange dark:prose-invert max-w-none w-full h-full min-h-[500px]',
    },
  },
})

watch(() => props.modelValue, (value) => {
  if (!editor.value) return
  const isSame = editor.value.getHTML() === value
  if (!isSame) {
    editor.value.commands.setContent(value, false)
  }
})

onBeforeUnmount(() => {
  if (editor.value) {
    editor.value.destroy()
  }
})
</script>

<style>
.ProseMirror {
  outline: none;
}
.ProseMirror p.is-editor-empty:first-child::before {
  color: #adb5bd;
  content: "Digite o texto aqui ou cole de algum lugar...";
  float: left;
  height: 0;
  pointer-events: none;
}
</style>
