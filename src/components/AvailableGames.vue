<template>
  <NCard class="play-card">
    <NH2>Parties disponibles</NH2>

    <NEmpty
      v-if="filteredRooms.length === 0"
      description="Aucune partie disponible pour l'instant."
    ></NEmpty>

    <div v-else class="room-list">
      <div v-for="room in filteredRooms" :key="room.id" class="room-item">
        <span>Partie #{{ room.id }}</span>
        <div class="join-actions">
          <NSelect
            v-model:value="selectedDecks[room.id]"
            :options="deckOptions"
            placeholder="Choisir un deck"
            style="width: 200px"
          ></NSelect>
          <NButton
            type="primary"
            :disabled="!selectedDecks[room.id]"
            @click="handleJoin(room.id)"
          >
            Rejoindre
          </NButton>
        </div>
      </div>
    </div>
  </NCard>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

import { useApi } from '@/composables/useApi'
import { useGameStore } from '@/store/game.store'

const gameStore = useGameStore()
const api = useApi()

const selectedDecks = ref<Record<string, number>>({})
const deckOptions = ref<{ label: string; value: number }[]>([])

onMounted(async () => {
  const decks = await api.getMyDecks()
  deckOptions.value = decks.map((d) => ({ label: d.name, value: d.id }))
})

const filteredRooms = computed(() => {
  return gameStore.rooms.filter(
    (room) => String(room.id) !== String(gameStore.currentRoomId),
  )
})

const handleJoin = (roomId: string) => {
  const deckId = selectedDecks.value[roomId]
  if (deckId) {
    gameStore.joinRoom(roomId, deckId.toString())
  }
}
</script>

<style scoped>
.play-card {
  min-height: 120px;
}
.room-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}
.room-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}
.join-actions {
  display: flex;
  gap: 10px;
}
</style>
