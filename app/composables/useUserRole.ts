export const useUserRole = () => {
  const user = useSupabaseUser()
  const supabase = useSupabaseClient()
  
  // Estado global para cachear os papéis do usuário logado e não sobrecarregar o DB
  const userRoles = useState<string[]>('user_roles', () => [])
  const userFullName = useState<string>('user_full_name', () => '')
  const isRolesLoaded = useState<boolean>('is_roles_loaded', () => false)

  const fetchRoles = async () => {
    // No Supabase V2, useSupabaseUser retorna os claims, onde o ID é a propriedade 'sub'
    const userId = user.value?.sub || user.value?.id
    
    if (!userId) {
      userRoles.value = []
      userFullName.value = ''
      isRolesLoaded.value = false
      return []
    }
    
    // Se já carregou na sessão atual, retorna do cache
    if (isRolesLoaded.value) {
      return userRoles.value
    }
    
    try {
      console.log('Buscando papéis para o usuário ID:', userId)
      const { data, error } = await supabase
        .from('profiles')
        .select('papeis, full_name')
        .eq('id', userId)
        .single()
        
      console.log('Resultado DB - Data:', data, 'Error:', error)
        
      if (!error && data) {
        userRoles.value = data.papeis || []
        userFullName.value = data.full_name || user.value?.email?.split('@')[0] || 'Usuário'
        isRolesLoaded.value = true
        console.log('Papéis carregados com sucesso:', userRoles.value)
      } else if (error) {
        console.error('Erro retornado pelo Supabase:', error)
      }
    } catch (e) {
      console.error('Erro ao buscar papéis do usuário:', e)
    }
    
    return userRoles.value
  }

  const clearRoles = () => {
    userRoles.value = []
    userFullName.value = ''
    isRolesLoaded.value = false
  }

  // Limpa o cache automaticamente caso o usuário deslogue
  watch(user, (newUser) => {
    if (!newUser) {
      clearRoles()
    }
  })

  return {
    userRoles,
    userFullName,
    isRolesLoaded,
    fetchRoles,
    clearRoles,
    // Verifica se possui um dos papéis requeridos ou é AdmDono
    hasRole: (allowedRoles: string[]) => {
      let roles = userRoles.value || []
      
      // Se por acaso o banco retornar uma string como "{Comercial}" ou "['Comercial']", vamos forçar pra array
      if (typeof roles === 'string') {
        roles = (roles as string).replace(/[{}[\]"']/g, '').split(',').map(r => r.trim())
      }

      // Limpar sujeiras (espaços e aspas) caso venham como array
      if (Array.isArray(roles)) {
        roles = roles.map((r: any) => typeof r === 'string' ? r.replace(/[{}[\]"']/g, '').trim() : r)
      } else {
        roles = [roles]
      }
      
      console.log('[DEBUG hasRole] Roles do Usuário (Limpas):', roles, ' | Requeridos:', allowedRoles)

      if (roles.includes('AdmDono')) return true
      return roles.some((role: string) => allowedRoles.includes(role))
    }
  }
}
