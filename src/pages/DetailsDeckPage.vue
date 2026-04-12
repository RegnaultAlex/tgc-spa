<template>
  <div>
    <div>
      <NButton
        style="display: inline-block; margin-right: 20px"
        @click="router.back()"
      >
        Retour
      </NButton>
      <NH1 style="display: inline-block">{{ deckName }}</NH1>
    </div>

    <NH5>Cartes du deck</NH5>
    <NH6>{{ selectedPokemonCards.length }}/10 cartes</NH6>

    <NButton
      type="primary"
      style="width: 100%; margin-bottom: 20px"
      @click="goToEdit"
    >
      Modifier
    </NButton>

    <CardGrid
      v-if="allCards.length > 0 && selectedPokemonCards.length > 0"
      :cards="selectedPokemonCards"
      size="md"
      :search-bar="true"
    />
    <div v-else>Chargement du deck...</div>
  </div>
</template>

<script setup lang="ts">
import { NButton, NH1, NH5, NH6 } from 'naive-ui'
import { onBeforeMount, ref } from 'vue'

import CardGrid from '@/components/CardGrid.vue'
import { useApi } from '@/composables/useApi'
import router, { ROUTES } from '@/router'
import type { Card } from '@/types'

const api = useApi()
const allCards = ref<Card[]>([])
const selectedPokemonCards = ref<Card[]>([])
const deckName = ref('')
const deckId = ref<number | null>(null)

onBeforeMount(async () => {
  try {
    const id = sessionStorage.getItem('currentDeckId')

    if (!id) {
      router.push(ROUTES.HOME)
      return
    }

    deckId.value = Number(id)
    const cardsRes = await api.getCards()
    allCards.value = cardsRes

    const deck = await api.getDeck(Number(id))
    deckName.value = deck.name

    const idsInDeck = deck.cards.map((dc) => dc.cardId)
    selectedPokemonCards.value = cardsRes.filter((card) =>
      idsInDeck.includes(card.id),
    )
  } catch (_e) {
    router.push(ROUTES.HOME)
  }
})

const goToEdit = () => {
  router.push(ROUTES.EDIT_DECK)
}
</script>
