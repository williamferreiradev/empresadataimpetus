# 🧠 Memória Técnica — Impetus Canvas

> Documento completo com todos os pedidos feitos, como foram implementados, a arquitetura do projeto e guia prático para dar continuidade.

---

## Índice

1. [Visão Geral do Projeto](#1-visão-geral-do-projeto)
2. [Stack Tecnológica](#2-stack-tecnológica)
3. [Arquitetura de Arquivos](#3-arquitetura-de-arquivos)
4. [Design System](#4-design-system)
5. [Histórico de Pedidos e Implementações](#5-histórico-de-pedidos-e-implementações)
6. [Estado Atual do Projeto](#6-estado-atual-do-projeto)
7. [Guia Prático para Continuidade](#7-guia-prático-para-continuidade)
8. [Problemas Conhecidos e Débitos Técnicos](#8-problemas-conhecidos-e-débitos-técnicos)

---

## 1. Visão Geral do Projeto

**Impetus Canvas** é um app de mapas mentais interativos com canvas infinito. O usuário pode:

- Criar, renomear e deletar mapas mentais
- Editar nós (nodes) no canvas com duplo-clique
- Conectar nós com arestas (edges) customizáveis
- Colapsar/expandir ramos inteiros da árvore
- Adicionar subnodes diretamente pelo card do nó
- Selecionar múltiplos nós com marquee selection (arrastar mouse)
- Navegar em modo slide (apresentação) entre os nós
- Gerar mapas a partir de Markdown (página `/docs`)
- Trocar formas dos nós (retângulo, sticky note, círculo)
- Adicionar emojis como ícones de nós
- Painel lateral de detalhes com editor Markdown

---

## 2. Stack Tecnológica

| Tecnologia | Versão | Uso |
|---|---|---|
| **Nuxt 4** | `^4.4.8` | Framework fullstack (SSR desabilitado) |
| **Vue 3** | `^3.5.39` | Framework reativo de UI |
| **Vue Flow** | `^1.48.2` | Engine do canvas infinito |
| **Vue Flow Node Resizer** | `^1.5.1` | Redimensionamento de nós |
| **Vue Flow Node Toolbar** | `^1.1.1` | Toolbar flutuante nos nós |
| **Rough.js** | `^4.6.6` | Renderização hand-drawn dos nós (SVG) |
| **Lucide Vue Next** | `^1.0.0` | Biblioteca de ícones SVG |
| **Markdown-it** | `^14.3.0` | Parser de Markdown para HTML |
| **TypeScript** | `^7.0.2` | Tipagem estática |

### Configuração Nuxt (`nuxt.config.ts`)

```ts
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  ssr: false,           // ← SPA mode (localStorage, canvas)
  css: ['~/assets/css/main.css'],
  devtools: { enabled: true }
})
```

> **SSR está desabilitado** porque o projeto depende de `localStorage` e APIs do browser (canvas, SVG).

---

## 3. Arquitetura de Arquivos

```
mapas/
├── app/
│   ├── app.vue                          # Entry point (<NuxtPage />)
│   ├── assets/css/main.css              # Design system global
│   ├── components/
│   │   ├── CanvasRoot.vue               # Canvas principal (~1135 linhas)
│   │   ├── CustomNode.vue               # Componente de nó com Rough.js (~599 linhas)
│   │   ├── CustomEdge.vue               # Aresta customizada SVG
│   │   ├── DetailPanel.vue              # Painel lateral de edição
│   │   ├── EmojiPicker.vue              # Seletor de emojis inline
│   │   ├── MapList.vue                  # Sidebar + cards de mapas
│   │   └── NavBar.vue                   # Barra de navegação
│   ├── composables/
│   │   ├── useMapStorage.ts             # CRUD de mapas no localStorage
│   │   └── useCanvasNavigation.ts       # Helper de navegação
│   ├── pages/
│   │   ├── index.vue                    # Redireciona para MapList
│   │   ├── docs.vue                     # Gerador de mapa via Markdown
│   │   ├── links.vue                    # Página link-in-bio
│   │   └── mapas/[id].vue              # Canvas de um mapa específico
│   └── types/
│       └── canvas.ts                    # Tipos CanvasNode, CanvasEdge, MapData, MapMeta
├── nuxt.config.ts
├── package.json
└── SDD-infinite-canvas (1).md          # Documento de design original
```

### Fluxo de Dados

```
localStorage
    ↕ (JSON)
useMapStorage.ts (composable)
    ↕ (refs reativas)
CanvasRoot.vue (orquestrador)
    ↕ (props/events)
CustomNode.vue + CustomEdge.vue + DetailPanel.vue
```

**Persistência**: Tudo é salvo em `localStorage` com debounce de 500ms:
- `maps:index` → array de `MapMeta[]` (id, nome, data)
- `map:{id}` → `MapData` completo (nodes + edges)

---

## 4. Design System

### Paleta de Cores (CSS Variables em `main.css`)

| Variable | Valor | Uso |
|---|---|---|
| `--bg-primary` | `#050811` | Fundo principal (void escuro) |
| `--bg-secondary` | `#0d111c` | Cards e painéis |
| `--bg-tertiary` | `#192033` | Bordas e elementos sutis |
| `--text-primary` | `#f1f5f9` | Texto principal |
| `--text-secondary` | `#94a3b8` | Texto secundário |
| `--text-muted` | `#475569` | Texto desativado |
| `--accent-primary` | `#cc5533` | **Laranja Claude** (cor principal) |
| `--accent-hover` | `#e26a4a` | Hover do accent |
| `--accent-success` | `#059669` | Emerald (sucesso) |
| `--accent-warning` | `#d97706` | Amber (aviso) |
| `--accent-danger` | `#dc2626` | Vermelho (perigo) |

### Categorias de Nós (Cores)

| Categoria | Variable | Cor |
|---|---|---|
| `core` | `--color-cat-core` | `#cc5533` (laranja) |
| `vertical` | `--color-cat-vertical` | `#10b981` (verde) |
| `oferta` | `--color-cat-oferta` | `#f59e0b` (amarelo) |
| `outbound` | `--color-cat-outbound` | `#ec4899` (pink) |
| `posicionamento` | `--color-cat-posicionamento` | `#84cc16` (lime) |

### Tipografia

- **Display**: `Outfit` (headings, títulos)
- **Sans**: `Inter` (corpo, labels, buttons)

### Tokens de Espaçamento/Efeitos

- Shadows: Minimalista — `--shadow-sm` e `--shadow-md` são `none`
- Borders: `rgba(255, 255, 255, 0.08)` (ultra sutil)
- Radius: `4px` / `6px` / `8px`
- Transitions: `0.12s ease` (fast) / `0.2s cubic-bezier` (normal)

---

## 5. Histórico de Pedidos e Implementações

---

### Pedido 1: Biblioteca de Emojis

> *"é bom ter uma biblioteca de emojis pra poder colocar também"*

**O que foi feito:**
- Criado o componente `EmojiPicker.vue` com 32 emojis populares pré-selecionados
- Implementação como dropdown posicionável (`placement: top | bottom`)
- Click-outside fecha o picker automaticamente
- Integrado em: `MapList.vue` (nome do mapa), `docs.vue` (título), `CustomNode.vue` (emoji do nó)

**Arquivos modificados:**
- `app/components/EmojiPicker.vue` — **NOVO**
- `app/components/MapList.vue` — integração no input de nome
- `app/components/CustomNode.vue` — emoji visual no nó
- `app/types/canvas.ts` — campo `emoji?: string` na interface `CanvasNode`

**Como funciona tecnicamente:**
```vue
<EmojiPicker @select="(emoji) => mapTitle += emoji" />
```
O picker emite o evento `select` com a string do emoji. O componente pai decide o que fazer com ele.

---

### Pedido 2: Componentes

> *"e os componentes?"*

**O que foi feito:**
Revisão e criação da componentização completa:

| Componente | Responsabilidade |
|---|---|
| `CanvasRoot.vue` | Orquestrador do canvas: VueFlow, toolbar, slides, CRUD de nós/edges |
| `CustomNode.vue` | Nó individual: Rough.js SVG, edição inline, handles, collapse, shape |
| `CustomEdge.vue` | Aresta SVG: bezier/straight/step, estilos, cores |
| `DetailPanel.vue` | Painel lateral: editar label, categoria, shape, conteúdo Markdown |
| `EmojiPicker.vue` | Seletor de emojis reutilizável |
| `MapList.vue` | Sidebar lateral com lista de mapas, criar/renomear/deletar |
| `NavBar.vue` | Barra de navegação superior |

---

### Pedido 3: Animação de Slide (collapse → expand)

> *"a animação do slide tem que ser dos nós abrindo com tudo fechado, quando eu clico no slide primeiro fecha depois vai abrindo"*

**O que foi feito:**
Implementada a lógica de apresentação em `CanvasRoot.vue`:

```ts
function focusSlide(index: number) {
  // 1. Colapsa TODOS os nós
  nodes.value.forEach(n => { n.data.isCollapsed = true })
  
  // 2. Expande apenas os ancestrais do nó alvo
  expandAncestors(node.id)
  updateHiddenStates()
  
  // 3. Faz fitView com animação de 800ms no nó alvo
  fitView({ nodes: [node.id], duration: 800, padding: 0.3 })
  
  // 4. Após 900ms, expande o nó alvo (filhos aparecem)
  setTimeout(() => {
    targetNode.data.isCollapsed = false
    updateHiddenStates()
  }, 900)
}
```

**Funções auxiliares criadas:**
- `expandAncestors(nodeId)` — percorre recursivamente as edges de baixo pra cima e descolapsa cada pai
- `getDescendants(nodeId)` — retorna todos os IDs filhos recursivamente
- `isNodeHidden(nodeId)` — checa se algum ancestral está colapsado
- `updateHiddenStates()` — aplica `hidden` em todos os nós/edges baseado no estado de collapse

**Navegação de slides:**
- `nextSlide()` / `prevSlide()` — incrementa/decrementa o índice
- `orderedNodes` — computed que ordena nós por `position.x` (esquerda → direita)

---

### Pedido 4: Trocar azul para laranja Claude

> *"troque esse azul para o laranja cor Claude"*

**O que foi feito:**
Substituição global da paleta de accent em `main.css`:

```css
/* ANTES */
--accent-primary: #0ea5e9;  /* Sky blue */
--accent-hover: #38bdf8;

/* DEPOIS */
--accent-primary: #cc5533;  /* Claude clay orange */
--accent-hover: #e26a4a;    /* Claude light orange */
```

**Todos os CSS variables que dependiam do azul foram atualizados:**
- `--shadow-glow` → `rgba(204, 85, 51, 0.1)`
- `--color-cat-core` → `#cc5533`
- Botões `.btn-primary`, inputs `:focus`, borders, etc.

---

### Pedido 5: Menu lateral em vez de mapas no centro

> *"faz uma espécie de menu lateral em vez de ter aquilo no meio somente os mapas"*

**O que foi feito:**
Refatoração completa do `MapList.vue`:

**ANTES**: Layout centralizado com cards em grid no meio da tela.
**DEPOIS**: Sidebar lateral fixa à esquerda com:
- Header com logo/marca
- Input de busca com ícone `Search`
- Botão de criar mapa com ícone `PlusCircle`
- Lista scrollável de mapas como cards compactos
- Cada card mostra: nome, data de criação, botões de ação (renomear, abrir, deletar)
- Área principal à direita para conteúdo futuro ou preview

**Estrutura CSS:**
```css
.map-list-layout {
  display: flex;
  width: 100vw;
  height: 100vh;
}

.sidebar { width: 340px; border-right: 1px solid rgba(255,255,255,0.05); }
.main-content { flex: 1; }
```

---

### Pedido 6: Bug fix

> *"ficou bugado"*

**O que foi feito:**
Correções de bugs visuais e de lógica introduzidos durante a refatoração da sidebar:
- Ajuste de z-index e overflow
- Fix de event handlers duplicados
- Correção de estilos quebrados por conflito de CSS scoped

---

### Pedido 7: Biblioteca de ícones — substituir emojis por Lucide

> *"use uma biblioteca de ícones e substitua todos esses emojis"*

**O que foi feito:**
Migração completa de emojis nativos para **Lucide Vue Next** em todos os componentes:

| Componente | Antes (Emoji) | Depois (Lucide) |
|---|---|---|
| `CustomNode.vue` | `➕ ✖️ 🚫 ▼ ▲` | `Plus, Trash2, Ban, ChevronDown, ChevronUp` |
| `CanvasRoot.vue` | `🔲 📝 ⚪ 📄 ⛶ 🗑 ◀ ▶ ➕ 🖱 ✋` | `Square, StickyNote, Circle, FileText, Maximize, Trash2, ChevronLeft/Right, Plus, MousePointer, Hand` |
| `DetailPanel.vue` | `➕ 🗑` | `Plus, Trash2` |
| `MapList.vue` | `✏️ ➕ 📄 🔍 📂 ✅ ❌ →` | `PenTool, PlusCircle, FileText, Search, FolderOpen, Check, X, ArrowRight, Plus` |
| `EmojiPicker.vue` | `😀` trigger | `Smile` (Lucide) |
| `docs.vue` | `⬅ ✅ ⚠️` | `ArrowLeft, Check, AlertTriangle` |

**Padrão de import:**
```ts
import { Plus, Trash2, Ban } from 'lucide-vue-next'
```

**Padrão de uso no template:**
```vue
<Plus :size="14" />
<Trash2 :size="16" class="mr-1" />
```

---

### Pedido 8: Botão de criar subnode no card do nó

> *"tem que ter um botão pra clicar no próprio card e gerar um subnode"*

**O que foi feito:**
Adicionado botão `+` na borda direita de cada `CustomNode.vue`:

```vue
<button class="add-subnode-toggle" @click.stop="emitAddSubnode" title="Criar sub-nó">
  <Plus :size="14" />
</button>
```

**Lógica completa:**
1. `CustomNode.vue` recebe `onAddSubnode` callback via `props.data`
2. Ao clicar no `+`, chama `emitAddSubnode()` que invoca o callback
3. `CanvasRoot.vue` executa `handleAddSubnode(parentId)`:
   - Cria um novo nó posicionado à direita do pai (`+260px` em X, com leve variação em Y)
   - Cria uma edge automática ligando pai → filho
   - Herda dimensões e callbacks do pai

**Posicionamento do botão (CSS):**
```css
.add-subnode-toggle {
  position: absolute;
  right: -12px;
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--bg-secondary);
  border: 1px solid rgba(255,255,255,0.1);
  /* aparece só no hover do nó */
}
```

---

### Pedido 9: Marquee Selection (arrastar pra selecionar múltiplos nós)

> *"e a possibilidade selecionar vários de uma vez segurando o botão esquerdo do mouse e arrastando"*

**O que foi feito:**
Implementados dois modos de interação no toolbar vertical do `CanvasRoot.vue`:

| Modo | Ícone | `panOnDrag` | Comportamento |
|---|---|---|---|
| **Selecionar** | `MousePointer` | `false` | Arrastar = marquee selection (retângulo de seleção) |
| **Mover** | `Hand` | `true` | Arrastar = pan/arrastar o canvas |

**Implementação:**
```ts
const panOnDrag = ref(true) // default: modo pan

// No template do VueFlow:
<VueFlow :pan-on-drag="panOnDrag" selection-key-code="" ... />
```

**Toolbar:**
```vue
<button :class="{ active: !panOnDrag }" @click="panOnDrag = false">
  <MousePointer :size="18" />  <!-- Modo selecionar -->
</button>
<button :class="{ active: panOnDrag }" @click="panOnDrag = true">
  <Hand :size="18" />  <!-- Modo mover -->
</button>
```

Quando `panOnDrag = false`, o Vue Flow ativa automaticamente o modo de seleção por retângulo ao arrastar com o mouse.

---

### Pedido 10: Fix de erros TypeScript no docs.vue

> *"@[docs.vue:current_problems]"*

**O que foi feito:**
Corrigidos erros de TypeScript causados pela refatoração do template:

**Problema**: O template referenciava `showModal` e `modalMessage` que não estavam definidos como `ref()` no script setup.

**Fix aplicado:**
```ts
const mapTitle = ref('Meu Mapa por Documento')
const showModal = ref(false)      // ← ADICIONADO
const modalMessage = ref('')       // ← ADICIONADO
const markdownText = ref(...)
```

---

## 6. Estado Atual do Projeto

### ✅ Funcionalidades Implementadas

- [x] CRUD de mapas (criar, renomear, deletar)
- [x] Canvas infinito com zoom/pan
- [x] Nós customizados com Rough.js (hand-drawn)
- [x] 3 formas de nó: retângulo, sticky note, círculo
- [x] Edição inline de labels (duplo-clique)
- [x] Edges customizáveis (bezier, straight, step)
- [x] 3 estilos de edge: normal, dashed, dotted
- [x] Cores por edge
- [x] Collapse/expand de ramos
- [x] Modo slide (apresentação com animação)
- [x] Marquee selection + modo pan
- [x] Botão de subnode no card
- [x] Emoji picker
- [x] Ícones Lucide (sem emojis nativos na UI)
- [x] Painel lateral de detalhes (Markdown)
- [x] Geração de mapa a partir de Markdown (`/docs`)
- [x] Persistência em localStorage com auto-save
- [x] Design system com paleta laranja Claude
- [x] Página link-in-bio (`/links`)

### 📐 Tipos TypeScript Completos

```ts
// types/canvas.ts

interface CanvasNode {
  id: string
  label: string
  position: { x: number; y: number }
  category: 'core' | 'vertical' | 'oferta' | 'outbound' | 'posicionamento' | string
  content: string        // Markdown renderizado no DetailPanel
  shape?: 'rectangle' | 'sticky' | 'circle'
  width?: number         // default: 180
  height?: number        // default: 80
  collapsed?: boolean
  emoji?: string
}

interface CanvasEdge {
  id: string
  source: string
  target: string
  label?: string
  routing?: 'bezier' | 'straight' | 'step'
  styleType?: 'normal' | 'dashed' | 'dotted'
  color?: string
}

interface MapData {
  nodes: CanvasNode[]
  edges: CanvasEdge[]
}

interface MapMeta {
  id: string
  name: string
  createdAt: string      // ISO string
}
```

---

## 7. Guia Prático para Continuidade

### Como rodar o projeto

```bash
cd c:\Users\matheus\Downloads\mapas
npm install
npm run dev
# → http://localhost:3000
```

### Como adicionar um novo componente de nó

1. Crie `app/components/MeuNovoNode.vue`
2. Registre em `CanvasRoot.vue`:
   ```ts
   import MeuNovoNode from './MeuNovoNode.vue'
   const nodeTypes = { custom: CustomNode, meuNovo: MeuNovoNode }
   ```
3. Ao criar um nó, use `type: 'meuNovo'` em vez de `type: 'custom'`

### Como adicionar uma nova propriedade a nós

1. Adicione o campo em `types/canvas.ts` → interface `CanvasNode`
2. Inclua no `data` do nó em `CanvasRoot.vue`:
   - No `onMounted()` (carregamento do mapa)
   - No `handlePaneDblClick()` (criação de novo nó)
   - No `handleAddSubnode()` (criação de subnode)
3. Mapeie na serialização em `triggerSave()` para persistir
4. Exponha no `DetailPanel.vue` se for editável pelo usuário
5. Use no `CustomNode.vue` via `props.data.novaProp`

### Como adicionar um novo tipo de edge

1. Adicione à union `routing` em `types/canvas.ts`
2. Implemente a lógica SVG/path em `CustomEdge.vue`
3. Adicione opção no `DetailPanel.vue` select de routing

### Como mudar o tema de cores

Edite apenas `app/assets/css/main.css`:
```css
:root {
  --accent-primary: #SUA_COR;
  --accent-hover: #SUA_COR_HOVER;
  --color-cat-core: #SUA_COR;
  /* ... */
}
```

### Como a persistência funciona (useMapStorage)

```
useMapStorage.ts
├── listMaps()          → lê localStorage['maps:index'] → MapMeta[]
├── getMap(id)          → lê localStorage['map:{id}']   → MapData
├── saveMap(id, data)   → grava MapData como JSON
├── createMap(name)     → gera UUID, atualiza index, retorna id
├── renameMap(id, name) → atualiza o nome no index
└── deleteMap(id)       → remove do index + remove dados do mapa
```

**Auto-save**: `CanvasRoot.vue` observa `[nodes, edges]` com `watch(..., { deep: true })` e chama `triggerSave()` com debounce de 500ms.

---

## 8. Problemas Conhecidos e Débitos Técnicos

### 🔴 Críticos

| Problema | Local | Detalhes |
|---|---|---|
| `saveMap` assinatura inconsistente | `docs.vue` L175-177 | `useMapStorage` espera `saveMap(id, MapData)` mas `docs.vue` chama `saveMap(id, nodes, edges)` — precisa ser `saveMap(id, { nodes: [...], edges: [...] })` |

### 🟡 Melhorias Pendentes

| Item | Descrição |
|---|---|
| **Export/Import** | Não há export para JSON/PNG. Implementar com `html-to-image` ou `toPng()` do Vue Flow |
| **Undo/Redo** | Não há histórico de ações. Implementar com stack de estados ou `useManualRefHistory` do VueUse |
| **Colaboração** | Tudo é local. Para multi-user, migrar para Supabase ou Firebase Realtime |
| **Busca no canvas** | Não há busca por label/conteúdo dentro do canvas aberto |
| **Minimap** | Vue Flow tem `@vue-flow/minimap` — só instalar e integrar |
| **Temas** | Apenas dark mode. Adicionar light mode com toggle de CSS variables |
| **Mobile** | Layout não é responsivo para touch/mobile |
| **Testes** | Zero testes. Adicionar Vitest para unit + Playwright para E2E |

### 🟢 Dicas de Performance

- `Rough.js` renderiza SVG a cada mudança — considerar memoização com `computed` ou `shallowRef`
- `updateHiddenStates()` percorre todos os nós recursivamente — pode ser O(n²) com hierarquias profundas
- `watch(..., { deep: true })` nos nodes/edges pode ser pesado com muitos nós — considerar `watchDebounced` do VueUse

---

## Changelog Resumido

| Data | Mudança |
|---|---|
| 2026-07-08 | Projeto criado com Nuxt 4 + Vue Flow + Rough.js |
| 2026-07-08 | Implementado `EmojiPicker.vue` |
| 2026-07-08 | Componentização completa (7 componentes) |
| 2026-07-08 | Animação de slide (collapse all → expand path → reveal children) |
| 2026-07-08 | Paleta trocada de azul sky para laranja Claude (`#cc5533`) |
| 2026-07-08 | `MapList` refatorado para sidebar lateral |
| 2026-07-08 | Bug fixes de layout e eventos |
| 2026-07-08 | Migração completa de emojis → Lucide icons em todos os componentes |
| 2026-07-08 | Botão de subnode `+` na borda direita do `CustomNode` |
| 2026-07-08 | Marquee selection + modo pan/select no toolbar vertical |
| 2026-07-08 | Fix TypeScript em `docs.vue` (`showModal`/`modalMessage` refs faltando) |
| 2026-07-08 | Criada página link-in-bio (`/links`) |

---

> **Este documento serve como snapshot completo do projeto.** Qualquer agente AI ou desenvolvedor pode ler este arquivo e continuar o desenvolvimento com contexto total.
