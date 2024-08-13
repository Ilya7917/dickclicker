import { defineStore } from 'pinia';
import axios from 'axios';
import { useUserStore } from './user';
import { be } from 'date-fns/locale';

interface Symbol {
  id: string;
  icon: string;
}

interface Position {
  reel: number;
  row: number;
}

export const useSlotMachineStore = defineStore('slotmachinestore', {
  state: () => ({
    reels: [] as Symbol[][],
    winLines: [] as Position[][],
    isSpinning: false,
    isAutoSpinOn: false,
    showPayLines: false,
    credits: 100,
    bet: 1,
  }),
  actions: {
    async spin(bet: number) {
      const userStore = useUserStore();
      const response = await axios.post(
          `${import.meta.env.VITE_API_HOST}/spin`,
          {
            bet: bet
          },
          {
            headers: {
              'x-api-key': userStore.getAccessToken
            }
          }
      );
      if(response.data.sucess) {
        if(userStore.user != null) {
          userStore.user.balance -= bet;
        }
      }
      return response.data;
    },
    async setWin(win_amount: number, number: number){
      const userStore = useUserStore();
      const response = await axios.post(
          `${import.meta.env.VITE_API_HOST}/reward`,
          {
              win_amount: win_amount,
              number: number
          },
          {
            headers: {
              'x-api-key': userStore.getAccessToken
            }
          }
      );
      console.log(response);
      if(response.data.sucess) {
        if(userStore.user != null) {
          userStore.user.withdrawal_balance += win_amount;
        }
      }
      return response.data;
    }
  },
});