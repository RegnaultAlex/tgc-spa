<template>
  <div>
    <NButton
      style="display: inline-block; margin-right: 20px"
      @click="router.back()"
    >
      Retour
    </NButton>

    <NH1 style="display: inline-block">Créer un deck</NH1>
  </div>

  <NH5>Nom du deck</NH5>
  <NInput v-model:value="deckName" placeholder="Mon super deck" />

  <NH6>{{ nbCardSelected }}/10 cartes sélectionnées</NH6>
  <NButton
    type="primary"
    style="width: 100%; margin-bottom: 20px"
    :disabled="deckName === '' || nbCardSelected < 10"
    @click="createDeck"
    >Créer le deck</NButton
  >

  <CardGrid
    :cards="cards ?? []"
    size="sm"
    @selected-cards="updateSelectedCard"
  />
</template>

<script setup lang="ts">
import { NButton, NH1, NInput } from 'naive-ui'
import { onMounted, ref } from 'vue'

import CardGrid from '@/components/CardGrid.vue'
import { useApi } from '@/composables/useApi'
import router from '@/router'
import type { Card } from '@/types'

const api = useApi()
const cards = ref<Card[]>()
const selectedPokemonCards = ref<number[]>([])
const nbCardSelected = ref<number>(0)

const updateSelectedCard = (selectedCards: Card[]) => {
  selectedPokemonCards.value = []
  selectedCards.forEach((e: Card) => {
    selectedPokemonCards.value.push(e.id)
  })
  nbCardSelected.value = selectedCards.length
}

const deckName = ref<string>('')

onMounted(async () => {
  cards.value = await api.getCards()
})

const createDeck = async () => {
  await api.createDeck({
    name: deckName.value,
    cards: selectedPokemonCards.value,
  })
  router.back()
}
</script>
