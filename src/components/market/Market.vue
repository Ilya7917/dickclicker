<script lang="ts" setup>
import { useWebAppNavigation } from 'vue-tg'
import { onMounted, ref } from "vue";
import { useWebAppPopup } from 'vue-tg'
import { useI18n } from 'vue-i18n';
import AddIcon from "@/assets/images/addIcon.svg";
import { useUserStore } from '@/store/user';
import { useMarketStore } from '@/store/marketstore'

import MarketItem from './MarketItem.vue';

const { t } = useI18n();

const wn = useWebAppNavigation();
const isPopupVisible = ref(false);
const popupVisibleState = ref('member')
const isCanView = ref(false);

const userStore = useUserStore();
const marketStore = useMarketStore();

const myUserId = ref(0);


const fetchFunction = () => {
  marketStore.fetchAllActiveOrders().then(status => {
    if(status) {
      if (marketStore.orders && myUserId) {
        // Фильтрация элементов, которые подходят под условия
        const [filteredOrders, removedOrders] = marketStore.orders.reduce(
          ([filtered, removed]: [order[], order[]], order) => {
            const isOwnerNotMyUserId = order.OwnerID == myUserId.value;

            const isCloseWithUserIdValid = order.CloseWithUserID == myUserId.value;

            if (isOwnerNotMyUserId || isCloseWithUserIdValid) {
              // Элемент подходит под условия удаления
              removed.push(order);
            } else {
              // Элемент остается в списке orders
              if(order.Status == 'active') {
                filtered.push(order);
              }
            }

            return [filtered, removed];
          },
          [[], []] // Начальные значения: [для отфильтрованных, для удаленных]
        );

        // Обновляем массивы в store
        marketStore.orders = filteredOrders;
        marketStore.myOrders = removedOrders;
      }
      isCanView.value = true;
    }
  });
}

const fetchOrderMembers = (orderId: number) => {
  marketStore.fetchOrderMembers(orderId).then(result => {
    if(result){
      membersOfOrder.value = result;
      let meInMembers = membersOfOrder.value?.findIndex(x => x.UserID == myUserId.value);
      if(meInMembers == -1){
        canShowStartOrderButton.value = true;
      } else {
        canShowStartOrderButton.value = false;
      }
    }
  })
}

onMounted(() => {
  fetchFunction();
  if(userStore.user?.id != undefined){ 
   myUserId.value = userStore.user?.id
  }
});


function closePopup() {
  if(popupState.value == 'create') return;
  isPopupVisible.value = false;
}



const popupState = ref("visible");



const pageState = ref('market')
const progressPost = ref(0);

const changePageState = (state: string) => { 
  pageState.value = state;
}

const isNextButton = ref(true);
const progressNewPosts = [
    {
        id: 0,
        isActive: true,
        text: "Add amount"
    },
    {
        id: 1,
        isActive: false,
        text: "Payment methods"
    },
    {
        id: 2,
        isActive: false,
        text: "Add price"
    }
]

const nextButtonChangeState = () => {
    progressPost.value++;
    progressNewPosts[progressPost.value].isActive = true;
}

const newMarketItem = ref<{
    amount: number;
    paymentMethods: string[];
    price: number;
}>({
    amount: 0,
    paymentMethods: [],
    price: 0,
});

interface orderMembers {
  ID:number;
  OrderID: number;
  UserAvatar: string;
  UserID: number;
  Username: string;
}

const membersOfOrder = ref<orderMembers[]>()

let selectedOrder = ref<order | undefined>(undefined)

interface order {
  ID: number;
  Amount: number;
  OwnerID: number;
  OwnerAvatar: string;
  OwnerName: string;
  PaymentMethods: string[];
  Price: number;
  Status: string;
  CloseWithUserID: number | null;
}

const visibleOrderPage = ref('order');
const canShowStartOrderButton = ref(false);

const addPaymentMethod = (method: string) => {
    if(newMarketItem.value.paymentMethods.findIndex(x => x == method) == -1) {
        newMarketItem.value.paymentMethods.push(method);
    } else {
        useWebAppPopup().showAlert("❌ Вы уже добавили этот метод оплаты ❌")
        return;
    }
}

const removePaymentMethod = (method: string) => {
  newMarketItem.value.paymentMethods.splice(newMarketItem.value.paymentMethods.findIndex(x => x == method), 1);
}

const getPaymentMethodNameBySuffix = (pName: string) => {
  switch(pName) {
    case "vm":
      return "Visa/MasterCard 💳";
      break;
    case "ton":
      return "TON wallet 💱";
      break;
    case "qiwi":
      return "Qiwi wallet 💵"
  }
}

const createNewOrder = () => {
  if(newMarketItem.value.amount <= 0) {
    useWebAppPopup().showAlert("❌ Ошибка. Нельзя создать сделку с 0 количеством коинов")
  }

  if(newMarketItem.value.paymentMethods.length == 0) {
    useWebAppPopup().showAlert("❌ Ошибка. Нужно добавить хотя бы 1 метод оплаты")
  }

  if(userStore.user?.username == null || userStore.user.username == undefined || userStore.user.username.trim() === ''){
    useWebAppPopup().showAlert("❌ Ошибка. У вас отсутствует ссылка на профиль, перейдите в настройки telegram и в поле 'имя пользователя' впишите своё имя пользователя. Иначе участники маркета не смогут с вами связаться.❌ \n ⚠️ Обязательно перезапустите кликер ⚠️")
    return;
  }

  marketStore.createNewOrder(newMarketItem.value).then(() => {
    fetchFunction();
      pageState.value = 'market';
      progressPost.value = 0;
      progressNewPosts.forEach(x => {
        if(x.id != 0) x.isActive = false;
      });
  });
}

const changeVisibleState = (state :string, order :order) => {
  pageState.value = 'visible';
  visibleOrderPage.value = state;
  selectedOrder.value = order;
  console.log(selectedOrder)
  fetchOrderMembers(order.ID);
}

const createOrderMember = () => {
  
  if(userStore.user == null) return;
  if(selectedOrder.value?.Amount != null && userStore.user.balance < selectedOrder.value.Amount) {
    useWebAppPopup().showAlert(`⚠️ У вас недостаточно 🍆 чтобы продать их ${selectedOrder.value.OwnerName} ⚠️`)
    return;
  }

  if(selectedOrder != null && selectedOrder.value?.ID != undefined){
    canShowStartOrderButton.value = false;
    marketStore.createOrderMember(selectedOrder.value?.ID, selectedOrder.value.OwnerID).then(status => {
      if(status) {
        fetchOrderMembers(selectedOrder.value?.ID !== undefined ? selectedOrder.value.ID : 0);
      }
    });
  }
}

const deleteMyOrder = (orderId: number) => {
  marketStore.deleteMyOrder(orderId).then(status => {
    if(status) {
      fetchFunction();
      isCanView.value = false;
      changePageState('market');
    }
  });
}

const selectedMember = ref({
   ID: 0,
   Username: '',
   MemberId: 0
})

const openOrderMemberPopup = (id: number, name: string, memberId:number, popupState: string) => {
  selectedMember.value.ID = id;
  selectedMember.value.Username = name;
  selectedMember.value.MemberId = memberId
  isPopupVisible.value = true;
  popupVisibleState.value = popupState
}

const startOrder = () => {
  marketStore.startOrder(selectedMember.value.ID, selectedMember.value.MemberId).then(result => {
    if(result) {
      isPopupVisible.value = false;
      fetchFunction();
      fetchOrderMembers(selectedOrder.value?.ID != null ? selectedOrder.value?.ID : 0)
      if (selectedOrder.value) {
        selectedOrder.value.Status = "progress";
      } 
    }
  })
}

const finishOrder = () => {
  if(selectedOrder.value != null) {
   marketStore.finishOrder(selectedOrder.value.ID).then(result => {
    if(result){
      isPopupVisible.value = false;
      pageState.value = 'market'
      fetchFunction();
    }
   })
  }
}

</script>

<template>

  <div class="telegram-channels">
    <div v-if="pageState != 'create'" class="earn-title">
        🛒 {{ $t("bottomMenu.market") }}
    </div>

    <div v-if="pageState === 'create'" class="createPostMenu">
        <button class="mypost-button" :style="{ marginTop: '10px' }" @click="changePageState('market')">Назад</button>
        <div :style="{ marginTop:'20px' }">
            <ul id="progressbar">
                <li v-for="item in progressNewPosts" :class="item.isActive ? 'active' : ''">{{  item.text }}</li>
            </ul>
        </div>
        <div class="createForm">
            <div v-if="progressPost === 0" :style="{ display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center' }">
              <label for="fname" >Количество коинов, которое вы планируете купить</label>
              <input type="number" id="fname" :style="{ width: '70%', color:'white'}" name="fname" v-model="newMarketItem.amount">
            </div>
            <div v-if="progressPost === 1" :style="{ display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center' }">
              <label for="fname" :style="{ fontSize:'18px' }">Способ оплаты, который будет удобен вам</label>
              <div class="sec-center" :style="{ marginTop:'20px' }"> 	
                <input class="dropdown" type="checkbox" id="dropdown" name="dropdown"/>
                <label class="for-dropdown" for="dropdown">Добавить способ оплаты</label>
                <div class="section-dropdown"> 
                    <a @click="addPaymentMethod('vm')">Visa/MasterCard <i class="uil uil-arrow-right">💳</i></a>
                    <a @click="addPaymentMethod('ton')">TON wallet  <i class="uil uil-arrow-right">💱</i></a>
                    <a @click="addPaymentMethod('qiwi')">Qiwi wallet<i class="uil uil-arrow-right">💵</i></a>
                </div>
                <div v-if="newMarketItem.paymentMethods.length > 0" :style="{ marginTop:'25px' }">
                    <div v-for="item in newMarketItem.paymentMethods" :style="{ display:'flex' }">
                        <div :style="{ width: '200px', height:'50px', border:'3.5px solid gray', textAlign:'center', justifyContent:'center', alignItems:'center', display:'flex'}">
                          <span>{{ getPaymentMethodNameBySuffix(item) }}</span>
                        </div>
                        <div :style="{ height:'50px', border:'3.5px solid white', width:'50px', display:'flex', justifyContent:'center', alignItems:'center' }" @click="removePaymentMethod(item)">
                          <span>❌</span>
                        </div>
                    </div>
                </div>
              </div>
            </div>
            <div v-if="progressPost === 2" :style="{ display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center' }">
                <label for="fname" >За сколько вы хотите приобрести коины? (в USD)</label>
                <input type="number" id="fname" :style="{ width: '70%', color:'white' }" name="fname" v-model="newMarketItem.price">
                <div v-if='isNextButton'>
                    <button class="mypost-button" :style="{ marginTop: '30px' }" @click="createNewOrder()">Создать</button>
                </div>
            </div>

            
        </div>
        <div v-if="progressPost < 2" :style="{ display:'flex', justifyContent:'center' }">
            <button class="mypost-button" :style="{ marginTop: '30px' }" @click="nextButtonChangeState">Дальше</button>
        </div>
    </div>

    <div v-if="pageState == 'market'" :style="{ display:'flex', flexDirection:'column', justifyContent:'space-between' }">
        <div :style="{ height:'40vh' }">
          <div class="channels-title" :style="{display:'flex', justifyContent:'space-between'}">
            <button class="boost-purchase-button" :style="{margin: '15px 25px'}" @click="">Купить</button>
            <button class="boost-purchase-button" :style="{margin: '15px 25px', opacity:'0.4'}" @click="useWebAppPopup().showAlert('🛠️ Coming soon')">Продать</button>
          </div>
          <div :style="{display: 'flex', width:'100%', justifyContent:'flex-end'}" @click="changePageState('create')">
              <img :src="AddIcon" alt="Your Icon" :style="{ height: '45px', marginRight:'15px' }" />
          </div>
          <div v-if="isCanView" class="channels-list">
            <MarketItem :orders="marketStore.myOrders != undefined ? marketStore.myOrders : []" :myUserId="myUserId" :changeVisibleState="changeVisibleState" :getPaymentMethodNameBySuffix="getPaymentMethodNameBySuffix" />
            <MarketItem :orders="marketStore.orders != undefined ? marketStore.orders : []" :myUserId="myUserId" :changeVisibleState="changeVisibleState" :getPaymentMethodNameBySuffix="getPaymentMethodNameBySuffix" />
          </div>
        </div>
    </div>


    <div v-if="pageState == 'visible'">
      <button class="boost-purchase-button" :style="{ width:'40%' }" @click="changePageState('market')">Назад</button>
      <div :style="{ display:'flex', justifyContent:'center' }">
          <span :style="{ fontSize:'30px', fontWeight:'bold' }">{{ selectedOrder?.OwnerID !== myUserId ? "" : "Ваш "}} Ордер №{{ selectedOrder?.ID }}</span>
      </div>
      <div v-if="selectedOrder?.OwnerID !== myUserId">
        <div :style="{ display:'flex', flexDirection:'column', marginLeft:'5%', marginTop:'20px' }">
          <div :style="{ display:'flex' }">
            <span :style="{ fontSize:'23px'}">Пользователь: {{ selectedOrder?.OwnerName }}</span>
            <img v-if="selectedOrder?.OwnerAvatar != null" :src="selectedOrder.OwnerAvatar" :style="{ height:'30px', borderRadius:'100px'}" />
            <div v-else :style="{ height:'30px', width:'30px', borderRadius:'100px', background:'gray', justifyContent:'center', alignItems:'center', display:'flex' }">👤</div>
          </div>
          <div>
            <span :style="{ fontSize:'23px'}">Хочет купить {{ selectedOrder?.Amount }}🍆 за {{ selectedOrder?.Price }}💲</span>
          </div>
          <div>
            <span :style="{ fontSize:'23px'}">Предпочтительные способы оплаты для {{ selectedOrder?.OwnerName }}:</span>
            <div>
              <div v-for="method in selectedOrder?.PaymentMethods" :style="{ border:'3.5px solid gray', width:'170px', textAlign:'center', marginTop:'7px' }">
                      <span>{{ getPaymentMethodNameBySuffix(method) }}</span>
              </div>
            </div>
          </div>
        </div>
        <div v-if="canShowStartOrderButton && selectedOrder?.Status == 'active'" :style="{display:'flex', justifyContent:'center', marginTop:'40px'}">
          <button class="boost-purchase-button" :style="{ width:'70%', backgroundColor:'#3f8b1e' }" @click="createOrderMember()">Продать 🍆 {{ selectedOrder?.OwnerName }}`y</button>
        </div>
        <div v-if="selectedOrder?.Status != 'closed'">
          <div v-if="membersOfOrder != undefined && membersOfOrder?.findIndex(x => x.UserID == myUserId) != -1 && membersOfOrder?.length > 0" :style="{ display:'flex', justifyContent:'center', alignItems:'center', textAlign:'center', marginTop:'30px' }">
            <span v-if="selectedOrder?.Status == 'active'">Ваш запрос успешно создан, вы начнёте сделку, когда пользователь {{ selectedOrder?.OwnerName }} примет ваш запрос</span>
            <div v-else> 
              <span :style="{ fontSize:'19px' }">{{ selectedOrder?.OwnerName }} принял ваш запрос на сделку</span>
              <button class="boost-purchase-button" :style="{ width:'70%', marginTop:'30px' }" @click="wn.openTelegramLink(`https://t.me/${selectedOrder?.OwnerName}`)">Связаться с {{ selectedOrder?.OwnerName }}</button>
              <button class="boost-purchase-button" :style="{ width:'70%', marginTop:'30px' }" @click="selectedOrder != null ? openOrderMemberPopup(selectedOrder?.ID, selectedOrder.OwnerName, selectedOrder.OwnerID, 'confirm') : null">Отпустить коины</button>
            </div>
          </div>
        </div>
        <div v-else>
          <div :style="{ display:'flex', justifyContent:'center', marginTop:'20px' }">
                <span :style="{ fontSize:'23px' }">Вы закрыли сделку с: {{ selectedOrder?.OwnerName }}</span>
          </div>
        </div>
      </div>
      <div v-else>
        <div :style="{ display:'flex', flexDirection:'column', marginLeft:'5%', marginTop:'20px' }">
          <div :style="{ display:'flex' }">
            <span :style="{ fontSize:'23px'}">{{ selectedOrder?.OwnerName }}</span>
            <img v-if="selectedOrder?.OwnerAvatar != null" :src="selectedOrder.OwnerAvatar" :style="{ height:'30px', borderRadius:'100px'}" />
            <div v-else :style="{ height:'30px', width:'30px', borderRadius:'100px', background:'gray', justifyContent:'center', alignItems:'center', display:'flex' }">👤</div>
          </div>
          <div>
            <span :style="{ fontSize:'23px'}">Собираетесь купить {{ selectedOrder?.Amount }}🍆 за {{ selectedOrder?.Price }}💲</span>
          </div>
          <div>
            <span :style="{ fontSize:'23px'}">Ваши сопсобы оплаты:</span>
            <div>
              <div v-for="method in selectedOrder?.PaymentMethods" :style="{ border:'3.5px solid gray', width:'170px', textAlign:'center', marginTop:'7px' }">
                      <span>{{ getPaymentMethodNameBySuffix(method) }}</span>
              </div>
            </div>
          </div>

          <div v-if="selectedOrder.Status == 'active'" class='orderSettingButtons' :style="{ display:'flex', justifyContent:'center', marginTop:'20px' }">
            <button class="boost-purchase-button" :style="{ width:'60%' }" @click="deleteMyOrder(selectedOrder.ID)">Удалить сделку</button>
          </div>
          
          <div v-if="selectedOrder.Status != 'closed'">
            <div v-if="membersOfOrder != undefined && membersOfOrder?.length > 0" :style="{ textAlign:'center', marginTop:'20px'}">
              <div v-if="selectedOrder.Status == 'active'">
                <span :style="{ fontSize:'19px'}"> Желающие купить коины: </span>
                <div v-for="user in membersOfOrder" :key="user.ID" @click="openOrderMemberPopup(user.OrderID, user.Username, user.UserID, 'member')" class="channel" :style="{ marginLeft:'-10px'}">
                  <div class="channel-info" :style="{ display:'flex', flexDirection:'row', justifyContent:'center', alignItems:'center' }">
                    <img v-if="user.UserAvatar != null && user.UserAvatar !== ''" :src="user.UserAvatar" :style="{ height:'30px', borderRadius:'100px'}" />
                    <div v-else :style="{ height:'30px', width:'30px', borderRadius:'100px', background:'gray', justifyContent:'center', alignItems:'center', display:'flex' }">👤</div>
                    <span class="name" :style="{ marginLeft:'10px', fontSize:'18px' }">{{ user.Username }}</span>
                  </div>
                  <div class="channel-action">
                    <svg class="arrow">
                      <use xlink:href="@/assets/images/sprite.svg#chevron-right"></use>
                    </svg>
          <!--          <button v-if="channel.is_available" class="button" @click="openChannelLink(channel)">Join</button>-->
                  </div>
                </div>
              </div>
              <div v-else>
                <span :style="{ fontSize:'23px' }">Вы торгуете с: {{ membersOfOrder[0].Username }}</span>
                <button class="boost-purchase-button" :style="{ width:'80%', marginTop:'30px' }" @click="wn.openTelegramLink(`https://t.me/${membersOfOrder[0].Username}`)">Связаться с {{ membersOfOrder[0].Username }}</button>
              </div>
            </div>
            <div v-else :style="{ textAlign:'center', marginTop:'20px' }">
              <span :style="{ fontSize:'19px', marginLeft:'-15px'}">ⓘ Запросов на сделку ещё не поступало ⓘ</span>
            </div>
          </div>
          <div v-else>
            <div :style="{ display:'flex', justifyContent:'center', marginTop:'20px' }">
                <span :style="{ fontSize:'23px' }">Вы закрыли сделку с: {{ membersOfOrder != undefined ? membersOfOrder[0].Username : "" }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>


    <div v-if="isPopupVisible" class="boost-purchase-popup" :class="{ 'visible': isPopupVisible }">
        <div v-if="popupVisibleState == 'member'" class="popup-content">
            <div class="popup-header">
                <h2>{{ selectedMember.Username }}</h2>
                <button class="close-button" @click="isPopupVisible = false;">
                  <svg class="close-icon" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 30 30" width="16px" height="16px">
                    <path d="M 7 4 C 6.744125 4 6.4879687 4.0974687 6.2929688 4.2929688 L 4.2929688 6.2929688 C 3.9019687 6.6839688 3.9019687 7.3170313 4.2929688 7.7070312 L 11.585938 15 L 4.2929688 22.292969 C 3.9019687 22.683969 3.9019687 23.317031 4.2929688 23.707031 L 6.2929688 25.707031 C 6.6839688 26.098031 7.3170313 26.098031 7.7070312 25.707031 L 15 18.414062 L 22.292969 25.707031 C 22.682969 26.098031 23.317031 26.098031 23.707031 25.707031 L 25.707031 23.707031 C 26.098031 23.316031 26.098031 22.682969 25.707031 22.292969 L 18.414062 15 L 25.707031 7.7070312 C 26.098031 7.3170312 26.098031 6.6829688 25.707031 6.2929688 L 23.707031 4.2929688 C 23.316031 3.9019687 22.682969 3.9019687 22.292969 4.2929688 L 15 11.585938 L 7.7070312 4.2929688 C 7.5115312 4.0974687 7.255875 4 7 4 z"/>
                  </svg>
                </button>
            </div>
            <div>
              <span>Отправил вам запрос на сделку, хотите торговать с {{ selectedMember.Username }}?</span>
            </div>
            <div :style="{ display:'flex', justifyContent:'center', marginTop:'20px' }">
              <button class="boost-purchase-button" :style="{ width:'60%' }" @click="startOrder()">Начать сделку</button>
            </div>
        </div>
        <div v-else class="popup-content">
            <div class="popup-header">
                <h2>Сделка с {{ selectedMember.Username }}</h2>
                <button class="close-button" @click="isPopupVisible = false;">
                  <svg class="close-icon" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 30 30" width="16px" height="16px">
                    <path d="M 7 4 C 6.744125 4 6.4879687 4.0974687 6.2929688 4.2929688 L 4.2929688 6.2929688 C 3.9019687 6.6839688 3.9019687 7.3170313 4.2929688 7.7070312 L 11.585938 15 L 4.2929688 22.292969 C 3.9019687 22.683969 3.9019687 23.317031 4.2929688 23.707031 L 6.2929688 25.707031 C 6.6839688 26.098031 7.3170313 26.098031 7.7070312 25.707031 L 15 18.414062 L 22.292969 25.707031 C 22.682969 26.098031 23.317031 26.098031 23.707031 25.707031 L 25.707031 23.707031 C 26.098031 23.316031 26.098031 22.682969 25.707031 22.292969 L 18.414062 15 L 25.707031 7.7070312 C 26.098031 7.3170312 26.098031 6.6829688 25.707031 6.2929688 L 23.707031 4.2929688 C 23.316031 3.9019687 22.682969 3.9019687 22.292969 4.2929688 L 15 11.585938 L 7.7070312 4.2929688 C 7.5115312 4.0974687 7.255875 4 7 4 z"/>
                  </svg>
                </button>
            </div>
            <div>
              <span>Нажимая кнопку ниже вы подтверждаете, что получили платёж от {{ selectedMember.Username }}</span>
            </div>
            <div :style="{ display:'flex', justifyContent:'center', marginTop:'20px' }">
              <button class="boost-purchase-button" :style="{ width:'60%' }" @click="finishOrder()">Отпустить коины</button>
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
  border-bottom: 2px solid;
  background: none;
}

input:focus {
  outline: none; /* Убирает стандартную синюю обводку */
  border: 1px solid #ccc; /* Устанавливает желаемую обводку, если нужно */
}

input[type="number"] {
  color: white; 
  text-align: right;
}


input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}


input[type="number"] {
  -moz-appearance: textfield;
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
  border-bottom: 2px solid;
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


/*progressbar*/
#progressbar {
  margin-bottom: 30px;
  overflow: hidden;
  /*CSS counters to number the steps*/
  counter-reset: step;
  text-align: center;
}
#progressbar li {
  list-style-type: none;
  color: white;
  text-transform: uppercase;
  font-size: 9px;
  width: 33.33%;
  float: left;
  position: relative;
}
#progressbar li:before {
  content: counter(step);
  counter-increment: step;
  width: 20px;
  line-height: 20px;
  display: block;
  font-size: 10px;
  color: #333;
  background: white;
  border-radius: 3px;
  margin: 0 auto 5px auto;
}
/*progressbar connectors*/
#progressbar li:after {
  content: '';
  width: 100%;
  height: 2px;
  background: white;
  position: absolute;
  left: -50%;
  top: 9px;
  z-index: -1; /*put it behind the numbers*/
}
#progressbar li:first-child:after {
  /*connector not needed before the first step*/
  content: none; 
}
/*marking active/completed steps green*/
/*The number of the step and the connector before it = green*/
#progressbar li.active:before,  #progressbar li.active:after{
  background: #27AE60;
  color: white;
}


.sec-center {
  position: relative;
  max-width: 100%;
  text-align: center;
  z-index: 200;
}
[type="checkbox"]:checked,
[type="checkbox"]:not(:checked){
  position: absolute;
  left: -9999px;
  opacity: 0;
  pointer-events: none;
}
.dark-light:checked + label,
.dark-light:not(:checked) + label{
  position: fixed;
  top: 40px;
  right: 40px;
  z-index: 20000;
  display: block;
  border-radius: 50%;
  width: 46px;
  height: 46px;
  cursor: pointer;
  transition: all 200ms linear;
  box-shadow: 0 0 25px rgba(255,235,167,.45);
}
.dark-light:checked + label{
  transform: rotate(360deg);
}
.dark-light:checked + label:after,
.dark-light:not(:checked) + label:after{
  position: absolute;
  content: '';
  top: 1px;
  left: 1px;
  overflow: hidden;
  z-index: 2;
  display: block;
  border-radius: 50%;
  width: 44px;
  height: 44px;
  background-color: #102770;
  background-image: url('https://assets.codepen.io/1462889/moon.svg');
  background-size: 20px 20px;
  background-repeat: no-repeat;
  background-position: center;
  transition: all 200ms linear;
  opacity: 0;
}
.dark-light:checked + label:after {
  opacity: 1;
}
.dark-light:checked + label:before,
.dark-light:not(:checked) + label:before{
  position: absolute;
  content: '';
  top: 0;
  left: 0;
  overflow: hidden;
  z-index: 1;
  display: block;
  border-radius: 50%;
  width: 46px;
  height: 46px;
  background-color: #48dbfb;
  background-image: url('https://assets.codepen.io/1462889/sun.svg');
  background-size: 25px 25px;
  background-repeat: no-repeat;
  background-position: center;
  transition: all 200ms linear;
}
.dark-light:checked + label:before{
  background-color: #000;
}
.light-back{
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1;
  background-color: #fff;
  overflow: hidden;
  background-image: url('https://s3-us-west-2.amazonaws.com/s.cdpn.io/1462889/pat-back.svg');
  background-position: center;
  background-repeat: repeat;
  background-size: 4%;
  height: 100%;
  width: 100%;
  transition: all 200ms linear;
  opacity: 0;
}
.dark-light:checked ~ .light-back{
  opacity: 1;
}
.dropdown:checked + label,
.dropdown:not(:checked) + label{
  position: relative;
  font-family: 'Roboto', sans-serif;
  font-weight: 500;
  font-size: 15px;
  line-height: 2;
  height: 50px;
  transition: all 200ms linear;
  border-radius: 4px;
  width: 220px;
  letter-spacing: 1px;
  display: -webkit-inline-flex;
  display: -ms-inline-flexbox;
  display: inline-flex;
  -webkit-align-items: center;
  -moz-align-items: center;
  -ms-align-items: center;
  align-items: center;
  -webkit-justify-content: center;
  -moz-justify-content: center;
  -ms-justify-content: center;
  justify-content: center;
  -ms-flex-pack: center;
  text-align: center;
  border: none;
  background-color: #ffeba7;
  cursor: pointer;
  color: #102770;
  box-shadow: 0 12px 35px 0 rgba(255,235,167,.15);
}
.dark-light:checked ~ .sec-center .for-dropdown{
  background-color: #102770;
  color: #ffeba7;
  box-shadow: 0 12px 35px 0 rgba(16,39,112,.25);
}
.dropdown:checked + label:before,
.dropdown:not(:checked) + label:before{
  position: fixed;
  top: 0;
  left: 0;
  content: '';
  width: 100%;
  height: 100%;
  z-index: -1;
  cursor: auto;
  pointer-events: none;
}
.dropdown:checked + label:before{
  pointer-events: auto;
}
.dropdown:not(:checked) + label .uil {
  font-size: 24px;
  margin-left: 10px;
  transition: transform 200ms linear;
}
.dropdown:checked + label .uil {
  transform: rotate(180deg);
  font-size: 24px;
  margin-left: 10px;
  transition: transform 200ms linear;
}
.section-dropdown {
  position: absolute;
  padding: 5px;
  background-color: #111;
  top: 70px;
  left: 0;
  width: 100%;
  border-radius: 4px;
  display: block;
  box-shadow: 0 14px 35px 0 rgba(9,9,12,0.4);
  z-index: 2;
  opacity: 0;
  pointer-events: none;
  transform: translateY(20px);
  transition: all 200ms linear;
}
.dark-light:checked ~ .sec-center .section-dropdown {
  background-color: #fff;
  box-shadow: 0 14px 35px 0 rgba(9,9,12,0.15);
}
.dropdown:checked ~ .section-dropdown{
  opacity: 1;
  pointer-events: auto;
  transform: translateY(0);
}
.section-dropdown:before {
  position: absolute;
  top: -20px;
  left: 0;
  width: 100%;
  height: 20px;
  content: '';
  display: block;
  z-index: 1;
}
.section-dropdown:after {
  position: absolute;
  top: -7px;
  left: 30px;
  width: 0; 
  height: 0; 
  border-left: 8px solid transparent;
  border-right: 8px solid transparent; 
  border-bottom: 8px solid #111;
  content: '';
  display: block;
  z-index: 2;
  transition: all 200ms linear;
}
.dark-light:checked ~ .sec-center .section-dropdown:after {
  border-bottom: 8px solid #fff;
}

a {
  position: relative;
  color: #fff;
  transition: all 200ms linear;
  font-family: 'Roboto', sans-serif;
  font-weight: 500;
  font-size: 15px;
  border-radius: 2px;
  padding: 5px 0;
  padding-left: 20px;
  padding-right: 15px;
  margin: 2px 0;
  text-align: left;
  text-decoration: none;
  display: -ms-flexbox;
  display: flex;
  -webkit-align-items: center;
  -moz-align-items: center;
  -ms-align-items: center;
  align-items: center;
  justify-content: space-between;
    -ms-flex-pack: distribute;
}
.dark-light:checked ~ .sec-center .section-dropdown a {
  color: #102770;
}
a:hover {
  color: #102770;
  background-color: #ffeba7;
}
.dark-light:checked ~ .sec-center .section-dropdown a:hover {
  color: #ffeba7;
  background-color: #102770;
}
a .uil {
  font-size: 22px;
}
.dropdown-sub:checked + label,
.dropdown-sub:not(:checked) + label{
  position: relative;
  color: #fff;
  transition: all 200ms linear;
  font-family: 'Roboto', sans-serif;
  font-weight: 500;
  font-size: 15px;
  border-radius: 2px;
  padding: 5px 0;
  padding-left: 20px;
  padding-right: 15px;
  text-align: left;
  text-decoration: none;
  display: -ms-flexbox;
  display: flex;
  -webkit-align-items: center;
  -moz-align-items: center;
  -ms-align-items: center;
  align-items: center;
  justify-content: space-between;
    -ms-flex-pack: distribute;
    cursor: pointer;
}
.dropdown-sub:checked + label .uil,
.dropdown-sub:not(:checked) + label .uil{
  font-size: 22px;
}
.dropdown-sub:not(:checked) + label .uil {
  transition: transform 200ms linear;
}
.dropdown-sub:checked + label .uil {
  transform: rotate(135deg);
  transition: transform 200ms linear;
}
.dropdown-sub:checked + label:hover,
.dropdown-sub:not(:checked) + label:hover{
  color: #102770;
  background-color: #ffeba7;
}
.dark-light:checked ~ .sec-center .section-dropdown .for-dropdown-sub{
  color: #102770;
}
.dark-light:checked ~ .sec-center .section-dropdown .for-dropdown-sub:hover{
  color: #ffeba7;
  background-color: #102770;
}

.section-dropdown-sub {
  position: relative;
  display: block;
  width: 100%;
  pointer-events: none;
  opacity: 0;
  max-height: 0;
  padding-left: 10px;
  padding-right: 3px;
  overflow: hidden;
  transition: all 200ms linear;
}
.dropdown-sub:checked ~ .section-dropdown-sub{
  pointer-events: auto;
  opacity: 1;
  max-height: 999px;
}
.section-dropdown-sub a {
  font-size: 14px;
}
.section-dropdown-sub a .uil {
  font-size: 20px;
}
.logo {
	position: fixed;
	top: 50px;
	left: 40px;
	display: block;
	z-index: 11000000;
  background-color: transparent;
  border-radius: 0;
  padding: 0;
	transition: all 250ms linear;
}
.logo:hover {
  background-color: transparent;
}
.logo img {
	height: 26px;
	width: auto;
	display: block;
  transition: all 200ms linear;
}
.dark-light:checked ~ .logo img{
  filter: brightness(10%);
}

@media screen and (max-width: 991px) {
.logo {
	top: 30px;
	left: 20px;
}
.dark-light:checked + label,
.dark-light:not(:checked) + label{
  top: 20px;
  right: 20px;
}
}

</style>
