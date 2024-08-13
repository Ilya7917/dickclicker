<template>
    <div class="bg"></div>

    <div class="WinScreen" :style="{ display: showWinScreen ? 'flex' : 'none' }" @click="closeWinningScreen">
      <img class="rotateImg" src="@/assets/images/RotateEffect.png" :style="{ width:'100vh', opacity:'0.5'}" />
      <div :style="{ position:'absolute', marginTop:'-35px', display:'flex', flexDirection:'column', textAlign:'center' }">
        <span :style="{ fontSize:'35px' }">Вы выиграли:</span>
        <span :style="{ fontSize:'50px' }">{{ this.winAmount }}🍆</span>
      </div>
      <div :style="{ position:'absolute', width:'100%', bottom:'100px', textAlign:'center' }">
        <span :style="{ fontSize:'25px' }">Нажмите чтобы продолжить</span>
      </div>
    </div>

    <div class="HeadText" :style="{ width:'100%', display:'flex', justifyContent:'center', marginTop:'20px'}">
      <span class="animated-text" :style="{ fontSize:'35px', fontWeight:'bold' }">
        <span v-for="(char, index) in 'SLOTS'" :key="index">{{ char }}</span>
      </span>
    </div>
    <div class="machineContainer">
      <line stroke="#000" stroke-width="2" />
      <div id="stage" class="perspective-on">
        <div id="rotate">
          <div id="ring1" class="ring"></div>
          <div id="ring2" class="ring"></div>
          <div id="ring3" class="ring"></div>
          <div id="ring4" class="ring"></div>
          <div id="ring5" class="ring"></div>
        </div>
      </div>
    </div>
    <div v-if="showSpinButtons" class="ButtonsSection" :style="{ zIndex:'100', bottom:'5%', position:'absolute', width:'100%', display:'flex', justifyContent:'center', flexDirection:'column', alignItems:'center'}">
        <div :style="{ display:'flex', alignItems:'center' }">
          <span :style="{ fontSize: '15px', fontWeight:'bold'}">Показать победные линии: </span>
          <div class="checkbox-wrapper-7" :style="{ marginLeft: '5px'}">
              <input class="tgl tgl-ios" id="cb2-7" type="checkbox" v-model="showLines" @change="(e) => showWinningLines(e.target.checked)"/>
              <label class="tgl-btn" for="cb2-7"></label>
          </div>
        </div>
        <div :style="{ marginTop:'20px', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}">
          <span :style="{ fontSize:'30px', fontWeight:'bold' }">СТАВКА:</span>
          <div :style="{ display:'flex', alignItems:'center' }">
            <button
              class="glow-on-hover"
              @touchstart="startDecrement"  
              @touchend="stopInterval"  
              @click="() => { if(bet - 100 >= 100) bet-=100 }"
              :style="{ textAlign: 'center', width: '80px', marginRight: '30px' }"
            >
              <p :style="{ fontSize: '50px', marginTop: '-5px' }">-</p>
            </button>
            <span :style="{ fontSize:'25px', fontWeight:'bold' }">{{  bet }}🍆</span> 
            <button
              class="glow-on-hover"
              @touchstart="startIncrement"  
              @touchend="stopInterval"
              @click="() => bet+=100"
              :style="{ fontSize: '35px', textAlign: 'center', width: '80px', marginLeft: '30px' }"
            >
              +
            </button>
          </div>
        </div>
        <button class="glow-on-hover" @click="startSpinning('single')" :style="{ fontSize:'23px', textAlign:'center', marginTop:'30px' }" >SPIN 🎰</button>
        <button class="glow-on-hover" @click="startSpinning('auto')" :style="{ fontSize:'23px', textAlign:'center', marginTop:'30px' }" >AUTO 🎲</button>
    </div>
    <div v-if="mode == 'auto'" class="ButtonsSection" :style="{ zIndex:'100', bottom:'5%', position:'absolute', width:'100%', display:'flex', justifyContent:'center', flexDirection:'column', alignItems:'center'}">
        <button class="glow-on-hover" @click="mode = 'single'" :style="{ fontSize:'23px', textAlign:'center', marginTop:'30px' }" >STOP 🎰</button>
    </div>

    

</template>
  
<script>
  import { useSlotMachineStore } from '@/store/slotmachinestore'
  import { useUserStore } from '@/store/user';
  import blowImg from '@/assets/images/RotateEffect.png';
  import { useWebAppPopup, useWebAppRequests } from 'vue-tg'
  const SLOTS_PER_REEL = 12;
  const REEL_RADIUS = 150 / 1.5; 

  const machineStore = useSlotMachineStore();
  const userStore = useUserStore();
  
  export default {
    data() {
      return {
        xray: false,
        perspective: true,
        mode: 'single',
        showSpinButtons: true,
        showWinScreen: false,
        bet: 100,
        winAmount: 0,
        showLines: false,
        symbols: ['🍒', '🍔', '🍕', '🍌', '🥑', '🍍', '🍉', '🍇', '🍓', '🍑', '🍈', '🍋'],
        currentAngles: [0, 0, 0, 0, 0], // храним текущие углы для каждого барабана
        visibleSlots: [], // храним видимые слоты
        lastWinningPattern: null, // сохраняем последний выигрышный шаблон для исключения повторений,
        lines: [
          [
            // Горизонтальные
            [1, 4, 7, 10, 13],
            [0, 3, 6, 9, 12],
            [2, 5, 8, 11, 14]
          ],
          [
            // ЗигЗаги
            [1, 3, 8, 9, 13],
            [2, 3, 7, 9, 14],
          ],
          [
            // Сложные диагонали
            [1, 4, 6, 10, 13],
            [2, 5, 6, 11, 14]
          ],
          [
            [2, 3, 6, 9, 14],
            [1, 3, 6, 9, 13]
          ],
          [
            [0, 3, 7, 9, 12],
            [0, 3, 8, 9, 12]
          ]
        ],
        colors: [
          [
             {color: 'yellow'}, { color:'blue' }, { color:'purple' }
          ],
          [
             {color:'brown'}, {color: 'orange'}
          ]
        ],
        printingLines: [],
        numberInRandoms: 5,
        ringIds: [ 'ring1', 'ring2', 'ring3', 'ring4', 'ring5' ],
        allSlots: [],
        winColors: [ 'lightgreen', 'blue', 'lightgreen', 'orange', 'purple' ],
        winPercents: [ 10, 20, 25, 30 ],
        interval: null,
      };
    },
    mounted() {
      
      for(let i = 0; i < this.ringIds.length; i++) {
        this.createSlots(document.getElementById(this.ringIds[i]), i+1)
      }


      this.highlightVisibleSlots()
      
    },
    methods: {
      startDecrement() {
        if (this.interval) return; // Защита от повторного нажатия
        this.interval = setInterval(() => {
          if (this.bet - 100 >= 100) {
            this.bet -= 100;
          }
        }, 150);
      },
      startIncrement() {
        if (this.interval) return; // Защита от повторного нажатия
        this.interval = setInterval(() => {
          this.bet += 100;
        }, 150);
        console.log(this.interval);
      },
      stopInterval() {
        clearInterval(this.interval);
        this.interval = null; // Обнуляем интервал для возможности повторного нажатия
      },
      createShowLine(arrayIndex, innerArrayIndex, type, itemIndex) {
        console.log(arrayIndex, innerArrayIndex)
        const line = document.createElement('div');
        line.className = 'myLine';
        line.style.position = 'absolute';
        line.style.top = type == "horizontal" ? '65%' : '50%';
        line.style.left = '0%';
        line.style.width = '100%';
        line.style.height = '2px'; // Толщина линии
        line.style.backgroundColor = this.colors[arrayIndex][innerArrayIndex].color; // Цвет линии
        line.style.transform = 'translateY(-50%)'; // Центрирование линии по вертикали
        if(type == 'zigZag') {
          if(innerArrayIndex == 0){
            line.style.transform = itemIndex <= 2 ? 'rotate(45deg)' : 'rotate(-45deg)'; 
          } else {
            line.style.transform = itemIndex <= 2 ? 'rotate(-45deg)' : 'rotate(45deg)'; 
          }
        }
        return line;
      },

      showWinningLines(event) {
        console.log(this.printingLines);
        if(event){
          this.lines.forEach((array, index) => {
            if(index > 1) return;
            array.forEach((innerArray, id) => {
              innerArray.forEach((item, itemIndex) => {
                let type = ''
                if(index == 0) type = 'horizontal';
                if(index == 1) type = 'zigZag';
                let showLine = this.createShowLine(index, id, type, itemIndex);
                const slot = document.getElementById(this.visibleSlots[item].id);
                slot.style.backgroundColor = 'gray';
                slot.appendChild(showLine);
                this.printingLines.push(showLine);
              })
            })
          })
        } else {
          this.printingLines.forEach(x => x.remove());
          this.printingLines = [];
          this.lines.forEach((array) => {
            array.forEach((innerArray) => {
              innerArray.forEach((item) => {
                const slot = document.getElementById(this.visibleSlots[item].id);
                slot.style.backgroundColor = 'white';
              })
            })
          })
        }

        console.log(this.printingLines);
          
      },

      createSlots(ring, ringIndex) {
        const slotAngle = 360 / SLOTS_PER_REEL;
        const seed = this.getSeed(ringIndex);
  
        for (let i = 0; i < SLOTS_PER_REEL; i++) {
          const slot = document.createElement('div');
          slot.className = 'slot';
          slot.id = `ring${ringIndex}-slot-${i}`;
          const transform = `rotateX(${slotAngle * i}deg) translateZ(${REEL_RADIUS}px)`;
          slot.style.transform = transform;
          slot.innerHTML = `<p>${this.symbols[(seed + i) % SLOTS_PER_REEL]}</p>`;
          this.allSlots.push(slot);
          ring.appendChild(slot);
        }
      },

      getRandom() {
        return Math.floor(Math.random() * this.numberInRandoms) + 1;
      },
      getSeed(idx) {
        // Генерирем случайное число для перемешивания слотов
        let number = this.getRandom()
        return number;
        return Math.floor(Math.random() * this.getRandom());
      },
      startSpinning(mode) {
        /* check user balance logic */
        if(userStore.user == null) return;

        if(userStore.user.balance < this.bet) {
           useWebAppPopup().showAlert("У вас недостаточно 🍆 чтобы крутить слоты");
           this.mode = 'single';
           this.showSpinButtons = true;
           return;
        }

        machineStore.spin(this.bet).then(result => {
          if(result.sucess) {
            this.mode = mode;
            this.numberInRandoms = result.number;
            console.log(`Number in randoms: ${this.numberInRandoms}`)
            this.allSlots.forEach(x => x.remove());
            for(let i = 0; i < this.ringIds.length; i++) {
              this.createSlots(document.getElementById(this.ringIds[i]), i+1)
            }

            this.showSpinButtons = false;
            this.clearHighlight(); // очищаем подсветку перед началом прокрутки
            this.resetAnimation(); // сбрасываем анимации
            this.currentAngles = [0, 0, 0, 0, 0]; // сбрасываем углы
            this.visibleSlots = []; // сбрасываем видимые слоты
            const timer = 2;
            for (let i = 1; i <= 5; i++) {
              const seed = this.getSeed(i);
              console.log(seed);
              const angle = -360 * 3 + seed * (360 / SLOTS_PER_REEL); // полный оборот плюс поворот на seed
              this.currentAngles[i - 1] = angle; // сохраняем текущий угол
              const ring = document.getElementById('ring' + i);
              ring.style.transition = `transform ${timer + i * 0.5}s ease-out`;
              ring.style.transform = `rotateX(${angle}deg)`;
            }
            setTimeout(() => {
              this.highlightVisibleSlots();
              this.ensureWinningCombination();
            }, (timer + 5 * 0.5) * 1000); // время завершения прокрутки последнего барабана
              }
            })        
      },
      resetAnimation() {
        for (let i = 1; i <= 5; i++) {
          const ring = document.getElementById('ring' + i);
          ring.style.transition = 'none';
          ring.style.transform = `rotateX(0deg)`;
          ring.offsetHeight; // триггер перерисовки
          ring.style.transition = '';
        }
      },
      clearHighlight() {
        this.showLines = false;
        document.querySelectorAll('.slot').forEach(slot => {
          slot.style.backgroundColor = '#fff'; // очищаем подсветку
        });

        try {
          this.printingLines.forEach(x => x.remove());
          this.printingLines = [];
        } catch {
          console.error('lines array`s empty')
        }
      },
      highlightVisibleSlots() {
        const slotAngle = 360 / SLOTS_PER_REEL;
        for (let i = 1; i <= 5; i++) {
          const angle = this.currentAngles[i - 1];
          const index = Math.round(-angle / slotAngle) % SLOTS_PER_REEL;
          const visibleIndices = [
            (index + SLOTS_PER_REEL) % SLOTS_PER_REEL,
            (index + 1 + SLOTS_PER_REEL) % SLOTS_PER_REEL,
            (index - 1 + SLOTS_PER_REEL) % SLOTS_PER_REEL
          ];
          visibleIndices.forEach(idx => {
            const slot = document.getElementById(`ring${i}-slot-${idx}`);
            if (slot) {
              slot.style.backgroundColor = 'gray'; // подсвечиваем видимые элементы
              this.visibleSlots.push({ id: slot.id, symbol: slot.textContent.trim(), ring: i, position: idx });
            }
          });
        }
      },
      ensureWinningCombination() {
        console.log(this.visibleSlots)
        let winArray = []
        for(let i = 0; i < this.lines.length; i++){
            this.lines[i].forEach((line, idx) => {
            let winCombinations = [];

            for (let i = 0; i <= line.length - 3; i++) {
              const currentSymbol = this.visibleSlots[line[i]].symbol;
              const nextSymbol = this.visibleSlots[line[i + 1]]?.symbol;
              const thirdSymbol = this.visibleSlots[line[i + 2]]?.symbol;

              if (nextSymbol !== undefined && thirdSymbol !== undefined && 
                  currentSymbol === nextSymbol && nextSymbol === thirdSymbol) {
                  
                const slot = document.getElementById(this.visibleSlots[line[i]].id);
                const slot1 = document.getElementById(this.visibleSlots[line[i + 1]].id);
                const slot2 = document.getElementById(this.visibleSlots[line[i + 2]].id);

                [slot, slot1, slot2].forEach(slotElement => {
                  if (!winCombinations.includes(slotElement)) {
                    winCombinations.push(slotElement);
                  }
                });
              }
          }

          if (winCombinations.length > 0) {
            winArray.push(winCombinations);
          }
        });
        }

        winArray.forEach((array, idx) => {
          if(array.length >= 3) {
            array.forEach(item => {
              item.style.backgroundColor = this.winColors[idx];
            })
          }
        })

        if(winArray.length > 0) {
          this.showWinScreen = true;
          if(this.numberInRandoms != 1){ 
            let winDifference = (this.bet / 100) * this.winPercents[Math.floor(Math.random() * this.winPercents.length)];
            if(winArray.length < 2) this.winAmount = this.bet - winDifference;
            else {
              const multiplyLinesWin = [20, 25, 30, 35, 40]
              winDifference = (this.bet / 100) * multiplyLinesWin[Math.floor(Math.random() * multiplyLinesWin.length)]
              this.winAmount = this.bet + winDifference;
            } 
          }
          else {
            this.winAmount = this.bet * 100
          }
          return;
        } 

        if(this.mode == 'auto') {
            this.startSpinning(this.mode);
        } else {
          this.showSpinButtons = true;
        }
        
        

      },
      closeWinningScreen() {
        machineStore.setWin(this.winAmount, this.numberInRandoms).then(result => {
          if(result.sucess) {
            this.showWinScreen = false;
            if(this.mode == 'single') {
              this.showSpinButtons = true;
              return;
            } else this.startSpinning(this.mode);
          }
        })
      }
    }
  };
  </script>
  
  <style>

  .animated-text {
    display: inline-block;
  }

  .animated-text span {
    display: inline-block;
    animation: moveText 3s infinite;
    position: relative;
  }

  .animated-text span:nth-child(odd) {
    animation-direction: alternate;
  }

  .animated-text span:nth-child(even) {
    animation-direction: alternate-reverse;
  }

  @keyframes moveText {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
  }

  .bg{
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      opacity: 0.8;
      background: #261e25;
      position: absolute;
      z-index: -1;
  }

  .WinScreen {
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      opacity: 0.8;
      background: #261e25;
      position: absolute;
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 999;
  }

  .rotateImg{
    animation: rotate 2s linear infinite;
  }
  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  
  .machineContainer{
    position: fixed;
    width: 100%;
    height: 85%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  #stage {
    margin: 0 auto;
    width: 100%; 
    padding: 0 0 27px; 
  }
  
  .perspective-on {
    perspective: 666px; 
  }
  .perspective-off {
    perspective: 0;
  }
  
  #rotate {
    margin: 0 auto 0;
    width: 300px; 
    height: 147px;
    transform-style: preserve-3d;
    position: relative; 
  }
  
  .ring {
    margin: 0 auto;
    height: 53px; 
    width: 60px; 
    float: left;
    transform-style: preserve-3d;
    position: relative;
  }
  .slot {
    position: absolute;
    width: 60px; 
    height: 53px;
    box-sizing: border-box;
    opacity: 0.9;
    color: rgba(0,0,0,0.9);
    background: #fff;
    border: solid 2px #000;
    backface-visibility: hidden;
    transition: background-color 0.5s;
  }
  
  .slot.highlight {
    background-color: green;
  }
  
  .backface-on {
    backface-visibility: visible;
  }
  
  .slot p {
    font-size: 24px; 
    font-weight: bold;
    line-height: 53px; 
    margin: 0;
    text-align: center;
  }
  
  .go {
  }
  label {
    cursor: pointer;
    display: inline-block;
    width: 45%;
    text-align: center;
  }
  .tilted {
    transform: rotateY(45deg);
  }
  
  .spin-0     { transform: rotateX(-3719deg); }
  .spin-1     { transform: rotateX(-3749deg); }
  .spin-2     { transform: rotateX(-3779deg); }
  .spin-3     { transform: rotateX(-3809deg); }
  .spin-4     { transform: rotateX(-3839deg); }
  .spin-5     { transform: rotateX(-3869deg); }
  .spin-6     { transform: rotateX(-3899deg); }
  .spin-7     { transform: rotateX(-3929deg); }
  .spin-8     { transform: rotateX(-3959deg); }
  .spin-9     { transform: rotateX(-3989deg); }
  .spin-10    { transform: rotateX(-4019deg); }
  .spin-11    { transform: rotateX(-4049deg); }
  
  @keyframes back-spin {
    100%  { transform: rotateX(30deg); }
  }
  @keyframes tiltin {
    0%    { transform: rotateY(0deg);}
    50%   { transform: rotateY(0deg);}
    100%  { transform: rotateY(45deg);}
  }
  @keyframes tiltout {
    0%    { transform: rotateY(45deg);}
    100%  { transform: rotateY(0deg);}
  }
  
  @keyframes spin-0 {
    0%    { transform: rotateX(30deg); }
    100%  { transform: rotateX(-3719deg); }
  }
  @keyframes spin-1 {
    0%    { transform: rotateX(30deg); }
    100%  { transform: rotateX(-3749deg); }
  }
  @keyframes spin-2 {
    0%    { transform: rotateX(30deg); }
    100%  { transform: rotateX(-3779deg); }
  }
  @keyframes spin-3 {
    0%    { transform: rotateX(30deg); }
    100%  { transform: rotateX(-3809deg); }
  }
  @keyframes spin-4 {
    0%    { transform: rotateX(30deg); }
    100%  { transform: rotateX(-3839deg); }
  }
  @keyframes spin-5 {
    0%    { transform: rotateX(30deg); }
    100%  { transform: rotateX(-3869deg); }
  }
  @keyframes spin-6 {
    0%    { transform: rotateX(30deg); }
    100%  { transform: rotateX(-3899deg); }
  }
  @keyframes spin-7 {
    0%    { transform: rotateX(30deg); }
    100%  { transform: rotateX(-3929deg); }
  }
  @keyframes spin-8 {
    0%    { transform: rotateX(30deg); }
    100%  { transform: rotateX(-3959deg); }
  }
  @keyframes spin-9 {
    0%    { transform: rotateX(30deg); }
    100%  { transform: rotateX(-3989deg); }
  }
  @keyframes spin-10 {
    0%    { transform: rotateX(30deg); }
    100%  { transform: rotateX(-4019deg); }
  }
  @keyframes spin-11 {
    0%    { transform: rotateX(30deg); }
    100%  { transform: rotateX(-4049deg); }
  }

  .glow-on-hover {
    width: 200px;
    height: 50px;
    border: none;
    outline: none;
    color: #fff;
    background: #111;
    cursor: pointer;
    position: relative;
    z-index: 0;
    border-radius: 10px;
}

.glow-on-hover:before {
    content: '';
    background: linear-gradient(45deg, #ff0000, #ff7300, #fffb00, #48ff00, #00ffd5, #002bff, #7a00ff, #ff00c8, #ff0000);
    position: absolute;
    top: -2px;
    left:-2px;
    background-size: 400%;
    z-index: -1;
    filter: blur(5px);
    width: calc(100% + 4px);
    height: calc(100% + 4px);
    animation: glowing 20s linear infinite;
    opacity: 1;
    transition: opacity .3s ease-in-out;
    border-radius: 10px;
}

.glow-on-hover:active {
    color: #000
}

.glow-on-hover:active:after {
    background: transparent;
}

.glow-on-hover:hover:before {
    opacity: 1;
}

.glow-on-hover:after {
    z-index: -1;
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background: #111;
    left: 0;
    top: 0;
    border-radius: 10px;
}

@keyframes glowing {
    0% { background-position: 0 0; }
    50% { background-position: 400% 0; }
    100% { background-position: 0 0; }
}


/* checkbox */

.checkbox-wrapper-7 .tgl {
    display: none;
}
.checkbox-wrapper-7 .tgl,
.checkbox-wrapper-7 .tgl:after,
.checkbox-wrapper-7 .tgl:before,
.checkbox-wrapper-7 .tgl *,
.checkbox-wrapper-7 .tgl *:after,
.checkbox-wrapper-7 .tgl *:before,
.checkbox-wrapper-7 .tgl + .tgl-btn {
    box-sizing: border-box;
}
.checkbox-wrapper-7 .tgl::-moz-selection,
.checkbox-wrapper-7 .tgl:after::-moz-selection,
.checkbox-wrapper-7 .tgl:before::-moz-selection,
.checkbox-wrapper-7 .tgl *::-moz-selection,
.checkbox-wrapper-7 .tgl *:after::-moz-selection,
.checkbox-wrapper-7 .tgl *:before::-moz-selection,
.checkbox-wrapper-7 .tgl + .tgl-btn::-moz-selection,
.checkbox-wrapper-7 .tgl::selection,
.checkbox-wrapper-7 .tgl:after::selection,
.checkbox-wrapper-7 .tgl:before::selection,
.checkbox-wrapper-7 .tgl *::selection,
.checkbox-wrapper-7 .tgl *:after::selection,
.checkbox-wrapper-7 .tgl *:before::selection,
.checkbox-wrapper-7 .tgl + .tgl-btn::selection {
    background: none;
}
.checkbox-wrapper-7 .tgl + .tgl-btn {
    outline: 0;
    display: block;
    width: 4em;
    height: 2em;
    position: relative;
    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}
.checkbox-wrapper-7 .tgl + .tgl-btn:after,
.checkbox-wrapper-7 .tgl + .tgl-btn:before {
    position: relative;
    display: block;
    content: "";
    width: 50%;
    height: 100%;
}
.checkbox-wrapper-7 .tgl + .tgl-btn:after {
    left: 0;
}
.checkbox-wrapper-7 .tgl + .tgl-btn:before {
    display: none;
}
.checkbox-wrapper-7 .tgl:checked + .tgl-btn:after {
    left: 50%;
}

.checkbox-wrapper-7 .tgl-ios + .tgl-btn {
    background: #fbfbfb;
    border-radius: 2em;
    padding: 2px;
    transition: all 0.4s ease;
    border: 1px solid #e8eae9;
}
.checkbox-wrapper-7 .tgl-ios + .tgl-btn:after {
    border-radius: 2em;
    background: #fbfbfb;
    transition: left 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), padding 0.3s ease, margin 0.3s ease;
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1), 0 4px 0 rgba(0, 0, 0, 0.08);
}
.checkbox-wrapper-7 .tgl-ios + .tgl-btn:hover:after {
    will-change: padding;
}
.checkbox-wrapper-7 .tgl-ios + .tgl-btn:active {
    box-shadow: inset 0 0 0 2em #e8eae9;
}
.checkbox-wrapper-7 .tgl-ios + .tgl-btn:active:after {
    padding-right: 0.8em;
}
.checkbox-wrapper-7 .tgl-ios:checked + .tgl-btn {
    background: #86d993;
}
.checkbox-wrapper-7 .tgl-ios:checked + .tgl-btn:active {
    box-shadow: none;
}
.checkbox-wrapper-7 .tgl-ios:checked + .tgl-btn:active:after {
    margin-left: -0.8em;
}
  </style>
  