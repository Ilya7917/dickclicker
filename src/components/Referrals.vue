<script lang="ts" setup>
import { useUserStore } from '@/store/user';

const userStore = useUserStore()
const user = userStore.user;
</script>

<template>
    <div class="referrals__screen">
        <div class="referrals__title">{{$t("referrals.title")}}</div>
        <div class="referrals__subtitle">{{$t("referrals.subtitle")}}</div>
        <a v-if="user" :href="'https://t.me/share/url?url=https://t.me/DickClickbot?start=r_' + user.id + '&text=' + $t(`referrals.message`) + ''" target="_blank" class="invite__button">{{$t("referrals.button")}}</a>
    </div>
</template>

<style scoped>
.referrals__screen {
    background: #010300a3;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    backdrop-filter: blur(5px);
    justify-content: center;
    align-items: center;
    text-align: center;
}

.referrals__title {
    font-size: 24px;
    font-weight: bold;
}

.referrals__subtitle {
    font-size: 14px;
    padding: 10px 45px 25px;
}

.invite__button {
    padding: 10px 20px;
    border: none;
    background: rgb(112 182 60);
    color: white;
    font-size: 20px;
    font-weight: bold;
    border-radius: 5px;
    cursor: pointer;
    text-decoration: none;
}
</style>