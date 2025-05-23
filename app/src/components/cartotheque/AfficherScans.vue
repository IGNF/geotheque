<template>
  <div class="scan-box">
    <form class="criteria-form" @submit.prevent="">
      <div class="scan-export-container">
        <button
          class="export-scan-button"
          @click="downloadCSV(storeScansData)"
          :disabled="!isDataAvailable > 0"
        >
          <div class="button-content">
            <div class="icon-wrapper">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="export-icon">
                <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
              </svg>
              <div v-if="isDataAvailable" class="scan-badge">
                {{ storeScansData.length }}
              </div>
            </div>
            <span class="button-text">Exporter tous les scans</span>
          </div>
        </button>
      </div>
      <div class="dropdown-container">
        <div class="dropdown-wrapper">
          <Dropdown
            nameDropdown="Nom du Scan"
            :options="storeScansData"
            :disableOption="textDisableOption"
          />
        </div>
      </div>
      <div class="button-group">
        <ShakingButton
          nameButton="Visualiser"
          @click="openIipmooviewer"
          :disabled="!storeSelectedScan"
          tooltip="Visualiser le scan"
        >
          <template #icon><SvgIcon type="mdi" :path="mdiMonitorEye" class="mdicon" /></template>
        </ShakingButton>
        <ShakingButton
          nameButton="Télécharger"
          @click="downloadScans"
          :disabled="!storeSelectedScan"
          tooltip="Télécharger l'image du scan"
        >
          <template #icon
            ><SvgIcon type="mdi" :path="mdiBriefcaseDownload" class="mdicon"
          /></template>
        </ShakingButton>
        <ShakingButton
          nameButton="XML"
          @click="downloadxml"
          :disabled="!storeSelectedScan"
          tooltip="Télécharger la fiche du scan format XML"
        >
          <template #icon><SvgIcon type="mdi" :path="mdiXml" class="mdicon" /></template>
        </ShakingButton>
      </div>
    </form>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import ShakingButton from '@/components/material/ShakingButton.vue'
import Dropdown from '@/components/material/Dropdown.vue'
import { useScanStore } from '@/components/store/scan'
import { storeToRefs } from 'pinia'
import { mdiMonitorEye, mdiBriefcaseDownload, mdiXml } from '@mdi/js'
import { findSectionScan } from '@/components/composable/getSectionScans'
import { downloadCSV } from '../composable/download'
import config from '@/config'

const scanStore = useScanStore()
const { storeScansData, storeSelectedScan } = storeToRefs(scanStore)

const isDataAvailable = computed(() => storeScansData.value && storeScansData.value.length > 0)

const imageUrl = ref('')
const textDisableOption = computed(() => {
  return storeScansData.value === null || storeScansData.value.length === 0
    ? 'Pas de scans résultats'
    : 'Veuillez sélectionner un scan'
})

/**
 * genère le chemin du dossier de l'image / fiche XML à partir des informations de la carte
 * @param info
 */
function generateFolderPath(info) {
  let path = ''
  if (info) {
    const section = findSectionScan(info.collection)
    if (section && section != undefined) {
      path += `/${section}/`
    }
    if (info.sous_coll !== '' && info.sous_coll != null) {
      path += `${info.collection}/${info.sous_coll}`
    } else {
      path += `${info.collection}`
    }
  }
  return path
}

/**
 * genère le chemin de l'image à partir des informations de la carte
 * @param info
 */
function generateImagePath(info, ext='JP2') {
  return generateFolderPath(info) + `/${info.id_carte}.${ext}`
}

/**
 * genère une URL d'image à partir des informations de la carte
 * @param info
 */
function generateImageUrl(info) {
  const path = generateImagePath(info)
  const url = config.IMG_CARTES_URL
  return `${url}/${path}`
}

/**
 * génère une URL pour l'iipsrv à partir des informations de la carte
 * @param info
 */
function getImageIppsrv(info) {
  const path = generateImagePath(info)
  const url = `${config.IIPSRV_URL}/fcgi-bin/iipsrv.fcgi?FIF=${config.IIPSRV_PREFIX_CARTE}/${path}&CVT=jpeg`
  return url
}

watch(storeSelectedScan, (newVal) => {
  if (newVal) {
    const info = storeSelectedScan.value?.properties
    if (info) {
      imageUrl.value = getImageIppsrv(info)
    }
  }
})

/**
 * ouvre l'image dans le visualiseur IIPMoo
 */
function openIipmooviewer() {
  if (imageUrl.value) {
    const urlParams = new URLSearchParams(new URL(imageUrl.value).search)
    const imageUrlServ = urlParams.get('FIF')

    localStorage.setItem('imageUrl', imageUrlServ)
    window.open(
      `iipmooviewer/index.html?server=${config.IIPSRV_URL}&image=${encodeURIComponent(imageUrlServ)}`,
      '_blank',
    )
  } else {
    console.error("L'URL de l'image est indéfinie.")
  }
}

/**
 * télécharge l'image du scan
 */
function downloadScans() {
  if (storeSelectedScan.value) {
    const info = storeSelectedScan.value?.properties
    const url = generateImageUrl(info)
    window.open(url, 'img')
  }
}

/**
 * Ouvre le fichier XML du scan dans une autre fenêtre
 */
function downloadxml() {
  if (storeSelectedScan.value) {
    const info = storeSelectedScan.value?.properties
    const path = generateFolderPath(info)
    const url_xml =  `${config.IMG_CARTES_URL}/${path}/Fiches/${info.id_carte}.xml`
    console.log('URL_XML : ', url_xml)
    window.open(url_xml, 'xml')
  }
}
</script>
<style scoped>
.scan-box {
  padding-top: 10px;
  width: 100%;
  box-sizing: border-box;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 15px;
}

.criteria-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  width: 100%;
  margin-bottom: 40px;
}

.scan-export-container {
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
}

.export-scan-button {
  width: 100%;
  height: 100px;
  background: linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%);
  color: #5e7a10;
  border: 2px dashed #5e7a10;
  border-radius: 20px;
  cursor: pointer;
  transition:
    all 0.3s ease,
    transform 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
}

.export-scan-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(94, 122, 16, 0.05);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.export-scan-button:hover {
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
  transform: translateY(-3px);
}

.export-scan-button:hover::before {
  opacity: 1;
}

.export-scan-button:active {
  transform: scale(0.98) translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.export-scan-button:disabled {
  background: linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%);
  color: #999;
  border-color: #bbb;
  cursor: not-allowed;
  box-shadow: none;
}

.button-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  text-align: center;
  z-index: 1;
}

.icon-wrapper {
  position: relative;
  background-color: rgba(94, 122, 16, 0.1);
  border-radius: 50%;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s ease;
}

.scan-badge {
  position: absolute;
  top: -6px;
  right: -6px;
  background-color: #ff4d4d;
  color: white;
  border-radius: 16px;
  min-width: 24px;
  height: 24px;
  padding: 0 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
  border: 2px solid white;
  z-index: 10;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.export-scan-button:hover .icon-wrapper {
  background-color: rgba(94, 122, 16, 0.2);
}

.export-icon {
  width: 28px;
  height: 28px;
  fill: #5e7a10;
}

.button-text {
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.dropdown-container {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
  margin-bottom: 10px;
  width: 100%;
  gap: 8px;
}

.dropdown-wrapper {
  flex: 1;
  width: 100%;
}

.form-row {
  display: flex;
  gap: 10px;
  width: 100%;
  flex-wrap: wrap;
}
.form-group {
  width: 100%;
}
.form-group.half {
  flex: 1;
  min-width: calc(50% - 5px);
  max-width: calc(50% - 5px);
}
.form-group label {
  font-size: 14px;
  color: #555;
}
.form-group input {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  transition:
    border-color 0.3s,
    box-shadow 0.3s;
  width: 100%;
  box-sizing: border-box;
}

.form-group input:focus {
  border-color: #739614;
  outline: none;
  box-shadow: 0 0 0 2px rgba(115, 150, 20, 0.2);
}

.button-group {
  margin-top: 10px;
  display: flex;
  gap: 10px;
}
.search-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 15px;
  background-color: #739614;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition:
    background-color 0.3s,
    transform 0.2s;
}
.search-button:hover {
  background-color: #5e7a10;
}

.search-button:active {
  transform: translateY(1px);
}

@media (max-width: 500px) {
  .form-row {
    flex-direction: column;
    gap: 15px;
  }

  .form-group.half {
    min-width: 100%;
    max-width: 100%;
  }
}
</style>
