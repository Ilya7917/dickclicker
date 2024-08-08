<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue';
import Balance from './account/Balance.vue';
import { useWebAppHapticFeedback } from 'vue-tg'
import BottomMenu from './BottomMenu.vue';
import { useUserStore } from '@/store/user';
import { skins } from './skins/skinBase';


const userStore = useUserStore()

const { getCurrentSkin } = userStore

const coinRef = ref<HTMLElement | null>(null);
const clickCount = ref(0);
let timerId: NodeJS.Timeout | undefined;

const resetClickCount = () => {
    console.log(`Кількість натискань: ${clickCount.value}`);
    userStore.sendMineCoins(clickCount.value)
    clickCount.value = 0; // Скидуємо лічильник після виведення
};
const onUserClick = () => {
    clickCount.value += 1;

    // Скидуємо таймер, якщо він вже був встановлений
    if (timerId) clearTimeout(timerId);

    // Встановлюємо новий таймер
    timerId = setTimeout(resetClickCount, 300); // Наприклад, чекаємо 1 секунду
};

onMounted(() => {
    window.scrollTo(0, 0)
    // window.addEventListener('touchstart', onUserClick);
    // window.addEventListener('mousedown', onUserClick);
});

onUnmounted(() => {
    // window.removeEventListener('touchstart', onUserClick);
    // window.removeEventListener('mousedown', onUserClick);
    if (timerId) clearTimeout(timerId);
});

const numbersContainerRef = ref<HTMLElement | null>(null);
const isMobileDevice = () => {
    return ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
};
const createFlyingNumber = (farm: number, x: number, y: number) => {
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = `${x}px`;
    container.style.top = `${y}px`;
    container.style.display = 'flex';
    container.style.alignItems = 'center'; // Вертикальное выравнивание элементов
    container.style.justifyContent = 'center'; // Горизонтальное выравнивание элементов
    container.style.transform = 'translate(-50%, -50%)'; // Центрирование


    const numberEl = document.createElement('div');
    numberEl.textContent = farm.toString(); // Тут може бути будь-яке число або текст
    if (userStore.user && userStore.user.is_premium) {
        numberEl.style.color = '#ff9900';
    } else {
        numberEl.style.color = 'white';
    }
    numberEl.style.userSelect = 'none';
    numberEl.style.pointerEvents = 'none';
    numberEl.style.fontSize = '40px';
    numberEl.classList.add('flying-number');

    const imageEl = document.createElement('img');
    imageEl.src = getSkin(); // Замените на путь к вашему изображению
    imageEl.style.width = '35px';
    imageEl.style.height = '35px';
    imageEl.style.marginLeft = '50px';
    imageEl.style.marginRight = '8px'; // Отступ между картинкой и числом  
    imageEl.classList.add('flying-number');

    container.appendChild(imageEl);
    container.appendChild(numberEl);

    numbersContainerRef.value?.appendChild(container);

    // Видаляємо елемент після анімації
    setTimeout(() => {
        container.remove();
    }, 1000); // Тривалість анімації
};

function isTouchEvent(event: any): boolean {
  if ((window as any).TouchEvent !== undefined) {
    return event instanceof TouchEvent;
  }

  return event.touches !== undefined;
}

const applyTilt = (event: MouseEvent | TouchEvent) => {
    if (!userStore.user) return;
    if (!coinRef.value) return;

    if (event.type === 'mousedown' && isMobileDevice()) {
        return;
    }

    let clientX, clientY;

    if (isTouchEvent(event)) {
        const touchEvent = event as TouchEvent;
        clientX = touchEvent.touches[0].clientX;
        clientY = touchEvent.touches[0].clientY;
    } else {
        const mouseEvent = event as MouseEvent;
        clientX = mouseEvent.clientX;
        clientY = mouseEvent.clientY;
    }

    const numbersContainerRect = numbersContainerRef.value?.getBoundingClientRect();
    const relativeX = clientX - (numbersContainerRect?.left ?? 0);
    const relativeY = clientY - (numbersContainerRect?.top ?? 0);
    

    if (userStore.user.energy > userStore.user.mine_level) {
        userStore.mineCoins();
        var mul = 1
        if (userStore.user.is_premium) {
            mul = 2
        }
        createFlyingNumber(userStore.user.mine_level*mul, relativeX, relativeY);
        useWebAppHapticFeedback().impactOccurred("light");
        onUserClick()
    }
    // const coinRect = coinRef.value.getBoundingClientRect();
    // const coinCenterX = coinRect.left + coinRect.width / 2;
    // const coinCenterY = coinRect.top + coinRect.height / 2;

    // const tiltX = clientX < coinCenterX ? 'rotateY(-10deg)' : 'rotateY(10deg)';
    // const tiltY = clientY < coinCenterY ? 'rotateX(10deg)' : 'rotateX(-10deg)';

    // coinRef.value.style.transform = `${tiltY} ${tiltX}`;

    coinRef.value.style.transform = 'scale(0.98)';
};

const resetTilt = () => {
    if (coinRef.value) {
        coinRef.value.style.transform = '';
        coinRef.value.style.transform = 'scale(1)';
    }
};

const  getSkin = () => {
    let index = skins.findIndex(e => e.id == getCurrentSkin)
    console.log(`Index is : ${index}`)
    return skins[index].skin;
}



</script>

<template>
    <main>
        <Balance />
        <!-- <League /> -->
        <div class="coin-container numbers-container" ref="numbersContainerRef">
            <img v-if="userStore.user?.is_premium" :src="getSkin()" alt="Premium Coin" class="coin" ref="coinRef" @mousedown="applyTilt" @touchstart="applyTilt"
                @mouseup="resetTilt" @mouseleave="resetTilt" @touchend="resetTilt" />
            <img v-else :src="getSkin()" class="coin" alt="Regular Coin" ref="coinRef" @mousedown="applyTilt" @touchstart="applyTilt"
                @mouseup="resetTilt" @mouseleave="resetTilt" @touchend="resetTilt" />
        </div>
    </main>
    <BottomMenu />
</template>

<style scoped>

.coin-container {
    position: relative;
    text-align: center;
    display: flex;
    justify-content: center;
    flex-grow: 1;
}

.coin {
    transition: transform 0.1s;
    cursor: pointer;
    width: 80%;
    height: auto;
    user-select: none;
    -webkit-tap-highlight-color: transparent; /* Для вебкіт-браузерів на мобільних пристроях */
    -webkit-user-select: none; /* Специфічно для WebKit браузерів */
    /* Додаємо цю властивість */
}

.coin:active {
    -webkit-tap-highlight-color: transparent;
}
</style>