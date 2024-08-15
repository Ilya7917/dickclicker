<script lang="ts" setup>
import { allPosts, UserWithBoosts, useUserStore } from '@/store/user';
import { onMounted, ref, Ref } from 'vue';
import loadingIcon from "@/assets/images/loading.svg";
import AcceptIcon from "@/assets/images/acceptet.svg";
import DonateBalance from '../account/DonateBalance.vue';
import NavMenu from './NavMenu.vue';
import { useWebAppPopup } from 'vue-tg'
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
const userStore = useUserStore()
userStore.getBoosts()
const isPopupVisible = ref(false);
const justOpened = ref(false);

const pageState = ref("posts");

const isPostOptionsSet = ref(false);

const isNextButton = ref(false);
const newPosts = ref({
    image: null as File | null,
    isPrivate: false,
    description: '',
    type: '',
    price: 0,
    votePrice: 0
})

const progressPost = ref(0);
const progressNewPosts = [
    {
        id: 0,
        isActive: true,
        text: "Add image"
    },
    {
        id: 1,
        isActive: false,
        text: "Write description"
    },
    {
        id: 2,
        isActive: false,
        text: "Choose Details"
    }
]

const filterPosts = (array: allPosts[]): allPosts[] => {
    if(userStore.posts == null) return [];
    const nonVotePosts = userStore.posts.filter(post => post.Type !== 'vote')
        .sort((a, b) => b.Donated - a.Donated); // Сортировка по Donated


    const votePosts = userStore.posts.filter(post => post.Type === 'vote')
        .sort((a, b) => (b.VoteYes + b.VoteNo) - (a.VoteYes + a.VoteNo)); // Сортировка по сумме VoteYes и VoteNo


    return [...nonVotePosts, ...votePosts]
}

async function fetchUserData() {
    try {
        await Promise.all([
            userStore.getMyBoughtPosts(),
            userStore.getPosts().then(ok => {
                if(ok) {
                    if(userStore.posts == null) return;
                    
                    let myFilteredPosts = filterPosts(userStore.posts);
                    
                    userStore.posts = myFilteredPosts;

                    const donatePosts: allPosts[] = userStore.posts.filter(post => post.Type === 'donate');
                    const votePosts: allPosts[] = userStore.posts.filter(post => post.Type === 'vote');

                    const result: allPosts[] = [];
                    while (donatePosts.length > 0 || votePosts.length > 0) {
                        if (donatePosts.length > 0) {
                            const post = donatePosts.shift();
                            if (post !== undefined) { 
                                result.push(post);
                            }
                        }
                        if (votePosts.length > 0) {
                            const post = votePosts.shift();
                            if (post !== undefined) {  
                                result.push(post);
                            }
                        }
                    }
                    userStore.posts = result;

                }
            }),
            userStore.getMyPosts(),
        ]);
    } catch (error) {
        console.error('Error fetching user data:', error);
    }
}

onMounted(() => {
    pageState.value = "posts";
    fetchUserData();
});

const handleChangePageState = (state: string) => {
  if (state === pageState.value) return;
  pageState.value = state;
};

const onAddFile = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const files = target.files;
    if (files && files.length > 0) {
        const file = files[0];
        const reader = new FileReader();
        
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                const MAX_WIDTH = 1024;
                const MAX_HEIGHT = 1024;
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                    }
                } else {
                    if (height > MAX_HEIGHT) {
                        width *= MAX_HEIGHT / height;
                        height = MAX_HEIGHT;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                if(ctx != null) ctx.drawImage(img, 0, 0, width, height);

                canvas.toBlob((blob) => {
                    if (blob) {
                        newPosts.value.image = new File([blob], file.name, { type: file.type });
                        isNextButton.value = true;
                    }
                }, file.type, 0.8);
            };
            img.src = event.target?.result as string;
        };

        reader.readAsDataURL(file);
    }
}

const onAddDescription = (e: Event) => {
    console.log(1);
    const target = e.target as HTMLInputElement;
    const value = target.value;
    if (value) {
        newPosts.value.description = value;
    }
    console.log(newPosts)
}

const nextButtonChangeState = () => {
    if(progressPost.value !== 0) isNextButton.value = false
    progressPost.value++;
    progressNewPosts[progressPost.value].isActive = true;
}

const uploadPostState = ref(false);
const createNewPost = () => {
    if(!userStore.user) return;
    if(userStore.user.balance < 1000) {
        useWebAppPopup().showAlert("Недостаточно 🍆 для создания поста");
        return;
    }
    newPosts.value.isPrivate = isPostOptionsSet.value;
    if (newPosts.value.image != null) {
        const newPost = {
          image: newPosts.value.image,
          isPrivate: newPosts.value.isPrivate,
          description: newPosts.value.description,
          price: newPosts.value.price,
          type: newPosts.value.type,
          votePrice: newPosts.value.votePrice
        };
        progressPost.value ++;
        userStore.createPost(newPost).then(result => {
            if(result) {
                setTimeout(() => {
                    progressPost.value = 0;
                    pageState.value = "posts";
                    progressNewPosts.forEach(x => { if(x.id !== 0) { x.isActive = false } });
                    uploadPostState.value = true;
                    uploadPostState.value = false;
                    userStore.getPosts();
                    userStore.getMyPosts();
                }, 2500);
            }
        });
    } else {
        useWebAppPopup().showAlert("Не выбрано изображение");
    }
}

const popupState = ref("close")

const currentPost = ref({
    id: 0,
    price: 0,
    imagePath: "",
    decription: "",
    donated: 0
})
const setStatePopup = (state :string, postid: number, price: number, imagePath: string | null, description: string | null, donated: number | null) => { 
    if(state == 'dump'){
        if(userStore.user != null && userStore.user.balance < 1000){
            useWebAppPopup().showAlert("Недостаточно средств. Минимум 1000 🍆");
            return;
        }
    }
    
    popupState.value = state;
    currentPost.value.id = postid;
    currentPost.value.price = price;
    currentPost.value.imagePath = imagePath !== null ? imagePath : "";
    currentPost.value.decription = description !== null ? description : "";
    currentPost.value.donated = donated !== null ? donated : 0;
}

const unlockNewPost = () => {
    if(!userStore.user) return;
    if(userStore.user.balance < currentPost.value.price) {
        useWebAppPopup().showAlert("Недостаточно средств на счету");
        return;
    };
    console.log(currentPost.value.id);
    userStore.unlockPost(currentPost.value.id).then(result => {
        if(result) {
            if(userStore.posts != null) {
                let index = userStore.posts.findIndex(x => x.ID == currentPost.value.id);
                if(index != -1){
                    userStore.posts[index].IsPrivate = false;
                    userStore.getMyBoughtPosts();
                }
            }
        }
    });
}

const checkIfCanUnlockPost = (postId: number, ownerId: number) => {
    if(!userStore.user) return;
    if(userStore.posts != null && userStore.posts[userStore.posts.findIndex(x => x.ID == postId)].Type != 'donate') return false;
    if(userStore.user.id == ownerId) return false;
    if(userStore.posts != null && !userStore.posts[userStore.posts.findIndex(x => x.ID == postId)].IsPrivate) return false;

    if(userStore.posts != null && userStore.posts[userStore.posts.findIndex(x => x.ID == postId)].IsPrivate){
        if(userStore.boughtPosts != null) {
            if(userStore.boughtPosts.length < 0) return true;
            if(userStore.boughtPosts?.length > 0) {
                if(userStore.boughtPosts.findIndex(x => x.PostID == postId) != -1){
                    return false;
                }
                return true;
            }
        }
        else {
            return true;
        }
    }
}

const checkIfItMyPost = (ownerId: number, postId: number) => {
    if(!userStore.user) return;
    if(userStore.user.id == ownerId) return false;
    if(userStore.posts != null && !userStore.posts[userStore.posts.findIndex(x => x.ID == postId)].IsPrivate) return false;
    if(ownerId != userStore.user.id) {
        if(checkIfBouthPost(postId)){
            return false;
        } else {
            return true;
        }
    }
    return true;
}

const checkIfBouthPost = (postId: number) => {
    if(userStore.boughtPosts != null && userStore.boughtPosts.length > 0)
    {
        let index = userStore.boughtPosts.findIndex(x => x.PostID == postId);
        console.log(index, postId);
        if(index != -1){
            console.log(index);
            return true;
        }
    }
    return false;
}

const donatedValue = ref(0);

const donateToPost = () => {
    if(!userStore.user) return;
    if(userStore.user.balance < Number(donatedValue.value)) {
        useWebAppPopup().showAlert("Недостаточно средств на счету");
        return;
    }
    userStore.donatePost(currentPost.value.id, donatedValue.value).then(result => {
        if(result) {
            if(userStore.posts != null){
                let index = userStore.posts.findIndex(x => x.ID == currentPost.value.id);
                if(index != -1){
                    userStore.posts[index].Donated += Number(donatedValue.value);
                }
            }
        }
    });
}


const textForPopup = (state: string) =>{
    switch(state) {
        case "unlock":
            return "Unlock post?"
            break;
        case "donate":
            return "Donate post?"
            break;
        case "visible":
            return `Post: ${currentPost.value.id}`
            break;
        case "change":
            return "Exchange donated dicks for basic ones?"
            break;
        case "dump":
            return "Dump post?"
            break;
    }
}

const exchangeValue = ref(0);

const exchangeDonateMoney = () => {
    if(!userStore.user) return;
    if(userStore.user.posts_balance != null && userStore.user.posts_balance < exchangeValue.value) {
        useWebAppPopup().showAlert("ⓘ Недостаточно средств для вывода!");
    }
    useWebAppPopup().showAlert("ⓘ Система удерживает 30% комиссию при переводе средств с донатного счёта на основной! ⓘ");
    userStore.exchangeDonateMoney(exchangeValue.value).then(result => {
        if(result) {
            if(userStore.user?.posts_balance != null) {
                userStore.user.posts_balance -= exchangeValue.value
            }
        }
    });
}

const setPostType = (type: string) => {
    newPosts.value.type = type;
}

const getPostTypeText = (type: string) => {
    switch(type){
        case "donate":
            return "Донатный 💸"
            break;
        case "vote":
            return "Голосование 🗳️"
            break;
    }
    return ""
}

const votePost = (postId: number, voteType: string, votePrice:number) => {
    if(!userStore.user) return;
    if(userStore.user.balance < votePrice) {
        useWebAppPopup().showAlert("Недостаточно 🍆 для голосования");
        return;
    }
    userStore.votePost(postId, voteType).then(result => {
        if(result){
            if(userStore.posts != null) {
                let index = userStore.posts.findIndex(x => x.ID == postId);
                if(index != -1){
                    switch(voteType){
                        case "yes":
                            userStore.posts[index].VoteYes += 1;
                            break;
                        case "no":
                            userStore.posts[index].VoteNo += 1;
                            break;
                    }
                    
                }
            }
        }
    })
}

const handleEnter = (event: KeyboardEvent) => {
  (event.target as HTMLInputElement).blur();
};

const dumpedValue = ref(0)

const dumpedPost = (id: number) => {
    userStore.dumpPost(id, 1000).then(result => {
        if(result) {
            fetchUserData()
        }
    })
}

let userPosts: Ref<allPosts[] | undefined> = ref(undefined);
let userPostsName = "";
const showUserPosts = (userId: number) => {
    if (userStore.posts && userStore.posts.length > 0) {
        userPosts.value = userStore.posts.filter(x => x.OwnerID === userId);
        if(userPosts.value != undefined && userPosts.value){
            pageState.value = 'userposts';
            userPostsName = userPosts.value[0].OwnerName
        }
    } else {
        userPosts.value = [];
    }

    

}

</script>

<template>
    <div class="Bg"></div>
    <NavMenu :page-state="pageState" @change-page-state="handleChangePageState" />
    <div v-if="pageState === 'create'" class="createPostMenu">
        <div>
            <ul id="progressbar">
                <li v-for="item in progressNewPosts" :class="item.isActive ? 'active' : ''">{{  item.text }}</li>
            </ul>
        </div>
        <div class="createForm">
            <div v-if="progressPost === 0" :style="{ display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center' }">
                <input class="addFile" type="file" @change="onAddFile">
                <span :style="{ fontWeight:'bold', marginTop: '15px'}">⚠️ Добавить можно только 1 изображение</span>
                <div class="sec-center" :style="{ marginTop:'20px' }"> 	
                    <input class="dropdown" type="checkbox" id="dropdown" name="dropdown"/>
                    <label class="for-dropdown" for="dropdown">{{ newPosts.type == '' ? 'Выберите тип поста' : getPostTypeText(newPosts.type) }}</label>
                    <div class="section-dropdown"> 
                        <a @click="setPostType('donate')">Донатный <i class="uil uil-arrow-right">💸</i></a>
                        <a @click="setPostType('vote')">Голосование  <i class="uil uil-arrow-right">🗳️</i></a>
                    </div>
                </div>
            </div>
            <div v-if="progressPost === 1" :style="{ display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center' }">
                <label for="fname">Описание(не обязательно)</label>
                <input v-click-outside="handleEnter" type="text" id="fname" @change="onAddDescription" name="fname">
            </div>
            <div v-if="progressPost === 2" :style="{ display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center' }">
                <div v-if="newPosts.type != 'vote'" :style="{ display: 'flex', alignItems:'center'}">
                    <span :style="{ fontSize: '15px', fontWeight:'bold'}">Платный пост (не обязательно)</span>
                    <div class="checkbox-wrapper-7" :style="{ marginLeft: '20px'}">
                        <input class="tgl tgl-ios" id="cb2-7" type="checkbox" v-model="isPostOptionsSet"/>
                        <label class="tgl-btn" for="cb2-7"></label>
                    </div>
                </div>
                <div v-if="newPosts.type == 'vote'" :style="{ display: 'flex', alignItems:'center', flexDirection:'column'}">
                    <span :style="{ fontSize: '15px', fontWeight:'bold'}">Цена голосования (в 🍆):</span>
                    <input v-click-outside="handleEnter" type="number" @keydown.enter="createNewPost" v-model="newPosts.votePrice" :style="{ width:'100%' }"/>
                </div>
                <div v-if="isPostOptionsSet" :style="{ marginTop: '50px', textAlign:'center'}">
                        <span :style="{ fontSize: '15px', fontWeight:'bold'}">Цена за разблокировку:</span>
                        <input v-click-outside="handleEnter" type="number" @keydown.enter="createNewPost" v-model="newPosts.price"/>
                </div>
                <div :style="{ marginTop: '50px', textAlign:'center'}">
                    <span :style="{ fontSize: '15px', fontWeight:'bold'}">Стоимость создания поста: 1000🍆</span>
                </div>
                <div>
                    <button class="mypost-button" :style="{ marginTop: '30px' }" @click="createNewPost">Создать</button>
                </div>
            </div>

            <div v-if="progressPost === 3">
                <div v-if="!uploadPostState" :style="{ display:'flex', flexDirection:'column'}"> 
                    <img :src="loadingIcon" />
                    <span :style="{ fontSize: '17px', fontWeight:'bold', marginTop:'10px' }">Подождите, мы загружаем ваш пост...</span>
                </div>
                <div v-else>
                    <img :src="AcceptIcon" />
                </div>
            </div>
        </div>
        <div v-if="isNextButton" :style="{ display:'flex', justifyContent:'center' }">
            <button class="mypost-button" :style="{ marginTop: '30px' }" @click="nextButtonChangeState">Дальше</button>
        </div>
    </div>

    <div v-if="pageState === 'posts'" class="boosts">
        <div v-for="(post, index) in userStore.posts" :key="post.ID" :style="{ width: '100%' }">
                <div class="post">
                    <div class="ownerData">
                        <img :src="post.AvatarURL" @click="showUserPosts(post.OwnerID)"/>
                        <span @click="showUserPosts(post.OwnerID)">{{ post.OwnerName }}</span>
                    </div>
                    <div class="postImage" :style="{  filter: checkIfItMyPost(post.OwnerID, post.ID) ? 'blur(25px)' : 'blur(0px)'}" >
                        <img :src="post.ImagePath" :style="{ maxWidth: '100%', height: 'auto', width:'100%'}" />
                    </div>
                    <div class="postDescription">
                        <span>{{ post.Description }}</span>
                    </div>
                    <div v-if="checkIfCanUnlockPost(post.ID, post.OwnerID)" class="unlock" :style="{ height: '70px', display:'flex', alignItems:'center', justifyContent: 'space-between', padding: '15px' }">
                        <span :style="{ fontSize: '14px' }">🍆{{ post.Price }}</span>
                        <button class="boost-purchase-button" @click="setStatePopup('unlock', post.ID, post.Price, null, null, null)">Unlock</button>
                    </div>
                    <div v-if="post.Type != 'vote'" class="donations" :style="{ height: '70px', display:'flex', alignItems:'center', justifyContent: 'space-between', padding: '15px' }">
                        <span class="donation__counter">Donated: 🍆{{ post.Donated - post.Dumped }}</span>
                        <button  class="boost-purchase-button" @click="setStatePopup('donate', post.ID, post.Price, null,null, null)">Donate</button>
                    </div>
                    <div v-else>
                        <div class="vote__counter">
                            <span>Всего: {{  ( (post.VoteYes + post.VoteNo) * post.VotePrice ) - post.Dumped }}🍆</span>
                        </div>
                        <div class="vote__counter-actions">
                            <div :style="{ display:'felx', flexDirection:'column', justifyContent:'center', textAlign:'center'}">
                                <span :style="{ fontSize:'18px'}">{{ post.VoteYes }} ✅</span>
                                <button class="boost-purchase-button" :style="{ marginLeft:'15px', marginTop:'10px', height:'40px', backgroundColor:'#3f8b1e', display:'flex', justifyContent:'center', alignItems:'center' }" @click="votePost(post.ID, 'yes', post.VotePrice)">Да {{ post.VotePrice }}🍆</button>
                            </div>
                            <div :style="{ display:'felx', flexDirection:'column', justifyContent:'center', textAlign:'center'}">
                                <span :style="{ fontSize:'18px'}">{{ post.VoteNo }} ❌</span>
                                <button class="boost-purchase-button" :style="{ marginRight:'15px',  marginTop:'10px', height:'40px', backgroundColor: '#bc0e0e', display:'flex', justifyContent:'center', alignItems:'center' }" @click="votePost(post.ID, 'no', post.VotePrice)">Нет {{ post.VotePrice }}🍆</button>
                            </div>
                        </div>
                    </div>
                    <div :style="{ display:'flex', justifyContent:'flex-end', alignItems:'center', padding:'15px' }">
                        <button class="boost-purchase-button" :style="{ padding:'15px', height:'40px', display:'flex', justifyContent:'center', alignItems:'center' }" @click="dumpedPost(post.ID)">😡 Dump 1.000 🍆</button>
                    </div>
                </div>
        </div>
    </div>


    <div v-if="pageState === 'userposts'" class="boosts">
        <span :style="{ fontSize:'20px', fontWeight:'bold', margin:'0 auto' }"> Посты пользователя: {{ userPostsName }} </span>
        <div v-for="(post, index) in userPosts" :key="post.ID" :style="{ width: '100%' }">
                <div class="post">
                    <div class="ownerData">
                        <img :src="post.AvatarURL"/>
                        <span>{{ post.OwnerName }}</span>
                    </div>
                    <div class="postImage" :style="{  filter: checkIfItMyPost(post.OwnerID, post.ID) ? 'blur(25px)' : 'blur(0px)'}" >
                        <img :src="post.ImagePath" :style="{ maxWidth: '100%', height: 'auto', width:'100%'}" />
                    </div>
                    <div class="postDescription">
                        <span>{{ post.Description }}</span>
                    </div>
                    <div v-if="checkIfCanUnlockPost(post.ID, post.OwnerID)" class="unlock" :style="{ height: '70px', display:'flex', alignItems:'center', justifyContent: 'space-between', padding: '15px' }">
                        <span :style="{ fontSize: '14px' }">🍆{{ post.Price }}</span>
                        <button class="boost-purchase-button" @click="setStatePopup('unlock', post.ID, post.Price, null, null, null)">Unlock</button>
                    </div>
                    <div v-if="post.Type != 'vote'" class="donations" :style="{ height: '70px', display:'flex', alignItems:'center', justifyContent: 'space-between', padding: '15px' }">
                        <span class="donation__counter">Donated: 🍆{{ post.Donated - post.Dumped }}</span>
                        <button  class="boost-purchase-button" @click="setStatePopup('donate', post.ID, post.Price, null,null, null)">Donate</button>
                    </div>
                    <div v-else>
                        <div class="vote__counter">
                            <span>Всего: {{  ( (post.VoteYes + post.VoteNo) * post.VotePrice ) - post.Dumped }}🍆</span>
                        </div>
                        <div class="vote__counter-actions">
                            <div :style="{ display:'felx', flexDirection:'column', justifyContent:'center', textAlign:'center'}">
                                <span :style="{ fontSize:'18px'}">{{ post.VoteYes }} ✅</span>
                                <button class="boost-purchase-button" :style="{ marginLeft:'15px', marginTop:'10px', height:'40px', backgroundColor:'#3f8b1e', display:'flex', justifyContent:'center', alignItems:'center' }" @click="votePost(post.ID, 'yes', post.VotePrice)">Да {{ post.VotePrice }}🍆</button>
                            </div>
                            <div :style="{ display:'felx', flexDirection:'column', justifyContent:'center', textAlign:'center'}">
                                <span :style="{ fontSize:'18px'}">{{ post.VoteNo }} ❌</span>
                                <button class="boost-purchase-button" :style="{ marginRight:'15px',  marginTop:'10px', height:'40px', backgroundColor: '#bc0e0e', display:'flex', justifyContent:'center', alignItems:'center' }" @click="votePost(post.ID, 'no', post.VotePrice)">Нет {{ post.VotePrice }}🍆</button>
                            </div>
                        </div>
                    </div>
                    <div :style="{ display:'flex', justifyContent:'flex-end', alignItems:'center', padding:'15px' }">
                        <button class="boost-purchase-button" :style="{ padding:'15px', height:'40px', display:'flex', justifyContent:'center', alignItems:'center' }" @click="dumpedPost(post.ID)">😡 Dump 1.000 🍆</button>
                    </div>
                </div>
        </div>
    </div>




    <div class="boost-purchase-popup" :class="{ 'visible': popupState == 'unlock' || popupState == 'donate' || popupState == 'visible' || popupState == 'change' || popupState == 'dump' }" @click="() => { popupState = 'close' }">
<!--        <div class="popup-overlay" @click="closePopup"></div>-->
        <div class="popup-content">
            <div class="popup-header">
                <h2>{{ textForPopup(popupState) }}</h2>
                <button class="close-button" @click="() => { popupState = 'close' }">
                  <svg class="close-icon" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 30 30" width="16px" height="16px">
                    <path d="M 7 4 C 6.744125 4 6.4879687 4.0974687 6.2929688 4.2929688 L 4.2929688 6.2929688 C 3.9019687 6.6839688 3.9019687 7.3170313 4.2929688 7.7070312 L 11.585938 15 L 4.2929688 22.292969 C 3.9019687 22.683969 3.9019687 23.317031 4.2929688 23.707031 L 6.2929688 25.707031 C 6.6839688 26.098031 7.3170313 26.098031 7.7070312 25.707031 L 15 18.414062 L 22.292969 25.707031 C 22.682969 26.098031 23.317031 26.098031 23.707031 25.707031 L 25.707031 23.707031 C 26.098031 23.316031 26.098031 22.682969 25.707031 22.292969 L 18.414062 15 L 25.707031 7.7070312 C 26.098031 7.3170312 26.098031 6.6829688 25.707031 6.2929688 L 23.707031 4.2929688 C 23.316031 3.9019687 22.682969 3.9019687 22.292969 4.2929688 L 15 11.585938 L 7.7070312 4.2929688 C 7.5115312 4.0974687 7.255875 4 7 4 z"/>
                  </svg>
                </button>
            </div>
            <div v-if="popupState == 'unlock'" class="popup-body">
                <p>Price:</p>
                <p>🍆{{ currentPost.price }}</p>
                <button class="boost-purchase-button" :style="{ width:'100%'}" @click="unlockNewPost">Unlock post</button>
            </div>
            <div v-if="popupState == 'donate'" class="popup-body">
                <div class="slidecontainer" :style="{ marginTop: '30px'}">
                    <input type="range" min="0" :max="userStore.user?.balance" class="slider" id="myRange" v-model="donatedValue">
                </div>
                <p>🍆{{ donatedValue }}</p>
                <button v-if="donatedValue > 0" class="boost-purchase-button" :style="{ width:'100%'}" @click="donateToPost">Donate post</button>
            </div>

            <div v-if="popupState == 'dump'" class="popup-body">
                <p> Не нравится пост? </p>
                <div class="slidecontainer" :style="{ marginTop: '30px' }">
                    <input
                    type="range"
                    min="1000"
                    :max="userStore.user?.balance"
                    step="1000"
                    class="slider"
                    id="myRange"
                    v-model="dumpedValue"
                    />
                </div>
                <p>🍆{{ dumpedValue }}</p>
                <button v-if="dumpedValue >= 1000" class="boost-purchase-button" :style="{ width:'100%'}" @click="dumpedPost(currentPost.id)">Dump post</button>
            </div>

            <div v-if="popupState == 'visible'">
                <img :src="currentPost.imagePath" :style="{ height: '200px', width:'100%', backgroundRepeat: 'no-repeat', objectFit:'contain'}" />
                <p v-if="currentPost.decription !== ''">{{ currentPost.decription }}</p>
                <p>Donated: 🍆{{ currentPost.donated }}</p>
            </div>
            <div v-if="popupState == 'change'">
                <div class="slidecontainer" :style="{ marginTop: '30px'}">
                    <input type="range" min="0" :max="userStore.user?.posts_balance !== null ? userStore.user?.posts_balance : 0" class="slider" id="myRange" v-model="exchangeValue">
                </div>
                <p>🍆{{ exchangeValue }}</p>
                <button v-if="exchangeValue > 0" class="boost-purchase-button" :style="{ width:'100%'}" @click="exchangeDonateMoney">Exchange</button>
            </div>
        </div>
    </div>
    <!-- My posts area -->
     <div v-if="pageState == 'myposts'" class="myPosts">
        <DonateBalance :popupState="setStatePopup"/>
        <div v-for="post in userStore.myPosts" class="postProfile" @click="setStatePopup('visible', post.ID, post.Price, post.ImagePath, post.Description, post.Donated)">
            <div class="icon-box" :style="{ fontSize:'27px' }">🌐</div>
            <div class="text-container" :style="{ display:'flex', justifyContent:'center' }">
                <span :style="{ marginLeft: '11px' }">Пост: {{ post.ID }}</span>
            </div>
        </div>
     </div>
</template>

<style scoped>
.myPosts {
    display: flex;
    flex-direction: column;
    margin-top: 20%;
    backdrop-filter: blur(5px);
}

.postProfile {
    display: flex;
    align-items: center;
    margin: 10px;
    background: rgb(167 167 167 / 21%);
    color: #fff;
    padding: 10px;
    border-radius: 15px;
    cursor: pointer;
}

input[type=text] {
  width: 150%;
  padding: 12px 20px;
  margin: 30px 0;
  box-sizing: border-box;
  color: white;
  border: none;
  border-bottom: 2px solid;
  background: none;
}

input:focus {
  outline: none; /* Убирает стандартную синюю обводку */
  border: 1px solid #ccc; /* Устанавливает желаемую обводку, если нужно */
}

input[type="number"] {
  color: white; 
  text-align: right;
}


input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}


input[type="number"] {
  -moz-appearance: textfield;
}

input[type="file"]::file-selector-button {
    background-color: #4CAF50;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

input[type=number] {
  width: 40%;
  padding: 12px 20px;
  margin: 30px 0;
  box-sizing: border-box;
  border: none;
  border-bottom: 2px solid;
  background: none;
}

.Bg{
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: #261e25;
    position: absolute;
    z-index: -1;
}

.createPostMenu {
    margin-top: 80px;
    display: flex;
    flex-direction: column;
    z-index: 10;
}
.createForm {
    margin-top: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.boosts {
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin-top: 12px;
    display: flex;
    flex-direction: column;
    gap: 25px;
    margin-bottom: 100px;
    padding: 0 12px;
}

.boost-purchase-button {
    padding: 10px 20px;
    border: none;
    background: linear-gradient(90deg, #d67eff, #b231cb, #d67eff);
    box-shadow: inset 0 0 0 1px #d67eff;
    background-size: 125%;
    color: white;
    font-size: 16px;
    font-weight: bold;
    border-radius: 30px;
    cursor: pointer;
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


.post {
    height: 100%;
    width: 100%;
    background: "gray";
    display: flex;
    flex-direction: column;
    background: #362b37;
    border-radius: 16px;
}
.ownerData {
    display: flex;
    align-items: center;
}

.ownerData>img {
    width: 52px;
    height: 52px;
    padding: 10px;
    border-radius: 30px;
}

.ownerData>span {
    font-size: 15px;
    font-weight: 500;
}

.postDescription {
    padding: 15px;
}

.postDescription>span {
    font-size: 16px;
    color: #c0bfc0;
}

.postDescription:has(span:empty) {
    display: none !important;
}

.donations,
.vote__counter,
.vote__counter-actions {
    background-color: #ff00ea1f;
}

.donations {
    border-radius: 0 0 16px 16px;
}

.vote__counter {
    display: flex;
    justify-content: center;
    padding-top: 10px;
}

.vote__counter>span {
    font-size: 15px;
    font-weight: 700;
    padding: 5px 15px;
    background-color: #0000003d;
    border-radius: 20px;
}

.vote__counter-actions {
    display: flex;
    justify-content: space-around;
    padding: 10px 0 20px;
    border-radius: 0 0 16px 16px;
}

.donation__counter {
    font-weight: 600;
}

/*progressbar*/
#progressbar {
  margin-bottom: 30px;
  overflow: hidden;
  /*CSS counters to number the steps*/
  counter-reset: step;
  text-align: center;
}
#progressbar li {
  list-style-type: none;
  color: white;
  text-transform: uppercase;
  font-size: 9px;
  width: 33.33%;
  float: left;
  position: relative;
}
#progressbar li:before {
  content: counter(step);
  counter-increment: step;
  width: 20px;
  line-height: 20px;
  display: block;
  font-size: 10px;
  color: #333;
  background: white;
  border-radius: 3px;
  margin: 0 auto 5px auto;
}
/*progressbar connectors*/
#progressbar li:after {
  content: '';
  width: 100%;
  height: 2px;
  background: white;
  position: absolute;
  left: -50%;
  top: 9px;
  z-index: -1; /*put it behind the numbers*/
}
#progressbar li:first-child:after {
  /*connector not needed before the first step*/
  content: none; 
}
/*marking active/completed steps green*/
/*The number of the step and the connector before it = green*/
#progressbar li.active:before,  #progressbar li.active:after{
  background: #27AE60;
  color: white;
}



/* checkbox */


.checkbox-wrapper-7 .tgl {
    display: none;
}
.checkbox-wrapper-7 .tgl,
.checkbox-wrapper-7 .tgl:after,
.checkbox-wrapper-7 .tgl:before,
.checkbox-wrapper-7 .tgl *,
.checkbox-wrapper-7 .tgl *:after,
.checkbox-wrapper-7 .tgl *:before,
.checkbox-wrapper-7 .tgl + .tgl-btn {
    box-sizing: border-box;
}
.checkbox-wrapper-7 .tgl::-moz-selection,
.checkbox-wrapper-7 .tgl:after::-moz-selection,
.checkbox-wrapper-7 .tgl:before::-moz-selection,
.checkbox-wrapper-7 .tgl *::-moz-selection,
.checkbox-wrapper-7 .tgl *:after::-moz-selection,
.checkbox-wrapper-7 .tgl *:before::-moz-selection,
.checkbox-wrapper-7 .tgl + .tgl-btn::-moz-selection,
.checkbox-wrapper-7 .tgl::selection,
.checkbox-wrapper-7 .tgl:after::selection,
.checkbox-wrapper-7 .tgl:before::selection,
.checkbox-wrapper-7 .tgl *::selection,
.checkbox-wrapper-7 .tgl *:after::selection,
.checkbox-wrapper-7 .tgl *:before::selection,
.checkbox-wrapper-7 .tgl + .tgl-btn::selection {
    background: none;
}
.checkbox-wrapper-7 .tgl + .tgl-btn {
    outline: 0;
    display: block;
    width: 4em;
    height: 2em;
    position: relative;
    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}
.checkbox-wrapper-7 .tgl + .tgl-btn:after,
.checkbox-wrapper-7 .tgl + .tgl-btn:before {
    position: relative;
    display: block;
    content: "";
    width: 50%;
    height: 100%;
}
.checkbox-wrapper-7 .tgl + .tgl-btn:after {
    left: 0;
}
.checkbox-wrapper-7 .tgl + .tgl-btn:before {
    display: none;
}
.checkbox-wrapper-7 .tgl:checked + .tgl-btn:after {
    left: 50%;
}

.checkbox-wrapper-7 .tgl-ios + .tgl-btn {
    background: #fbfbfb;
    border-radius: 2em;
    padding: 2px;
    transition: all 0.4s ease;
    border: 1px solid #e8eae9;
}
.checkbox-wrapper-7 .tgl-ios + .tgl-btn:after {
    border-radius: 2em;
    background: #fbfbfb;
    transition: left 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), padding 0.3s ease, margin 0.3s ease;
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1), 0 4px 0 rgba(0, 0, 0, 0.08);
}
.checkbox-wrapper-7 .tgl-ios + .tgl-btn:hover:after {
    will-change: padding;
}
.checkbox-wrapper-7 .tgl-ios + .tgl-btn:active {
    box-shadow: inset 0 0 0 2em #e8eae9;
}
.checkbox-wrapper-7 .tgl-ios + .tgl-btn:active:after {
    padding-right: 0.8em;
}
.checkbox-wrapper-7 .tgl-ios:checked + .tgl-btn {
    background: #86d993;
}
.checkbox-wrapper-7 .tgl-ios:checked + .tgl-btn:active {
    box-shadow: none;
}
.checkbox-wrapper-7 .tgl-ios:checked + .tgl-btn:active:after {
    margin-left: -0.8em;
}


.boost-purchase-popup {
  transform: translateY(100%); /* Start off the bottom of the screen */
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: flex-end; /* Align the modal at the bottom */
  z-index: 1000;
  transition: transform 0.2s ease; /* Smooth transition for the transform property */
  color: white;
}

.boost-purchase-popup.visible {
  transform: translateY(0); /* Position it inside the viewport */
}

.popup-content {
  position: relative;
  background: "blue";
  backdrop-filter: blur(100px);
  -webkit-backdrop-filter: blur(30px);
  border-radius: 10px 10px 0 0; /* Тільки верхні кути округлені */
  z-index: 1001;
  padding: 20px 20px 45px;
  width: 100%;
  box-shadow: 0 0 30px 10px rgba(0, 0, 0, 0.5);
}

.popup-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.close-button {
    border: none;
    background: none;
    cursor: pointer;
    font-size: 24px;
    color: white;
}

.popup-body h3,
.popup-body p {
    margin: 10px 0;
}
.boost-desc-hint {
    color: #c5c5c5;
    font-size: 14px;
}

.price-hint {
    color: #aeaeae;
    margin-left: 5px;
    font-size: 12px;
}

/* slider */

.slidecontainer {
  width: 100%;
}

.slider {
  -webkit-appearance: none;
  width: 100%;
  height: 15px;
  border-radius: 5px;
  background: #d3d3d3;
  outline: none;
  opacity: 0.7;
  -webkit-transition: .2s;
  transition: opacity .2s;
}

.slider:hover {
  opacity: 1;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 25px;
  height: 25px;
  border-radius: 50%;
  background: #04AA6D;
  cursor: pointer;
}

.slider::-moz-range-thumb {
  width: 25px;
  height: 25px;
  border-radius: 50%;
  background: #04AA6D;
  cursor: pointer;
}



.sec-center {
  position: relative;
  max-width: 100%;
  text-align: center;
  z-index: 200;
}
[type="checkbox"]:checked,
[type="checkbox"]:not(:checked){
  position: absolute;
  left: -9999px;
  opacity: 0;
  pointer-events: none;
}
.dark-light:checked + label,
.dark-light:not(:checked) + label{
  position: fixed;
  top: 40px;
  right: 40px;
  z-index: 20000;
  display: block;
  border-radius: 50%;
  width: 46px;
  height: 46px;
  cursor: pointer;
  transition: all 200ms linear;
  box-shadow: 0 0 25px rgba(255,235,167,.45);
}
.dark-light:checked + label{
  transform: rotate(360deg);
}
.dark-light:checked + label:after,
.dark-light:not(:checked) + label:after{
  position: absolute;
  content: '';
  top: 1px;
  left: 1px;
  overflow: hidden;
  z-index: 2;
  display: block;
  border-radius: 50%;
  width: 44px;
  height: 44px;
  background-color: #102770;
  background-image: url('https://assets.codepen.io/1462889/moon.svg');
  background-size: 20px 20px;
  background-repeat: no-repeat;
  background-position: center;
  transition: all 200ms linear;
  opacity: 0;
}
.dark-light:checked + label:after {
  opacity: 1;
}
.dark-light:checked + label:before,
.dark-light:not(:checked) + label:before{
  position: absolute;
  content: '';
  top: 0;
  left: 0;
  overflow: hidden;
  z-index: 1;
  display: block;
  border-radius: 50%;
  width: 46px;
  height: 46px;
  background-color: #48dbfb;
  background-image: url('https://assets.codepen.io/1462889/sun.svg');
  background-size: 25px 25px;
  background-repeat: no-repeat;
  background-position: center;
  transition: all 200ms linear;
}
.dark-light:checked + label:before{
  background-color: #000;
}
.light-back{
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1;
  background-color: #fff;
  overflow: hidden;
  background-image: url('https://s3-us-west-2.amazonaws.com/s.cdpn.io/1462889/pat-back.svg');
  background-position: center;
  background-repeat: repeat;
  background-size: 4%;
  height: 100%;
  width: 100%;
  transition: all 200ms linear;
  opacity: 0;
}
.dark-light:checked ~ .light-back{
  opacity: 1;
}
.dropdown:checked + label,
.dropdown:not(:checked) + label{
  position: relative;
  font-family: 'Roboto', sans-serif;
  font-weight: 500;
  font-size: 15px;
  line-height: 2;
  height: 50px;
  transition: all 200ms linear;
  border-radius: 4px;
  width: 220px;
  letter-spacing: 1px;
  display: -webkit-inline-flex;
  display: -ms-inline-flexbox;
  display: inline-flex;
  -webkit-align-items: center;
  -moz-align-items: center;
  -ms-align-items: center;
  align-items: center;
  -webkit-justify-content: center;
  -moz-justify-content: center;
  -ms-justify-content: center;
  justify-content: center;
  -ms-flex-pack: center;
  text-align: center;
  border: none;
  background-color: #ffeba7;
  cursor: pointer;
  color: #102770;
  box-shadow: 0 12px 35px 0 rgba(255,235,167,.15);
}
.dark-light:checked ~ .sec-center .for-dropdown{
  background-color: #102770;
  color: #ffeba7;
  box-shadow: 0 12px 35px 0 rgba(16,39,112,.25);
}
.dropdown:checked + label:before,
.dropdown:not(:checked) + label:before{
  position: fixed;
  top: 0;
  left: 0;
  content: '';
  width: 100%;
  height: 100%;
  z-index: -1;
  cursor: auto;
  pointer-events: none;
}
.dropdown:checked + label:before{
  pointer-events: auto;
}
.dropdown:not(:checked) + label .uil {
  font-size: 24px;
  margin-left: 10px;
  transition: transform 200ms linear;
}
.dropdown:checked + label .uil {
  transform: rotate(180deg);
  font-size: 24px;
  margin-left: 10px;
  transition: transform 200ms linear;
}
.section-dropdown {
  position: absolute;
  padding: 5px;
  background-color: #111;
  top: 70px;
  left: 0;
  width: 100%;
  border-radius: 4px;
  display: block;
  box-shadow: 0 14px 35px 0 rgba(9,9,12,0.4);
  z-index: 2;
  opacity: 0;
  pointer-events: none;
  transform: translateY(20px);
  transition: all 200ms linear;
}
.dark-light:checked ~ .sec-center .section-dropdown {
  background-color: #fff;
  box-shadow: 0 14px 35px 0 rgba(9,9,12,0.15);
}
.dropdown:checked ~ .section-dropdown{
  opacity: 1;
  pointer-events: auto;
  transform: translateY(0);
}
.section-dropdown:before {
  position: absolute;
  top: -20px;
  left: 0;
  width: 100%;
  height: 20px;
  content: '';
  display: block;
  z-index: 1;
}
.section-dropdown:after {
  position: absolute;
  top: -7px;
  left: 30px;
  width: 0; 
  height: 0; 
  border-left: 8px solid transparent;
  border-right: 8px solid transparent; 
  border-bottom: 8px solid #111;
  content: '';
  display: block;
  z-index: 2;
  transition: all 200ms linear;
}
.dark-light:checked ~ .sec-center .section-dropdown:after {
  border-bottom: 8px solid #fff;
}

a {
  position: relative;
  color: #fff;
  transition: all 200ms linear;
  font-family: 'Roboto', sans-serif;
  font-weight: 500;
  font-size: 15px;
  border-radius: 2px;
  padding: 5px 0;
  padding-left: 20px;
  padding-right: 15px;
  margin: 2px 0;
  text-align: left;
  text-decoration: none;
  display: -ms-flexbox;
  display: flex;
  -webkit-align-items: center;
  -moz-align-items: center;
  -ms-align-items: center;
  align-items: center;
  justify-content: space-between;
    -ms-flex-pack: distribute;
}
.dark-light:checked ~ .sec-center .section-dropdown a {
  color: #102770;
}
a:hover {
  color: #102770;
  background-color: #ffeba7;
}
.dark-light:checked ~ .sec-center .section-dropdown a:hover {
  color: #ffeba7;
  background-color: #102770;
}
a .uil {
  font-size: 22px;
}
.dropdown-sub:checked + label,
.dropdown-sub:not(:checked) + label{
  position: relative;
  color: #fff;
  transition: all 200ms linear;
  font-family: 'Roboto', sans-serif;
  font-weight: 500;
  font-size: 15px;
  border-radius: 2px;
  padding: 5px 0;
  padding-left: 20px;
  padding-right: 15px;
  text-align: left;
  text-decoration: none;
  display: -ms-flexbox;
  display: flex;
  -webkit-align-items: center;
  -moz-align-items: center;
  -ms-align-items: center;
  align-items: center;
  justify-content: space-between;
    -ms-flex-pack: distribute;
    cursor: pointer;
}
.dropdown-sub:checked + label .uil,
.dropdown-sub:not(:checked) + label .uil{
  font-size: 22px;
}
.dropdown-sub:not(:checked) + label .uil {
  transition: transform 200ms linear;
}
.dropdown-sub:checked + label .uil {
  transform: rotate(135deg);
  transition: transform 200ms linear;
}
.dropdown-sub:checked + label:hover,
.dropdown-sub:not(:checked) + label:hover{
  color: #102770;
  background-color: #ffeba7;
}
.dark-light:checked ~ .sec-center .section-dropdown .for-dropdown-sub{
  color: #102770;
}
.dark-light:checked ~ .sec-center .section-dropdown .for-dropdown-sub:hover{
  color: #ffeba7;
  background-color: #102770;
}

.section-dropdown-sub {
  position: relative;
  display: block;
  width: 100%;
  pointer-events: none;
  opacity: 0;
  max-height: 0;
  padding-left: 10px;
  padding-right: 3px;
  overflow: hidden;
  transition: all 200ms linear;
}
.dropdown-sub:checked ~ .section-dropdown-sub{
  pointer-events: auto;
  opacity: 1;
  max-height: 999px;
}
.section-dropdown-sub a {
  font-size: 14px;
}
.section-dropdown-sub a .uil {
  font-size: 20px;
}
.logo {
	position: fixed;
	top: 50px;
	left: 40px;
	display: block;
	z-index: 11000000;
  background-color: transparent;
  border-radius: 0;
  padding: 0;
	transition: all 250ms linear;
}
.logo:hover {
  background-color: transparent;
}
.logo img {
	height: 26px;
	width: auto;
	display: block;
  transition: all 200ms linear;
}
.dark-light:checked ~ .logo img{
  filter: brightness(10%);
}

@media screen and (max-width: 991px) {
.logo {
	top: 30px;
	left: 20px;
}
.dark-light:checked + label,
.dark-light:not(:checked) + label{
  top: 20px;
  right: 20px;
}
}
</style>
