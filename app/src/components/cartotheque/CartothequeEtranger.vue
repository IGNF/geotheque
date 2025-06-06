<template>
  <div>
    <div v-if="!activeSubCategory" class="sub-categories">
      <div
        v-for="sub in subCategories"
        :key="sub.id"
        class="sub-category"
        @click="$emit('select-sub-category', sub.id)"
      >
        <SvgIcon v-if="mdiIcons[sub.icon]" :path="mdiIcons[sub.icon]" type="mdi" class="icon" />
        <span>{{ sub.title }}</span>
      </div>
    </div>

    <div v-if="!activeSubCategory">
      <div class="search-header">Cliquer sur l'un des onglets pour effectuer une recherche :</div>
      <div class="search-options">
        <div class="search-option">
          <SvgIcon :path="mdiIcons.feuille" type="mdi" class="icon" />
          <span>par feuille(s) au 1:50 000</span>
        </div>
        <div class="search-option">
          <SvgIcon :path="mdiIcons.pays" type="mdi" class="icon" />
          <span>par pays</span>
        </div>
        <div class="search-option">
          <SvgIcon :path="mdiIcons.point" type="mdi" class="icon" />
          <span>par pointé sur la carte</span>
        </div>
      </div>
    </div>

    <FeuilleSearch v-if="activeSubCategory === 'feuilles'" @close="$emit('close-sub-category')" />

    <PaysSearch v-if="activeSubCategory === 'pays'" @close="$emit('close-sub-category')" />

    <PointSearch
      v-if="activeSubCategory === 'point'"
      @close="$emit('close-sub-category')"
      @go-to-point="goToPoint"
    />
  </div>
</template>

<script setup>
import { watch } from 'vue'
import PointSearch from '@/components/material/PointSearch.vue'
import FeuilleSearch from '@/components/material/FeuilleSearch.vue'
import PaysSearch from '@/components/material/PaysSearch.vue'
import { eventBus } from '@/components/composable/eventBus'
import { useScanStore } from '@/components/store/scan'

import { mdiLeaf, mdiEarth, mdiCrosshairsGps } from '@mdi/js'

const scanStore = useScanStore()

const mdiIcons = {
  feuille: mdiLeaf,
  pays: mdiEarth,
  point: mdiCrosshairsGps,
}

const props = defineProps({
  activeSubCategory: {
    type: String,
    default: null,
  },
  subCategories: {
    type: Array,
    required: true,
  },
})

defineEmits(['select-sub-category', 'close-sub-category'])

/**
 * Met à jour la bbox dans le store
 * @param point 
 */
function goToPoint(point) {
  if (point.bboxMercator) {
    scanStore.updateBbox(point.bboxMercator)
  }
}

watch(
  () => props.activeSubCategory,
  (newVal) => {
    eventBus.emit('toggle-pin', newVal === 'point')
  },
)
</script>

<style scoped>
.sub-categories {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-top: 20px;
}

.sub-category {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  padding: 15px;
  border-radius: 5px;
  transition:
    background-color 0.3s,
    transform 0.3s;
}

.sub-category:hover {
  background-color: #f0f0f0;
  transform: scale(1.05);
}

.search-header {
  margin-top: 20px;
  margin-bottom: 10px;
  padding: 5px;
  font-size: 14px;
  color: #666;
}

.search-options {
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-left: 5px;
}

.search-option {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 5px;
}

.search-option span {
  font-size: 14px;
  color: #444;
}

.icon {
  font-size: 24px;
  color: #739614;
  transition:
    color 0.3s,
    font-size 0.3s;
}

.sub-category:hover .icon {
  color: #4caf50;
  font-size: 28px;
}

.sub-category span {
  font-size: 15px;
  color: #333;
  transition: color 0.3s;
}

.sub-category:hover span {
  color: #4caf50;
}
</style>
