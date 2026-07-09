# SDD — Impetus Canvas
### Software Design Document — v1 (multi-mapa, storage local)

**Versão:** 2.0
**Relacionado a:** PRD-infinite-canvas.md
**Substitui:** SDD-infinite-canvas.md v1.0 (single-tenant estático)

---

## 1. Visão geral da arquitetura

Aplicação front-end pura. Sem servidor de API, sem banco remoto nesta fase. Cada mapa é um documento JSON (`{ nodes, edges }`) persistido no `localStorage` do navegador. Múltiplos mapas coexistem, identificados por `id`.

```
┌───────────────────────────────────────────────┐
│                  Nuxt (SPA)                    │
│                                                 │
│  ┌───────────┐      ┌────────────────────────┐│
│  │  Vue Flow  │◄────►│  useMapStorage()       ││
│  │  (canvas + │      │  (composable de acesso ││
│  │  viewport) │      │  a dados — abstração)  ││
│  └─────┬──────┘      └───────────┬────────────┘│
│        │                         │              │
│  ┌─────▼──────┐         ┌────────▼──────────┐  │
│  │ CustomNode │         │   localStorage     │  │
│  │ CustomEdge │         │   maps:index        │  │
│  │ (Rough.js) │         │   map:{id}           │  │
│  └────────────┘         └──────────────────────┘  │
│                                                 │
│  ┌─────────────┐   ┌───────────────────────┐ │
│  │  MapList     │   │  NavBar → fitView()    │ │
│  │  (/mapas)    │   │  (dentro de cada mapa)  │ │
│  └─────────────┘   └───────────────────────┘ │
└───────────────────────────────────────────────┘
```

Decisão central desta versão: **todo acesso a dados passa por um composable único (`useMapStorage`)**. Nenhum componente fala com `localStorage` diretamente. Isso é o que permite trocar o storage por Neon/API depois sem tocar em `CanvasRoot`, `NavBar`, `CustomNode`, etc.

## 2. Stack técnica

| Camada | Escolha | Motivo |
|---|---|---|
| Framework | Nuxt/Vue 3 | Consistência com o ecossistema já usado na Data Impetus |
| Motor de canvas | Vue Flow | Gerencia pan/zoom/nós/arestas nativamente |
| Estética hand-drawn | Rough.js | Bordas/setas com efeito de rascunho, via custom node/edge |
| Storage | `localStorage` via composable (`useMapStorage`) | Zero setup, zero infra, uso local/pessoal por enquanto |
| Estado local | Vue reactivity (`ref`/`reactive`) | Suficiente pro tamanho do app; Pinia opcional se crescer |
| Deploy | Vercel/Netlify (SPA estática) ou só local (`nuxt dev`) | Sem backend, não exige nada além de servir arquivos estáticos |

**Fora da stack por enquanto (deliberado):** Neon, Supabase, qualquer server route no Nitro. Entram quando o projeto migrar de "uso local" pra "precisa sincronizar entre dispositivos/pessoas" — ver seção 8.

## 3. Modelo de dados

### 3.1 Estrutura no localStorage

```
maps:index                  → [{ id, name, createdAt }]
map:{id}                    → { nodes: CanvasNode[], edges: CanvasEdge[] }
```

### 3.2 Tipos

```typescript
interface CanvasNode {
  id: string
  label: string
  position: { x: number; y: number }
  category: 'core' | 'vertical' | 'oferta' | 'outbound' | 'posicionamento' | string
  content: string // markdown, renderizado no painel de detalhe
}

interface CanvasEdge {
  id: string
  source: string
  target: string
  label?: string
}

interface MapData {
  nodes: CanvasNode[]
  edges: CanvasEdge[]
}

interface MapMeta {
  id: string
  name: string
  createdAt: string
}
```

## 4. Camada de dados — `useMapStorage`

Único ponto de contato com persistência. A superfície pública é o que importa — a implementação interna é o que muda quando trocar de storage.

```typescript
// composables/useMapStorage.ts
export function useMapStorage() {
  function listMaps(): MapMeta[] {
    const raw = localStorage.getItem('maps:index')
    return raw ? JSON.parse(raw) : []
  }

  function getMap(id: string): MapData {
    const raw = localStorage.getItem(`map:${id}`)
    return raw ? JSON.parse(raw) : { nodes: [], edges: [] }
  }

  function saveMap(id: string, data: MapData): void {
    localStorage.setItem(`map:${id}`, JSON.stringify(data))
  }

  function createMap(name: string): string {
    const id = crypto.randomUUID()
    const index = listMaps()
    index.push({ id, name, createdAt: new Date().toISOString() })
    localStorage.setItem('maps:index', JSON.stringify(index))
    saveMap(id, { nodes: [], edges: [] })
    return id
  }

  function renameMap(id: string, name: string): void {
    const index = listMaps().map(m => m.id === id ? { ...m, name } : m)
    localStorage.setItem('maps:index', JSON.stringify(index))
  }

  function deleteMap(id: string): void {
    const index = listMaps().filter(m => m.id !== id)
    localStorage.setItem('maps:index', JSON.stringify(index))
    localStorage.removeItem(`map:${id}`)
  }

  return { listMaps, getMap, saveMap, createMap, renameMap, deleteMap }
}
```

**Regra de arquitetura:** nenhum componente chama `localStorage.*` diretamente. Sempre via `useMapStorage()`. Isso é o contrato que garante migração barata (seção 8).

## 5. Componentes

### 5.1 `<MapList>` (página `/mapas` ou `/`)
- Chama `listMaps()` no mount.
- Renderiza grid/lista com nome + data de criação.
- Botão "novo mapa" → `createMap(nome)` → navega pra `/mapas/{id}`.
- Ação de deletar/renomear por mapa.

### 5.2 `<CanvasRoot>` (página `/mapas/[id]`)
- No mount, chama `getMap(id)` e popula `nodes`/`edges` reativos do Vue Flow.
- Escuta mudanças no canvas (arrastar nó, criar aresta, editar label) e persiste via `saveMap(id, data)` — com debounce (ex: 500ms) pra não gravar a cada pixel de drag.
- Renderiza `<NavBar>` e `<DetailPanel>`.

### 5.3 `<CustomNode>`
- Renderiza retângulo com Rough.js (seed fixo por nó, cacheado — não regenerar a cada render).
- Cor por `category`.
- `@click` → abre `DetailPanel` com o `content`.
- Editável no MVP local: duplo-clique no label permite renomear inline (grava via `saveMap` com debounce).

### 5.4 `<CustomEdge>`
- Path customizado com Rough.js sobreposto ao path base do Vue Flow.

### 5.5 `<NavBar>`
- Gerada dinamicamente a partir dos `nodes` do mapa carregado (não é mais hardcoded pensando só no Operating System).
- `@click` em cada botão → `fitView({ nodes: [nodeId], duration: 1200, padding: 0.2 })`.

### 5.6 `<DetailPanel>`
- Painel lateral/modal com o `content` do nó (markdown → HTML via `markdown-it`).

## 6. Animações (câmera)

Sem mudança em relação à versão anterior — isso é 100% client-side e independe de onde os dados moram.

```
Usuário clica botão na NavBar
        │
        ▼
navegarParaSecao(nodeId)
        │
        ▼
fitView({ nodes: [nodeId], duration: 1200, padding: 0.2 })
        │
        ▼
Vue Flow anima pan+zoom até enquadrar o nó
```

`duration` e `padding` ajustáveis por gosto. `useVueFlow()` expõe `fitView`/`setCenter` — não precisa gerenciar estado de câmera manualmente.

## 7. Estrutura de arquivos

```
/pages
  index.vue                  → <MapList>
  mapas/[id].vue              → <CanvasRoot>
/components
  MapList.vue
  CanvasRoot.vue
  CustomNode.vue
  CustomEdge.vue
  NavBar.vue
  DetailPanel.vue
/composables
  useMapStorage.ts            → única porta de entrada pra dados
  useCanvasNavigation.ts       → wrapper em torno de fitView/setCenter
/types
  canvas.ts                   → CanvasNode, CanvasEdge, MapData, MapMeta
```

## 8. Caminho de migração (quando sair do "local")

Porque tudo passa por `useMapStorage`, migrar pra Neon (ou outro) é trocar só o **interior** das 6 funções — a assinatura (`listMaps`, `getMap`, `saveMap`, `createMap`, `renameMap`, `deleteMap`) não muda, e nenhum componente é tocado.

```typescript
// versão futura, mesma interface:
async function getMap(id: string): Promise<MapData> {
  return await $fetch(`/api/maps/${id}`)
}
async function saveMap(id: string, data: MapData): Promise<void> {
  await $fetch(`/api/maps/${id}`, { method: 'PUT', body: data })
}
```

Único ajuste real: as funções passam a ser `async`, o que propaga `await` pros componentes que as chamam — mudança mecânica, não arquitetural. Nessa migração entra Nitro server routes + `@neondatabase/serverless`.

**Não implementar nada da seção 8 agora.** Está aqui só pra garantir que a decisão de hoje (local) não vira parede quando o projeto crescer.

## 9. Riscos técnicos

| Item | Risco | Mitigação |
|---|---|---|
| Rough.js + Vue Flow | Integração não é nativa; pode custar tempo | Prototipar 1 nó isolado antes de aplicar em todos |
| Re-render de Rough.js a cada pan/zoom | Formas randomizadas recalculadas destroem performance | Gerar path/seed uma vez, cachear por nó |
| localStorage por navegador | Não sincroniza entre dispositivos, se perde ao limpar dados do browser | Aceito como limitação conhecida da fase atual; documentado, não é bug |
| Debounce de save mal calibrado | Salvar de menos perde progresso; salvar de mais degrada performance no drag | Começar com 500ms, ajustar no uso real |
| Migração futura esquecer o contrato do composable | Alguém acessa `localStorage` direto em algum componente novo, quebrando a abstração | Regra de arquitetura explícita (seção 4) — revisão de código deve pegar isso |
