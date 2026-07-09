<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
const mapId = route.params.id as string
</script>

<template>
  <CanvasRoot :map-id="mapId" />
</template>
