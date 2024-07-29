<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useUserStore } from '@/store/user';
import Spinner  from './Spinner.vue';
import { useI18n } from 'vue-i18n';
import { useWebAppPopup } from 'vue-tg'

const { t } = useI18n();
const userStore = useUserStore()

const loser = [
  'Not quite',
  'Stop gambling',
  'Hey, you lost!',
  'Ouch! I felt that',
  'Don\'t beat yourself up',
  'There goes the college fund',
  'I have a cat. You have a loss',
  'You\'re awesome at losing',
  'Coding is hard',
  'Don\'t hate the coder',
];

const showSpinButtons = ref(true);

const spinType = ref("single")

const canSpin = ref(false);

const winner = ref<boolean | null>(false);
const spinner1 = ref(null);
const spinner2 = ref(null);
const spinner3 = ref(null);

const handleClick = (type: string) => {
  winner.value = null;
      spinner1.value = null;
      spinner2.value = null;
      spinner3.value = null;
      matches.value = []
      canSpin.value = !canSpin.value;
  /*
  if(!userStore.user) return;
  if(userStore.user.balance < 1000) {
    useWebAppPopup().showAlert("Недостаточно средств");
    return;
  }
  spinType.value = type;
  showSpinButtons.value = false;
  userStore.spinSlot().then(result => {
    if(result){
      winner.value = null;
      spinner1.value = null;
      spinner2.value = null;
      spinner3.value = null;
      matches.value = []
      canSpin.value = !canSpin.value;
    }
  });
  */
};

const matches = ref<number[]>([]);
const winNumbers = ref<number[]>([-188, 0, -752, -1128]);

const finishHandler = (value: number) => {
  matches.value.push(value);
  console.log(matches.value);
  if (matches.value.length === 3) {
    const first = matches.value[0];
    winner.value = matches.value.every(match => match === first);
    if(spinType.value == 'single') showSpinButtons.value = true; // -188 - pizza, 0 - burger, -752 - banana, -1128 - avocado
    if(winner.value){
       let winIndex = winNumbers.value.findIndex(x => x == matches.value[0])
       if(winIndex != -1){
          userStore.getReward(winNumbers.value[winIndex])
       }
    }

    if(spinType.value == 'auto')
    {
      handleClick('auto');
    }
  }
};

const getLoser = () => {
  return loser[Math.floor(Math.random() * loser.length)];
};

/*
<h1 style="color: white;">
        <span>{{ winner === null ? 'Waiting…' : winner ? '🤑 Pure skill! 🤑' : getLoser() }}</span>
      </h1>
*/

</script>



<template>
    <div id="slots">
      <audio v-if="winner" autoplay="true" class="player" preload="false">
        <source src="https://andyhoffman.codes/random-assets/img/slots/winning_slot.wav" />
      </audio>
      
      <div :style="{ display:'flex', flexDirection:'column', alignItems:'center', marginTop:'25%'}">
        <span :style="{ fontSize: '30px', fontWeight:'bold' }">Награды: </span>
        <div :style="{ display:'flex', flexDirection:'column', alignItems:'center', marginTop:'10px' }">
          <div :style="{ display:'flex' }">
            <div class='rewardIcon'>
                <span>🍌 3k🍆</span>
            </div>
            <div class='rewardIcon'>
                <span>🥑 10k🍆</span>
            </div>
            <div class='rewardIcon'>
                <span>🍔 25k🍆</span>
            </div>
          </div>
          <div class='rewardIcon' :style="{marginTop:'15px'}">
              <span>🍕 50k🍆</span>
          </div>
        </div>
      </div>

      <div class="spinner-container">
        <Spinner @finish="finishHandler" :timer="1000" :canSpin="canSpin" ref="spinner1" />
        <Spinner @finish="finishHandler" :timer="1400" :canSpin="canSpin" ref="spinner2" />
        <Spinner @finish="finishHandler" :timer="2200" :canSpin="canSpin" ref="spinner3" />
        <div class="gradient-fade"></div>
      </div>
      <div v-if="showSpinButtons" :style="{ display:'flex', width:'100%', flexDirection:'column', alignItems:'center', bottom: '15%', position:'fixed' }">
        <button class="mypost-button" :style="{ marginTop: '30px', width: '60%' }" @click="handleClick('single')">Крутить(1000🍆) 🎲</button>
        <button class="mypost-button" :style="{ marginTop: '30px', width: '60%' }" @click="handleClick('auto')">Авто(1000🍆) 🎰</button>
      </div>
      <div v-if="spinType == 'auto'" :style="{ display:'flex', width:'100%', flexDirection:'column', alignItems:'center', bottom: '15%', position:'fixed' }">
        <button class="mypost-button" :style="{ marginTop: '30px', width: '60%' }" @click="spinType = 'single'">Стоп</button>
      </div>
    </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css?family=Cairo');

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.mypost-button {
    padding: 10px 20px;
    border: none;
    background-color: #878787;
    color: white;
    width: 170px;
    font-size: 17px;
    font-weight: bold;
    border-radius: 5px;
    cursor: pointer;
}

.rewardIcon {
  font-size: 20px;
  font-weight: bold;
}


body {
  background-color: #292929;
}

#repeatButton {
  appearance: none;
  border: none;
  background: url(https://andyhoffman.codes/random-assets/img/slots/repeat.png) transparent 0 0 no-repeat;
  background-size: cover;
  width: 48px;
  height: 48px;
  position: absolute;
  top: 10px;
  right: 20px;
  cursor: pointer;
  animation: 6s linear infinite spin;
}

h1 {
  font-size: 150%;
  font-family: 'Cairo', sans-serif;
}

h1 span {
  color: aliceblue;
  border: 1px solid hsla(208, 100%, 97.1%, .1);
  display: inline-block;
  padding: 0.75rem 1rem;
}

.icons {
  display: inline-block;
  width: 128px;
  height: 564px;
  overflow: hidden;
  background: #fff url(https://andyhoffman.codes/random-assets/img/slots/sprite5.png) repeat-y;
  will-change: backgroundPosition;
  transition: 0.3s background-position ease-in-out;
  padding: 0 80px;
  transform: translateZ(0);
}

.icons:nth-child(2) {
  margin: 0 10px;
}

* {
  box-sizing: border-box;
}

.spinner-container {
  overflow: hidden;
  height: 632px;
  padding: 2em;
  transform: translate(-50%, -50%) scale(.62, .62);
  position: absolute;
  top: 50%;
  left: 50%;
  display: flex;
  transition: 0.3s transform;
}

.app-wrap.winner-false {
  animation: linear 1s spin;
}

.spinner-container::after {
  position: absolute;
  content: '';
  display: block;
  height: 180px;
  top: 50%;
  transform: translateY(-50%);
  right: 30px;
  left: 30px;
  background: rgba(255, 0, 0, .1);
}

.gradient-fade {
  position: absolute;
  top: 32px;
  right: 32px;
  bottom: 32px;
  left: 32px;
  background: linear-gradient(
    to bottom,
    rgba(64,64,64,1) 0%,
    rgba(64,64,64,0) 7%,
    rgba(64,64,64,0) 93%,
    rgba(64,64,64,1) 100%
  );
}

@media screen and (max-width: 1000px) {
  .spinner-container {
    transform: translate(-50%, -50%) scale(.55, .55);
  }
}

@media screen and (max-width: 500px) {
  .spinner-container {
    transform: translate(-50%, -50%) scale(.4, .4);
  }
}
</style>
