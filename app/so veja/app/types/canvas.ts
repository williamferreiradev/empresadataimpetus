export interface CanvasNode {
  id: string
  label: string
  position: { x: number; y: number }
  category: 'core' | 'vertical' | 'oferta' | 'outbound' | 'posicionamento' | string
  content: string // markdown, rendered in detail panel
  shape?: 'rectangle' | 'sticky' | 'circle'
  width?: number
  height?: number
  collapsed?: boolean
  emoji?: string
}

export interface CanvasEdge {
  id: string
  source: string
  target: string
  label?: string
  routing?: 'bezier' | 'straight' | 'step'
  styleType?: 'normal' | 'dashed' | 'dotted'
  color?: string
}

export interface MapData {
  nodes: CanvasNode[]
  edges: CanvasEdge[]
}

export interface MapMeta {
  id: string
  name: string
  createdAt: string
}
