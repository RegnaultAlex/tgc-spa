<template>
  <NCard class="form-page">
    <NForm class="form" :rules="rules" :model="formValue">
      <NH1 style="margin-bottom: 10px">Connexion</NH1>

      <NFormItem label="Email" class="formitem" path="email">
        <NInput v-model:value="formValue.email" placeholder="votre@email.com" />
      </NFormItem>

      <NFormItem label="Mot de passe" class="formitem" path="password">
        <NInput
          v-model:value="formValue.password"
          type="password"
          show-password-on="mousedown"
          placeholder="Password"
        />
      </NFormItem>

      <NAlert v-if="auth.error">
        {{ auth.error }}
      </NAlert>

      <NFormItem>
        <NButton
          type="primary"
          class="formitem"
          attr-type="submit"
          :disabled="auth.loading"
          @click="SignIn"
          >Se connecter</NButton
        >
      </NFormItem>

      <NP
        >Pas encore de compte ?
        <NA @click="redirectToSignUp"><u>S'inscrire</u></NA></NP
      >
    </NForm>
  </NCard>
</template>

<script setup lang="ts">
import type { FormRules } from 'naive-ui'
import {
  NAlert,
  NButton,
  NCard,
  NForm,
  NFormItem,
  NH1,
  NInput,
  NP,
} from 'naive-ui'
import { type Ref, ref } from 'vue'

import router, { ROUTES } from '@/router'
import { useAuthStore } from '@/store/auth.store'
import type { SignInPayload } from '@/types'

const auth = useAuthStore()

const formValue: Ref<SignInPayload> = ref({
  email: '',
  password: '',
})

const redirectToSignUp = () => {
  router.push(ROUTES.SIGNUP)
}

const SignIn = async () => {
  if (formValue.value.email !== '' && formValue.value.password !== '') {
    await auth.SignIn(formValue.value)
    router.replace(ROUTES.HOME)
  }
}

const rules: FormRules = {
  email: {
    required: true,
    message: 'Veuillez entrer votre Email',
    trigger: ['blur', 'input'],
    type: 'email',
  },
  password: {
    required: true,
    message: 'Veuillez entrer votre mot de passe',
    trigger: ['blur', 'input'],
  },
}
</script>

<style scoped>
.form-page {
  border: none;
  width: 100%;
  display: flex;
  align-items: center;
}

.form {
  width: 500px;
  border: 1px solid gray;
  padding: 30px;
  margin-top: 100px;
}

.formitem {
  margin-top: 8px;
  width: 100%;
}
</style>
