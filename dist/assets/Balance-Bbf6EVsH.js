import{d as h,u as B,C as b,r as v,s as S,b as g,c as x,e as s,t as u,n as y,_ as w}from"./index-CIgIJdAu.js";const z={class:"balance-panel"},k={class:"balance-hint"},q={class:"balance__wrapper"},A=h({__name:"Balance",setup(C){var c;const t=B(),p=b(()=>{var a;const e=((a=t.user)==null?void 0:a.balance.toString().length)||0;return e<5?"44px":e<8?"39px":e<12?"34px":e<15?"29px":"24px"}),n=v(((c=t.user)==null?void 0:c.balance)||0);function m(e){const a=n.value,o=e-a;let r=900;o<=10&&(r=300);const _=performance.now();function i(d){const f=d-_,l=Math.min(f/r,1);n.value=Math.round(a+o*l),l<1&&requestAnimationFrame(i)}requestAnimationFrame(i)}return S(()=>{var e;return((e=t.user)==null?void 0:e.balance)??0},e=>{m(e)},{immediate:!0}),(e,a)=>(g(),x("div",z,[s("span",k,u(e.$t("account.yourBalance")),1),s("div",q,[s("div",{class:"balance",style:y({fontSize:p.value})},u(n.value.toLocaleString()),5)])]))}}),L=w(A,[["__scopeId","data-v-8d507ac6"]]);export{L as B};
