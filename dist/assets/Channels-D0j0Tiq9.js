import{j as d,u as _,k as h,d as p,C as k,h as u,c as t,a as s,t as o,F as v,p as f,b as m,o as c,y as g,z as C,_ as S}from"./index-DBHjoCmr.js";const w="/assets/sprite-BbW-irAG.svg",y=d("channels",{state:()=>({channels:null}),actions:{async fetchChannels(){const e=_(),i=await h.get("https://dickclicker.app/channels",{headers:{"x-api-key":e.getAccessToken}});this.channels=i.data}}}),$=e=>(g("data-v-f41d3d36"),e=e(),C(),e),b=w+"#chevron-right",B={class:"telegram-channels"},I={class:"earn-title"},L={class:"channels-title"},x={class:"channels-list"},A=["onClick"],F={class:"channel-info"},T={class:"name"},j={class:"channel-action"},z={key:0,class:"reward"},D={key:1,class:"reward"},E=$(()=>s("svg",{class:"arrow"},[s("use",{"xlink:href":b})],-1)),G=p({__name:"Channels",setup(e){const i=y(),r=k();u(()=>{i.fetchChannels()});const l=n=>{n.is_available=!1,r.openTelegramLink(n.invite_link)};return(n,M)=>(c(),t("div",B,[s("div",I," 🤑 "+o(n.$t("earn.name")),1),s("div",L," 📢 "+o(n.$t("earn.channels")),1),s("div",x,[(c(!0),t(v,null,f(m(i).channels,a=>(c(),t("div",{key:a.id,onClick:N=>l(a),class:"channel"},[s("div",F,[s("span",T,o(a.title),1)]),s("div",j,[a.is_available?(c(),t("span",z,"🪙 "+o(a.reward.toLocaleString()),1)):(c(),t("span",D,"💠 "+o(n.$t("earn.rewardReached")),1)),E])],8,A))),128))])]))}}),U=S(G,[["__scopeId","data-v-f41d3d36"]]);export{U as default};
