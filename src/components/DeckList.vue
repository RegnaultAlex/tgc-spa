<template>
  <div class="deck-list-container">
    <NCard v-for="deck in decks" :key="deck.id" class="play-card">
      <NH2>{{ deck.name }}</NH2>

      <div style="display: flex; align-items: center">
        <CardGrid :cards="getCardsForDeck(deck)" size="md" />
      </div>

      <div
        class="buttons"
        style="position: relative; bottom: 0; margin-top: 10px"
      >
        <NButton @click="editDeck(deck.id)">Modifier</NButton>
        <NButton @click="detailsDeck(deck.id)">Détails</NButton>
        <NButton type="error" @click="removeDeck(deck.id)">Supprimer</NButton>
      </div>
    </NCard>
  </div>
</template>

<script setup lang="ts">
import { NButton } from 'naive-ui'
import { onBeforeMount, ref } from 'vue'

import { useApi } from '@/composables/useApi'
import router, { ROUTES } from '@/router'
import type { Card } from '@/types'
import { type Deck } from '@/types'

import CardGrid from './CardGrid.vue'

const api = useApi()
const decks = ref<Deck[]>([])
const cards = ref<Card[]>([])

onBeforeMount(async () => {
  decks.value = await api.getMyDecks()
  cards.value = await api.getCards()
})

const getCardsForDeck = (deck: Deck) => {
  const idsInDeck = deck.cards.map((dc) => dc.cardId)
  return cards.value.filter((card) => idsInDeck.includes(card.id))
}

const editDeck = (deckId: number) => {
  sessionStorage.setItem('currentDeckId', String(deckId))
  router.push(ROUTES.EDIT_DECK)
}

const detailsDeck = (deckId: number) => {
  sessionStorage.setItem('currentDeckId', String(deckId))
  router.push(ROUTES.DETAILS_DECK)
}

const removeDeck = (deckId: number) => {
  api.deleteDeck(deckId)
  decks.value = decks.value.filter((d) => d.id !== deckId)
}
</script>

<style scoped>
.buttons > * {
  margin-right: 20px;
  margin-bottom: 15px;
}
</style>
