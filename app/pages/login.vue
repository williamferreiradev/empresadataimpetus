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
// Removed useSupabaseCookieRedirect() as we have saveRedirectToCookie: false

watch(user, () => {
  if (user.value) {
    navigateTo('/')
  }
}, { immediate: true })

function onLoginSuccess() {
  navigateTo('/')
}
</script>
