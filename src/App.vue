<script setup lang="ts">
import {onMounted, onUnmounted, ref, watchEffect} from 'vue'
import {useWebAppViewport, useWebApp, useWebAppBackButton, useWebAppTheme, useWebAppClosingConfirmation} from 'vue-tg'
import { useUserStore } from './store/user'
import { useRoute, useRouter } from 'vue-router';
import Popup from '@/components/Popup.vue'
import {useI18n} from "vue-i18n";
import { skins } from './components/skins/skinBase';

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const { getCurrentBg } = userStore

useWebAppViewport().expand()
useWebAppClosingConfirmation().enableClosingConfirmation()
useWebAppTheme().headerColor.value = "#ff72e3";
useWebAppTheme().backgroundColor.value = "#ff72e3";

useWebAppBackButton().onBackButtonClicked(() => {
  router.push("/")
  useWebAppBackButton().hideBackButton()
})

let rechargeID: NodeJS.Timeout | null

const farmerPopup = ref(false)
const farmerPopupText = ref("")
const farmerProfit = ref(0)
const farmerClosed = ref(false)
const farmerPopupClose = () => {
  const user = useUserStore()
  if (user.user && !farmerClosed.value) {
    user.user.balance += farmerProfit.value
    farmerClosed.value = true
  }
}
onMounted(() => {
  const { locale } = useI18n();
  console.log(import.meta.env.VITE_API_HOST);
  userStore.testRequest();  

  userStore.login(useWebApp().initData).then(user => {
    console.log(user)
    userStore.getSkins().then(mySkins => {
      if(mySkins > 1)
      {
        for(let i = 0; i < mySkins; i++)
        {
            skins[i].isUnlock = true;
        } 
      }

      if (!user) {
        isUserLoggedIn.value = true
        return
      }
      locale.value = user.language_code;
      isUserLoggedIn.value = true
      if (user.auto_farmer_profit > 0) {
        farmerPopup.value = true
        farmerPopupText.value = `The Farmer mined ${user.auto_farmer_profit} coins.`
        farmerProfit.value = user.auto_farmer_profit
      }
    })
  })

  rechargeID = setInterval(() => {
    userStore.recharge()
  }, 1000)
})

onUnmounted(() => {
  if (rechargeID) clearInterval(rechargeID)
})

watchEffect(() => {
  if (route.path !== '/') {
    useWebAppBackButton().showBackButton()
  }
})

const isUserLoggedIn = ref(false);
console.log(isUserLoggedIn);
</script>

<template>
  <RouterView v-if="isUserLoggedIn" />
  <Popup v-if="farmerPopup" header="👨‍🌾 Auto farmer" :body="farmerPopupText" action="Claim" :closeCallback="farmerPopupClose"></Popup>
</template>

<style scoped></style>
