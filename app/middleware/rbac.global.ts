export default defineNuxtRouteMiddleware(async (to, from) => {
  const user = useSupabaseUser()

  // O controle de papéis só ocorre se o usuário estiver logado.
  // Usuários deslogados são barrados pelo middleware de autenticação principal.
  if (!user.value) return

  const { userRoles, fetchRoles, hasRole } = useUserRole()

  // Mapa de Acessos (Módulo/Prefixo da Rota -> Papéis Permitidos)
  // Obs: O AdmDono tem acesso automático a tudo via useUserRole.
  const roleRules = [
    { prefix: '/marketing', allowedRoles: ['Marketing'] },
    { prefix: '/comercial', allowedRoles: ['Comercial'] },
    { prefix: '/pre-vendas', allowedRoles: ['Pré-vendas'] },
    { prefix: '/customer-success', allowedRoles: ['Customer Success'] },
    { prefix: '/entrega', allowedRoles: ['Entrega'] },
    { prefix: '/financeiro', allowedRoles: ['Financeiro'] },
    { prefix: '/administrativo', allowedRoles: ['Administrativo'] }
  ]

  // Verifica se a rota atual se enquadra em alguma das regras protegidas
  const rule = roleRules.find(r => to.path.startsWith(r.prefix))

  if (!rule) {
    // Se a rota for a raiz (Dashboard), vamos verificar os papéis e redirecionar direto se houver apenas 1
    if (to.path === '/') {
      await fetchRoles()
      const acessiveis = roleRules.filter(r => hasRole(r.allowedRoles))
      
      // AdmDono tem acesso a todos os 7, então não redireciona automático
      if (acessiveis.length === 1) {
        console.log('[RBAC] Redirecionamento automático da Home para:', acessiveis[0].prefix)
        return navigateTo(acessiveis[0].prefix)
      }
    }
    
    // Se não houver regra específica para a rota, acesso livre.
    return
  }

  // Busca/Garante os papéis do usuário no banco (com cache da sessão)
  await fetchRoles()

  // Avalia se o usuário tem pelo menos um dos papéis necessários para a rota
  const hasAccess = hasRole(rule.allowedRoles)
  console.log(`[RBAC] Avaliando rota ${to.path}. Papéis necessários:`, rule.allowedRoles, ' | Papéis do usuário:', userRoles.value, ' | Acesso permitido?', hasAccess)

  if (!hasAccess) {
    console.warn(`[RBAC] Acesso bloqueado para a rota ${to.path}. O usuário não possui o setor correto.`)

    // Bloqueia e redireciona para a Home
    return navigateTo('/')
  }
})