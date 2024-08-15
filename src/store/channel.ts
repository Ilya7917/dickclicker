import axios from 'axios';
import { defineStore } from 'pinia'
import { isProxy, toRaw } from 'vue';
import { useUserStore } from './user';
import Balance from '@/components/account/Balance.vue';

const userStore = useUserStore()

const { setUser } = userStore

export interface Channel {
    id: number;
    title: string;
    invite_link: string;
    balance: number;
    reward: number;
    avatar_url?: string;
    is_available: boolean;
    available: boolean;
    is_whale: boolean;
    user_id: number;
    channel_avatar: string;
    task: string;
};

export interface ChannelMember {
    ChannelID: number;
    UserID: number;
    Status: string;
    UpdatedAt: Date | null;
    CreatedAt: Date | null;
    UserName: string | null;
}

export const useChannelsStore = defineStore('channels', {
    state: () => ({
        channels: null as Channel[] | null,
        whales: null as Channel[] | null,
        myChannels: null as ChannelMember[] | null,
        channelMembers: null as ChannelMember[] | null,
    }),
    getters: {
        getChannels: (state) => state.myChannels,
    },
    actions: {
        async fetchChannels() {
            const userStore = useUserStore();
            const response = await axios.get<Channel[]>(`${import.meta.env.VITE_API_HOST}/channels`, {
                headers: {
                    'x-api-key': userStore.getAccessToken,
                }
            });
            console.log(response);
            this.channels = response.data;
        },
        async fetchWhales() {
            const userStore = useUserStore();
            const response = await axios.get<Channel[]>(`${import.meta.env.VITE_API_HOST}/whales`, {
                headers: {
                    'x-api-key': userStore.getAccessToken,
                }
            });
            this.whales = response.data;
            console.log(response.data);
        },
        async fetchChannelMembersInProgress(channelId: number) {
            const userStore = useUserStore();
            const response = await axios.get(`${import.meta.env.VITE_API_HOST}/getInProgressUsersOfChannel`, {
                headers: {
                    'x-api-key': userStore.getAccessToken,
                    'id': channelId
                }
            });
            console.log(response);
            this.channelMembers = response.data.members;
            return response.data;
        },
        async startChannel(channelId: number) {
            const userStore = useUserStore();
            const response = await axios.post(`${import.meta.env.VITE_API_HOST}/initUserChannel`,
                {
                    id: channelId
                },
                {
                headers: {
                    'x-api-key': userStore.getAccessToken,
                },
            });
            this.myChannels = response.data.channels
            return true;
        },
        async releaseUserTask(channelId: number, userId: number) {
            const userStore = useUserStore();
            const response = await axios.post(`${import.meta.env.VITE_API_HOST}/releaseUserTask`,
                {
                    id: channelId,
                    user_id: userId
                },
                {
                headers: {
                    'x-api-key': userStore.getAccessToken,
                },
            });
            if(response.data.sucess){
                return true;
            }
            return false;
            
        },
        async finishChannelTask(channelId: number) {
            const userStore = useUserStore();
            const response = await axios.post(`${import.meta.env.VITE_API_HOST}/updateUserChannelTask`,
                {
                    id: channelId
                },
                {
                headers: {
                    'x-api-key': userStore.getAccessToken,
                },
            });
            if(response.data.sucess){
                return true;
            }
            return false;
        },
        async createWhale(channelBalance: number, link: string, rewarded: number, task: string) {
            const userStore = useUserStore();
            const response = await axios.post(`${import.meta.env.VITE_API_HOST}/createWhale`,
                {
                    balance: channelBalance,
                    link: link,
                    rewarded: rewarded,
                    task: task
                },
                {
                headers: {
                    'x-api-key': userStore.getAccessToken,
                },
            });
            console.log(response)
            if(response.data.sucess) {
                if(userStore.user?.balance != null) { userStore.user.balance -= channelBalance }
                return true 
            };
            return false;
        },
        async getMyChannels(){
            const userStore = useUserStore();
            const response = await axios.get(`${import.meta.env.VITE_API_HOST}/getMyChannels`, {
                headers: {
                    'x-api-key': userStore.getAccessToken,
                }
            });
            console.log(response);
            this.myChannels = toRaw(response.data.channels)
        },
        async rewardChannel(channelId: Number){
            const userStore = useUserStore();
            const response = await axios.post(`${import.meta.env.VITE_API_HOST}/getRewardFromChannel`,
                {
                    id: channelId
                },
                {
                headers: {
                    'x-api-key': userStore.getAccessToken,
                },
            });
            console.log(response.data);
            setUser(response.data.user);
            this.myChannels = response.data.channels
            return true;
        },
        async changeChannelAvailable(channelId: number) {
            const userStore = useUserStore();
            const response = await axios.post(`${import.meta.env.VITE_API_HOST}/changeChannelAvailable`,
                {
                    id: channelId
                },
                {
                headers: {
                    'x-api-key': userStore.getAccessToken,
                },
            });
            console.log(response.data);
            return true;
        },
        async deleteWhale(channelId: number) {
            const userStore = useUserStore();
            const response = await axios.post(`${import.meta.env.VITE_API_HOST}/deleteWhale`,
                {
                    id: channelId
                },
                {
                headers: {
                    'x-api-key': userStore.getAccessToken,
                },
            });
            console.log(response.data);
            return true;
        },
        async topUpWhale(channelId: number, balance: number) {
            const userStore = useUserStore();
            const response = await axios.post(`${import.meta.env.VITE_API_HOST}/topUpWhale`,
                {
                    id: channelId,
                    balance: balance
                },
                {
                headers: {
                    'x-api-key': userStore.getAccessToken,
                },
            });
            console.log(response.data);
            return true;
        }
    },
})