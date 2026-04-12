<template>
  <NModal
    :show="!!gameStore.gameResult"
    :mask-closable="false"
    :close-on-esc="false"
  >
    <NCard
      style="width: 400px; text-align: center"
      :bordered="false"
      size="huge"
      role="dialog"
      aria-modal="true"
    >
      <NResult
        :status="gameStore.gameResult === 'win' ? 'success' : 'error'"
        :title="gameStore.gameResult === 'win' ? 'Victoire ! ' : 'Défaite... '"
        :description="
          gameStore.gameResult === 'win'
            ? 'Félicitations, vous avez écrasé votre adversaire !'
            : 'Votre adversaire était trop fort cette fois-ci.'
        "
      >
        <template #footer>
          <NButton type="primary" size="large" @click="handleReturnHome">
            Retour à l'accueil
          </NButton>
        </template>
      </NResult>
    </NCard>
  </NModal>
</template>

<script setup lang="ts">
import { NButton, NCard, NModal, NResult } from 'naive-ui'
import { useRouter } from 'vue-router'

import { useGameStore } from '@/store/game.store'

const gameStore = useGameStore()
const router = useRouter()

const handleReturnHome = () => {
  gameStore.resetGame()
  router.push('/')
}
</script>
