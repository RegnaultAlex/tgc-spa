<template>
  <div class="action-bar">
    <div class="turn-indicator">
      <NTag
        v-if="gameStore.isMyTurn"
        type="success"
        bordered
        style="background: white"
        >Votre tour</NTag
      >
      <NTag v-else bordered style="background: white">Tour adverse</NTag>
    </div>

    <div class="game-messages">
      {{ gameStore.gameMessages || 'En attente...' }}
    </div>

    <div class="action-buttons">
      <NButton :disabled="!gameStore.isMyTurn" @click="gameStore.drawCards">
        Piocher
      </NButton>

      <NButton
        type="error"
        :disabled="!gameStore.isMyTurn || !gameStore.playerBoard.activeCard"
        @click="gameStore.attack"
      >
        Attaquer
      </NButton>

      <NButton
        type="warning"
        :disabled="!gameStore.isMyTurn"
        @click="gameStore.endTurn"
      >
        Fin de tour
      </NButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NButton, NTag } from 'naive-ui'

import { useGameStore } from '@/store/game.store'

const gameStore = useGameStore()
</script>

<style scoped>
.action-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-top: 1px solid #f0f0f0;
  border-bottom: 1px solid #f0f0f0;
  background-color: white;
}

.turn-indicator {
  flex: 1;
}

.game-messages {
  flex: 2;
  text-align: center;
  font-style: italic;
  color: #666;
  font-size: 14px;
}

.action-buttons {
  flex: 1;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
