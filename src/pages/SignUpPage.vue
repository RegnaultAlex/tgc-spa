<template>
  <NCard class="form-page">
    <NForm class="form" :rules="rules" :model="formValue">
      <NH1 style="margin-bottom: 10px">Inscription</NH1>

      <NFormItem label="Email" class="formitem" path="email">
        <NInput v-model:value="formValue.email" placeholder="votre@email.com" />
      </NFormItem>

      <NFormItem label="Nom d'utilisateur" class="formitem" path="username">
        <NInput v-model:value="formValue.username" placeholder="Pseudo" />
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
          @click="SignUp"
          >S'inscrire</NButton
        >
      </NFormItem>

      <NP
        >Déjà un compte ?
        <NA @click="redirectToSignIn"><u>Se connecter</u></NA></NP
      >
    </NForm>
  </NCard>
</template>

<script setup lang="ts">
import type { FormRules } from 'naive-ui'
import { NButton, NCard, NForm, NFormItem, NH1, NInput, NP } from 'naive-ui'
import { type Ref, ref } from 'vue'

import router, { ROUTES } from '@/router'
import { useAuthStore } from '@/store/auth.store'
import type { SignUpPayload } from '@/types'

const auth = useAuthStore()

const redirectToSignIn = () => {
  router.push(ROUTES.LOGIN)
}

const formValue: Ref<SignUpPayload> = ref({
  email: '',
  password: '',
  username: '',
})

const SignUp = async () => {
  if (
    formValue.value.email !== '' &&
    formValue.value.password !== '' &&
    formValue.value.username !== ''
  ) {
    await auth.SignUp(formValue.value)
    router.replace(ROUTES.HOME)
  }
}

const rules: FormRules = {
  email: {
    required: true,
    message: 'Veuillez entrer un Email',
    trigger: ['blur', 'input'],
    type: 'email',
  },
  password: {
    required: true,
    message: 'Veuillez entrer un mot de passe',
    trigger: ['blur', 'input'],
  },
  username: {
    required: true,
    message: "Vueillez entrer un nom d'utilisateur",
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
