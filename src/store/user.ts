import { defineStore } from 'pinia'
import axios from 'axios'
import { id } from 'date-fns/locale';

export interface User {
    id: number;
    balance: number;
    post_balance: number;
    first_name: string;
    username: string;
    language_code: string;
    energy: number;
    energy_level: number;
    max_energy_level: number;
    mine_level: number;
    access_token: string;
    avatar_url?: string;
    auto_farmer: boolean;
    auto_farmer_profit: number;
    access_token_expires_at: string;
    premium_expires_at: Date | null;
    is_premium: boolean;
    daily_booster_available_at: Date;
};

export let dickIcon = 0;

export interface Boosts {
    current_mine_level: number;
    mine_level_price: number;
    current_energy_level: number;
    energy_level_price: number;
    current_max_energy: number;
    max_energy_price: number;
    auto_farmer_price: number;
}

export interface UserWithBoosts {
    user: User;
    boosts: Boosts;
}

export interface DailyBooster {
    coin: number;
    energy: number;
    next_at: Date;
}

export interface MiningResult {
    balance: number;
    mined: number;
    newEnergy: number;
}

export interface newPost {
    image: File;
    isPrivate: boolean;
    description: string;
    price: number;
    type: string;
    votePrice: number;
}

export interface allPosts {
    ID: number;
    ImagePath: string;
    OwnerName: string;
    OwnerID: number;
    AvatarURL: string;
    IsPrivate: boolean;
    Description: string;
    Price: number;
    Donated: number;
    Type: string;
    VotePrice: number;
    VoteYes: number;
    VoteNo: number;
}

export interface boughtPosts {
    ID: number;
    IsUnlock: true;
    PostID: number;
    UserID: number;
}



export const useUserStore = defineStore('user', {
    state: () => ({
        user: null as User | null,
        boosts: null as Boosts | null,
        skin: 0 as number | null,
        bg: "#ff72e3" as string | null,
        posts: null as allPosts[] | null,
        boughtPosts: null as boughtPosts[] | null,
        myPosts: null as allPosts[] | null,
        posts_balance: 0 as number | null,
    }),
    getters: {
        getAccessToken: (state) => "85a3ee03db29e208000acd43591dc0cbc93a45651117fca4fb797d8d32e89fa4", // state.user?.access_token,
        getCurrentSkin: (state) => state.skin,
        getCurrentBg: (state) => state.bg
    },
    actions: {
        setSkin(newSkin: number) {
            this.skin = newSkin;
        },
        setUser(user: User) {
            this.user = user
        },
        setBoosts(boosts: Boosts) {
            this.boosts = boosts
        },
        async getSkins()
        {
            if(!this.user) return;

            const response = await axios.get(`${import.meta.env.VITE_API_HOST}/getSkins`, {
                headers: {
                    'x-api-key': this.user.access_token,
                }
            });
            this.skin = response.data.current_skin;
            return response.data.skins;
        },
        async updateUserCurrentSkin(id: number)
        {
            if (!this.user) {
                return
            }
            const response = await axios.post(
                `${import.meta.env.VITE_API_HOST}/setSkin`,
                {
                  skinId: id
                },
                {
                  headers: {
                    'x-api-key': this.user.access_token
                  }
                }
            );
            if(response.data.sucess)
            {
                this.skin = id;
            }
        },
        async getPosts(){
            // if(!this.user) return;
            const response = await axios.get(`${import.meta.env.VITE_API_HOST}/getPosts`, {
                headers: {
                    'x-api-key': this.getAccessToken,
                }
            });
            console.log(response);
            this.posts = response.data;
            if(response.data.length > 0) return true;
            return false;
            
        },
        async exchangeDonateMoney(amount: number) {
            if(!this.user) return;
            const response = await axios.post(
                `${import.meta.env.VITE_API_HOST}/exchangeDonateMoney`,
                {
                   amount: Number(amount)
                },
                {
                  headers: {
                    'x-api-key': this.user.access_token,
                  }
                }
            );
            console.log(response);
            if(response.data.sucess) return true;
            return false;
        },
        async unlockPost(postId: number) {
            if (!this.user) return;
            const response = await axios.post(
                `${import.meta.env.VITE_API_HOST}/unlockPost`,
                {
                   postId: postId
                },
                {
                  headers: {
                    'x-api-key': this.user.access_token,
                  }
                }
            );
            console.log(response);
            if(response.data.sucess){
                this.user = response.data.user
                return true;
            }
            return false;
        },
        async getMyBoughtPosts() {
            if(!this.user) return;
            const response = await axios.get(`${import.meta.env.VITE_API_HOST}/boughtPosts`, {
                headers: {
                    'x-api-key': this.user.access_token,
                }
            });
            console.log(response);
            if(response.data.length > 0) 
            {
                this.boughtPosts = response.data;
                console.log(this.boughtPosts);
            }
        },
        async getMyPosts() {
            if(!this.user) return;
            const response = await axios.get(`${import.meta.env.VITE_API_HOST}/getMyPosts`, {
                headers: {
                    'x-api-key': this.user.access_token,
                }
            });
            console.log(response);
            this.myPosts = response.data;
        },
        async donatePost(postId: number, amount: number){
            if (!this.user) {
                return
            }
            const response = await axios.post(
                `${import.meta.env.VITE_API_HOST}/donatePost`,
                {
                   postId: postId,
                   amount: Number(amount)
                },
                {
                  headers: {
                    'x-api-key': this.user.access_token,
                  }
                }
            );
            if(response.data.sucess) {
                this.user = response.data.user
                return true;
            } 
        },
        async createPost(post: newPost)
        {
            if(!this.user) return;
            const formData = new FormData();
            formData.append('image', post.image);
            formData.append('isPrivate', post.isPrivate.toString()); // Преобразование булевого значения в строку
            formData.append('description',post.description);
            formData.append('price', post.price.toString()); // Преобразование числа в строку
            formData.append('type', post.type == '' ? "donated" : post.type)
            formData.append('votePrice', post.votePrice.toString())
        
            const response = await fetch(`${import.meta.env.VITE_API_HOST}/createPost`, {
                method: 'POST',
                body: formData,
                headers: {
                    'x-api-key': this.user.access_token,
                }
              });
              const result = await response.json();
              console.log(result);
              if(result.sucess) {
                this.user = result.user;
                return true;
              }
              return false;
        },
        async votePost(postId: number, voteType: string){
            if(!this.user) return;
            const response = await axios.post(
                `${import.meta.env.VITE_API_HOST}/votePost`,
                {
                   id: postId,
                   vote_type: voteType
                },
                {
                  headers: {
                    'x-api-key': this.user.access_token,
                  }
                }
            );
            if(response.data.sucess) {
                this.user = response.data.user
                return true;
            } 
        },
        async getMyPostsBalance() {
            if(!this.user) return;
            const response = await axios.get(`${import.meta.env.VITE_API_HOST}/getUserPostsBalance`, {
                headers: {
                    'x-api-key': this.user.access_token,
                }
            });
            console.log(response);
            this.posts_balance = response.data;
        },
        async buyNewSkin(skinId: number)
        {
            if (!this.user) {
                return
            }
            const response = await axios.post(
                `${import.meta.env.VITE_API_HOST}/buySkin`,
                {
                  skinId: skinId
                },
                {
                  headers: {
                    'x-api-key': this.user.access_token
                  }
                }
            );
            if(response.data.sucess)
            {
                this.setUser(response.data.user)
                return true;
            }
            return false;
            
        },
        async login(initData: string) {
            const apiKey = import.meta.env.VITE_API_KEY
            if (apiKey !== undefined && apiKey !== "") {
                try {
                    const response = await axios.get<User>(`${import.meta.env.VITE_API_HOST}/getMe`, {
                        headers: {
                            'x-api-key': apiKey,
                        }
                    });
                    this.setUser(response.data);
                } catch (error) {
                    console.error('Login via ready token error:', error);
                    // Обробка помилок або відображення повідомлення користувачу
                }
            } else {
                try {
                    const response = await axios.post<User>(`${import.meta.env.VITE_API_HOST}/authorize`, initData);
                    this.setUser(response.data);
                } catch (error) {
                    console.error('Login error:', error);
                    // Обробка помилок або відображення повідомлення користувачу
                }
            }
            if (!this.user) {
                return
            }
            if (this.user.auto_farmer_profit > 0) {
                this.user.balance -= this.user.auto_farmer_profit
            }
            return this.user
        },
        async testRequest(){
            const response = await axios.get(`${import.meta.env.VITE_API_HOST}/health`);
            console.log(response);
        },
        mineCoins() {
            if (this.user && this.user.energy >= this.user.mine_level) {
                var mul = 1
                if (this.user.is_premium) {
                    mul = 2
                }
                this.user.balance += this.user.mine_level * mul
                this.user.energy -= this.user.mine_level
            }
        },
        async sendMineCoins(clicks: number) {
            if (!this.user) {
                return;
            }

            let energy = this.user.energy + this.user.mine_level * clicks

            console.log("clicks", clicks)
            console.log("energy", energy)
            console.log("to mine", this.user.mine_level * clicks)
            console.log("rouned", Math.round((energy / this.user.mine_level)))
            if (energy < this.user.mine_level * clicks && clicks > 1) {
                clicks = Math.round((energy / this.user.mine_level))
                if (clicks < 1) {
                    return
                }
            }
            const result = await axios.post<MiningResult>(`${import.meta.env.VITE_API_HOST}/mine`, {
                count: clicks,
            }, {
                headers: {
                    'x-api-key': this.user.access_token,
                }
            });

            this.user.balance = result.data.balance
            this.user.energy = result.data.newEnergy
        },
        async getBoosts() {
            if (!this.user) {
                return
            }
            const response = await axios.get<Boosts>(`${import.meta.env.VITE_API_HOST}/boosts`, {
                headers: {
                    'x-api-key': this.user.access_token,
                }
            });
            this.setBoosts(response.data);
        },
        async purchaseBoost(boost: string) {
            if (!this.user) {
                return;
            }

            const result = await axios.post<UserWithBoosts>(`${import.meta.env.VITE_API_HOST}/boosts`, {
                boost: boost,
            }, {
                headers: {
                    'x-api-key': this.user.access_token,
                }
            });
            this.setUser(result.data.user)
            this.setBoosts(result.data.boosts)
            // this.user.balance = result.data.balance
            // this.user.energy = result.data.newEnergy
        },
        async openDailyBooster() {
            if (!this.user) {
                return;
            }

            const result = await axios.post<DailyBooster>(`${import.meta.env.VITE_API_HOST}/dailyBooster`, {}, {
                headers: {
                    'x-api-key': this.user.access_token,
                }
            });
            return result.data
        },
        async spinSlot() {
            if(!this.user) return;
            const result = await axios.post(`${import.meta.env.VITE_API_HOST}/spin`, {}, {
                headers: {
                    'x-api-key': this.user.access_token,
                }
            });
            if(result.data.sucess) {
                this.user = result.data.user;
                return true;
            }
            return false;
            console.log(result);
        },
        async getReward(winCode: number) {
            if(!this.user) return;
            const result = await axios.post(`${import.meta.env.VITE_API_HOST}/reward`, {
                code: winCode
            }, {
                headers: {
                    'x-api-key': this.user.access_token,
                }
            });
            if(result.data.sucess) {
                this.user = result.data.user;
                return true;
            }
            return false;
        },
        recharge() {
            if (this.user) {
                if (this.user.energy + this.user.energy_level > (1000 + this.user.max_energy_level * 500)) {
                    this.user.energy = 1000 + this.user.max_energy_level * 500
                    return
                }
                this.user.energy += this.user.energy_level
            }
        },
        logout() {
            this.user = null
        }
    }
})