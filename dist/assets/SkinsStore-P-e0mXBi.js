import{d as D,u as P,r as s,v as W,b as u,c as g,e,x as _,f as B,m as y,y as V,z as G,_ as E,l as Z,o as q,F as L,p as N,q as J,g as Y,t as z,s as H,A as K}from"./index-DEt5kXre.js";import{h as $}from"./moment-C5S46NFB.js";const Q="/assets/Gumball1-uAiOoDb5.png",R=n=>(V("data-v-0315a9ce"),n=n(),G(),n),X={class:"container"},ee=["src"],te=R(()=>e("svg",{viewBox:"0 0 439 215",fill:"none",xmlns:"http://www.w3.org/2000/svg"},[e("path",{d:"M295.5 14.0103C400.3 15.2103 429.167 117.51 430.5 168.51C338.1 208.51 207.667 185.177 154 168.51C157.5 116.51 190.7 12.8103 295.5 14.0103Z",fill:"white",stroke:"#531028","stroke-width":"13","stroke-linecap":"round","stroke-linejoin":"round"}),e("path",{class:"open-egg-color",d:"M99.1013 198.787C-10.8987 165.987 1.26801 68.7865 21.1013 24.2865C152.701 -28.5135 247.268 59.6199 278.101 110.287C264.268 153.453 209.101 231.587 99.1013 198.787Z",fill:"#F3D478"}),e("path",{d:"M21.1013 24.2865C1.26801 68.7865 -10.8987 165.987 99.1013 198.787C209.101 231.587 264.268 153.453 278.101 110.287M21.1013 24.2865C152.701 -28.5135 247.268 59.6199 278.101 110.287M21.1013 24.2865C44.6013 69.2865 128.901 149.487 278.101 110.287",stroke:"#531028","stroke-width":"13","stroke-linecap":"round","stroke-linejoin":"round"})],-1)),se={class:"gachapon"},oe=["src"],ne={key:0,class:"machine",style:{position:"absolute",marginLeft:"-460px",marginTop:"115px"},viewBox:"0 0 617 979",fill:"none",xmlns:"http://www.w3.org/2000/svg"},ae=["fill"],le=R(()=>e("path",{d:"M323.599 925.513C291.223 932.027 279.261 908.229 274.125 897.882C326.587 906.466 345.102 886.898 352.345 874.125C357.085 887.153 357.344 918.724 323.599 925.513Z",fill:"white",stroke:"#531028","stroke-width":"10","stroke-linecap":"round","stroke-linejoin":"round"},null,-1)),ce=D({__name:"SkinLottery",props:{openLotteryPopup:{type:Function},isRunMachine:{},availableSkins:{},fetchFunction:{type:Function}},setup(n){const p=n,t=P();s("");const a=s([]),l=s(""),v=s(0),o=s(!1);s(!1);const d=s(!1),k=s("#E5A0B9"),c=s(null),f=s(!1),C=["#E5A0B9","#F3D478","#9DCFE0","#B9AFD4"],w=()=>{o.value=!o.value,k.value=C[Math.floor(Math.random()*C.length)]},S=()=>{f.value||p.openLotteryPopup()},b=()=>{d.value=!d.value},x=()=>{if(a.value.length>=1){const i=Math.floor(Math.random()*a.value.length);l.value=a.value[i],a.value.splice(i,1)}else l.value="抽完嚕 (๑•́ ₃ •̀๑)";o.value=!1,d.value=!0,f.value=!1,v.value=Math.floor(Math.random()*p.availableSkins.length),c.value=p.availableSkins[v.value].skin,t.addNewSkin(JSON.stringify(p.availableSkins[v.value].id)).then(i=>{i&&(console.log("skin updated"),p.fetchFunction())})};return W(()=>p.isRunMachine,(i,M)=>{f.value=!0,w()}),(i,M)=>(u(),g("div",X,[e("div",{class:_(["mask",{active:d.value}]),onClick:b},[e("div",null,[e("img",{src:c.value!=null?c.value:"",style:{width:"250px"}},null,8,ee)]),te],2),e("div",se,[e("div",null,[e("img",{src:B(Q),style:{width:"617px"},onClick:S},null,8,oe),o.value?(u(),g("svg",ne,[e("g",{class:_(["egg",{active:o.value}]),onClick:x},[e("circle",{class:"egg-color",cx:"313.5",cy:"885.5",r:"40.5",fill:k.value,stroke:"#57172F","stroke-width":"10"},null,8,ae),le],2)])):y("",!0)])])]))}}),ie=E(ce,[["__scopeId","data-v-0315a9ce"]]),re="data:image/svg+xml,%3c?xml%20version='1.0'%20encoding='iso-8859-1'?%3e%3c!DOCTYPE%20svg%20PUBLIC%20'-//W3C//DTD%20SVG%201.1//EN'%20'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3e%3c!--%20Uploaded%20to:%20SVG%20Repo,%20www.svgrepo.com,%20Generator:%20SVG%20Repo%20Mixer%20Tools%20--%3e%3csvg%20height='800px'%20width='800px'%20version='1.1'%20id='_x35_'%20xmlns='http://www.w3.org/2000/svg'%20xmlns:xlink='http://www.w3.org/1999/xlink'%20viewBox='0%200%20512%20512'%20xml:space='preserve'%3e%3cg%3e%3cpath%20style='fill:%23C38287;'%20d='M90.465,186.912c0.086-7.581-5.26-27.49,2.771-43.781c8.025-16.291-42.226-20.546-67.682,0.367%20c-24.51,20.137,1.764,37.468,17.938,33.657C76.267,169.428,90.299,202.261,90.465,186.912z'/%3e%3cpath%20style='fill:%23CD7580;'%20d='M73.315,96.009c0.079,7.574-5.26,27.483,2.764,43.782c8.025,16.277-46.799,25.105-67.674-0.375%20c-20.878-25.48,1.76-37.461,17.941-33.65C59.102,113.485,73.137,80.654,73.315,96.009z'/%3e%3cpath%20style='fill:%23E7B850;'%20d='M76.45,264.211c18.183-21.406,33.092-31.038,20.821-50.433%20c-23.402-23.408-34.309-48.743-34.309-84.458c0-35.709,14.476-68.035,37.876-91.436C124.243,14.483,156.563,0,192.278,0%20s68.035,14.483,91.443,37.884c23.401,23.402,37.87,55.728,37.87,91.436c0,52.789-42.222,95.011-42.222,121.4%20c-2.64,10.561,15.835,23.761,39.582,23.761c23.761,0,102.932,18.467,160.988-58.063c15.28-21.122,33.755-9.238,31.675,21.107%20C509.618,266.609,493.133,512,318.951,512c-50.135,0-43.788,0-139.874,0c-40.074,0-76.36-16.25-102.627-42.513%20c-26.273-26.27-42.52-62.554-42.52-102.649C33.93,326.765,50.176,290.474,76.45,264.211'/%3e%3cpath%20style='fill:%23D6AA65;'%20d='M219.533,340.458h193.216c21.108,0,26.388,36.941-7.92,58.063c0,26.38-13.201,65.97-52.782,65.97%20c-39.596,0-87.092,0-121.4,0c-34.316,0-58.064-39.59-58.064-63.337C172.584,377.399,195.777,340.458,219.533,340.458z'/%3e%3cpath%20style='fill:%23E0B562;'%20d='M206.331,324.616h193.218c21.108,0,26.388,36.949-7.92,58.064c0,26.395-13.194,65.983-52.776,65.983%20c-39.589,0-87.097,0-121.406,0s-58.057-39.589-58.057-63.344C159.39,361.565,182.583,324.616,206.331,324.616z'/%3e%3cpath%20style='fill:%23EFEEF7;'%20d='M159.39,109.522c0,16.77-13.596,30.359-30.348,30.359c-16.763,0-30.355-13.589-30.355-30.359%20c0-16.748,13.592-30.344,30.355-30.344C145.794,79.177,159.39,92.773,159.39,109.522z'/%3e%3cpath%20style='fill:%23646478;'%20d='M143.556,109.522c0,8.025-6.503,14.525-14.514,14.525c-8.018,0-14.518-6.5-14.518-14.525%20c0-8.003,6.5-14.503,14.518-14.503C137.052,95.018,143.556,101.518,143.556,109.522z'/%3e%3cpath%20style='opacity:0.07;fill:%23EA552C;'%20d='M479.939,216.418c-58.056,76.53-137.227,58.063-160.988,58.063%20c-23.747,0-42.222-13.201-39.582-23.761c0-16.264,16.049-38.563,28.356-65.637l-254.33,254.33%20c6.371,11.011,14.115,21.128,23.055,30.075C102.717,495.75,139.003,512,179.077,512c96.086,0,89.738,0,139.874,0%20c174.182,0,190.667-245.391,192.664-274.474C513.694,207.18,495.219,195.296,479.939,216.418z'/%3e%3c/g%3e%3c/svg%3e",ue="/assets/lottery-BW77fbtn.svg",pe={class:"navMenu"},ve={class:"nav-btn__wrapper"},de=["src"],he=["src"],ge={class:"nav-btn__text"},_e=D({__name:"NavMenu",props:{pageState:{}},emits:["change-page-state"],setup(n,{emit:p}){const t=n,a=p,l=v=>{v!==t.pageState&&a("change-page-state",v)};return(v,o)=>(u(),g("div",pe,[e("div",ve,[e("button",{class:_(["post-component__nav-btn skins",{active:t.pageState==="skins"}]),onClick:o[0]||(o[0]=d=>l("skins"))},[e("img",{src:B(re)},null,8,de)],2),e("button",{class:_(["post-component__nav-btn lottery",{active:t.pageState==="lottery"}]),onClick:o[1]||(o[1]=d=>l("lottery"))},[e("img",{src:B(ue)},null,8,he)],2)]),e("div",ge,[e("span",{class:_(["nav-btn__text-item",{active:t.pageState==="skins"}])},"Team",2),e("span",{class:_(["nav-btn__text-item",{active:t.pageState==="lottery"}])},"Lottery",2)])]))}}),ke=E(_e,[["__scopeId","data-v-584f4cd5"]]),T=n=>(V("data-v-a291d79d"),n=n(),G(),n),fe={key:0,class:"Bg"},me={key:1,class:"boosts"},Ce=["onClick"],we=["src","alt"],Se={class:"popup-content"},ye=T(()=>e("h2",null,"Получить новый скин?",-1)),be=T(()=>e("svg",{class:"close-icon",xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 30 30",width:"16px",height:"16px"},[e("path",{d:"M 7 4 C 6.744125 4 6.4879687 4.0974687 6.2929688 4.2929688 L 4.2929688 6.2929688 C 3.9019687 6.6839688 3.9019687 7.3170313 4.2929688 7.7070312 L 11.585938 15 L 4.2929688 22.292969 C 3.9019687 22.683969 3.9019687 23.317031 4.2929688 23.707031 L 6.2929688 25.707031 C 6.6839688 26.098031 7.3170313 26.098031 7.7070312 25.707031 L 15 18.414062 L 22.292969 25.707031 C 22.682969 26.098031 23.317031 26.098031 23.707031 25.707031 L 25.707031 23.707031 C 26.098031 23.316031 26.098031 22.682969 25.707031 22.292969 L 18.414062 15 L 25.707031 7.7070312 C 26.098031 7.3170312 26.098031 6.6829688 25.707031 6.2929688 L 23.707031 4.2929688 C 23.316031 3.9019687 22.682969 3.9019687 22.292969 4.2929688 L 15 11.585938 L 7.7070312 4.2929688 C 7.5115312 4.0974687 7.255875 4 7 4 z"})],-1)),xe=[be],Me={class:"popup-body"},Le={class:"boost-desc-hint"},$e=D({__name:"SkinsStore",setup(n){var F,I,A;const{t:p}=Z(),t=P();t.getBoosts();const a=s(!1),l=s("skins"),v=s(!1);s({coin:0,energy:0,isOpen:!1});const o=s(""),d=s(!1),k=s([]),c=s([]),f=s([]),{setSkin:C,getCurrentSkin:w}=t,S=()=>{t.getSkins().then(r=>{k.value=[],c.value=[],f.value=[],o.value=t.skins!=null?t.skins:"",k.value=o.value.split(",").map(Number),console.log(k.value),H.forEach(m=>{k.value.findIndex(h=>h==m.id)!=-1?c.value.push(m):f.value.push(m)}),w!==null&&(i.value.id=w)})};q(()=>{S()});function b(){if(v.value){v.value=!1;return}a.value=!1}console.log($((F=t.user)==null?void 0:F.daily_booster_available_at).isBefore(new Date)),console.log((I=t.user)==null?void 0:I.daily_booster_available_at.toString()),console.log($((A=t.user)==null?void 0:A.daily_booster_available_at).toString()),console.log(new Date),console.log($().toString());const x=s({id:"multitap",name:"👆 Multitap",description:"Increase amount of coins you can earn per one tap",nextLevelSpec:[""],price:1999,next_level:5,level:1,action:p("boosts.upgrade")});s({id:0,price:1e3});const i=s({id:0}),M=r=>{l.value=r};function O(r){t.user&&(C(r),i.value.id=r,t.updateUserCurrentSkin(r),console.log(`Clicked skin: ${r}`))}const U=()=>{a.value=!0},j=()=>{var r;if(t.user){if(((r=t.user)==null?void 0:r.balance)<c.value.length*250+1e3){K().showAlert("Недостаточно 🐥 для получения яйца");return}t.useSkinMachine(c.value.length*250+1e3).then(m=>{if(m){if(t.user==null)return;t.user.balance-=c.value.length*250+1e3,d.value=!d.value,a.value=!1}})}};return(r,m)=>(u(),g(L,null,[l.value=="skins"?(u(),g("div",fe)):y("",!0),l.value=="skins"?(u(),g("div",me,[(u(!0),g(L,null,N(c.value,h=>(u(),g("div",{key:h.id,class:"boosts__item"},[e("div",{class:_({"boost-active":h.id===i.value.id,boost:h.id!==i.value.id}),onClick:Be=>O(h.id)},[e("img",{src:h.skin,alt:"Skin "+h.id},null,8,we)],10,Ce)]))),128))])):y("",!0),l.value=="lottery"?(u(),J(ie,{key:2,openLotteryPopup:U,isRunMachine:d.value,availableSkins:f.value,fetchFunction:S},null,8,["isRunMachine","availableSkins"])):y("",!0),Y(ke,{onChangePageState:M,pageState:l.value},null,8,["pageState"]),e("div",{class:_(["boost-purchase-popup",{visible:a.value}])},[e("div",Se,[e("div",{class:"popup-header"},[ye,e("button",{class:"close-button",onClick:b},xe)]),e("div",Me,[e("p",null,"Стоимость яйца составит "+z(c.value.length*250+1e3)+" 🐥",1),(u(!0),g(L,null,N(x.value.nextLevelSpec,h=>(u(),g("p",Le,z(h),1))),256)),e("button",{class:"boost-purchase-button",onClick:j},"Получить яйцо")])])],2)],64))}}),Fe=E($e,[["__scopeId","data-v-a291d79d"]]);export{Fe as default};
