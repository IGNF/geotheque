<template>
  <div class="critere-selection">
    <form class="criteria-form" @submit.prevent="handleSubmit">
      <div class="form-row" v-if="isCartotheque">
        <FormInput class="half" label="Année min." id="yearMin" v-model="formData.yearMin" />
        <FormInput class="half" label="Année max." id="yearMax" v-model="formData.yearMax" />
      </div>

      <div class="form-row" v-if="isCartotheque">
        <ComboInput
          class="half"
          label="Echelle min."
          id="scaleMin"
          v-model="formData.scaleMin"
          :options="scaleOptions"
          :showOptions="showScaleMinOptions"
          @toggle="showScaleMinOptions = !showScaleMinOptions"
          @select="selectScaleMin"
          @hide="showScaleMinOptions = false"
        />
        <ComboInput
          class="half"
          label="Echelle max."
          id="scaleMax"
          v-model="formData.scaleMax"
          :options="scaleOptions"
          :showOptions="showScaleMaxOptions"
          @toggle="showScaleMaxOptions = !showScaleMaxOptions"
          @select="selectScaleMax"
          @hide="showScaleMaxOptions = false"
        />
      </div>

      <div class="form-row" v-if="isPhototheque">
        <ComboInput
          class="half"
          label="Commanditaire"
          id="commanditaire"
          v-model="formData.commanditaire"
          :options="commanditaireOptions"
          :showOptions="showCommanditaireOptions"
          @toggle="showCommanditaireOptions = !showCommanditaireOptions"
          @select="selectCommanditaire"
          @hide="showCommanditaireOptions = false"
          @input="updateCommanditaireOptions"
        />

        <ComboInput
          class="half"
          label="Producteur"
          id="producteur"
          v-model="formData.producteur"
          :options="producteurOptions"
          :showOptions="showProducteurOptions"
          @toggle="showProducteurOptions = !showProducteurOptions"
          @select="selectProducteur"
          @hide="showProducteurOptions = false"
          @input="updateProducteurOptions"
        />
      </div>

      <Dropdown
        v-if="isCartotheque"
        nameDropdown="Collections"
        :options="collectionsOptions"
        @update:selected="updateSelectedCollection"
        :defaultValue="collectionsOptions[0]"
      />

      <div class="form-row" v-if="isPhototheque">
        <Dropdown
          v-if="isPhototheque"
          class="half"
          nameDropdown="Support"
          :options="supportOptions"
          @update:selected="updateSelectedSupport"
          :defaultValue="supportOptions[0]"
        />

        <Dropdown
          v-if="isPhototheque"
          class="half"
          nameDropdown="Emulsion"
          :options="emulsionOptions"
          @update:selected="updateSelectedEmulsion"
          :defaultValue="emulsionOptions[0]"
        />
      </div>

      <Alert
        :show="noResultsFound"
        type="warning"
        title="Aucun résultat"
        dismissible
        :duration="4000"
        @close="noResultsFound = false"
      >
        Aucun résultat trouvé. Veuillez modifier vos critères de recherche.
      </Alert>

      <div class="button-group">
        <button type="button" class="button reset-button" @click="resetForm">
          <SvgIcon :path="mdiRefresh" type="mdi" />
          <span>Réinitialiser</span>
        </button>

        <button type="submit" class="button search-button">
          <SvgIcon :path="mdiMagnify" type="mdi" />
          <span>Rechercher</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import Dropdown from '@/components/material/Dropdown.vue'
import FormInput from '@/components/material/FormInput.vue'
import ComboInput from '@/components/material/ComboInput.vue'
import { eventBus } from '@/components/composable/eventBus'
import { useScanStore } from '@/components/store/scan'
import { storeToRefs } from 'pinia'
import { mdiRefresh, mdiMagnify } from '@mdi/js'
import Alert from '../material/Alert.vue'

const scanStore = useScanStore()
const {
  storeURL,
  storeCritereSelection,
  activeTab,
  collectionsOptions,
  supportOptions,
  emulsionOptions,
  storeScansData,
} = storeToRefs(scanStore)
const noResultsFound = ref(false)

/**
 * Vérifie si des résultats ont été trouvés
 */
const checkResults = () => {
  if (!storeScansData.value || storeScansData.value.length === 0) {
    noResultsFound.value = true
  } else {
    noResultsFound.value = false
  }
}

/**
 * Détermine si l'onglet actif est la cartothèque
 */
const isCartotheque = computed(() =>
  ['cartotheque', 'cartotheque_etranger'].includes(activeTab.value),
)

/**
 * Détermine si l'onglet actif est la photothèque
 */
const isPhototheque = computed(() =>
  ['phototheque', 'phototheque_etranger'].includes(activeTab.value),
)

const formData = ref({
  yearMin: storeCritereSelection.value.yearMin || '',
  yearMax: storeCritereSelection.value.yearMax || '',
  scaleMin: String(storeCritereSelection.value.scaleMin || '500'),
  scaleMax: String(storeCritereSelection.value.scaleMax || '100000'),
  commanditaire: storeCritereSelection.value.commanditaire || '',
  producteur: storeCritereSelection.value.producteur || '',
  collection: { id: '0', name: 'Toutes les collections' },
  support: { id: '0', name: 'Tous les supports' },
  emulsion: { id: '0', name: 'Tous les emulsions' },
})

const scaleOptions = [
  '500',
  '1000',
  '2000',
  '5000',
  '10000',
  '25000',
  '50000',
  '80000',
  '100000',
  '200000',
  '250000',
  '500000',
  '1000000',
  '5000000',
  '10000000',
]

const commanditaireOptions = ref([])
const producteurOptions = ref([])

const showScaleMinOptions = ref(false)
const showScaleMaxOptions = ref(false)
const showCommanditaireOptions = ref(false)
const showProducteurOptions = ref(false)

watch(storeURL, async () => {
  await loadInitialOptions()
})

/**
 * Charge les options initiales pour le formulaire
 */
async function loadInitialOptions() {
  if (isPhototheque.value) {
    const [commanditaireOpts, producteurOpts] = await Promise.all([
      scanStore.getCommanditaireOptions(),
      scanStore.getProducteurOptions(),
    ])

    commanditaireOptions.value = commanditaireOpts
    producteurOptions.value = producteurOpts
  }
}

/**
 * Met à jour les options de commanditaire en fonction de la sélection actuelle
 */
async function updateCommanditaireOptions() {
  if (isPhototheque.value) {
    const options = await scanStore.getCommanditaireOptions(formData.value.commanditaire)
    commanditaireOptions.value = options
  }
}

/**
 * Met à jour les options de producteur en fonction de la sélection actuelle
 */
async function updateProducteurOptions() {
  if (isPhototheque.value) {
    const options = await scanStore.getProducteurOptions(formData.value.producteur)
    producteurOptions.value = options
  }
}

/**
 * Met à jour les options de collection en fonction de la sélection actuelle
 */
const selectScaleMin = (scale) => {
  formData.value.scaleMin = scale
  showScaleMinOptions.value = false
}

/**
 * Met à jour les options de collection en fonction de la sélection actuelle
 */
const selectScaleMax = (scale) => {
  formData.value.scaleMax = scale
  showScaleMaxOptions.value = false
}

/**
 * Met à jour les options de collection en fonction de la sélection actuelle
 */
const selectCommanditaire = (option) => {
  formData.value.commanditaire = option
  showCommanditaireOptions.value = false
}

/**
 * permet de sélectionner un producteur
 * @param option 
 */
const selectProducteur = (option) => {
  formData.value.producteur = option
  showProducteurOptions.value = false
}

/**
 * Met à jour la collection sélectionnée
 * @param selected 
 */
const updateSelectedCollection = (selected) => {
  formData.value.collection = selected
}

/**
 * Met à jour le support sélectionné
 * @param selected 
 */
const updateSelectedSupport = (selected) => {
  formData.value.support = selected
}

/**
 * Met à jour l'émulsion sélectionnée
 * @param selected 
 */
const updateSelectedEmulsion = (selected) => {
  formData.value.emulsion = selected
}

/**
 * Gère la soumission du formulaire
 */
const handleSubmit = () => {
  eventBus.emit('reset')

  const criteria = {
    yearMin: formData.value.yearMin,
    yearMax: formData.value.yearMax,
    scaleMin: formData.value.scaleMin,
    scaleMax: formData.value.scaleMax,
    commanditaire: formData.value.commanditaire,
    producteur: formData.value.producteur,
    collection:
      formData.value.collection.name === collectionsOptions.value[0].name
        ? null
        : formData.value.collection.name,
    support:
      formData.value.support.name === supportOptions.value[0].name
        ? null
        : formData.value.support.name,
    emulsion:
      formData.value.emulsion.name === emulsionOptions.value[0].name
        ? null
        : formData.value.emulsion.name,
  }

  scanStore.updateCriteria(criteria)

  setTimeout(() => {
    checkResults()
  }, 100)
}

/**
 * Réinitialise le formulaire
 */
const resetForm = () => {
  formData.value = {
    yearMin: '',
    yearMax: '',
    scaleMin: '500',
    scaleMax: '100000',
    commanditaire: '',
    producteur: '',
    collection: { id: '0', name: 'Toutes les collections' },
    support: { id: '0', name: 'Tous les supports' },
    emulsion: { id: '0', name: 'Tous les emulsions' },
  }

  scanStore.resetCriteria()
  eventBus.emit('criteria-reset')
  noResultsFound.value = false
}
</script>

<style scoped>
.critere-selection {
  padding-top: 10px;
  width: 100%;
  box-sizing: border-box;
}

.criteria-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}

.form-row {
  display: flex;
  gap: 12px;
  width: 100%;
  flex-wrap: wrap;
}

.half {
  flex: 1;
  min-width: calc(50% - 6px);
  max-width: calc(50% - 6px);
}

.button-group {
  display: flex;
  gap: 12px;
  margin-top: 5px;
}

.button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
  flex: 1;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  min-height: 44px;
}

.search-button {
  background-color: #739614;
  color: white;
  border: 1px solid #739614;
}

.search-button:hover {
  background-color: #628012;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.15);
  transform: translateY(-1px);
}

.search-button:active {
  transform: translateY(1px);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.reset-button {
  background-color: white;
  color: #555;
  border: 1px solid #e0e0e0;
}

.reset-button:hover {
  background-color: #f7f7f7;
  border-color: #d0d0d0;
  color: #739614;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.08);
  transform: translateY(-1px);
}

.reset-button:active {
  transform: translateY(1px);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

@media (max-width: 500px) {
  .form-row {
    flex-direction: column;
    gap: 15px;
  }

  .half {
    min-width: 100%;
    max-width: 100%;
  }

  .button-group {
    flex-direction: column;
  }

  .button {
    width: 100%;
  }
}
</style>
