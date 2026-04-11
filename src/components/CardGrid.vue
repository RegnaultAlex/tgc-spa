<template>
  <div
    style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap"
  >
    <PokemonCard
      v-for="pokemon in props.cards"
      :key="pokemon.id"
      :card="pokemon"
      :size="size ?? 'md'"
      :selected="selectedPokemon.includes(pokemon)"
      :limit-reached="selectedPokemon.length >= 10"
      @toggle-enabled="togglePokemon"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

import type { Card } from '@/types'

import PokemonCard from './PokemonCard.vue'

const props = defineProps<{
  cards: Card[]
  size?: string
  initialSelection?: Card[]
}>()

const emit = defineEmits<(e: 'selected-cards', cards: Card[]) => void>()

const selectedPokemon = ref<Card[]>([])

watch(
  () => props.initialSelection,
  (newVal) => {
    if (newVal) {
      selectedPokemon.value = [...newVal]
    }
  },
  { immediate: true },
)

const togglePokemon = (card: Card) => {
  const index = selectedPokemon.value.findIndex((p) => p.id === card.id)

  if (index === -1) {
    if (selectedPokemon.value.length < 10) {
      selectedPokemon.value.push(card)
    }
  } else {
    selectedPokemon.value.splice(index, 1)
  }

  emit('selected-cards', selectedPokemon.value)
}
</script>
