import{d as B,u as N,r as i,z as p,o as I,J as G,b as O,c as R,e as s,B as U,K as T,n as C,v as F,x as W,y as E,_ as A}from"./index-Dm4aBicW.js";import{u as x}from"./games-CtqU644f.js";const v=u=>(W("data-v-709c623d"),u=u(),E(),u),H=["width","height"],P={id:"unity-loading-bar"},$=v(()=>s("div",{id:"unity-logo"},null,-1)),J={id:"unity-progress-bar-empty"},V=v(()=>s("div",{id:"unity-webgl-logo"},null,-1)),j=v(()=>s("div",{id:"unity-build-title"},"FlappyDick",-1)),z=B({__name:"Town",setup(u){const r=x(),a=N(),g=i("unity-desktop"),w=i(960),h=i(600),m=i("0%"),f=i(!0),S=i(0),y=i(null),t=i(null),l=i(null),c="https://taptaptap.coinclicker.app/uploads/BuildTown",_=`${c}/buildes.loader.js`,b={dataUrl:`${c}/buildes.data`,frameworkUrl:`${c}/buildes.framework.js`,codeUrl:`${c}/buildes.wasm`,streamingAssetsUrl:"",companyName:"DefaultCompany",productName:"FlappyDick",productVersion:"0.1.1",showBanner:(e,n)=>{if(l.value){const o=document.createElement("div");o.innerHTML=e,l.value.appendChild(o),n==="error"?o.style.background="red":n==="warning"&&(o.style.background="yellow"),o.style.padding="10px",setTimeout(()=>{l.value&&l.value.removeChild(o)},5e3)}}},k=e=>{m.value=`${100*e}%`,e==1&&console.log("load Finish")},M=()=>{var e;(e=t.value)==null||e.SetFullscreen(1)};return window.GetSkins=function(){t.value.SendMessage("GameManager","OnInitSkins",a.skins)},window.GetLastVisit=function(){t.value.SendMessage("FoodSlider","OnSetFoodSlider",JSON.stringify(a.town))},window.GetEnergy=function(){var e,n;t.value.SendMessage("EmojiSlider","OnSetTownEmoji",JSON.stringify({energy:(e=a.user)==null?void 0:e.energy,energy_level:(n=a.user)==null?void 0:n.energy_level}))},window.TryBuy=function(e){if(console.log(e),!!a.user){if(a.user.balance<e){p().showAlert("У вас недостаточно 🐥 для покупки данной постройки");return}r.tryBuy(e).then(n=>{if(n){if(!a.user)return;a.user.balance-=e,t.value.SendMessage("WebGLCallbackHandler","OnAccept")}})}},window.GetReferals=function(){r.getReferals().then(e=>{console.log(e);const n={referals:e};t.value.SendMessage("Referal_Window","OnSetReferals",JSON.stringify(n))})},window.SaveJSON=function(e){console.log(e),r.saveUserBuildings(e).then(n=>{n&&(console.log(n),a.getTown())})},window.CheckUserIsland=function(e){console.log(e),r.checkReferalIsland(Number(e)).then(n=>{n?t.value.SendMessage("Referal_Window","VisitIsland"):t.value.SendMessage("Referal_Window","ReferalWithoutIsland")})},window.GetReferalTown=function(e){r.getReferalIsland(Number(e)).then(n=>{t.value.SendMessage("GameManager","OnSetReferalTown",n)})},window.window.GetBuildings=function(){r.getUserBuildings().then(e=>{t.value.SendMessage("GameManager","OnSetMyTown",e)})},window.GetReferalSkins=function(e){r.getReferalSkins(Number(e)).then(n=>{t.value.SendMessage("GameManager","OnInitSkins",n)})},window.IncreaseFood=function(e){if(a.user){if(a.user.balance<Number(e)){p().showAlert("Недостаточно коинов 🐥");return}r.onSetFood(Number(e)).then(n=>{if(n){if(!a.user)return;a.user.balance-=Number(e),t.value.SendMessage("FoodSlider","OnAcceptFood")}})}},I(async()=>{var n,o;if(((n=a.user)==null?void 0:n.id)!=null&&(S.value=(o=a.user)==null?void 0:o.id),/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)){const d=document.createElement("meta");d.name="viewport",d.content="width=device-width, height=device-height, initial-scale=1.0, user-scalable=no, shrink-to-fit=yes",document.getElementsByTagName("head")[0].appendChild(d),g.value="unity-mobile",w.value=window.innerWidth,h.value=window.innerHeight}f.value=!0;const e=document.createElement("script");e.src=_,e.onload=async()=>{try{t.value=await createUnityInstance(y.value,b,k),f.value=!1}catch(d){alert(d)}},document.body.appendChild(e)}),G(()=>{t.value&&t.value.Quit().then(()=>{t.value=null})}),i({userHP:0,userName:"",enemyHP:0,enemyName:""}),i(0),(e,n)=>(O(),R("div",{id:"unity-container",class:F(g.value)},[s("canvas",{id:"unity-canvas",ref_key:"canvas",ref:y,width:w.value,height:h.value,tabindex:"-1"},null,8,H),U(s("div",P,[$,s("div",J,[s("div",{id:"unity-progress-bar-full",style:C({width:m.value})},null,4)])],512),[[T,f.value]]),s("div",{id:"unity-warning",ref_key:"warningBanner",ref:l},null,512),s("div",{id:"unity-footer"},[V,s("div",{id:"unity-fullscreen-button",onClick:M}),j])],2))}}),K=A(z,[["__scopeId","data-v-709c623d"]]);export{K as default};
