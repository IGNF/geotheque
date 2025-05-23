<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
const emit = defineEmits(['click'])

const props = defineProps({
  nameButton: {
    type: String,
    default: 'Aled',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  tooltip: {
    type: String,
    default: '',
  },
})

const buttonRef = ref(null)
const showTooltip = ref(false)
const tooltipPosition = ref({ top: 0, left: 0 })

/**
 * Met à jour la position du tooltip
 */
function handleMouseEnter() {
  if (props.tooltip) {
    updatePosition()
    showTooltip.value = true
  }
}

/**
 * Cache le tooltip
 */
function handleMouseLeave() {
  showTooltip.value = false
}

/**
 * Met à jour la position du tooltip
 */
function updatePosition() {
  if (!buttonRef.value) return

  const rect = buttonRef.value.getBoundingClientRect()
  tooltipPosition.value = {
    top: rect.top - 10,
    left: rect.left + rect.width / 2,
  }
}

onMounted(() => {
  if (props.tooltip) {
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
  }
})

onBeforeUnmount(() => {
  if (props.tooltip) {
    window.removeEventListener('resize', updatePosition)
    window.removeEventListener('scroll', updatePosition, true)
  }
})
</script>

<template>
  <button
    ref="buttonRef"
    class="button"
    :disabled="disabled"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    @click="$emit('click')"
  >
    <slot name="icon"></slot>
    {{ nameButton }}
  </button>

  <Teleport to="body">
    <div
      v-if="tooltip && showTooltip"
      class="shaking-tooltip"
      :style="{
        top: `${tooltipPosition.top}px`,
        left: `${tooltipPosition.left}px`,
      }"
    >
      {{ tooltip }}
      <div class="tooltip-arrow"></div>
    </div>
  </Teleport>
</template>

<style scoped>
button {
  padding: 10px 15px;
  border: none;
  display: flex;
  gap: 8px;
  border-radius: 4px;
  background: #739614;
  font-size: 14px;
  color: #ffffff;
  font-family: inherit;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover:not(:disabled) {
  background-color: #5e7a10;
}

button:active:not(:disabled) {
  transform: translateY(1px);
}

button:disabled {
  background: #b0c080;
  cursor: not-allowed;
  animation: none;
  opacity: 0.7;
}

.shaking-tooltip {
  position: fixed;
  transform: translate(-50%, -100%);
  background-color: #739614;
  color: white;
  padding: 6px 10px;
  border-radius: 4px;
  font-size: 12px;
  pointer-events: none;
  z-index: 9999;
  max-width: 250px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  white-space: nowrap;
}

.tooltip-arrow {
  position: absolute;
  left: 50%;
  top: 100%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 5px solid #739614;
}
</style>
