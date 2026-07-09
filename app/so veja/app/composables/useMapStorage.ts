import type { MapMeta, MapData } from '../types/canvas'

export function useMapStorage() {
  function listMaps(): MapMeta[] {
    if (typeof window === 'undefined') return []
    const raw = localStorage.getItem('maps:index')
    return raw ? JSON.parse(raw) : []
  }

  function getMap(id: string): MapData {
    if (typeof window === 'undefined') return { nodes: [], edges: [] }
    const raw = localStorage.getItem(`map:${id}`)
    return raw ? JSON.parse(raw) : { nodes: [], edges: [] }
  }

  function saveMap(id: string, data: MapData): void {
    if (typeof window === 'undefined') return
    localStorage.setItem(`map:${id}`, JSON.stringify(data))
  }

  function createMap(name: string): string {
    if (typeof window === 'undefined') return ''
    const id = crypto.randomUUID()
    const index = listMaps()
    index.push({ id, name, createdAt: new Date().toISOString() })
    localStorage.setItem('maps:index', JSON.stringify(index))
    saveMap(id, { nodes: [], edges: [] })
    return id
  }

  function renameMap(id: string, name: string): void {
    if (typeof window === 'undefined') return
    const index = listMaps().map(m => m.id === id ? { ...m, name } : m)
    localStorage.setItem('maps:index', JSON.stringify(index))
  }

  function deleteMap(id: string): void {
    if (typeof window === 'undefined') return
    const index = listMaps().filter(m => m.id !== id)
    localStorage.setItem('maps:index', JSON.stringify(index))
    localStorage.removeItem(`map:${id}`)
  }

  return { listMaps, getMap, saveMap, createMap, renameMap, deleteMap }
}
