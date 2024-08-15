<template>
    <div :style="{ display:'flex', flexDirection:'column', justifyContent:'space-between' }">
        <div :style="{ height:'100%' }">
          <div v-if="isCanView" class="channels-list">
            <div v-for="channel in channels"  :key="channel.id" @click="channel.is_available ? openChannelLink(channel, 'visible') : wn.openTelegramLink(channel.invite_link)" :class="channel.available ? 'channel' : 'channel-disable'">
              <div class="channel-info" :style="{ display:'flex', flexDirection:'row', justifyContent:'center', alignItems:'center' }">
                <img v-if="channel.channel_avatar != ''" :src="channel.channel_avatar" :style="{ height:'30px', borderRadius:'100px'}" />
                <div v-else :style="{ height:'30px', width:'30px', borderRadius:'100px', background:'gray', justifyContent:'center', alignItems:'center', display:'flex' }">{{ channel.is_whale ? "🐳" : "📢" }}</div>
                <span class="name" :style="{ marginLeft:'10px' }">{{ channel.title }}</span>
                <span v-if="channel.user_id == myUserId">👑</span>
              </div>
              <div class="channel-action">
                <span v-if="channel.is_available" class="reward">🍆 {{ channel.reward.toLocaleString() }}</span>
                <span v-else>Награда получена</span>
                <svg class="arrow">
                  <use xlink:href="@/assets/images/sprite.svg#chevron-right"></use>
                </svg>
              </div>
            </div>
          </div>
        </div>
    </div>
</template>

<script lang="ts" setup>

    import { Channel, useChannelsStore } from '@/store/channel';
    import { defineProps, PropType } from 'vue';
    import { useWebAppNavigation } from 'vue-tg'
    const wn = useWebAppNavigation()


    const props = defineProps({
        isCanView: {
            type: Boolean,
            requireq: true
        },
        channels: {
            type: Array as PropType<Channel[]>, // Используем PropType для указания типа массива
            required: true
        },
        openChannelLink: {
            type: Function,
            required: true
        },
        myUserId: {
            type:Number,
            required: true
        }
    });

</script>

<style scoped>
.channel {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 10px;
  background: rgba(128, 128, 128, 0.1);
  color: #fff;
  padding: 20px 10px;
  border-radius: 8px;
}

.channel-disable {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 10px;
  background: rgba(171, 10, 10, 0.1);
  color: #fff;
  padding: 20px 10px;
  border-radius: 8px;
}
</style>

