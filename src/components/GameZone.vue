<template>
  <div class="game-zone">
    <div class="zone-header">
      <span class="zone-title">{{ title }}</span>
      <NTag class="score-tag">{{ board.score }}/3 KO</NTag>
    </div>

    <div class="active-card-area">
      <template v-if="board.activeCard">
        <PokemonCard :card="board.activeCard" :limit-reached="false" />
      </template>

      <div v-else class="empty-slot">Aucune carte</div>
    </div>

    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { NTag } from 'naive-ui'

import PokemonCard from '@/components/PokemonCard.vue'
import type { PlayerBoard } from '@/store/game.store'

defineProps<{
  board: PlayerBoard
  title: string
}>()
</script>

<style scoped>
.game-zone {
  padding: 20px;
  background-color: white;
  width: 100%;
}

.zone-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.zone-title {
  font-weight: 700;
  font-size: 16px;
  color: #333;
}

.score-tag {
  font-weight: 500;
  background-color: white;
  border: 1px solid #e0e0e6;
  color: #333;
}

.active-card-area {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 250px;
}

.empty-slot {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 160px;
  height: 220px;
  border: 1px dashed #ccc;
  border-radius: 8px;
  color: #999;
  font-size: 14px;
}
</style>
