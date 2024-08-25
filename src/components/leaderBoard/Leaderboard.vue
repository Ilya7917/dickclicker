<script lang="ts" setup>
import { useLeaderboardStore } from '@/store/leaderboard';
import { useUserStore } from '@/store/user';
import { onMounted, ref } from 'vue';
import { useWebAppPopup } from 'vue-tg'
import leaderboardItem from './LeaderboardItem.vue';


const leaderboardStore = useLeaderboardStore()
const userStore = useUserStore()
const user = userStore.user

onMounted(() => {
  leaderboardStore.fetchDailyLeaderboard()
  leaderboardStore.fetchMonthlyLeaderboard()
  leaderboardStore.fetchLeaderboard()
})

import { useI18n } from 'vue-i18n';
const { t } = useI18n();

t("top.yourPlace", {
  place: 123
})

const activeTab = ref('Day');
// Функція для зміни вкладки
const setActiveTab = (tabName: string) => {
  activeTab.value = tabName;
  // Тут можна додати логіку для завантаження даних в залежності від вибраної вкладки
  // Наприклад: leaderboardStore.fetchLeaderboard(tabName);
};
</script>

<template>
  <div class="tabs">
    <button @click="setActiveTab('Day')" class="tab">{{$t("top.day")}}</button>
    <button @click="setActiveTab('Month')" class="tab">{{$t("top.month")}}</button>
    <button @click="setActiveTab('Balance')" class="tab">{{$t("top.balance")}}</button>
  </div>
  <div class="leaderboard" v-if="activeTab === 'Day'">
    <leaderboardItem v-if="leaderboardStore.dailyLeaderboard" :leaderboard="leaderboardStore.dailyLeaderboard" :balance="user?.balance || 0" leader-board-title="top.topToday" />
  </div>
  <div class="leaderboard" v-if="activeTab === 'Month'">
    <leaderboardItem v-if="leaderboardStore.monthlyLeaderboard" :leaderboard="leaderboardStore.monthlyLeaderboard" :balance="user?.balance || 0" leader-board-title="top.topMonth" />
  </div>
  <div class="leaderboard" v-if="activeTab === 'Balance'">
    <leaderboardItem v-if="leaderboardStore.monthlyLeaderboard" :leaderboard="leaderboardStore.monthlyLeaderboard" :balance="user?.balance || 0" leader-board-title="top.topBalance" />
  </div>
</template>

<style scoped>
.tabs {
  margin: 10px;
}
.tabs button {
  background-color: rgba(57, 57, 57, 0.5); /* Білий колір з напівпрозорістю */
  border: none;
  padding: 10px 20px;
  margin: 0 5px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  color: white;
}

.tabs button:hover {
  background-color: rgba(255, 255, 255, 0.7); /* Збільшуємо прозорість при наведенні */
}

.tabs button.active {
  background-color: rgba(112, 112, 112, 0.9); /* Активна кнопка буде менш прозорою */
}
.name {
  color: rgb(255, 153, 0);
}

.player {
  display: flex;
  align-items: center;

  margin: 10px;
  background: rgba(128, 128, 128, 0.1);
  color: #fff;
  padding: 10px;
  border-radius: 8px;
}

.you {
  background: rgba(255, 200, 0, 0.1);
}

.leaderboard-title {
  margin: 10px;
  font-size: 24px;
}

.player-info {
  display: flex;
  flex-direction: column;
}

.player-score {
  font-size: 12px;
}

.rank {
  margin-right: 15px
}

.avatar,
.name,
.score {
  margin-right: 5px;
}

.avatar img,
.avatar .initials {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.initials {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #777;
}</style>