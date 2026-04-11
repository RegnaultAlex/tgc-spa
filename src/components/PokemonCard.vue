<template>
  <div
    :class="[props.size, { enabled: isEnabled }, { limited: limitReached }]"
    style="
      display: flex;
      flex-direction: column;
      align-items: center;
      border-radius: 10px;
    "
    @click="changeCardState"
  >
    <NImage
      class="image"
      :src="props.card.imgUrl"
      :alt="props.card.name"
      :width="props.size === 'md' ? 150 : 100"
      preview-disabled
    />

    <span style="color: lightslategray">#{{ props.card.pokedexNumber }}</span>
    <span>{{ props.card.name }}</span>
    <span
      :style="{
        'background-color': typeColor,
        padding: '2px 5px',
        'border-radius': '5px',
      }"
    >
      {{ props.card.type }}
    </span>

    <div v-if="props.currentHP !== undefined" class="hp-bar-container">
      <div
        class="hp-bar-fill"
        :style="{ width: hpPercentage + '%', backgroundColor: hpColor }"
      ></div>
    </div>

    <div style="margin-bottom: 10px">
      <span>❤️{{ props.currentHP ?? props.card.hp }}</span>
      <span style="margin-left: 10px">⚔️{{ props.card.attack }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NImage } from 'naive-ui'
import { computed, ref, watch } from 'vue'

import { useColors } from '@/composables/useColors'
import type { Card } from '@/types'

const props = withDefaults(
  defineProps<{
    card: Card
    size?: string
    limitReached: boolean
    currentHP?: number
    selected?: boolean
  }>(),
  {
    size: 'md',
  },
)

const emit = defineEmits<{
  'toggle-enabled': [card: Card]
}>()

const color = useColors()
const typeColor: string = color.getTypeColor(props.card.type)

const isEnabled = ref(props.selected ?? false)

watch(
  () => props.selected,
  (newVal) => {
    isEnabled.value = newVal ?? false
  },
)

const hpPercentage = computed(() => {
  if (props.currentHP === undefined) return 100
  return Math.max(0, Math.min(100, (props.currentHP / props.card.hp) * 100))
})

const hpColor = computed(() => {
  if (hpPercentage.value > 50) return '#52c41a'
  if (hpPercentage.value > 20) return '#faad14'
  return '#f5222d'
})

const changeCardState = () => {
  if ((props.limitReached && isEnabled.value) || !props.limitReached) {
    isEnabled.value = !isEnabled.value
    emit('toggle-enabled', props.card)
  }
}
</script>

<style scoped>
.hp-bar-container {
  width: 80%;
  height: 8px;
  background-color: #e0e0e0;
  border-radius: 4px;
  margin: 8px 0;
  overflow: hidden;
  border: 1px solid #ccc;
}

.hp-bar-fill {
  height: 100%;
  transition:
    width 0.3s ease,
    background-color 0.3s ease;
}

.md,
.sm {
  border: 1px solid gray;
  transition: all 0.2s ease;
}

.md {
  width: 270px;
}
.sm {
  width: 120px;
}

div:hover:not(.image):not(.limited) {
  background-color: rgba(177, 212, 124, 0.379);
  cursor: pointer;
}

.enabled {
  background-color: rgba(177, 212, 124, 0.615);
  cursor: pointer;
  border: 2px solid green !important;
}

div > * {
  user-select: none;
}

.limited:not(.enabled) {
  opacity: 0.5;
  background-color: rgb(230, 230, 230);
  cursor: not-allowed;
  filter: grayscale(0.5);
}
</style>
