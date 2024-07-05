<script lang="ts" setup>
import { useUserStore } from '@/store/user';
import { computed, ref, watch } from 'vue';

const userStore = useUserStore()


const fontSize = computed(() => {
  const balanceLength = userStore.user?.balance.toString().length || 0;
  if (balanceLength < 5) return '44px'; // базовий розмір для коротких значень
  if (balanceLength < 8) return '39px';
  if (balanceLength < 12) return '34px'; // менший розмір для середніх значень
  if (balanceLength < 15) return '29px'; // менший розмір для середніх значень
  return '24px'; // ще менший розмір для довгих значень
});

const animatedBalance = ref(userStore.user?.balance || 0);
// Функція для плавної зміни балансу
function animateBalance(newBalance: number) {
  const startBalance = animatedBalance.value;
  const change = newBalance - startBalance;
  let duration = 900; // тривалість анімації в мілісекундах
  if (change <= 10) {
    duration = 300
  }
  const startTime = performance.now();

  function update(currentTime: number) {
    const elapsedTime = currentTime - startTime;
    const progress = Math.min(elapsedTime / duration, 1);
    animatedBalance.value = Math.round(startBalance + change * progress);

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

// Спостерігаємо за зміною балансу і анімуємо цифри
watch(() => (userStore.user?.balance ?? 0), (newBalance: number) => {
  animateBalance(newBalance);
}, { immediate: true });
</script>

<template>
  <div class="balance-panel">
    <span class="balance-hint">{{ $t("account.yourBalance") }}</span>
    <div class="balance__wrapper">
      <div class="balance" :style="{ fontSize: fontSize }">{{ animatedBalance.toLocaleString() }}</div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@200..800&family=Raleway:ital,wght@0,100..900;1,100..900&family=Syncopate:wght@400;700&display=swap');
.balance-panel {
  padding: 10px 20px;
  margin: 20px;
  color: white;
  text-align: center;
  user-select: none;
  /* Додаємо цю властивість */
  pointer-events: none;
  /* Це запобігає взаємодії з елементом через курсор */
}

.balance-hint {
  color: #ffffffba;
}

.balance {
  font-family: "Syncopate", sans-serif;
  font-weight: bold;
  margin-top: 5px;
}</style>