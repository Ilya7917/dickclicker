import { createRouter, createWebHistory} from 'vue-router'
import { useWebAppPopup } from 'vue-tg'

const routes = [
    {
        path: '/', name: 'miner', component: () => import('@/components/Miner.vue')
    },
    {
        path: '/leaderboard', name: 'leaderboard', component: () => import('@/components/Leaderboard.vue')
    },
    {
        path: '/skins', name: 'skins', component: () => import('@/components/skins/SkinsStore.vue')
    },
    {
        path: '/posts', name: 'skins', component: () => { useWebAppPopup().showAlert("👨‍💻 In developing")}
    },
    {
        path: '/boosts', name: 'boosts', component: () => import('@/components/boosts/BoostsIndex.vue')
    },
    {
        path: '/channels', name: 'channels', component: () => import('@/components/Channels.vue')
    },
    {
        path: '/referrals', name: 'referrals', component: () => import('@/components/Referrals.vue')
    }
]

const router = createRouter({
    routes,
    history: createWebHistory()
})

export default router