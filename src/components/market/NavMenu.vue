<script lang="ts" setup>
    import BackIcon from "@/assets/images/back-icon.svg"
    import OrdersIcon from "@/assets/images/orders-icon.svg"
    import AddPostIcon from "@/assets/images/add-post.svg";
    import ProfileIcon from "@/assets/images/profile-icon.svg";
    
    const props = defineProps<{
        pageState: string;
    }>();

    const emit = defineEmits(['change-page-state']);

    const changePageState = (state: string) => {
        if (state === props.pageState) return;
        emit('change-page-state', state);
    };
</script>

<template>
    <div class="navMenu">
        <div class="nav-btn__wrapper">
            <button v-if="props.pageState != 'visible'" class="post-component__nav-btn feed" :class="{ 'active': props.pageState === 'market' }" @click="changePageState('market')">
                <img :src="OrdersIcon" />
            </button>
            <button v-if="props.pageState != 'visible'" class="post-component__nav-btn compose" :class="{ 'active': props.pageState === 'create' }" @click="changePageState('create')">
                <img :src="AddPostIcon" />
            </button>
            <button v-if="props.pageState != 'visible'" class="post-component__nav-btn profile" :class="{ 'active': props.pageState === 'myorders' }" @click="changePageState('myorders')"><img :src="ProfileIcon" /></button>
            <button v-else class="post-component__nav-btn profile" @click="changePageState('market')"><img :src="BackIcon" /></button>
        </div>
        <div class="nav-btn__text">
            <span v-if="props.pageState != 'visible'" class="nav-btn__text-item" :class="{ 'active': props.pageState === 'posts' }">Orders</span>
            <span v-if="props.pageState != 'visible'" class="nav-btn__text-item" :class="{ 'active': props.pageState === 'create' }">Create</span> 
            <span v-if="props.pageState != 'visible'" class="nav-btn__text-item" :class="{ 'active': props.pageState === 'myorders' }">My Orders</span>
            <span v-else="props.pageState != 'visible'" class="nav-btn__text-item">Back</span>
        </div>
    </div>
</template>

<style scoped>
.navMenu {
    position: fixed;
    bottom: 0px;
    height: 92px;
    width: 100%;
    background-image: linear-gradient(0deg, #2b1e29 25%, transparent 50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
    z-index: 10;
}

.navMenu .nav-btn__wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 30px;
    background: #392936;
    padding: 16px;
    align-self: center;
    border-radius: 40px;
    box-shadow: inset 0 0 0px 1px #4d3749;
}

.navMenu .nav-btn__text {
    font-size: 11px;
    font-weight: 500;
    display: flex;
    gap: 24px;
    padding: 10px 0 15px;
    color: #a289a9;
}

.navMenu .nav-btn__text .nav-btn__text-item.active {
    color: #fff;
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

.mypost-button:hover {
    background-color: #878787;
}

.post-component__nav-btn {
    position: relative;
    width: 22px;
    height: 22px;
    border: none;
    background-color: transparent;
    font-size: 20px;
    font-weight: bold;
    border-radius: 5px;
    cursor: pointer;
    transition: all 0.3s ease;
    -webkit-tap-highlight-color: transparent;
}

.post-component__nav-btn img {
    width: 22px;
    height: 22px;
    filter: brightness(10);
    opacity: 0.5;
}

.post-component__nav-btn.active {
    pointer-events: none;
}

.post-component__nav-btn.active img {
    opacity: 1;
}

.post-component__nav-btn.active::before {
    content: '';
    position: absolute;
    top: -7px;
    left: -7px;
    width: 36px;
    height: 36px;
    background: linear-gradient(90deg, #d67eff, #b231cb, #d67eff);
    background-size: 125%;
    background-position: center;
    border-radius: 50%;
    box-shadow: inset 0 0 0 1px #d67eff;
}

</style>