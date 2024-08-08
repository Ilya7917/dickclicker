import axios from 'axios';
import { defineStore } from 'pinia'
import { toRaw } from 'vue';
import { useUserStore } from './user';

const userStore = useUserStore()

const { setUser } = userStore

export interface Orders {
    ID: number;
    Amount: number;
    OwnerID: number;
    OwnerAvatar: string;
    OwnerName: string;
    PaymentMethods: string[];
    Price: number;
    Status: string;
    CloseWithUserID: number | null;
}

export interface newOrder {
    amount: number;
    paymentMethods: string[];
    price: number;
}

export const useMarketStore = defineStore('marketStore', {
    state: () => ({
        orders: null as Orders[] | null,
        myOrders: null as Orders[] | null,
    }),
    getters: {},
    actions: {
        async createNewOrder(order: newOrder) {
            console.log(order);
            const userStore = useUserStore();
            const response = await axios.post(`${import.meta.env.VITE_API_HOST}/createOrder`,
                {
                    amount: order.amount,
                    paymentMethods: order.paymentMethods,
                    price: order.price
                },
                {
                headers: {
                    'x-api-key': userStore.getAccessToken,
                },
            });
            console.log(response);
            return true;
        },
        async fetchAllActiveOrders() {
            const userStore = useUserStore();
            const response = await axios.get(`${import.meta.env.VITE_API_HOST}/orders`, {
                headers: {
                    'x-api-key': userStore.getAccessToken,
                }
            });
            console.log(response);
            for(let i = 0; i < response.data.orders.length; i++){
                const paymentMethodsStr = response.data.orders[i].PaymentMethods;
                const paymentMethods = paymentMethodsStr.split(',').map((method:string) => method.trim());
                response.data.orders[i].PaymentMethods = paymentMethods;
                console.log(paymentMethods);
            }
            this.orders = response.data.orders;
            console.log(this.orders);
            return true;
        },
        async createOrderMember(orderID: number, owner_id: number){
            const userStore = useUserStore();
            const response = await axios.post(`${import.meta.env.VITE_API_HOST}/createOrderMember`,
                {
                    id: orderID,
                    owner_id: owner_id
                },
                {
                headers: {
                    'x-api-key': userStore.getAccessToken,
                },
            });
            console.log(response);
            return true;
        },
        async fetchOrderMembers(orderID: number) {
            const userStore = useUserStore();
            const response = await axios.get(`${import.meta.env.VITE_API_HOST}/getOrderMembers`, {
                headers: {
                    'x-api-key': userStore.getAccessToken,
                    'id': orderID
                }
            });
            console.log(response);
            return response.data.members;
        },
        async deleteMyOrder(orderID: number){
            const userStore = useUserStore();
            const response = await axios.post(`${import.meta.env.VITE_API_HOST}/deleteOrder`,
                {
                    id: orderID
                },
                {
                headers: {
                    'x-api-key': userStore.getAccessToken,
                },
            });
            console.log(response);
            if(response.data.sucess){
                return true;
            }
            return false;
        },

        async startOrder(orderID:number, memberId:number){
            const userStore = useUserStore();
            const response = await axios.post(`${import.meta.env.VITE_API_HOST}/startOrder`,
                {
                    id: orderID,
                    member_id: memberId
                },
                {
                headers: {
                    'x-api-key': userStore.getAccessToken,
                },
            });
            console.log(response);
            if(response.data.sucess){
                return true;
            }
            return false;
        },
        async finishOrder(orderID: number){
            const userStore = useUserStore();
            const response = await axios.post(`${import.meta.env.VITE_API_HOST}/finishOrder`,
                {
                    id: orderID,
                },
                {
                headers: {
                    'x-api-key': userStore.getAccessToken,
                },
            });
            console.log(response);
            if(response.data.sucess){
                return true;
            }
            return false;
        },
    },
})