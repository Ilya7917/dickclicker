<script lang="ts" setup>
import { useUserStore } from '@/store/user';
import { onMounted, ref } from 'vue';
import Balance from '../account/Balance.vue';
import { useWebAppPopup } from 'vue-tg'
import question from "@/assets/images/question.svg";
import {useWebAppViewport, useWebApp, useWebAppBackButton, useWebAppTheme, useWebAppClosingConfirmation} from 'vue-tg'
import moment from 'moment';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
const userStore = useUserStore()
userStore.getBoosts()
const isPopupVisible = ref(false);
const justOpened = ref(false);
const lootboxContent = ref({
    coin: 0,
    energy: 0,
    isOpen: false
});



/* skinArea */
import { skins } from './skinBase';
import { kStringMaxLength } from 'buffer';
const { setSkin, getCurrentSkin } = userStore;



onMounted(()=>{
    if(getCurrentSkin === null) return;
    mySkin.value.id = getCurrentSkin;
})

function closePopup() {
  if (justOpened.value) {
    justOpened.value = false;
    return;
  }
  isPopupVisible.value = false;
}
console.log(moment(userStore.user?.daily_booster_available_at).isBefore(new Date()))
console.log(userStore.user?.daily_booster_available_at.toString())
console.log(moment(userStore.user?.daily_booster_available_at).toString())
console.log(new Date())
console.log(moment().toString())
const selectedBoost = ref({
    id: 'multitap',
    name: '👆 Multitap',
    description: 'Increase amount of coins you can earn per one tap',
    nextLevelSpec: [''],
    price: 1999,
    next_level: 5,
    level: 1,
    action: t("boosts.upgrade")
});


const selectedSkin = ref({
    id: 0,
    price: 1000
});

const mySkin = ref({
    id: 0
})

function showPurchasePopup(boost: string) {
    if (!userStore.boosts || !userStore.user) {
        return;
    }
    switch (boost) {
        case 'multitap':
            if (userStore.boosts?.mine_level_price > userStore.user.balance) {
                useWebAppPopup().showAlert(t("account.youDontHaveEnough"))
                return;
            }
            selectedBoost.value = {
                id: 'multitap',
                name: '👆 '+t("boosts.multitap.name"),
                description: t("boosts.multitap.description"),
                nextLevelSpec: [t("boosts.multitap.nextLevelSpec")],
                price: userStore.boosts?.mine_level_price,
                next_level: userStore.boosts?.current_mine_level + 1,
                level: userStore.boosts?.current_mine_level,
                action: t("boosts.upgrade")
            }
            break;
        case 'energy':
            if (userStore.boosts?.current_energy_level >= 4) {
                return;
            }
            if (userStore.boosts?.energy_level_price > userStore.user.balance) {
                useWebAppPopup().showAlert(t("account.youDontHaveEnough"))
                return;
            }
            selectedBoost.value = {
                id: 'energy',
                name: '👆 '+t("boosts.energy.name"),
                description: t("boosts.energy.description"),
                nextLevelSpec: [t("boosts.energy.nextLevelSpec")],
                price: userStore.boosts?.energy_level_price,
                next_level: userStore.boosts?.current_energy_level + 1,
                level: userStore.boosts?.current_energy_level,
                action: t("boosts.upgrade")
            }
            break;
        case 'max_energy':
            if (userStore.boosts?.max_energy_price > userStore.user.balance) {
                useWebAppPopup().showAlert(t("account.youDontHaveEnough"))
                return;
            }
            selectedBoost.value = {
                id: 'max_energy',
                name: '⚡️ '+t("boosts.maxEnergy.name"),
                description: t("boosts.maxEnergy.description"),
                nextLevelSpec: [t("boosts.maxEnergy.nextLevelSpec")],
                price: userStore.boosts?.max_energy_price,
                next_level: userStore.user?.max_energy_level + 2,
                level: userStore.user?.max_energy_level + 2,
                action: t("boosts.upgrade")
            }
            break;
        case 'daily_lootbox':
            if (moment(userStore.user?.daily_booster_available_at).isAfter(moment())) {
                useWebAppPopup().showAlert("Daily lootbox unavailable yet")
                return;
            }
            selectedBoost.value = {
                id: 'daily_lootbox',
                name: '🎁 '+t("boosts.dailyLootbox.name"),
                description: t("boosts.dailyLootbox.description"),
                nextLevelSpec: [
                  t("boosts.dailyLootbox.nextLevelSpec.balance"),
                  t("boosts.dailyLootbox.nextLevelSpec.energy")
                ],
                price: 0,
                next_level: 0,
                level: 0,
                action: t("boosts.open")
            }
            break;
        case 'auto_farmer':
            if (userStore.user?.auto_farmer) {
                useWebAppPopup().showAlert("Your auto farmer already works")
                return;
            }
            if (userStore.boosts?.auto_farmer_price > userStore.user.balance) {
                useWebAppPopup().showAlert("You don't have enough coins to buy this")
                return;
            }
            selectedBoost.value = {
                id: 'auto_farmer',
                name: '👨‍🌾 '+t("boosts.autoFarmer.name"),
                description: t("boosts.autoFarmer.description"),
                nextLevelSpec: [
                  t("boosts.autoFarmer.nextLevelSpec.value"),
                  t("boosts.autoFarmer.nextLevelSpec.max")
                ],
                price: userStore.boosts?.auto_farmer_price,
                next_level: 0,
                level: 0,
                action: t("boosts.buy")
            }
            break;
    }
    isPopupVisible.value = true;
    justOpened.value = true;
}

function setNewUserDick(id: number){
    if (!userStore.user) {
        return;
    }
    console.log(`Clicked skin: ${id}`);
    if(skins[id].isUnlock)
    {
        setSkin(id);
        mySkin.value.id = id;
        userStore.updateUserCurrentSkin(id);
    }
    else
    {
        if(id != 0 && skins[id - 1].isUnlock)
        {
            if ((1000 * id) > userStore.user.balance) {
                useWebAppPopup().showAlert("You don't have enough coins to buy this")
                return;
            }
            isPopupVisible.value = true;
            justOpened.value = true;
            selectedSkin.value.id = id;
            selectedSkin.value.price = 1000 * id;
            console.log(isPopupVisible.value)
        }
    }
}

function buyNewDick() {
    if (!userStore.user) {
        return;
    }
    userStore.buyNewSkin(selectedSkin.value.id).then(result => {
        if(result)
        {
            skins[selectedSkin.value.id].isUnlock = true;
            setSkin(selectedSkin.value.id);
            mySkin.value.id = selectedSkin.value.id;
            isPopupVisible.value = false;
            justOpened.value = false;
        }
    });
}



function checkBeforeIndex(index: number) {
    if(index <= 0) return;
    if(skins[index - 1].isUnlock) return true;
}

const purchaseBoost = () => {
    if (selectedBoost.value.id === 'daily_lootbox') {
        // Припустимо, ви вирішили, що в коробці "випало" 1000 монет
        lootboxContent.value.coin = 500;
        lootboxContent.value.isOpen = true;
        // Показати анімацію випадання предмета
        // Тут можна використати setTimeout, щоб показати анімацію після невеликої затримки
        userStore.openDailyBooster().then(dailyBooster => {
            lootboxContent.value.coin = dailyBooster?.coin ?? 0
            lootboxContent.value.energy = dailyBooster?.energy ?? 0
            isPopupVisible.value = true;
            if (userStore.user && dailyBooster) {
                userStore.user.balance += lootboxContent.value.coin
                userStore.user.energy += lootboxContent.value.energy
                userStore.user.daily_booster_available_at = dailyBooster.next_at
            }
        })
    } else {
        userStore.purchaseBoost(selectedBoost.value.id)
    }
    closePopup()
}
const claimDailyBooster = () => {
    lootboxContent.value.isOpen = false
    lootboxContent.value.coin = 0
    lootboxContent.value.energy = 0

    closePopup()
}
</script>

<template>
    <Balance />
    <div class="Bg"></div>
    <div class="boosts">
        <div v-for="skin in skins" :key="skin.id">
                <div :class="{'boost-active': skin.id === mySkin.id, 'boost': skin.id !== mySkin.id}" 
                    @click="setNewUserDick(skin.id)">
                    <img v-if="skin.isUnlock" :src="skin.skin" :alt="'Skin ' + skin.id" :style="{ width: '170px', height: '170px' }">
                    <div v-else class="lockImagePrice">
                        <img :src="question" :style="{ width: '100px', height: '100px' }" />
                        <span v-if="checkBeforeIndex(skin.id)" :style="{ color: '#aeaeae', fontSize: '25px', marginTop: '15px'}">{{ 1000 * skin.id }}🍆</span>
                    </div>
                </div>
        </div>
    </div>
    <!-- Модальне вікно для купівлі бусту -->
    <div class="boost-purchase-popup" :class="{ 'visible': isPopupVisible }">
<!--        <div class="popup-overlay" @click="closePopup"></div>-->
        <div class="popup-content"  v-click-outside="closePopup">
            <div class="popup-header">
                <h2>New skin</h2>
                <button class="close-button" @click="closePopup">
                  <svg class="close-icon" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 30 30" width="16px" height="16px">
                    <path d="M 7 4 C 6.744125 4 6.4879687 4.0974687 6.2929688 4.2929688 L 4.2929688 6.2929688 C 3.9019687 6.6839688 3.9019687 7.3170313 4.2929688 7.7070312 L 11.585938 15 L 4.2929688 22.292969 C 3.9019687 22.683969 3.9019687 23.317031 4.2929688 23.707031 L 6.2929688 25.707031 C 6.6839688 26.098031 7.3170313 26.098031 7.7070312 25.707031 L 15 18.414062 L 22.292969 25.707031 C 22.682969 26.098031 23.317031 26.098031 23.707031 25.707031 L 25.707031 23.707031 C 26.098031 23.316031 26.098031 22.682969 25.707031 22.292969 L 18.414062 15 L 25.707031 7.7070312 C 26.098031 7.3170312 26.098031 6.6829688 25.707031 6.2929688 L 23.707031 4.2929688 C 23.316031 3.9019687 22.682969 3.9019687 22.292969 4.2929688 L 15 11.585938 L 7.7070312 4.2929688 C 7.5115312 4.0974687 7.255875 4 7 4 z"/>
                  </svg>
                </button>
            </div>
            <div class="popup-body">
                <p>Unlock new skin?</p>
                <p v-for="spec in selectedBoost.nextLevelSpec" class="boost-desc-hint">{{ spec }}</p>
                <p v-if="selectedBoost.price != 0">🍆{{ selectedSkin.price }}</p>
                <button class="boost-purchase-button" @click="buyNewDick">Buy new skin</button>
            </div>
        </div>
    </div>
    <!-- Умовно відображаємо вміст коробки, якщо він існує
    <div v-if="lootboxContent.isOpen" class="lootbox-item">
        {{ lootboxContent }}
    </div> -->
</template>

<style scoped>
.boosts-title {
    margin: 10px;
    font-size: 24px;
}


.Bg{
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: #010300a3;
    position: absolute;
}

.lockImagePrice {
    width: 170px;
    height: 170px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}

.lockImage {
    visibility: hidden;
    width: 170px;
    height: 170px;
    background: #2c2c2c;
}

.boosts {
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    backdrop-filter: blur(5px);
}

.boostContainer{
    display: flex;
    flex-wrap: wrap;
}

.boost {
    display: flex;
    align-items: center;
    margin: 10px;
    background: rgb(167 167 167 / 21%);
    color: #fff;
    padding: 10px;
    border-radius: 15px;
    cursor: pointer;
}

.boost-active {
    display: flex;
    align-items: center;
    margin: 10px;
    background: rgba(167, 167, 167, 0.533);
    color: #fff;
    padding: 10px;
    border-radius: 15px;
    cursor: pointer;
}

.daily-boost {
    background: rgb(99 162 87 / 39%);
}

.icon-box {
    display: flex;
    align-items: center;
    justify-content: center;
    /* Center the icon vertically and horizontally */
    margin-right: 10px;
    /* Add some space between the icon and the text */
    background: rgba(128, 128, 128, 0.2);
    color: #fff;
    padding: 10px;
    font-size: 20px;
    border-radius: 15px;
    /* Apply rounded corners */
    width: 40px;
    /* Set a fixed width for a square shape */
    height: 40px;
    /* Set a fixed height for a square shape */
}

.text-container {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
}

.text-container>div {
    display: flex;
    justify-content: space-between;
    font-size: 15px;
}

.price {
    font-weight: 500;
    color: #ffffff;
    /* Gold color for the price */
    font-size: 16px;
    /* Smaller font size for the price */
}

.badge {
    background: rgb(112 182 60);
    color: white;
    padding: 2px 8px;
    font-size: 12px;
    border-radius: 10px;
    margin-left: 5px;
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
  backdrop-filter: blur(30px);
  -webkit-backdrop-filter: blur(30px);
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

@keyframes drop {
    0% {
        opacity: 0;
        transform: translateY(-20px);
    }

    100% {
        opacity: 1;
        transform: translateY(0);
    }
}

.lootbox-items {
    animation: drop 0.5s ease-out;
    /* Застосовуємо анімацію до елементу */
}

.lootbox-item {
    margin-top: 10px;
}
</style>
