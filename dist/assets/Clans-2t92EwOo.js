import{u as ie,j as me,k as U,d as q,b as n,c as s,e as t,x as $,m as d,f as P,y as H,z as E,_ as W,p as z,t as g,F as A,r as h,o as ce,v as fe,n as se,l as ge,G as Ce,g as N,C as ae,H as le,A as xe}from"./index-NzSs_JIL.js";import{u as be}from"./marketstore-BseyPw7L.js";import{B as ke}from"./back-icon-BbM4sjQV.js";import{_ as _e}from"./sprite-D2SurNu7.js";const w=ie(),we=me("clan",{state:()=>({clans:null,clanMembers:null}),getters:{},actions:{async getClans(){const e=await U.get("https://taptaptap.coinclicker.app/getAllClans",{headers:{"x-api-key":w.getAccessToken}});console.log(e),this.clans=e.data},async createClan(e){if(!w.getAccessToken)return;const a=new FormData;e.image!=null&&a.append("image",e.image),a.append("description",e.description),a.append("clanname",e.name);const r=await(await fetch("https://taptaptap.coinclicker.app/createClan",{method:"POST",body:a,headers:{"x-api-key":w.getAccessToken}})).json();return console.log(r),!!r.sucess},async createClanMember(e){const a=await U.post("https://taptaptap.coinclicker.app/createClanMemberRequest",{clan_id:e},{headers:{"x-api-key":w.getAccessToken}});return console.log(a),!!a.data.sucess},async getClanMembers(e){const a=await U.get("https://taptaptap.coinclicker.app/getClanMembers",{headers:{"x-api-key":w.getAccessToken,id:e}});return console.log(a),this.clanMembers=a.data,a.data},async acceptUserToClan(e,a){console.log(a);const o=await U.post("https://taptaptap.coinclicker.app/acceptUserToClan",{clan_id:e,user_id:a},{headers:{"x-api-key":w.getAccessToken}});return console.log(o),!!o.data.sucess},async declineUserToClan(e,a){console.log(a);const o=await U.post("https://taptaptap.coinclicker.app/declineUserToClan",{clan_id:e,user_id:a},{headers:{"x-api-key":w.getAccessToken}});return console.log(o),!!o.data.sucess},async removeUserFrom(e,a){console.log(a);const o=await U.post("https://taptaptap.coinclicker.app/removeUserFromClan",{clan_id:e,user_id:a},{headers:{"x-api-key":w.getAccessToken}});return console.log(o),!!o.data.sucess},async changeUserRole(e,a,o){console.log(a);const r=await U.post("https://taptaptap.coinclicker.app/changeMemberRole",{clan_id:e,user_id:a,role:o},{headers:{"x-api-key":w.getAccessToken}});return console.log(r),!!r.data.sucess},async leaveClan(e){const a=await U.post("https://taptaptap.coinclicker.app/leaveClan",{clan_id:e},{headers:{"x-api-key":w.getAccessToken}});return console.log(a),!!a.data.sucess}}}),G=e=>(H("data-v-8d979741"),e=e(),E(),e),$e={class:"navMenu"},Ie={class:"nav-btn__wrapper"},Se=G(()=>t("span",{style:{fontSize:"20px"}},"🏰",-1)),Ue=[Se],De=G(()=>t("span",{style:{fontSize:"20px"}},"✍🏼",-1)),je=[De],Te=G(()=>t("span",{style:{fontSize:"20px"}},"🕌",-1)),Le=[Te],Me=["src"],Pe={class:"nav-btn__text"},Ae=q({__name:"NavMenu",props:{pageState:{},hasClan:{type:Boolean}},emits:["change-page-state"],setup(e,{emit:a}){const o=e,r=a,m=y=>{y!==o.pageState&&r("change-page-state",y)};return(y,i)=>(n(),s("div",$e,[t("div",Ie,[y.pageState!="claninfo"?(n(),s("button",{key:0,class:$(["post-component__nav-btn feed",{active:o.pageState==="clans"}]),style:{display:"flex",justifyContent:"center",alignItems:"center"},onClick:i[0]||(i[0]=C=>m("clans"))},Ue,2)):d("",!0),!y.hasClan&&y.pageState!="claninfo"?(n(),s("button",{key:1,class:$(["post-component__nav-btn compose",{active:o.pageState==="create"}]),style:{display:"flex",justifyContent:"center",alignItems:"center"},onClick:i[1]||(i[1]=C=>m("create"))},je,2)):d("",!0),y.pageState!="claninfo"?(n(),s("button",{key:2,class:$(["post-component__nav-btn mywhales",{active:o.pageState==="myClan"}]),style:{display:"flex",justifyContent:"center",alignItems:"center"},onClick:i[2]||(i[2]=C=>m("myClan"))},Le,2)):d("",!0),y.pageState=="claninfo"?(n(),s("button",{key:3,class:"post-component__nav-btn profile",onClick:i[3]||(i[3]=C=>m("clans"))},[t("img",{src:P(ke)},null,8,Me)])):d("",!0)]),t("div",Pe,[y.pageState!="claninfo"?(n(),s("span",{key:0,class:$(["nav-btn__text-item",{active:o.pageState==="whales"}])},"Clans",2)):d("",!0),!y.hasClan&&y.pageState!="claninfo"?(n(),s("span",{key:1,class:$(["nav-btn__text-item",{active:o.pageState==="create"}])},"Create",2)):d("",!0),y.pageState!="claninfo"?(n(),s("span",{key:2,class:$(["nav-btn__text-item",{active:o.pageState==="mywhales"}])},"My Clan",2)):d("",!0),y.pageState=="claninfo"?(n(),s("span",{key:3,class:$(["nav-btn__text-item",{active:o.pageState==="mywhales"}])},"Back",2)):d("",!0)])]))}}),Oe=W(Ae,[["__scopeId","data-v-8d979741"]]),X=e=>(H("data-v-668abb9a"),e=e(),E(),e),Re=_e+"#chevron-right",Ne={key:0,style:{height:"85vh",display:"flex",alignItems:"center",justifyContent:"center"}},ze=X(()=>t("span",{style:{fontSize:"25px"}},"Здесь пока ещё нету кланов",-1)),Fe=[ze],Be=["onClick"],Ve=["src"],qe={key:1,style:{height:"30px",width:"30px",borderRadius:"100px",background:"gray",justifyContent:"center",alignItems:"center",display:"flex"}},He={class:"name",style:{marginLeft:"10px",fontSize:"18px"}},Ee={key:2,style:{marginLeft:"10px"}},We=X(()=>t("span",null,"👑",-1)),Ge=[We],Xe={style:{display:"flex",flexDirection:"column"}},Je={style:{fontSize:"17px"}},Ke=X(()=>t("div",null,[t("svg",{class:"arrow"},[t("use",{"xlink:href":Re})])],-1)),Qe={__name:"ClanItem",props:{clans:{type:Array,required:!0},myUserId:{type:Number,required:!0},changePageState:{type:Function,required:!0}},setup(e){return(a,o)=>e.clans.length==0?(n(),s("div",Ne,Fe)):(n(!0),s(A,{key:1},z(e.clans,r=>(n(),s("div",{id:"MyOrders",key:r.ID,onClick:o[0]||(o[0]=()=>{}),class:"channel"},[t("div",{onClick:m=>e.changePageState("claninfo",r),class:"channel-info",style:{display:"flex",flexDirection:"row",justifyContent:"center",alignItems:"center"}},[r.ClanPicture!=null&&r.ClanPicture!=""?(n(),s("img",{key:0,src:r.ClanPicture,style:{height:"30px",borderRadius:"100px"}},null,8,Ve)):(n(),s("div",qe,"🏰")),t("span",He,g(r.ClanName),1),r.OwnerID==e.myUserId?(n(),s("div",Ee,Ge)):d("",!0)],8,Be),t("div",null,[t("div",Xe,[t("span",Je,g(r.MemberCount)+"👤",1)])]),Ke]))),128))}},Ye=W(Qe,[["__scopeId","data-v-668abb9a"]]),Ze={style:{display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",marginTop:"25px",gap:"15px"}},et=["src"],tt={key:1,style:{height:"30px",width:"30px",borderRadius:"100px",background:"gray",justifyContent:"center",alignItems:"center",display:"flex"}},nt={style:{fontSize:"25px",fontWeight:"bold"}},st={style:{fontSize:"15px",fontWeight:"bold"}},at={key:2,style:{textAlign:"center",width:"70%"}},lt={key:1},ot={key:3,style:{textAlign:"center",width:"70%"}},it={key:0,style:{display:"flex",justifyContent:"space-between",margin:"15px"}},ct={key:1},rt={class:"channel-info",style:{display:"flex",flexDirection:"row",justifyContent:"center",alignItems:"center"}},ut=["src"],dt={key:1,style:{height:"30px",width:"30px",borderRadius:"100px",background:"gray",justifyContent:"center",alignItems:"center",display:"flex"}},pt={class:"name",style:{marginLeft:"10px",fontSize:"18px"}},vt={key:2,style:{marginLeft:"10px"}},yt=t("span",null,"👑",-1),ht=[yt],mt=t("div",{style:{marginRight:"15px"}},[t("span",null," основатель ")],-1),ft=["onClick"],gt={class:"channel-info",style:{display:"flex",flexDirection:"row",justifyContent:"center",alignItems:"center"}},Ct=["src"],xt={key:1,style:{height:"30px",width:"30px",borderRadius:"100px",background:"gray",justifyContent:"center",alignItems:"center",display:"flex"}},bt={class:"name",style:{marginLeft:"10px",fontSize:"18px"}},kt={style:{marginRight:"15px"}},_t={key:2},wt=["onClick"],$t={class:"channel-info",style:{display:"flex",flexDirection:"row",justifyContent:"center",alignItems:"center"}},It=["src"],St={key:1,style:{height:"30px",width:"30px",borderRadius:"100px",background:"gray",justifyContent:"center",alignItems:"center",display:"flex"}},Ut={class:"name",style:{marginLeft:"10px",fontSize:"18px"}},oe=q({__name:"ClanData",props:{clan:{type:Object,required:!0},myUserId:{type:Number,required:!0},clansStore:{type:Object,required:!0},onOpenUserData:{type:Function,reuired:!0},needUpdate:{type:Boolean,required:!0},myClan:{type:Object,reuired:!0},leaveClan:{type:Function,reuired:!0}},setup(e){const a=e,o=h("members"),r=h(!1),m=h(!1),y=h([]),i=x=>{a.clansStore.createClanMember(x).then(p=>{p&&C()})},C=()=>{a.clansStore.getClanMembers(a.clan.ID).then(x=>{if(y.value=x,x.length>0)if(x.findIndex(p=>p.UserID==a.myUserId)!=-1){let p=x.findIndex(I=>I.UserID==a.myUserId);x[p].Status=="member"?(m.value=!1,r.value=!1):(r.value=!0,m.value=!1)}else r.value=!0,m.value=!0;else r.value=!0,m.value=!0})};return ce(()=>{C()}),fe(()=>a.needUpdate,(x,p)=>{C()}),(x,p)=>{var I;return n(),s(A,null,[t("div",Ze,[e.clan.ClanPicture!=null&&e.clan.ClanPicture!=""?(n(),s("img",{key:0,src:e.clan.ClanPicture,style:{height:"100px",borderRadius:"100%"}},null,8,et)):(n(),s("div",tt,"🏰")),t("span",nt,g(e.clan.ClanName),1),t("span",st,g(e.clan.Description),1),t("span",null,"Участников: "+g(e.clan.MemberCount)+"👤",1),r.value&&e.clan.OwnerID!=e.myUserId?(n(),s("div",at,[m.value?(n(),s("button",{key:0,class:"boost-purchase-button",style:{backgroundColor:"#3f8b1e"},onClick:p[0]||(p[0]=c=>i(e.clan.ID))},"Подать заявку на вступление")):(n(),s("span",lt,"Заявка на вступление в "+g(e.clan.ClanName)+" успешно отправлена",1))])):d("",!0),e.clan.ID==((I=e.myClan)==null?void 0:I.ID)&&e.clan.OwnerID!=e.myUserId?(n(),s("div",ot,[t("button",{class:"boost-purchase-button",style:{backgroundColor:"gray"},onClick:p[1]||(p[1]=c=>{var b;return(b=e.leaveClan)==null?void 0:b.call(e,e.clan.ID)})},"Покинуть клан")])):d("",!0)]),e.clan.OwnerID==e.myUserId?(n(),s("div",it,[t("button",{class:"boost-purchase-button",style:se({width:"auto",marginLeft:"20px",background:`${o.value=="members"?"gray":"none"}`,border:"1px solid gray"}),onClick:p[2]||(p[2]=c=>o.value="members")},"Участники",4),t("button",{class:"boost-purchase-button",style:se({width:"auto",marginRight:"20px",background:`${o.value=="members"?"none":"gray"}`,border:"1px solid gray"}),onClick:p[3]||(p[3]=c=>o.value="invites")},"Заявки",4)])):d("",!0),o.value=="members"?(n(),s("div",ct,[t("div",{onClick:p[4]||(p[4]=()=>{}),class:"channel"},[t("div",rt,[e.clan.OwnerPicture!=null&&e.clan.OwnerPicture!=""?(n(),s("img",{key:0,src:e.clan.OwnerPicture,style:{height:"30px",borderRadius:"100px"}},null,8,ut)):(n(),s("div",dt,"👤")),t("span",pt,g(e.clan.OwnerID==e.myUserId?"Вы":e.clan.OwnerName),1),e.clan.OwnerID==e.myUserId?(n(),s("div",vt,ht)):d("",!0)]),mt]),(n(!0),s(A,null,z(y.value.filter(c=>c.Status=="member"),c=>(n(),s("div",{onClick:b=>{var S;return e.clan.OwnerID==e.myUserId?(S=e.onOpenUserData)==null?void 0:S.call(e,"memberData",c):null},class:"channel"},[t("div",gt,[c.UserPicture!=null&&c.UserPicture!=""?(n(),s("img",{key:0,src:c.UserPicture,style:{height:"30px",borderRadius:"100px"}},null,8,Ct)):(n(),s("div",xt,"👤")),t("span",bt,g(c.UserID==e.myUserId?"Вы":c.UserName),1)]),t("div",kt,[t("span",null,g(c.Role),1)])],8,ft))),256))])):d("",!0),o.value=="invites"?(n(),s("div",_t,[(n(!0),s(A,null,z(y.value.filter(c=>c.Status=="request"),c=>(n(),s("div",{onClick:b=>{var S;return(S=e.onOpenUserData)==null?void 0:S.call(e,"invite",c)},class:"channel"},[t("div",$t,[c.UserPicture!=null&&c.UserPicture!=""?(n(),s("img",{key:0,src:c.UserPicture,style:{height:"30px",borderRadius:"100px"}},null,8,It)):(n(),s("div",St,"👤")),t("span",Ut,g(c.UserName),1)])],8,wt))),256))])):d("",!0)],64)}}}),O=e=>(H("data-v-64713d45"),e=e(),E(),e),Dt={class:"telegram-channels"},jt={key:0},Tt={key:1,class:"createPostMenu",style:{marginTop:"15px"}},Lt={style:{marginTop:"20px"}},Mt={id:"progressbar"},Pt={class:"createForm"},At={key:0,style:{display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center"}},Ot=O(()=>t("label",{for:"fname"},"Название клана",-1)),Rt={key:1,style:{display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center"}},Nt=O(()=>t("label",{for:"fname",style:{fontSize:"18px"}},"Аватар клана (Не обязательно)",-1)),zt={key:2,style:{display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center"}},Ft=O(()=>t("label",{for:"fname"},"Описание клана (Не обязательно)",-1)),Bt={key:0},Vt={key:0,style:{display:"flex",justifyContent:"center"}},qt={key:2,style:{display:"flex",flexDirection:"column",justifyContent:"space-between"}},Ht={style:{height:"100%"}},Et={key:0,class:"channels-list"},Wt={key:3},Gt={key:4},Xt={key:0,class:"popup-content"},Jt={class:"popup-header"},Kt=O(()=>t("svg",{class:"close-icon",xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 30 30",width:"16px",height:"16px"},[t("path",{d:"M 7 4 C 6.744125 4 6.4879687 4.0974687 6.2929688 4.2929688 L 4.2929688 6.2929688 C 3.9019687 6.6839688 3.9019687 7.3170313 4.2929688 7.7070312 L 11.585938 15 L 4.2929688 22.292969 C 3.9019687 22.683969 3.9019687 23.317031 4.2929688 23.707031 L 6.2929688 25.707031 C 6.6839688 26.098031 7.3170313 26.098031 7.7070312 25.707031 L 15 18.414062 L 22.292969 25.707031 C 22.682969 26.098031 23.317031 26.098031 23.707031 25.707031 L 25.707031 23.707031 C 26.098031 23.316031 26.098031 22.682969 25.707031 22.292969 L 18.414062 15 L 25.707031 7.7070312 C 26.098031 7.3170312 26.098031 6.6829688 25.707031 6.2929688 L 23.707031 4.2929688 C 23.316031 3.9019687 22.682969 3.9019687 22.292969 4.2929688 L 15 11.585938 L 7.7070312 4.2929688 C 7.5115312 4.0974687 7.255875 4 7 4 z"})],-1)),Qt=[Kt],Yt={style:{display:"flex",justifyContent:"center",marginTop:"20px"}},Zt={style:{display:"flex",justifyContent:"center",marginTop:"20px"}},en={key:1,class:"popup-content"},tn={class:"popup-header"},nn=O(()=>t("svg",{class:"close-icon",xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 30 30",width:"16px",height:"16px"},[t("path",{d:"M 7 4 C 6.744125 4 6.4879687 4.0974687 6.2929688 4.2929688 L 4.2929688 6.2929688 C 3.9019687 6.6839688 3.9019687 7.3170313 4.2929688 7.7070312 L 11.585938 15 L 4.2929688 22.292969 C 3.9019687 22.683969 3.9019687 23.317031 4.2929688 23.707031 L 6.2929688 25.707031 C 6.6839688 26.098031 7.3170313 26.098031 7.7070312 25.707031 L 15 18.414062 L 22.292969 25.707031 C 22.682969 26.098031 23.317031 26.098031 23.707031 25.707031 L 25.707031 23.707031 C 26.098031 23.316031 26.098031 22.682969 25.707031 22.292969 L 18.414062 15 L 25.707031 7.7070312 C 26.098031 7.3170312 26.098031 6.6829688 25.707031 6.2929688 L 23.707031 4.2929688 C 23.316031 3.9019687 22.682969 3.9019687 22.292969 4.2929688 L 15 11.585938 L 7.7070312 4.2929688 C 7.5115312 4.0974687 7.255875 4 7 4 z"})],-1)),sn=[nn],an={key:0},ln={style:{display:"flex",justifyContent:"center",marginTop:"20px"}},on={style:{display:"flex",justifyContent:"center",marginTop:"20px"}},cn={key:1},rn={style:{display:"flex",justifyContent:"center",marginTop:"20px"}},un={style:{display:"flex",justifyContent:"center",marginTop:"20px"}},dn={style:{display:"flex",justifyContent:"center",marginTop:"20px"}},pn=q({__name:"Clans",setup(e){ge(),Ce();const a=h(!1),o=h("member"),r=h("view"),m=h(!1),y=ie(),i=we();be();const C=h(0),x=h(!1),p=h(null),I=()=>{i.getClans().then(()=>{var v,l,u;((v=y.user)==null?void 0:v.clan_id)!=null?(p.value=i.clans!=null?i.clans[(l=i.clans)==null?void 0:l.findIndex(_=>{var L;return _.ID==((L=y.user)==null?void 0:L.clan_id)})]:null,x.value=!0):((u=i.clans)==null?void 0:u.findIndex(_=>_.OwnerID==C.value))!=-1&&(x.value=!0),m.value=!0})};ce(()=>{var v,l;I(),((v=y.user)==null?void 0:v.id)!=null&&(C.value=(l=y.user)==null?void 0:l.id)});const c=h("clans"),b=h(0),S=(v,l)=>{c.value=v,l!=null&&(F.value=l)},J=h(!0),K=[{id:0,isActive:!0,text:"Add name"},{id:1,isActive:!1,text:"Add avatar"},{id:2,isActive:!1,text:"Description"}],re=()=>{switch(b.value){case 0:if(D.value.name.trim()===""){xe().showAlert("❌ Название канала не может быть пустым ❌");return}break}b.value++,K[b.value].isActive=!0},D=h({name:"",image:null,description:""}),k=h(!1),F=h(null),ue=v=>{const u=v.target.files;if(u&&u.length>0){const _=u[0],L=new FileReader;L.onload=he=>{var ee;const M=new Image;M.onload=()=>{const R=document.createElement("canvas"),te=R.getContext("2d"),B=1024,V=1024;let j=M.width,T=M.height;j>T?j>B&&(T*=B/j,j=B):T>V&&(j*=V/T,T=V),R.width=j,R.height=T,te!=null&&te.drawImage(M,0,0,j,T),R.toBlob(ne=>{ne&&(D.value.image=new File([ne],_.name,{type:_.type}),J.value=!0)},_.type,.8)},M.src=(ee=he.target)==null?void 0:ee.result},L.readAsDataURL(_)}},de=()=>{i.createClan(D.value).then(v=>{console.log(v),v&&(c.value="clans",I())})},f=h(null),Q=(v,l)=>{a.value=!0,o.value=v,f.value=l,r.value="view"},pe=()=>{i.acceptUserToClan(f.value.ClanID,f.value.UserID).then(v=>{var l;if(v){let u=(l=i.clans)==null?void 0:l.findIndex(_=>_.ID==f.value.ClanID);i.clans!=null&&i.clans[u??-1].MemberCount++,a.value=!1,k.value=!k.value}})},ve=()=>{i.declineUserToClan(f.value.ClanID,f.value.UserID).then(v=>{v&&(a.value=!1,k.value=!k.value)})},ye=()=>{i.removeUserFrom(f.value.ClanID,f.value.UserID).then(v=>{var l;if(v){let u=(l=i.clans)==null?void 0:l.findIndex(_=>_.ID==f.value.ClanID);i.clans!=null&&i.clans[u??-1].MemberCount--,a.value=!1,k.value=!k.value,r.value="view"}})},Y=v=>{i.changeUserRole(f.value.ClanID,f.value.UserID,v).then(l=>{l&&(a.value=!1,k.value=!k.value,r.value="view")})},Z=v=>{i.leaveClan(v).then(l=>{l&&(I(),c.value="clans",k.value=!k.value)})};return(v,l)=>(n(),s("div",Dt,[m.value?(n(),s("div",jt,[N(Oe,{"page-state":c.value,onChangePageState:S,hasClan:x.value},null,8,["page-state","hasClan"])])):d("",!0),c.value==="create"?(n(),s("div",Tt,[t("div",Lt,[t("ul",Mt,[(n(),s(A,null,z(K,u=>t("li",{class:$(u.isActive?"active":"")},g(u.text),3)),64))])]),t("div",Pt,[b.value===0?(n(),s("div",At,[Ot,ae(t("input",{type:"text",id:"fname",style:{width:"70%",color:"white"},name:"fname","onUpdate:modelValue":l[0]||(l[0]=u=>D.value.name=u)},null,512),[[le,D.value.name]])])):d("",!0),b.value===1?(n(),s("div",Rt,[Nt,t("input",{class:"addFile",type:"file",onChange:ue,style:{marginTop:"30px"}},null,32)])):d("",!0),b.value===2?(n(),s("div",zt,[Ft,ae(t("input",{type:"text",id:"fname",style:{width:"70%",color:"white"},name:"fname","onUpdate:modelValue":l[1]||(l[1]=u=>D.value.description=u)},null,512),[[le,D.value.description]]),J.value?(n(),s("div",Bt,[t("button",{class:"mypost-button",style:{marginTop:"30px"},onClick:l[2]||(l[2]=u=>de())},"Создать")])):d("",!0)])):d("",!0)]),b.value<2?(n(),s("div",Vt,[t("button",{class:"mypost-button",style:{marginTop:"30px"},onClick:re},"Дальше")])):d("",!0)])):d("",!0),c.value=="clans"?(n(),s("div",qt,[t("div",Ht,[m.value?(n(),s("div",Et,[N(Ye,{changePageState:S,clans:P(i).clans!=null?P(i).clans:[],myUserId:C.value,isPopupVisible:a.value},null,8,["clans","myUserId","isPopupVisible"])])):d("",!0)])])):d("",!0),c.value=="claninfo"?(n(),s("div",Wt,[N(oe,{clan:F.value!=null?F.value:new Object,myUserId:C.value,clansStore:P(i),onOpenUserData:Q,needUpdate:k.value,myClan:p.value!=null?p.value:new Object,leaveClan:Z},null,8,["clan","myUserId","clansStore","needUpdate","myClan"])])):d("",!0),c.value=="myClan"&&p.value!=null?(n(),s("div",Gt,[N(oe,{clan:p.value!=null?p.value:new Object,myUserId:C.value,clansStore:P(i),onOpenUserData:Q,needUpdate:k.value,myClan:p.value!=null?p.value:new Object,leaveClan:Z},null,8,["clan","myUserId","clansStore","needUpdate","myClan"])])):d("",!0),a.value?(n(),s("div",{key:5,class:$(["boost-purchase-popup",{visible:a.value}])},[o.value=="invite"?(n(),s("div",Xt,[t("div",Jt,[t("span",null,"Пользователь "+g(f.value.UserName)+" хочет вступить к вам в клан",1),t("button",{class:"close-button",onClick:l[3]||(l[3]=u=>{a.value=!1})},Qt)]),t("div",Yt,[t("button",{class:"boost-purchase-button",style:{width:"60%"},onClick:l[4]||(l[4]=u=>pe())},"Принять")]),t("div",Zt,[t("button",{class:"boost-purchase-button",style:{width:"60%"},onClick:l[5]||(l[5]=u=>ve())},"Отклонить")])])):d("",!0),o.value=="memberData"?(n(),s("div",en,[t("div",tn,[t("span",null,"Пользователь "+g(f.value.UserName)+" состоит в вашем клане",1),t("button",{class:"close-button",onClick:l[6]||(l[6]=u=>{a.value=!1})},sn)]),t("span",null,"Роль: "+g(f.value.Role),1),r.value=="view"?(n(),s("div",an,[t("div",ln,[t("button",{class:"boost-purchase-button",style:{width:"60%"},onClick:l[7]||(l[7]=u=>r.value="edit")},"Изменить роль")]),t("div",on,[t("button",{class:"boost-purchase-button",style:{width:"60%"},onClick:l[8]||(l[8]=u=>ye())},"Выгнать")])])):(n(),s("div",cn,[t("div",rn,[t("button",{class:"boost-purchase-button",style:{width:"60%"},onClick:l[9]||(l[9]=u=>Y("заместитель"))},"Сделать заместителем")]),t("div",un,[t("button",{class:"boost-purchase-button",style:{width:"60%"},onClick:l[10]||(l[10]=u=>Y("участник"))},"Сделать участником")]),t("div",dn,[t("button",{class:"boost-purchase-button",style:{width:"60%"},onClick:l[11]||(l[11]=u=>r.value="view")},"Назад")])]))])):d("",!0)],2)):d("",!0)]))}}),fn=W(pn,[["__scopeId","data-v-64713d45"]]);export{fn as default};
