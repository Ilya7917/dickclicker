import{j as ae,u as b,k as v,d as oe,h as re,l as de,g as ne,c as a,a as t,t as r,b as d,m as _,F as p,p as L,o,_ as ie}from"./index-cV-L-q2Y.js";const le=ae("leaderboard",{state:()=>({leaderboard:null,lastFetch:0,dailyLeaderboard:null,dailyLastFetch:0,monthlyLeaderboard:null,monthlyLastFetch:0}),actions:{async fetchLeaderboard(){const n=Date.now();if(!(n-this.lastFetch<60*1e3&&this.leaderboard))try{const e=b(),l=await v.get("http://209.159.157.98:80/leaderboard",{headers:{"x-api-key":e.getAccessToken}});this.leaderboard=l.data,this.lastFetch=n}catch(e){console.error("Error fetching data:",e)}},async fetchDailyLeaderboard(){const n=Date.now();if(!(n-this.dailyLastFetch<60*1e3&&this.dailyLeaderboard))try{const e=b(),l=await v.get("http://209.159.157.98:80/leaderboard/daily",{headers:{"x-api-key":e.getAccessToken}});this.dailyLeaderboard=l.data,this.dailyLastFetch=n}catch(e){console.error("Error fetching data:",e)}},async fetchMonthlyLeaderboard(){const n=Date.now();if(!(n-this.monthlyLastFetch<60*1e3&&this.monthlyLeaderboard))try{const e=b(),l=await v.get("http://209.159.157.98:80/leaderboard/monthly",{headers:{"x-api-key":e.getAccessToken}});this.monthlyLeaderboard=l.data,this.monthlyLastFetch=n}catch(e){console.error("Error fetching data:",e)}}}}),ce={class:"tabs"},_e={key:0,class:"leaderboard"},he={class:"leaderboard-title"},ye={class:"leaderboard-list"},ue={key:0,class:"player you"},pe={class:"avatar"},be=["src","alt"],me={key:1,class:"initials"},ve={class:"player-info"},Le={class:"name"},ke={class:"player-score"},ge={class:"rank"},fe={class:"avatar"},Se=["src","alt"],$e={key:1,class:"initials"},Ce={class:"player-info"},Fe={key:0,class:"name"},we={key:1},De={class:"player-score"},Ue={key:1,class:"leaderboard"},Be={class:"leaderboard-title"},Me={class:"leaderboard-list"},Te={key:0,class:"player you"},Ae={class:"avatar"},Ee=["src","alt"],Pe={key:1,class:"initials"},Ie={class:"player-info"},Ne={class:"name"},Ve={class:"player-score"},je={class:"rank"},xe={class:"avatar"},qe=["src","alt"],ze={key:1,class:"initials"},Ge={class:"player-info"},He={key:0,class:"name"},Je={key:1},Ke={class:"player-score"},Oe={key:2,class:"leaderboard"},Qe={class:"leaderboard-title"},Re={class:"leaderboard-list"},We={key:0,class:"player you"},Xe={class:"avatar"},Ye=["src","alt"],Ze={key:1,class:"initials"},et={class:"player-info"},tt={class:"name"},st={class:"player-score"},at={class:"rank"},ot={class:"avatar"},rt=["src","alt"],dt={key:1,class:"initials"},nt={class:"player-info"},it={key:0,class:"name"},lt={key:1},ct={class:"player-score"},_t=oe({__name:"Leaderboard",setup(n){const e=le(),se=b().user;re(()=>{e.fetchDailyLeaderboard(),e.fetchMonthlyLeaderboard(),e.fetchLeaderboard()});const{t:y}=de();y("top.yourPlace",{place:123});const u=ne("Day"),m=i=>{u.value=i};return(i,c)=>{var k,g,f,S,$,C,F,w,D,U,B,M,T,A,E,P,I,N,V,j,x,q,z,G,H,J,K,O,Q,R,W,X,Y,Z,ee,te;return o(),a(p,null,[t("div",ce,[t("button",{onClick:c[0]||(c[0]=s=>m("Day")),class:"tab"},r(i.$t("top.day")),1),t("button",{onClick:c[1]||(c[1]=s=>m("Month")),class:"tab"},r(i.$t("top.month")),1),t("button",{onClick:c[2]||(c[2]=s=>m("Balance")),class:"tab"},r(i.$t("top.balance")),1)]),u.value==="Day"?(o(),a("div",_e,[t("div",he," 🏆 "+r(i.$t("top.topToday")),1),t("div",ye,[((k=d(e).dailyLeaderboard)==null?void 0:k.me)!=null?(o(),a("div",ue,[t("span",pe,[(g=d(e).dailyLeaderboard)!=null&&g.me.avatar_url?(o(),a("img",{key:0,src:(f=d(e).dailyLeaderboard)==null?void 0:f.me.avatar_url,alt:(S=d(e).dailyLeaderboard)==null?void 0:S.me.identity},null,8,be)):(o(),a("div",me,r((F=(C=($=d(e).dailyLeaderboard)==null?void 0:$.me)==null?void 0:C.identity)==null?void 0:F.substring(0,2).toUpperCase()),1))]),t("div",ve,[t("span",Le,r(d(y)("top.yourPlace",{place:(D=(w=d(e).dailyLeaderboard)==null?void 0:w.me)==null?void 0:D.position})),1),t("span",ke,"🪙 +"+r((B=(U=d(e).dailyLeaderboard)==null?void 0:U.me)==null?void 0:B.score.toLocaleString()),1)])])):_("",!0),(o(!0),a(p,null,L((M=d(e).dailyLeaderboard)==null?void 0:M.players,(s,h)=>(o(),a("div",{key:s.id,class:"player"},[t("span",ge,r(h+1)+".",1),t("span",fe,[s.avatar_url?(o(),a("img",{key:0,src:s.avatar_url,alt:s.identity},null,8,Se)):(o(),a("div",$e,r(s.identity.substring(0,2).toUpperCase()),1))]),t("div",Ce,[s.is_premium?(o(),a("span",Fe,r(s.identity),1)):(o(),a("span",we,r(s.identity),1)),t("span",De,"🪙 +"+r(s.score.toLocaleString()),1)])]))),128))])])):_("",!0),u.value==="Month"?(o(),a("div",Ue,[t("div",Be," 🏆 "+r(i.$t("top.topMonth")),1),t("div",Me,[((T=d(e).monthlyLeaderboard)==null?void 0:T.me)!=null?(o(),a("div",Te,[t("span",Ae,[(A=d(e).monthlyLeaderboard)!=null&&A.me.avatar_url?(o(),a("img",{key:0,src:(E=d(e).monthlyLeaderboard)==null?void 0:E.me.avatar_url,alt:(P=d(e).monthlyLeaderboard)==null?void 0:P.me.identity},null,8,Ee)):(o(),a("div",Pe,r((V=(N=(I=d(e).monthlyLeaderboard)==null?void 0:I.me)==null?void 0:N.identity)==null?void 0:V.substring(0,2).toUpperCase()),1))]),t("div",Ie,[t("span",Ne,r(d(y)("top.yourPlace",{place:(x=(j=d(e).monthlyLeaderboard)==null?void 0:j.me)==null?void 0:x.position})),1),t("span",Ve,"🪙 +"+r((z=(q=d(e).monthlyLeaderboard)==null?void 0:q.me)==null?void 0:z.score.toLocaleString()),1)])])):_("",!0),(o(!0),a(p,null,L((G=d(e).monthlyLeaderboard)==null?void 0:G.players,(s,h)=>(o(),a("div",{key:s.id,class:"player"},[t("span",je,r(h+1)+".",1),t("span",xe,[s.avatar_url?(o(),a("img",{key:0,src:s.avatar_url,alt:s.identity},null,8,qe)):(o(),a("div",ze,r(s.identity.substring(0,2).toUpperCase()),1))]),t("div",Ge,[s.is_premium?(o(),a("span",He,r(s.identity),1)):(o(),a("span",Je,r(s.identity),1)),t("span",Ke,"🪙 +"+r(s.score.toLocaleString()),1)])]))),128))])])):_("",!0),u.value==="Balance"?(o(),a("div",Oe,[t("div",Qe," 🏆 "+r(i.$t("top.topBalance")),1),t("div",Re,[((H=d(e).monthlyLeaderboard)==null?void 0:H.me)!=null?(o(),a("div",We,[t("span",Xe,[(K=(J=d(e).leaderboard)==null?void 0:J.me)!=null&&K.avatar_url?(o(),a("img",{key:0,src:(O=d(e).leaderboard)==null?void 0:O.me.avatar_url,alt:(Q=d(e).leaderboard)==null?void 0:Q.me.identity},null,8,Ye)):(o(),a("div",Ze,r((X=(W=(R=d(e).leaderboard)==null?void 0:R.me)==null?void 0:W.identity)==null?void 0:X.substring(0,2).toUpperCase()),1))]),t("div",et,[t("span",tt,r(d(y)("top.yourPlace",{place:(Z=(Y=d(e).leaderboard)==null?void 0:Y.me)==null?void 0:Z.position})),1),t("span",st,"🪙 "+r((ee=d(se))==null?void 0:ee.balance.toLocaleString()),1)])])):_("",!0),(o(!0),a(p,null,L((te=d(e).leaderboard)==null?void 0:te.players,(s,h)=>(o(),a("div",{key:s.id,class:"player"},[t("span",at,r(h+1)+".",1),t("span",ot,[s.avatar_url?(o(),a("img",{key:0,src:s.avatar_url,alt:s.identity},null,8,rt)):(o(),a("div",dt,r(s.identity.substring(0,2).toUpperCase()),1))]),t("div",nt,[s.is_premium?(o(),a("span",it,r(s.identity),1)):(o(),a("span",lt,r(s.identity),1)),t("span",ct,"🪙 "+r(s.score.toLocaleString()),1)])]))),128))])])):_("",!0)],64)}}}),yt=ie(_t,[["__scopeId","data-v-f0ddd920"]]);export{yt as default};
