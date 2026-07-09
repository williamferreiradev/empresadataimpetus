import { useVueFlow } from '@vue-flow/core'

export function useCanvasNavigation() {
  const { fitView } = useVueFlow()

  function focusNode(nodeId: string) {
    fitView({
      nodes: [nodeId],
      duration: 1200,
      padding: 0.2
    })
  }

  return { focusNode }
}
