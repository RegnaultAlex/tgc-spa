<template>
  <NInput
    v-if="props.searchBar"
    v-model:value="searchBarValue"
    placeholder="Rechercher"
    style="margin-bottom: 15px"
    clearable
  />

  <div
    style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap"
  >
    <PokemonCard
      v-for="pokemon in filteredCards"
      :key="pokemon.id"
      :card="pokemon"
      :size="size ?? 'md'"
      :selected="selectedPokemon.some((p) => p.id === pokemon.id)"
      :limit-reached="selectedPokemon.length >= 10"
      @toggle-enabled="togglePokemon"
    />
  </div>
</template>

<script setup lang="ts">
import { NInput } from 'naive-ui'
import { computed, ref, watch } from 'vue'

import type { Card } from '@/types'

import PokemonCard from './PokemonCard.vue'

const props = defineProps<{
  cards: Card[]
  size?: string
  initialSelection?: Card[]
  searchBar?: boolean
}>()

const emit = defineEmits(['selected-cards'])

const selectedPokemon = ref<Card[]>([])
const searchBarValue = ref('')

const filteredCards = computed(() => {
  if (!searchBarValue.value.trim()) {
    return props.cards
  }

  const search = searchBarValue.value.toLowerCase()

  return props.cards.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(search),
  )
})

watch(
  () => props.initialSelection,
  (newVal) => {
    if (newVal) selectedPokemon.value = [...newVal]
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

  emit('selected-cards', [...selectedPokemon.value])
}
</script>
