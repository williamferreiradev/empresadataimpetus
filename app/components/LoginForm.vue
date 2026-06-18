<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <BaseInput
      id="email"
      label="Email"
      type="email"
      v-model="email"
      placeholder="seu@email.com"
      required
    >
      <template #icon>
        <EnvelopeIcon class="h-5 w-5 text-gray-400" />
      </template>
    </BaseInput>

    <div v-if="mode === 'login'">
      <BaseInput
        id="password"
        label="Senha"
        type="password"
        v-model="password"
        placeholder="••••••••"
        required
      >
        <template #icon>
          <LockClosedIcon class="h-5 w-5 text-gray-400" />
        </template>
      </BaseInput>
    </div>

    <div v-if="error" class="text-sm text-red-600 bg-red-50 p-3 rounded-md">
      {{ error }}
    </div>

    <div v-if="successMsg" class="text-sm text-emerald-600 bg-emerald-50 p-3 rounded-md">
      {{ successMsg }}
    </div>

    <div class="flex items-center justify-between" v-if="mode === 'login'">
      <div class="text-sm">
        <a href="#" @click.prevent="mode = 'reset'" class="font-medium text-emerald-600 hover:text-emerald-500">
          Esqueceu a senha?
        </a>
      </div>
    </div>

    <div class="flex items-center justify-between" v-if="mode === 'reset'">
      <div class="text-sm">
        <a href="#" @click.prevent="mode = 'login'" class="font-medium text-emerald-600 hover:text-emerald-500">
          Voltar para o login
        </a>
      </div>
    </div>

    <BaseButton type="submit" fullWidth :loading="loading">
      {{ mode === 'login' ? 'Entrar' : 'Enviar email de recuperação' }}
    </BaseButton>
  </form>
</template>

<script setup>
import { ref } from 'vue'
import { EnvelopeIcon, LockClosedIcon } from '@heroicons/vue/24/outline'

const supabase = useSupabaseClient()
const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')
const successMsg = ref('')
const mode = ref('login') // 'login' or 'reset'

const emit = defineEmits(['success'])

async function handleSubmit() {
  error.value = ''
  successMsg.value = ''
  loading.value = true

  try {
    if (mode.value === 'login') {
      const { data, error: err } = await supabase.auth.signInWithPassword({
        email: email.value,
        password: password.value,
      })
      if (err) throw err
      emit('success')
    } else {
      const { error: err } = await supabase.auth.resetPasswordForEmail(email.value, {
        redirectTo: `${window.location.origin}/password/update`,
      })
      if (err) throw err
      successMsg.value = 'Email de recuperação enviado! Verifique sua caixa de entrada.'
    }
  } catch (err) {
    error.value = err.message || 'Ocorreu um erro'
  } finally {
    loading.value = false
  }
}
</script>
