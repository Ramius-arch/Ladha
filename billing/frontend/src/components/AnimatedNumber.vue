<template>
  <span class="animated-num-span" style="color: inherit;">{{ displayValue }}{{ suffix }}</span>
</template>

<script>
import { defineComponent, ref, watch, onMounted } from 'vue';

export default defineComponent({
  name: 'AnimatedNumber',
  props: {
    value: {
      type: [Number, String],
      default: 0
    },
    suffix: {
      type: String,
      default: ''
    },
    duration: {
      type: Number,
      default: 800
    }
  },
  setup(props) {
    const formatTarget = (target) => {
      if (typeof target === 'number') return target.toLocaleString();
      if (typeof target === 'string') {
        const parsed = parseFloat(target.replace(/[^0-9.-]+/g, ''));
        return isNaN(parsed) ? target : parsed.toLocaleString();
      }
      return '0';
    };

    const displayValue = ref(formatTarget(props.value));

    const animateNumber = (target) => {
      const numTarget = typeof target === 'string' ? parseFloat(target.replace(/[^0-9.-]+/g, '')) || 0 : target || 0;
      if (isNaN(numTarget) || numTarget === 0) {
        displayValue.value = formatTarget(target);
        return;
      }

      const start = Math.floor(numTarget * 0.7); // Start near target for rapid Steve Jobs precision fluid feel
      const startTime = performance.now();

      const updateCount = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / props.duration, 1);
        // Apple ease-out cubic
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(start + (numTarget - start) * easeProgress);

        displayValue.value = current.toLocaleString();

        if (progress < 1) {
          requestAnimationFrame(updateCount);
        } else {
          displayValue.value = numTarget.toLocaleString();
        }
      };

      requestAnimationFrame(updateCount);
    };

    watch(() => props.value, (newVal) => {
      animateNumber(newVal);
    });

    onMounted(() => {
      animateNumber(props.value);
    });

    return {
      displayValue
    };
  }
});
</script>
