<template>
  <div class="container">
    <NH1>Jouer</NH1>

    <div class="play-div">
      <CreateGame class="component" />

      <AvailableGames class="component" />
    </div>

    <div class="deck-div">
      <div
        style="
          display: flex;
          width: 100%;
          justify-content: space-between;
          margin-top: 10px;
        "
      >
        <NH1>Mes decks</NH1>
        <NButton
          type="primary"
          style="margin-top: 15px"
          @click="redirectToCreatePage"
          >+ Nouveau deck</NButton
        >
      </div>

      <DeckList class="component" />
    </div>
  </div>
</template>

<script setup lang="ts">
import AvailableGames from '@/components/AvailableGames.vue'
import CreateGame from '@/components/CreateGame.vue'
import DeckList from '@/components/DeckList.vue'
import router, { ROUTES } from '@/router'

const redirectToCreatePage = () => {
  router.push(ROUTES.CREATE_DECK)
}
</script>

<style scoped>
.play-div {
  display: flex;
  gap: 30px;
}
</style>
