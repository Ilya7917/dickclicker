<template>
  <div class="energy-section">
    <div class="energy">
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
      <router-link class="menu-item" to="/skins" tag="button">
        🍆
        <span>{{ $t("bottomMenu.skins") }}</span>
      </router-link>
      <router-link class="menu-item" to="/referrals" tag="button">
        🧑‍🤝‍🧑
        <span>{{ $t("bottomMenu.referrals") }}</span>
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

const userStore = useUserStore()
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



