<template>
  <NLayoutHeader
    bordered
    style="padding: 0 24px; position: sticky; top: 0; z-index: 100"
  >
    <NSpace justify="space-between" align="center" style="height: 56px">
      <NSpace align="center" :size="16">
        <RouterLink to="/">TCG SPA</RouterLink>
        <NButton
          tag="a"
          :href="`${apiBaseUrl.replace('/api', '')}/api-docs`"
          target="_blank"
          text
          size="small"
        >
          API Docs
        </NButton>
        <NButton
          tag="a"
          href="https://making-rerun-61323218.figma.site/"
          target="_blank"
          text
          size="small"
        >
          Maquettes
        </NButton>
      </NSpace>
      <NSpace align="center" :size="16">
        <NText depth="3">{{ auth.username }}</NText>
        <NButton size="small" @click="Logout">Déconnexion</NButton>
      </NSpace>
    </NSpace>
  </NLayoutHeader>
</template>

<script setup lang="ts">
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL as string
import router, { ROUTES } from '@/router'
import { useAuthStore } from '@/store/auth.store'
const auth = useAuthStore()

const Logout = () => {
  auth.Logout()
  router.replace(ROUTES.LOGIN)
}
</script>
