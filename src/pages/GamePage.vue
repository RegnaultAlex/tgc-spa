<template>
  <div class="game-container">
    <GameZone :board="gameStore.opponentBoard" title="Adversaire" />

    <ActionBar />

    <GameZone :board="gameStore.playerBoard" title="Vous">
      <div class="hand-section">
        <p class="hand-title">
          Main ({{ gameStore.playerBoard.hand?.length || 0 }}/5)
        </p>

        <div class="hand-cards">
          <div v-if="!gameStore.playerBoard.hand?.length" class="empty-hand">
            Votre main est vide
          </div>

          <div
            v-for="card in gameStore.playerBoard.hand"
            :key="card.id"
            class="hand-card-wrapper"
            @click="gameStore.playCard(card.id)"
          >
            <PokemonCard :card="card" :limit-reached="false" />
          </div>
        </div>

        <p class="deck-title">
          Deck : {{ gameStore.playerBoard.deckCount || 0 }} cartes
        </p>
      </div>
    </GameZone>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

import ActionBar from '@/components/ActionBar.vue'
import GameZone from '@/components/GameZone.vue'
import PokemonCard from '@/components/PokemonCard.vue'
import router from '@/router'
import { useGameStore } from '@/store/game.store'

const gameStore = useGameStore()

onMounted(() => {
  if (!gameStore.currentRoomId) {
    router.push('/')
  }
})
</script>

<style scoped>
.game-container {
  display: flex;
  flex-direction: column;
  max-width: 1200px;
  margin: 0 auto;
  min-height: calc(100vh - 80px);
  background-color: #fafafc;
}

.hand-section {
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  width: 100%;
}

.hand-title {
  color: #666;
  font-size: 14px;
  margin-bottom: 10px;
}

.deck-title {
  color: #666;
  font-size: 14px;
  margin-top: 10px;
}

.hand-cards {
  display: flex;
  gap: 15px;
  overflow-x: auto;
  padding-bottom: 10px;
}

.hand-card-wrapper {
  cursor: pointer;
  transition: transform 0.2s ease;
}

.hand-card-wrapper:hover {
  transform: translateY(-10px);
}

.empty-hand {
  padding: 40px;
  border: 1px dashed #ccc;
  width: 100%;
  text-align: center;
  color: #999;
  border-radius: 8px;
}
</style>
