<template>
  <div id="MyOrders" v-for="order in orders" :key="order.ID" @click="" class="channel">
      <div class="channel-info" :style="{ display:'flex', flexDirection:'row', justifyContent:'center', alignItems:'center' }">
          <img v-if="order.OwnerAvatar != null && order.OwnerAvatar != ''" :src="order.OwnerAvatar" :style="{ height:'30px', borderRadius:'100px'}" />
          <div v-else :style="{ height:'30px', width:'30px', borderRadius:'100px', background:'gray', justifyContent:'center', alignItems:'center', display:'flex' }">👤</div>
          <span class="name" :style="{ marginLeft:'10px', fontSize:'18px' }">{{ order.OwnerName }}</span>
      </div>
      <div @click="order.OwnerID !== myUserId ? changeVisibleState('order', order) : changeVisibleState('me', order)">
          <div v-if="order.OwnerID !== myUserId" :style="{ display:'flex', flexDirection:'column'}">
              <span v-if="order.Status == 'active'" :style="{ fontSize:'17px' }">хочет купить {{ order.Amount }}🍆 за {{ order.Price }}💲</span>
              <span v-if="order.Status == 'progress'">сделка в процессе ⏳</span>
              <span v-else>сделка закрыта ✅</span>
              <div v-if="order.Status != 'closed'" :style="{ display:'flex', flexDirection:'column' }">
                  <div v-for="method in order.PaymentMethods" :style="{ border:'3.5px solid gray', width:'170px', textAlign:'center', marginTop:'7px' }">
                      <span>{{ getPaymentMethodNameBySuffix(method) }}</span>
                  </div>
              </div>  
          </div>
          <span v-else :style="{ fontSize:'20px' }">{{ order.Status == "active" || order.Status == "progress" ? `ваша сделка 👑 ${ order.Status == 'progress' ? "⏳" : '' }` : "сделка закрыта ✅" }} </span>
      </div>
      <div  >
          <svg class="arrow">
              <use xlink:href="@/assets/images/sprite.svg#chevron-right"></use>
          </svg>
      </div>
  </div>
</template>

<script setup>

const props = defineProps({
orders: {
  type: Array,
  required: true
},
myUserId: {
  type: Number,
  required: true
},
changeVisibleState: {
  type: Function,
  required: true
},
getPaymentMethodNameBySuffix: {
  type: Function,
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

.channel-action {
display: flex;
align-items: center;
}

</style>