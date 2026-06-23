<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        Entre na sua conta
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        Ou faça login para acessar o sistema
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-100">
        <LoginForm @success="onLoginSuccess" />
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: false
})

const user = useSupabaseUser()
const supabase = useSupabaseClient()
const router = useRouter()

watch(user, async () => {
  if (user.value) {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('papeis')
        .eq('id', user.value.id)
        .single()

      if (profile && profile.papeis && profile.papeis.length === 1) {
        const p = profile.papeis[0]
        if (p === 'Comercial') return router.push('/comercial')
        if (p === 'Pré-vendas') return router.push('/pre-vendas')
        if (p === 'Marketing') return router.push('/marketing')
        if (p === 'Entrega') return router.push('/entrega')
        if (p === 'Customer Success') return router.push('/cs')
        if (p === 'Financeiro') return router.push('/financeiro')
        if (p === 'Administrativo') return router.push('/administrativo')
      }
    } catch (e) {
      console.error('Erro ao buscar papel:', e)
    }
    router.push('/')
  }
}, { immediate: true })

function onLoginSuccess() {
  // O watcher já vai cuidar do redirecionamento assim que o user for preenchido
}
</script>
