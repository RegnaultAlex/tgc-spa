<template>
  <NCard class="play-card">
    <template v-if="!gameStore.currentRoomId">
      <NH2 style="margin: 0">Créer une partie</NH2>

      <div class="actions">
        <NSelect
          v-model:value="selectedDeck"
          :options="deckOptions"
          placeholder="Sélectionner un deck"
        />
        <NButton type="primary" :disabled="!selectedDeck" @click="handleCreate">
          Créer la partie
        </NButton>
      </div>
    </template>

    <template v-else>
      <NH2 style="margin: 0; color: #18a058">Partie active</NH2>

      <div class="actions">
        <span class="waiting-text">
          Partie #{{ gameStore.currentRoomId }} créée. En attente d'un
          adversaire...
        </span>
      </div>
    </template>
  </NCard>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

import { useApi } from '@/composables/useApi'
import { useGameStore } from '@/store/game.store'

const gameStore = useGameStore()
const api = useApi()

const selectedDeck = ref<number | null>(null)
const deckOptions = ref<{ label: string; value: number }[]>([])

onMounted(async () => {
  const decks = await api.getMyDecks()

  deckOptions.value = decks.map((d) => ({
    label: d.name,
    value: d.id,
  }))
})

const handleCreate = () => {
  if (selectedDeck.value) {
    gameStore.createRoom(selectedDeck.value.toString())
  }
}
</script>

<style scoped>
.play-card {
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 120px;
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-top: 15px;
}

.waiting-text {
  font-size: 14px;
  font-weight: 500;
  opacity: 0.9;
}
</style>
