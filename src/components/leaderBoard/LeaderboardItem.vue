<template>
  <div class="leaderboard-title">
    🏆 {{$t(leaderBoardTitle)}}
  </div>
  <div class="leaderboard-list">
    <div class="player you" v-if="leaderboard.me != null">
      <span class="avatar" :style="{ display:'flex', alignItems:'center', justifyContent:'center' }">
        <img v-if="leaderboard?.me?.avatar_url" :src="leaderboard?.me.avatar_url"
          :alt="leaderboard?.me.identity" />
        <div v-else class="initials">{{ leaderboard?.me?.identity?.substring(0, 2).toUpperCase() }}
        </div>
      </span>
      <div v-if="leaderBoardTitle == 'top.balance'" class="player-info">
        <span class="name">{{ t("top.yourPlace", {"place": leaderboard?.me?.position}) }}</span>
        <span class="player-score">🍆 {{ balance.toLocaleString() }}</span>
      </div>
      <div v-else class="player-info">
        <span class="name">{{ t("top.yourPlace", {"place": leaderboard?.me?.position}) }}</span>
        <span class="player-score">🍆 +{{ leaderboard?.me?.score.toLocaleString() }}</span>
      </div>

    </div>
    <div v-for="(player, index) in leaderboard?.players" :key="player.id" class="player">
      <span class="rank">{{ index == 0 ? '👑' : (index + 1 + '.') }}</span>
      <span class="avatar" :style="{ display:'flex', alignItems:'center', justifyContent:'center' }">
        <img v-if="player.avatar_url" :src="player.avatar_url" :alt="player.identity" />
        <div v-else class="initials">{{ player.identity.substring(0, 2).toUpperCase() }}</div>
      </span>
      <div class="player-info">
        <span v-if="player.is_premium" class="name">{{ player.identity }}</span>
        <span v-else>{{ player.identity }}</span>
        <span class="player-score">🍆 {{ leaderBoardTitle != 'top.balance' ? '+' : '' }} {{ player.score.toLocaleString() }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { Leaderboard } from '@/store/leaderboard';
  import { useI18n } from 'vue-i18n';
  const { t } = useI18n();

  interface Props {
      leaderboard: Leaderboard;
      balance: number;
      leaderBoardTitle: string;
  }

  // Используем defineProps с явными типами
  const props = defineProps<Props>();
</script>

<style scoped>
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
}
</style>