<template>
  <div class="slot-machine">
    <h1>Слот-машина</h1>
    <div class="machine-body">
      <div class="reels">
        <div v-for="(col, colIndex) in reels" :key="colIndex" class="column">
          <div class="reel-wrapper" :style="{'animation-play-state': isSpinning ? 'running' : 'paused'}">
            <div v-for="(reel, reelIndex) in col" :key="reelIndex" class="reel">
              {{ reel }}
            </div>
            <div v-for="(reel, reelIndex) in col" :key="'repeat-' + reelIndex" class="reel">
              {{ reel }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <button @click="spin" class="spin-button">Крутить</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      symbols: ['🍒', '🍔', '🍕', '🍌', '🥑'],
      reels: [
        ['🍒', '🍔', '🍕', '🍌', '🥑'],
        ['🍌', '🍒', '🥑', '🍔', '🍕'],
        ['🥑', '🍕', '🍌', '🍒', '🍔'],
        ['🍔', '🥑', '🍕', '🍌', '🍒'],
        ['🍕', '🍌', '🍒', '🥑', '🍔']
      ],
      isSpinning: false
    };
  },
  methods: {
    async spin() {
      if (this.isSpinning) return;
      this.isSpinning = true;

      // Останавливаем каждую колонку с задержкой
      for (let i = 0; i < this.reels.length; i++) {
        await this.stopReel(i);
      }

      this.isSpinning = false;
    },
    stopReel(index) {
      return new Promise((resolve) => {
        setTimeout(() => {
          this.$set(this.reels, index, this.reels[index].slice(0, 3));
          resolve();
        }, 1000 + index * 500);
      });
    }
  }
};
</script>

<style>
.slot-machine {
  text-align: center;
  font-family: Arial, sans-serif;
  background-color: #222;
  color: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
  max-width: 400px;
  margin: 0 auto;
  position: relative;
  overflow: hidden;
}

.machine-body {
  background: #444;
  padding: 20px;
  border-radius: 10px;
  position: relative;
  overflow: hidden;
}

.reels {
  display: flex;
  justify-content: center;
  margin: 20px 0;
}

.column {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 5px;
  height: 180px;
  overflow: hidden;
  position: relative;
}

.reel-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: spin 1s linear infinite;
}

.reel {
  font-size: 2em;
  margin: 5px 0;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  border-radius: 5px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
}

.spin-button {
  font-size: 1em;
  padding: 10px 20px;
  cursor: pointer;
  background: #ff5722;
  color: #fff;
  border: none;
  border-radius: 5px;
  box-shadow: 0 5px #e64a19;
}

.spin-button:active {
  box-shadow: 0 2px #e64a19;
  transform: translateY(3px);
}

@keyframes spin {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-100%);
  }
}

.slot-machine::before {
  content: '';
  position: absolute;
  top: 33%;
  left: 0;
  right: 0;
  height: 2px;
  background: rgba(255, 255, 0, 0.7);
}

.slot-machine::after {
  content: '';
  position: absolute;
  top: 66%;
  left: 0;
  right: 0;
  height: 2px;
  background: rgba(255, 255, 0, 0.7);
}
</style>
