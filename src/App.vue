<template>
  <NConfigProvider>
    <NMessageProvider>
      <NLayout>
        <HeaderBar v-if="isAuth" />
        <NLayoutContent>
          <RouterView />
        </NLayoutContent>
      </NLayout>
    </NMessageProvider>
  </NConfigProvider>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import HeaderBar from './components/layout/HeaderBar.vue'
import { useAuthStore } from './store/auth.store'

const auth = useAuthStore()

const isAuth = computed(() => {
  return auth.isAuthenticated
})
</script>

<style>
body {
  padding: 0 20px;
}
</style>
