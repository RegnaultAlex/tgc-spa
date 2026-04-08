<template>
  <NCard class="play-card">
    <NH2>Créer une partie</NH2>
    <NSelect placeholder="Sélectionner un deck"></NSelect>
    <NButton type="primary" style="max-width: 140px">Créer la partie</NButton>
  </NCard>
</template>

<script setup lang="ts"></script>

<style scoped>
.play-card {
  display: flex;
  gap: 20px;
}
</style>
