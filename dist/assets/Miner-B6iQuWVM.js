import{B as X}from"./Balance-CtvzDfXa.js";import{d as B,u as E,r as I,o as b,c as M,a as s,n as U,b as T,t as _,e as c,w as g,F as x,f as h,_ as S,g as k,h as V,i as z,Z as D}from"./index-CqXW9hOz.js";const P="/assets/dick-vdtGk5Yl.svg",Z="/assets/coin-ByFR-4vK.png",G={class:"energy-section"},K={class:"energy"},L={class:"energy-progress-bar"},O={class:"energy-info"},j={class:"energy-value"},q={class:"bottom-menu"},A={class:"menu-items"},H=B({__name:"BottomMenu",setup($){const t=E();return(n,m)=>{var f,p,a;const o=I("router-link");return b(),M(x,null,[s("div",G,[s("div",K,[s("div",L,[s("div",{class:"energy-progress",style:U({width:(((f=T(t).user)==null?void 0:f.energy)??0)/(1e3+(((p=T(t).user)==null?void 0:p.max_energy_level)??0)*500)*100+"%"})},null,4)]),s("div",O,[s("span",j,"⚡"+_((a=T(t).user)==null?void 0:a.energy),1)])])]),s("div",q,[s("div",A,[c(o,{class:"menu-item",to:"/leaderboard",tag:"button"},{default:g(()=>[h(" 🏆 "),s("span",null,_(n.$t("bottomMenu.top")),1)]),_:1}),c(o,{class:"menu-item",to:"/channels",tag:"button"},{default:g(()=>[h(" 💰 "),s("span",null,_(n.$t("bottomMenu.earn")),1)]),_:1}),c(o,{class:"menu-item",to:"/referrals",tag:"button"},{default:g(()=>[h(" 🧑‍🤝‍🧑 "),s("span",null,_(n.$t("bottomMenu.referrals")),1)]),_:1}),c(o,{class:"menu-item",to:"/boosts",tag:"button"},{default:g(()=>[h(" 🚀 "),s("span",null,_(n.$t("bottomMenu.boosts")),1)]),_:1})])])],64)}}}),J=S(H,[["__scopeId","data-v-3d274f9f"]]),Q=B({__name:"Miner",setup($){const t=E(),n=k(null),m=k(0);let o;const f=()=>{console.log(`Кількість натискань: ${m.value}`),t.sendMineCoins(m.value),m.value=0},p=()=>{m.value+=1,o&&clearTimeout(o),o=setTimeout(f,300)};V(()=>{}),z(()=>{o&&clearTimeout(o)});const a=k(null),R=()=>"ontouchstart"in window||navigator.maxTouchPoints>0,Y=(r,u,l)=>{var y;const e=document.createElement("div");e.textContent=r.toString(),e.style.position="absolute",e.style.left=`${u}px`,e.style.top=`${l}px`,t.user&&t.user.is_premium?e.style.color="#ff9900":e.style.color="white",e.style.userSelect="none",e.style.pointerEvents="none",e.style.fontSize="40px",e.style.transform="translate(-50%, -50%)",e.classList.add("flying-number"),(y=a.value)==null||y.appendChild(e),setTimeout(()=>{e.remove()},1e3)};function F(r){return window.TouchEvent!==void 0?r instanceof TouchEvent:r.touches!==void 0}const v=r=>{var w;if(!t.user||!n.value||r.type==="mousedown"&&R())return;let u,l;if(F(r)){const d=r;u=d.touches[0].clientX,l=d.touches[0].clientY}else{const d=r;u=d.clientX,l=d.clientY}const e=(w=a.value)==null?void 0:w.getBoundingClientRect(),y=u-((e==null?void 0:e.left)??0),N=l-((e==null?void 0:e.top)??0);if(t.user.energy>t.user.mine_level){t.mineCoins();var C=1;t.user.is_premium&&(C=2),Y(t.user.mine_level*C,y,N),D().impactOccurred("light"),p()}n.value.style.transform="scale(0.98)"},i=()=>{n.value&&(n.value.style.transform="",n.value.style.transform="scale(1)")};return(r,u)=>{var l;return b(),M(x,null,[s("main",null,[c(X),s("div",{class:"coin-container numbers-container",ref_key:"numbersContainerRef",ref:a},[(l=T(t).user)!=null&&l.is_premium?(b(),M("img",{key:0,src:P,alt:"Premium Coin",class:"coin",ref_key:"coinRef",ref:n,onMousedown:v,onTouchstart:v,onMouseup:i,onMouseleave:i,onTouchend:i},null,544)):(b(),M("img",{key:1,src:Z,class:"coin",alt:"Regular Coin",ref_key:"coinRef",ref:n,onMousedown:v,onTouchstart:v,onMouseup:i,onMouseleave:i,onTouchend:i},null,544))],512)]),c(J)],64)}}}),te=S(Q,[["__scopeId","data-v-9c68ec86"]]);export{te as default};
