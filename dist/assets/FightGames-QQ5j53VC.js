import{d as w,u as k,r as o,o as L,b as s,c as a,e,F as D,p as I,t as v,f as g,m,x as S,D as U,I as F,q as G}from"./index-D19YrIDj.js";import{u as T,G as B}from"./GameFight-BD-dTD0Y.js";const H={class:"bg"},j={key:0},N={class:"leaderboard",style:{marginTop:"30px",display:"flex",flexDirection:"column"}},V={style:{width:"85%",margin:"0 auto"}},z={class:"post",style:{display:"flex",flexDirection:"row"}},M={style:{display:"flex",alignItems:"center",fontSize:"30px",justifyContent:"center"}},R=["src"],A={key:1,style:{height:"30px",width:"30px",borderRadius:"100px",background:"gray",justifyContent:"center",alignItems:"center",display:"flex"}},E={style:{display:"flex",justifyContent:"space-between",alignItems:"center",width:"100%"}},$={class:"name",style:{marginLeft:"10px"}},q={class:"FightDefensData",style:{width:"100%",display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",marginTop:"20px"}},O={style:{fontSize:"20px",fontWeight:"bold"}},P={class:"popup-content"},W={class:"popup-header"},J=e("h2",null,"Пополнить ❤️",-1),K=e("svg",{class:"close-icon",xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 30 30",width:"16px",height:"16px"},[e("path",{d:"M 7 4 C 6.744125 4 6.4879687 4.0974687 6.2929688 4.2929688 L 4.2929688 6.2929688 C 3.9019687 6.6839688 3.9019687 7.3170313 4.2929688 7.7070312 L 11.585938 15 L 4.2929688 22.292969 C 3.9019687 22.683969 3.9019687 23.317031 4.2929688 23.707031 L 6.2929688 25.707031 C 6.6839688 26.098031 7.3170313 26.098031 7.7070312 25.707031 L 15 18.414062 L 22.292969 25.707031 C 22.682969 26.098031 23.317031 26.098031 23.707031 25.707031 L 25.707031 23.707031 C 26.098031 23.316031 26.098031 22.682969 25.707031 22.292969 L 18.414062 15 L 25.707031 7.7070312 C 26.098031 7.3170312 26.098031 6.6829688 25.707031 6.2929688 L 23.707031 4.2929688 C 23.316031 3.9019687 22.682969 3.9019687 22.292969 4.2929688 L 15 11.585938 L 7.7070312 4.2929688 C 7.5115312 4.0974687 7.255875 4 7 4 z"})],-1),Q=[K],X=e("div",null,[e("span",null,"Количество:")],-1),Y={class:"slidecontainer",style:{marginTop:"30px"}},Z=["max"],ne=w({__name:"FightGames",setup(ee){const f=T(),r=k(),_=o(!1);o("");const u=o(!1),n=o(0),y=o(0);o("games"),o("");const b=()=>{f.updateUserHealthDefens(Number(n.value)).then(c=>{if(c){if(!r.user)return;r.user.balance-=n.value,y.value+=Number(n.value),u.value=!1,n.value=0}})},C=()=>{u.value=!1,_.value=!0},x=o(0);return L(()=>{var c,t;((c=r.user)==null?void 0:c.id)!=null&&(x.value=(t=r.user)==null?void 0:t.id),f.getGamesScore().then(l=>{if(l!=null&&l.length>0){let d=l.findIndex(p=>p.UserID==x.value);d!=-1&&(y.value=l[d].DefensHealth)}})}),(c,t)=>{var l,d,p;return s(),a("div",H,[_.value?m("",!0):(s(),a("div",j,[e("div",N,[(s(!0),a(D,null,I((l=g(f).gamesScore)==null?void 0:l.slice(0,3),(i,h)=>(s(),a("div",V,[e("div",z,[e("div",M,[e("span",null,v(h==0?"👑":h==1?"🥈":h==2?"🥉":h+1),1)]),i.UserAvatar!=""?(s(),a("img",{key:0,src:i.UserAvatar,style:{height:"50px",borderRadius:"100px"}},null,8,R)):(s(),a("div",A,"👤")),e("div",E,[e("span",$,v(i.UserName),1)])])]))),256))]),e("div",q,[e("span",O,"Health protection: "+v(y.value)+"❤️",1),e("button",{class:"boost-purchase-button",style:{width:"55%",marginTop:"30px"},onClick:t[0]||(t[0]=i=>u.value=!0)},"Добавить ❤️")]),e("div",{style:{marginTop:"40px",width:"100%",display:"flex",alignItems:"center",justifyContent:"center"}},[e("button",{class:"button-19",style:{width:"35%"},onClick:C},"⚔️FIGHT")])])),u.value?(s(),a("div",{key:1,class:S(["boost-purchase-popup",{visible:u.value}])},[e("div",P,[e("div",W,[J,e("button",{class:"close-button",onClick:t[1]||(t[1]=i=>{u.value=!1})},Q)]),X,e("div",Y,[U(e("input",{type:"range",min:"0",max:((d=g(r).user)==null?void 0:d.balance)!==null?(p=g(r).user)==null?void 0:p.balance:0,class:"slider",id:"myRange","onUpdate:modelValue":t[2]||(t[2]=i=>n.value=i)},null,8,Z),[[F,n.value]]),e("p",null,"🐥"+v(n.value),1),n.value>0?(s(),a("button",{key:0,class:"boost-purchase-button",style:{width:"100%"},onClick:b},"Exchange")):m("",!0)])])],2)):m("",!0),_.value?(s(),G(B,{key:2})):m("",!0)])}}});export{ne as default};
