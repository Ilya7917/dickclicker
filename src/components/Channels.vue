<script lang="ts" setup>
import {Channel, useChannelsStore} from '@/store/channel';
import { useWebAppNavigation } from 'vue-tg'
import { onMounted, ref } from "vue";
import { differenceInHours } from 'date-fns';
import { useWebAppPopup } from 'vue-tg'
import { useI18n } from 'vue-i18n';
import AddIcon from "@/assets/images/addIcon.svg";
import { useUserStore } from '@/store/user';
import Balance from './account/Balance.vue';
const { t } = useI18n();

const channelsStore = useChannelsStore();
const wn = useWebAppNavigation()
const isPopupVisible = ref(false);
const isCanView = ref(false);

const userStore = useUserStore();
const { getChannels } = channelsStore;

const myUserId = ref(5879286931);

const selectedChannel = ref({
    id: 0,
    title: "",
    reward: 0,
    balance: 0,
    invite_link: "",
    status: "",
    createdAt: "",
    owner_id: 0,
    available: false,
    is_available: false,

});
const fetchFunction = () => {
  channelsStore.fetchChannels().then(() => {
    channelsStore.getMyChannels().then(() => {
      if(channelsStore.myChannels?.length != null && channelsStore.myChannels?.length > 0){
        channelsStore.myChannels?.map(channel => {
            console.log(channel);
            if(channel.Status == "init") {
              let index = channelsStore.channels?.findIndex(x => x.id == channel.ChannelID);
              if (channelsStore.channels && index != null && index != -1) {
                channelsStore.channels[index].is_available = true;
                console.log(channelsStore.channels[index].is_available)
              }
            }
            if(channel.Status == "rewarded")
            {
              let index = channelsStore.channels?.findIndex(x => x.id == channel.ChannelID);
              if (channelsStore.channels && index != null && index != -1) {
                channelsStore.channels[index].is_available = false;
                console.log(channelsStore.channels[index].is_available)
              }
            }
        })
      }
      let whales = [] as Channel[]
      channelsStore.channels?.map(item => {
        if(item.is_whale) whales.push(item);
      })
      channelsStore.whales = whales.length > 0 ? whales : [];
      whales.sort((a, b) => {
        // Сначала сортируем по myUserId.value
        if (a.user_id === myUserId.value && b.user_id !== myUserId.value) {
          return -1;
        }
        if (a.user_id !== myUserId.value && b.user_id === myUserId.value) {
          return 1;
        }

         // Затем сортируем по available
        if (a.available && !b.available) {
          return -1;
        }
        if (!a.available && b.available) {
          return 1;
        }

        // Затем сортируем по is_available
        if (a.is_available && !b.is_available) {
          return -1;
        }
        if (!a.is_available && b.is_available) {
          return 1;
        }
        // Если предыдущие условия не сработали, оставляем порядок как есть
        return 0;
      });
      console.log(channelsStore.whales);
      isCanView.value = true;
    });
  });
}

onMounted(() => {
  fetchFunction()
  if(userStore.user?.id != undefined){ 
   myUserId.value = userStore.user?.id
  }
});

const openChannelLink = (channel: Channel, state: string) => {

  if(!channel.available && channel.user_id != myUserId.value) {
    console.log('channel is not available');
    useWebAppPopup().showAlert(t("У кита закончился баланс 🍆"))
    wn.openTelegramLink(channel.invite_link)
    return;
  }

  if(channelsStore.myChannels?.length != null && channelsStore.myChannels?.length > 0) {
      let index = channelsStore.myChannels.findIndex(x => x.ChannelID == channel.id);
      console.log(index);
      if(index != -1)
      {
        selectedChannel.value.status = channelsStore.myChannels[index].Status
        selectedChannel.value.createdAt = channelsStore.myChannels[index].CreatedAt?.toLocaleString() || '';
      }
      else {
        selectedChannel.value.status = "";
        selectedChannel.value.createdAt = '';
      }
  }
  console.log(channelsStore.myChannels);
  // channel.is_available = false
  selectedChannel.value.id = channel.id
  selectedChannel.value.balance = channel.balance
  selectedChannel.value.owner_id = channel.user_id;
  selectedChannel.value.reward = channel.reward
  selectedChannel.value.title = channel.title
  selectedChannel.value.invite_link = channel.invite_link
  selectedChannel.value.available = channel.available
  selectedChannel.value.is_available = channel.is_available
  isPopupVisible.value = false;
  popupState.value = state;
  setTimeout(reOpenPopup, 100)
  // wn.openTelegramLink(channel.invite_link)
}

const onPressStartButton = () => {
  
  const channel =  {
    id: selectedChannel.value.id,
    title: selectedChannel.value.title,
    invite_link: selectedChannel.value.invite_link,
    available: true,
    reward: 0,
    balance: 0,
    is_available: true,
    channel_avatar: '',
    is_whale: false,
    user_id: 0
  }

  channelsStore.startChannel(channel).then(result => {
    if(result)
    {
        isPopupVisible.value = false;
        channelsStore.getMyChannels();  
        try{
          wn.openTelegramLink(selectedChannel.value.invite_link)
        }
        catch{
          console.log("Err");
        }
    }
  })
}

const reOpenPopup = () => {
  isPopupVisible.value = true;
};

function closePopup() {
  if(popupState.value == 'create') return;
  isPopupVisible.value = false;
}

const checkTimeTillGetReward = () => {
  console.log("check time: " + selectedChannel.value.createdAt);
  const createdAt = new Date(selectedChannel.value.createdAt);
  const now = new Date();

  const hoursDifference = differenceInHours(now, createdAt);
  console.log("check time: " + selectedChannel.value.createdAt);
  console.log("Hours since request: " + hoursDifference);

  if (hoursDifference >= 1) {
    const channel =  {
      id: selectedChannel.value.id,
      title: selectedChannel.value.title,
      invite_link: selectedChannel.value.invite_link,
      reward: 0,
      is_available: true,
      available: true,
      balance: 0,
      channel_avatar: '',
      is_whale: false,
      user_id: 0
    }
    channelsStore.rewardChannel(channel).then(() => {
      console.log("request finished");
      isPopupVisible.value = false;
      if (channelsStore.channels) {
          var index = channelsStore.channels.findIndex(x => x.id == selectedChannel.value.id);
          channelsStore.channels[index].is_available = false;
      }
      selectedChannel.value.status = "";
      selectedChannel.value.createdAt = '';
    })
  } else {
    useWebAppPopup().showAlert(t("earn.waitRewardText"))
  }
}



const popupState = ref("visible");
const openCreateWhaleForm = () => {
  console.log(11111111);
  popupState.value = 'create';
  isPopupVisible.value = true;
}


const newWhaleData = ref({
  balance: 0,
  link: "",
  rewared: 0,
})

function isValidTelegramUrl(url: string) {
  const pattern = /^(https?:\/\/)?(www\.)?t\.me\/[a-zA-Z0-9_]{5,}$/;
  return pattern.test(url);
}


async function createNewWhale() {
  if (newWhaleData.value.link === "" || newWhaleData.value.rewared == 0) return;

  if (!isValidTelegramUrl(newWhaleData.value.link)) {
    console.error("Invalid Telegram URL format");
    useWebAppPopup().showAlert(t("Invalid Telegram URL format"))
    return;
  }

  if(userStore.user != null && newWhaleData.value.balance > userStore.user?.balance) {
    useWebAppPopup().showAlert(t("У вас недостаточно 🍆 чтобы поместить их в кита"))
    return;
  }
  
  if(newWhaleData.value.balance == 0){
    useWebAppPopup().showAlert(t("Баланс кита не может быть 0"))
    return;
  }

  if(newWhaleData.value.rewared > newWhaleData.value.balance) {
    useWebAppPopup().showAlert(t("❌ Вы не можете выдавать юзерам больше, чем будет на балансе кита ❌"))
    return;
  }
  
  if(channelsStore.channels != null) {
     let index = channelsStore.channels.findIndex(x => x.user_id == myUserId.value);
     if(index != -1){
      useWebAppPopup().showAlert(t("Вы не можете создать больше 1 кита"))
      return;
     }
  }
  

  channelsStore.createWhale(newWhaleData.value.balance, newWhaleData.value.link, newWhaleData.value.rewared).then(result => {
    if (result) {
      fetchFunction();
      isPopupVisible.value = false;
    }
  });
}


const channels = [  
  {
    id: 0,
    title: "Test",
    invite_link: "http://1111.com",
    reward: 10000,
    is_available: true
  },
  {
    id: 1,
    title: "Tes121t",
    invite_link: "http://1111.com",
    reward: 10,
    is_available: true
  }
]

const handleEnter = (event: KeyboardEvent) => {
  (event.target as HTMLInputElement).blur();
};


const stopActiveChannel = (channelId: number) => {
    const elemIndex = channelsStore.whales?.findIndex(x => x.id == channelId);
    if(elemIndex != -1 && elemIndex != undefined){
      if(channelsStore.whales != null && channelsStore.whales[elemIndex].id == channelId){
        channelsStore.changeChannelAvailable(channelId).then(result => {
          if(result) {
            isPopupVisible.value = false;
            fetchFunction();
          }
        })
      }
    }
}

const deleteUserWhale = (channelId: number) => {
  const elemIndex = channelsStore.whales?.findIndex(x => x.id == channelId);
  if(elemIndex != -1 && elemIndex != undefined){
    if(channelsStore.whales != null && channelsStore.whales[elemIndex].id == channelId){
        channelsStore.deleteWhale(channelId).then(result => {
        if(result) {
            isPopupVisible.value = false;
            fetchFunction();
          }
        })
      }
  }
}

const myChannelPopupState = ref('view');

const updateWhaleBalance = ref(0);

const topUpWhaleBalance = (channelId :number) => {
  if(userStore.user == null) return;

  if(updateWhaleBalance.value == 0) {
    useWebAppPopup().showAlert(t("Нельзя пополнить на 0 🍆"))
    return;
  }

  if(userStore.user.balance < updateWhaleBalance.value) {
    useWebAppPopup().showAlert(t("У вас недостаточно 🍆 чтобы поместить их в кита"))
    return;
  }

  channelsStore.topUpWhale(channelId, updateWhaleBalance.value).then(result => {
    if(result) {
       isPopupVisible.value = false;
       myChannelPopupState.value = 'view';
       fetchFunction();
    }
  })

}

</script>

<template>

  <div class="telegram-channels">
    <div class="earn-title">
      🤑 {{ $t("earn.name") }}
    </div>
    <div :style="{ display:'flex', flexDirection:'column', justifyContent:'space-between' }">
        <div :style="{ height:'40vh' }">
          <div class="channels-title">
            📢 {{ $t("earn.channels") }}
          </div>
          <div v-if="isCanView" class="channels-list">
            <div v-for="channel in channelsStore.channels?.filter(c => !c.is_whale)"  :key="channel.id" @click="channel.is_available ? openChannelLink(channel, 'visible') : wn.openTelegramLink(channel.invite_link)" class="channel">
              <div class="channel-info" :style="{ display:'flex', flexDirection:'row', justifyContent:'center', alignItems:'center' }">
                <img v-if="channel.channel_avatar != ''" :src="channel.channel_avatar" :style="{ height:'30px', borderRadius:'100px'}" />
                <div v-else :style="{ height:'30px', width:'30px', borderRadius:'100px', background:'gray', justifyContent:'center', alignItems:'center', display:'flex' }">📢</div>
                <span class="name" :style="{ marginLeft:'10px' }">{{ channel.title }}</span>
              </div>
              <div class="channel-action">
                <span v-if="channel.is_available" class="reward">🍆 {{ channel.reward.toLocaleString() }}</span>
                <span v-else>Награда получена</span>
                <svg class="arrow">
                  <use xlink:href="@/assets/images/sprite.svg#chevron-right"></use>
                </svg>
      <!--          <button v-if="channel.is_available" class="button" @click="openChannelLink(channel)">Join</button>-->
              </div>
            </div>
          </div>
        </div>
        <div>
          <div :style="{ display:'flex', justifyContent:'space-between' }" >
            <div class="channels-title">
              🐳 {{ $t("whales.channels") }}
            </div>
            <div :style="{display: 'flex', alignItems:'center'}" @click="openCreateWhaleForm">
              <img :src="AddIcon" alt="Your Icon" :style="{ height: '45px', marginRight:'7px' }" />
            </div>
          </div>
          <div v-if="isCanView" class="channels-list" :style="{ height: '40vh', overflowY:'scroll'}">
            <div v-for="chan in channelsStore.whales" :key="chan.id" @click="chan.is_available ? openChannelLink(chan, 'visible') : wn.openTelegramLink(chan.invite_link)" :class="chan.available ? 'channel' : 'channel-disable'">
              <div class="channel-info" :style="{ display:'flex', flexDirection:'row', justifyContent:'center', alignItems:'center' }">
                <img v-if="chan.channel_avatar != ''" :src="chan.channel_avatar" :style="{ height:'30px', borderRadius:'100px'}" />
                <div v-else :style="{ height:'30px', width:'30px', borderRadius:'100px', background:'gray', justifyContent:'center', alignItems:'center', display:'flex' }">🐳</div>
                <span class="name" :style="{ marginLeft:'10px' }">{{ chan.title }} </span>
                <span v-if="chan.user_id == myUserId">👑</span>
              </div>
              <div class="channel-action">
                <span v-if="chan.is_available" class="reward">🍆 {{ chan.reward.toLocaleString() }}</span>
                <span v-else>Награда получена</span>
                <svg class="arrow">
                  <use xlink:href="@/assets/images/sprite.svg#chevron-right"></use>
                </svg>
      <!--          <button v-if="channel.is_available" class="button" @click="openChannelLink(channel)">Join</button>-->
              </div>
            </div>
          </div>
        </div>
    </div>




    <div v-if="isPopupVisible" class="boost-purchase-popup" :class="{ 'visible': isPopupVisible }">
<!--        <div class="popup-overlay" @click="closePopup"></div>-->
        <div class="popup-content" v-click-outside="closePopup">
            <div class="popup-header">
                <h2>{{ popupState == 'create' ? 'Create whale' : selectedChannel.title }}</h2>
                <button class="close-button" @click="isPopupVisible = false;">
                  <svg class="close-icon" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 30 30" width="16px" height="16px">
                    <path d="M 7 4 C 6.744125 4 6.4879687 4.0974687 6.2929688 4.2929688 L 4.2929688 6.2929688 C 3.9019687 6.6839688 3.9019687 7.3170313 4.2929688 7.7070312 L 11.585938 15 L 4.2929688 22.292969 C 3.9019687 22.683969 3.9019687 23.317031 4.2929688 23.707031 L 6.2929688 25.707031 C 6.6839688 26.098031 7.3170313 26.098031 7.7070312 25.707031 L 15 18.414062 L 22.292969 25.707031 C 22.682969 26.098031 23.317031 26.098031 23.707031 25.707031 L 25.707031 23.707031 C 26.098031 23.316031 26.098031 22.682969 25.707031 22.292969 L 18.414062 15 L 25.707031 7.7070312 C 26.098031 7.3170312 26.098031 6.6829688 25.707031 6.2929688 L 23.707031 4.2929688 C 23.316031 3.9019687 22.682969 3.9019687 22.292969 4.2929688 L 15 11.585938 L 7.7070312 4.2929688 C 7.5115312 4.0974687 7.255875 4 7 4 z"/>
                  </svg>
                </button>
            </div>
            <div v-if="popupState == 'visible' && selectedChannel.owner_id != myUserId" class="popup-body">
                <p>{{ selectedChannel.status == "init" ? $t("earn.waitRewardText") : $t("earn.selectedChannel") }}</p>
                <p>🍆{{ selectedChannel.reward }}</p>
                <button class="boost-purchase-button" @click="selectedChannel.status == 'init' ? checkTimeTillGetReward() : onPressStartButton()">{{ selectedChannel.status == "init" ?  $t("earn.getRewardButton") : $t("earn.startRewardButton") }}</button>
            </div>
            <div v-if="popupState == 'visible' && selectedChannel.owner_id == myUserId" class="popup-body">
                <p v-if="myChannelPopupState == 'view'">Этот канал принадлежит вам</p>
                <p v-if="myChannelPopupState == 'view'">Награда за переход: 🍆{{ selectedChannel.reward }}</p>
                <p v-if="myChannelPopupState == 'view'">Оставшийся баланс кита: 🍆{{ selectedChannel.balance }}</p>
                <div v-if="myChannelPopupState == 'view'" :style="{ marginTop: '15px' }">
                  <button class="boost-purchase-button" @click="stopActiveChannel(selectedChannel.id)">{{ selectedChannel.available ? 'Остановить' : 'Включить' }}</button>
                  <button class="boost-purchase-button" @click="myChannelPopupState = 'topUp'" :style="{marginTop:'15px'}">Пополнить</button>
                  <button v-if="!selectedChannel.available && (userStore.user?.balance != undefined && userStore.user?.balance <= selectedChannel.reward)" class="boost-purchase-button" :style="{marginTop:'15px'}" @click="deleteUserWhale(selectedChannel.id)">Удалить</button>
                </div>
                <div v-else :style="{ marginTop: '15px' }">
                  <span>Насколько желаете пополнить кита?🐳</span>
                  <input type="number" id="fname" :style="{ width: '100%'}" name="fname" v-model="updateWhaleBalance">
                  <button class="boost-purchase-button" @click="topUpWhaleBalance(selectedChannel.id)" :style="{marginTop:'15px'}">Пополнить</button>
                  <button class="boost-purchase-button" @click="myChannelPopupState = 'view'" :style="{marginTop:'15px'}">Назад</button>
                </div>
            </div>
            <div v-if="popupState == 'create'" class="popup-body" @keydown.enter="handleEnter" :style="{ overflowY: 'scroll' }">
              <div :style="{ display:'flex', flexDirection:'column', justifyContent:'center', marginTop:'30px'}">
                <label for="fname" >Ссылка на канал</label>
                <input type="text" id="fname" :style="{ width: '100%'}" name="fname" v-model="newWhaleData.link">
              </div>
              <div :style="{ display:'flex', flexDirection:'column', justifyContent:'center', marginTop:'30px'}">
                <label for="fname" >Цена за переход</label>
                <input type="number" id="fname" :style="{ width: '100%'}" name="fname" v-model="newWhaleData.rewared">
              </div>

              <div :style="{ display:'flex', flexDirection:'column', justifyContent:'center', marginTop:'30px'}">
                <label for="fname" >Баланс кита</label>
                <input type="number" id="fname" :style="{ width: '100%'}" name="fname" v-model="newWhaleData.balance">
              </div>

              <div :style="{ display:'flex', flexDirection:'column', justifyContent:'center', marginTop:'30px'}">
                    <button class="mypost-button" :style="{ marginTop: '30px', width: '100%' }" @click="createNewWhale">Создать</button>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>

<style scoped>

input[type=text] {
  width: 150%;
  padding: 12px 20px;
  margin: 30px 0;
  box-sizing: border-box;
  border: none;
  border-bottom: 2px solid rgb(0, 255, 0);
  background: none;
}

.mypost-button {
    padding: 10px 20px;
    border: none;
    background-color: #878787;
    color: white;
    width: 170px;
    font-size: 20px;
    font-weight: bold;
    border-radius: 5px;
    cursor: pointer;
}

input[type=number] {
  width: 40%;
  padding: 12px 20px;
  margin: 30px 0;
  box-sizing: border-box;
  border: none;
  border-bottom: 2px solid rgb(0, 255, 0);
  background: none;
}

.telegram-channels {
    overflow-y: hidden;
    background: #010300a3;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    backdrop-filter: blur(5px);
}
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

.earn-title {
  margin: 25px 10px;
  font-size: 24px;
  font-weight: bold;
  text-align: center;
}
.channels-title {
  margin: 10px;
  font-size: 24px;
  font-weight: bolder;
}

.channel-info {
  display: flex;
  flex-direction: column;
  /* font-size: 18px; */
}

.channel-action {
  display: flex;
  align-items: center;
}

.name,
.description,
.reward {
  margin-right: 15px;
}

.button {
  padding: 10px 10px;
  background: #000000;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: large;
  font-weight: bold;
}

.boost-purchase-popup {
  transform: translateY(100%); /* Start off the bottom of the screen */
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: flex-end; /* Align the modal at the bottom */
  z-index: 1000;
  transition: transform 0.2s ease; /* Smooth transition for the transform property */
  color: white;
}

.boost-purchase-popup.visible {
  transform: translateY(0); /* Position it inside the viewport */
}

.popup-content {
  position: relative;
  background: rgba(256,256,256,.15);
  backdrop-filter: blur(100px);
  -webkit-backdrop-filter: blur(300px);
  border-radius: 10px 10px 0 0; /* Тільки верхні кути округлені */
  z-index: 1001;
  padding: 20px 20px 45px;
  width: 100%;
  box-shadow: 0 0 30px 10px rgba(0, 0, 0, 0.5);
}

.popup-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.close-button {
    border: none;
    background: none;
    cursor: pointer;
    font-size: 24px;
    color: white;
}

.popup-body h3,
.popup-body p {
    margin: 10px 0;
}

.boost-purchase-button {
    padding: 10px 20px;
    border: none;
    background-color: #2c2c2c;
    color: white;
    width: 100%;
    font-size: 20px;
    font-weight: bold;
    border-radius: 5px;
    cursor: pointer;
}

.boost-desc-hint {
    color: #c5c5c5;
    font-size: 14px;
}

.price-hint {
    color: #aeaeae;
    margin-left: 5px;
    font-size: 12px;
}
</style>
