<template>
    <div :style="{ backgroundPosition: '0px ' + position + 'px' }" class="icons"></div>
</template>
  
<script lang="ts" setup>
  import { ref, watch, onMounted } from 'vue';


  interface Props {
    timer: number;
    canSpin: boolean;
  }

  const props = defineProps<Props>();
  const emit = defineEmits(['finish']);
  const position = ref(0);
  const timeRemaining = ref(props.timer);
  const iconHeight = 188;
  const multiplier = Math.floor(Math.random() * (4 - 1) + 1);
  let timer: number | any;
  console.log(props.canSpin)
  const setStartPosition = () => {
    return ((Math.floor(Math.random() * 9)) * iconHeight) * -1;
  };

  let start = setStartPosition();
  const speed = iconHeight * multiplier;

  const moveBackground = () => {
    position.value -= speed;
    timeRemaining.value -= 100;
  };

  const getSymbolFromPosition = () => {
    const totalSymbols = 9;
    const maxPosition = (iconHeight * (totalSymbols - 1) * -1);
    const moved = (props.timer / 100) * multiplier;
    let currentPosition = start;

    for (let i = 0; i < moved; i++) {
      currentPosition -= iconHeight;

      if (currentPosition < maxPosition) {
        currentPosition = 0;
      }
    }
    console.log(currentPosition);
    emit('finish', currentPosition);
  };

  const tick = () => {
    if (timeRemaining.value <= 0) {
      clearInterval(timer);
      getSymbolFromPosition();
    } else {
      moveBackground();
    }
  };

  const reset = () => {
    if (timer) {
      clearInterval(timer);
    }
    start = setStartPosition()
    position.value = start;
    timeRemaining.value = props.timer;
    console.log(`Position: ${position.value}`)
    timer = setInterval(tick, 100);
  };

  defineExpose({
    reset,
  });

  watch(() => props.canSpin, (newValue) => {
    console.log(newValue)
    reset();
  });

  onMounted(() => {
  });
</script>