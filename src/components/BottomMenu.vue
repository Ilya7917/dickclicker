<template>
  <div class="energy-section">
    <div ref="withdrawalBalanceRef" :style="{ left:'15px', position:'fixed', display:'flex', justifyContent:'space-between' }">
      <span>Доступный баланс на вывод: 0🍆</span>
    </div>

    <div :style="{ right:'15px', top: '25px', position:'fixed', display:'flex', justifyContent:'space-between' }">
      <router-link class="menu-item" :style="{ fontSize: '35px'}" to="/tasks" tag="button">
          📋
          <span>{{ $t("bottomMenu.tasks") }}</span>
      </router-link>
    </div>

    <div ref="skinsRef" :style="{ right:'15px', position:'fixed', display:'flex', justifyContent:'space-between' }">
        <router-link class="menu-item" :style="{ fontSize: '35px'}" to="/skins" tag="button">
          🍆
          <span>{{ $t("bottomMenu.skins") }}</span>
        </router-link>
    </div>

    <div ref="energyRef" class="energy">
      <div class="energy-progress-bar">
      <div class="energy-progress" :style="{ width: ((userStore.user?.energy ?? 0) / (1000 + (userStore.user?.max_energy_level ?? 0) * 500) * 100) + '%' }"></div>
    </div>
    <div class="energy-info">
        <span class="energy-value">⚡{{ userStore.user?.energy }}</span>
    </div>
      <!--
      <div class="max-energy-info">
        <span class="max-energy">/ {{ 1000 + (userStore.user?.max_energy_level ?? 0) * 500 }}</span>
      </div>
      -->
    </div>
  </div>
  <div class="bottom-menu">
    <div class="menu-items">
      <router-link class="menu-item" to="/leaderboard" tag="button">
        🏆
        <span>{{ $t("bottomMenu.top") }}</span>
      </router-link>
      <router-link class="menu-item" to="/channels" tag="button">
        💰
        <span>{{ $t("bottomMenu.earn") }}</span>
      </router-link>
      <router-link class="menu-item" to="/market" tag="button">
        🛒
        <span>{{ $t("bottomMenu.market") }}</span>
      </router-link>
      <router-link class="menu-item" to="/slots" tag="button">
        🎰
        <span>{{ $t("slots.bottom") }}</span>
      </router-link>
      <router-link class="menu-item" to="/posts" tag="button">
        🌐
        <span>{{ $t("bottomMenu.posts") }}</span>
      </router-link>
      <router-link class="menu-item" to="/boosts" tag="button">
        🚀
        <span>{{ $t("bottomMenu.boosts") }}</span>
      </router-link>
    </div>
  </div>
</template>




<script lang="ts" setup>
import { useUserStore } from '@/store/user';
import { onMounted, ref } from 'vue';

const userStore = useUserStore()

const energyRef = ref<HTMLElement | null>(null);
const skinsRef = ref<HTMLElement | null>(null);
const withdrawalBalanceRef = ref<HTMLElement | null>(null);

const updatePosition = () => {
  if (energyRef.value && skinsRef.value && withdrawalBalanceRef.value) {
    const energyRect = energyRef.value.getBoundingClientRect();
    skinsRef.value.style.bottom = `${window.innerHeight - energyRect.top + 20}px`;
    withdrawalBalanceRef.value.style.bottom = `${window.innerHeight - energyRect.top + 20}px`;
  }
};

onMounted(async () => {
  updatePosition();
});
</script>

<style scoped>
.bottom-menu {
  overflow: hidden;
  display: flex;
  flex-direction: column;
  border-radius: 30px 30px 0 0;
  padding: 5px 15px 0;
  background: linear-gradient(0deg, #ffffff00, #ffffff42);
  box-shadow: inset 0px 1px 1px 1px #ffffff4a;
}

.circle-border {
  display: inline-block;
  padding: 10px; /* Увеличивает размер рамки */
  border: 2px solid black; /* Толщина и цвет рамки */
  border-radius: 50%; /* Делает рамку круглой */
  text-align: center;
}

.energy-section {
  margin: 5px;
}

.energy {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 5px;
  padding: 0 10px 5px;
}

.energy-info {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  width: 120px;
}

.energy-value {
  font-weight: bold;
  font-size: 22px;
  color: white;
}

.max-energy-info {
  display: flex;
  justify-content: flex-end; /* Вирівнювання максимальної енергії праворуч */
  align-items: flex-end;
  width: 100%;
}

.max-energy {
  color: #ffffffba;
  font-size: 0.8em;
}

.energy-progress-bar {
  height: 22px;
  width: 100%;
  background-color: #ffffff33;
  box-shadow: 0 0 1px 1px #ffffff8a;
  border-radius: 18px;
  overflow: hidden;
  padding: 2px;
}

.energy-progress {
  height: 100%;
  background: linear-gradient(0deg, #efa91f, #fdef5a);
  border-radius: 18px;
}

.menu-items {
  display: flex;
  justify-content: space-around;
}

.circle-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: none;
  border: 2px solid white; /* Белая рамка */
  padding: 10px;
  border-radius: 50%; /* Круглая рамка */
  font-weight: bold;
  color: white;
  font-size: 22px;
  cursor: pointer;
  text-decoration: none;
  outline: none;
  flex: 1 0 15%;
  overflow: hidden;
  text-align: center;
  width: 100px; /* Фиксированная ширина для круговой рамки */
  height: 100px; /* Фиксированная высота для круговой рамки */
}

.menu-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  padding: 10px 5px;
  border-radius: 5px;
  font-weight: bold;
  color: white;
  font-size: 1em;
  cursor: pointer;
  text-decoration: none;
  outline: none;
  flex: 1 0 15%;
  font-size: 22px;
  overflow: hidden;
  text-align: center;
}

.menu-item>span {
  font-size: 13px;
  text-overflow: ellipsis;
  overflow: hidden;
  text-wrap: nowrap;
  width: 100%;
}
</style>



