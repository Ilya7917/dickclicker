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
        path: '/boosts', name: 'boosts', component: () => import('@/components/boosts/BoostsIndex.vue')
    },
    {
        path: '/channels', name: 'channels', component: () => import('@/components/Channels.vue')
    },
    {
        path: '/slots', name: 'slots', component: () => useWebAppPopup().showAlert("In developing 🛠️")
    },
    {
        path: '/posts', name: 'posts', component: () => import('@/components/posts/Posts.vue')
    },
    {
        path: '/market', name: 'market', component: () => useWebAppPopup().showAlert("In developing 🛠️")
    }
]

const router = createRouter({
    routes,
    history: createWebHistory()
})

/*
    delete referal path
    {
        path: '/referrals', name: 'referrals', component: () => import('@/components/Referrals.vue')
    },
*/

export default router