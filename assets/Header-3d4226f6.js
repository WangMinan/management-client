import{u as _e}from"./vue-router-111722e5.js";import{a as t}from"./js-cookie-cf83ad76.js";import{_ as P,__tla as Je}from"./request-1f057831.js";import{u as ve}from"./vuex-857a7739.js";import{e as re}from"./jsencrypt-32ff7c06.js";import{p as Ze,q as Ye}from"./@vueuse-dbe79a15.js";import{_ as Se,__tla as Le}from"./_plugin-vue_export-helper-238c9948.js";import{b as he,E as C,__tla as xe}from"./element-plus-d18cd086.js";import{j as Pe,r as B,a0 as te,ag as r,o as k,c as m,a as n,u,W as H,U as de,X as l,R as a,Q as W,i as p,V as y,F as We,ax as Ve,ay as be}from"./@vue-3b858b78.js";let ie,Ae,Oe=Promise.all([(()=>{try{return Je}catch{}})(),(()=>{try{return Le}catch{}})(),(()=>{try{return xe}catch{}})()]).then(async()=>{let V;Ae=""+new URL("prison-logo-e9dae820.svg",import.meta.url).href,V="data:image/png;base64,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";let Q,b,O,D,U,M,R,F,N,j,G,q,X,z,T,$,K,ee;Q=w=>(Ve("data-v-e1a8929c"),w=w(),be(),w),b={class:"header"},O={class:"l-content"},D={key:0},U={key:1},M={key:2},R=Q(()=>n("div",{class:"flex-grow"},null,-1)),F={class:"r-content"},N=Q(()=>n("span",null,"\u660E\u4EAE\u6A21\u5F0F",-1)),j=Q(()=>n("span",null,"\u6697\u9ED1\u6A21\u5F0F",-1)),G={class:"el-dropdown-link"},q=["src"],X=["src"],z=Q(()=>n("span",null,"\u4FEE\u6539\u6635\u79F0",-1)),T=Q(()=>n("span",null,"\u4FEE\u6539\u5BC6\u7801",-1)),$={class:"dialog-footer"},K={class:"dialog-footer"},ee={__name:"Header",setup(w){const ne=ve(),Z="\u76D1\u6240\u8B66\u5458\u5FC3\u7406\u4FDD\u969C\u4E0E\u7BA1\u7406\u7CFB\u7EDF",le=g=>new URL(Object.assign({"../../assets/img/user.png":V})[`../../assets/img/${g}.png`],self.location).href;Pe(()=>{t.set("manualExit","false",{expires:30})});const Ie=_e(),ce=async()=>{ne.commit("saveNavState",""),t.set("manualExit","true",{expires:30});const g=he.service({lock:!0,text:"\u6B63\u5728\u6E05\u9664\u767B\u5F55\u72B6\u6001",background:"rgba(0, 0, 0, 0.7)"});try{const{data:e}=await P.post("/backstage-management-service/logout");e.code!==2e3&&C.error(e.msg)}catch{C.error("\u540E\u7AEF\u670D\u52A1\u5668\u5F02\u5E38,\u5C06\u5F3A\u5236\u9000\u51FA")}finally{t.remove("accessToken"),t.remove("refreshToken"),g.close(),await Ie.push("/login")}};let i=B(!1);const Y=B(),I=B({oldPassword:"",newPassword:"",confirmPassword:""}),ue=te({oldPassword:[{validator:(g,e,o)=>{e===""?o(new Error("\u8BF7\u8F93\u5165\u65E7\u5BC6\u7801")):e.length<4||e.length>20?o(new Error("\u5BC6\u7801\u957F\u5EA6\u4E3A4-20")):o()},trigger:"blur"}],newPassword:[{validator:(g,e,o)=>{e===""?o(new Error("\u8BF7\u8F93\u5165\u65B0\u5BC6\u7801")):e.length<4||e.length>20?o(new Error("\u5BC6\u7801\u957F\u5EA6\u4E3A4-20")):o()},trigger:"blur"}],confirmPassword:[{validator:(g,e,o)=>{e===""?o(new Error("\u8BF7\u518D\u6B21\u8F93\u5165\u65B0\u5BC6\u7801")):e.length<4||e.length>20?o(new Error("\u5BC6\u7801\u957F\u5EA6\u4E3A4-20")):e!==I.value.newPassword?o(new Error("\u4E24\u6B21\u8F93\u5165\u5BC6\u7801\u4E0D\u4E00\u81F4!")):o()},trigger:"blur"}]}),f=g=>{g&&g.resetFields()},Be=async g=>{g&&await g.validate(async(e,o)=>{if(e){const c={oldPassword:re(I.value.oldPassword),newPassword:re(I.value.newPassword)},{data:d}=await P.put("/backstage-management-service/account/password",c);d.code===2e3?(C.success("\u4FEE\u6539\u6210\u529F"),i.value=!1,f(g)):C.error(d.msg)}else C.error("\u9884\u6821\u9A8C\u672A\u901A\u8FC7,\u8BF7\u68C0\u67E5\u8F93\u5165")})},_=B(JSON.parse(t.get("person")).nickname||JSON.parse(t.get("person")).name),ke=B(JSON.parse(t.get("person")).imageUrl||le("user"));let A=B(!1);const S=B(),E=B({nickname:""}),Ce=te({nickname:[{required:!0,message:"\u8BF7\u8F93\u5165\u6635\u79F0",trigger:"blur"},{min:2,max:20,message:"\u957F\u5EA6\u5728 2 \u5230 20 \u4E2A\u5B57\u7B26",trigger:"blur"}]}),Qe=g=>{g&&g.validate(async(e,o)=>{if(e){const c=JSON.parse(t.get("person")).id,{data:d}=await P.put(`/backstage-management-service/prison/${c}`,E.value);d.code===2e3?(C.success("\u4FEE\u6539\u6210\u529F"),A.value=!1,_.value=E.value.nickname,f(g)):C.error(d.msg)}else C.error("\u9884\u6821\u9A8C\u672A\u901A\u8FC7,\u8BF7\u68C0\u67E5\u8F93\u5165")})},L=B(window.localStorage.getItem("vueuse-color-scheme")==="dark"),me=Ze(),He=Ye(me),ae=()=>{L.value=!L.value,He()};return(g,e)=>{const o=r("Sunny"),c=r("el-icon"),d=r("el-button"),pe=r("Moon"),se=r("el-col"),h=r("el-dropdown-item"),Ee=r("el-dropdown-menu"),ye=r("el-dropdown"),we=r("el-row"),x=r("Lock"),J=r("el-input"),v=r("el-form-item"),ge=r("el-form"),oe=r("el-dialog"),fe=r("User");return k(),m(We,null,[n("div",b,[n("div",O,[u(t).get("role")==="Admin"?(k(),m("h1",D,H(u(Z))+"\u2014\u2014\u8FD0\u7EF4\u7AEF,\u6B22\u8FCE\u60A8:"+H(_.value),1)):u(t).get("role")==="PrisonAdmin"?(k(),m("h1",U,H(u(Z))+"\u2014\u2014\u76D1\u6240\u7AEF,\u6B22\u8FCE\u60A8:"+H(_.value),1)):u(t).get("role")==="Police"?(k(),m("h1",M,H(u(Z))+"\u2014\u2014\u8B66\u5458\u7AEF,\u6B22\u8FCE\u60A8:"+H(_.value),1)):de("",!0)]),R,n("div",F,[l(we,{gutter:15},{default:a(()=>[l(se,{span:18},{default:a(()=>[L.value?(k(),W(d,{key:1,onClick:ae,style:{background:"#303133",color:"white"}},{default:a(()=>[l(c,null,{default:a(()=>[l(pe)]),_:1}),j]),_:1})):(k(),W(d,{key:0,onClick:ae,style:{background:"#409EFF",color:"white"}},{default:a(()=>[l(c,null,{default:a(()=>[l(o)]),_:1}),N]),_:1}))]),_:1}),l(se,{span:6},{default:a(()=>[l(ye,null,{dropdown:a(()=>[l(Ee,null,{default:a(()=>[u(t).get("role")==="prison"?(k(),W(h,{key:0,onClick:e[0]||(e[0]=s=>p(A)?A.value=!0:A=!0)},{default:a(()=>[z]),_:1})):de("",!0),l(h,{onClick:e[1]||(e[1]=s=>p(i)?i.value=!0:i=!0)},{default:a(()=>[T]),_:1}),l(h,{onClick:ce},{default:a(()=>[y("\u9000\u51FA\u767B\u5F55")]),_:1})]),_:1})]),default:a(()=>[n("span",G,[u(t).get("role")==="Police"?(k(),m("img",{key:0,src:ke.value,class:"user-icon",alt:"LOGO"},null,8,q)):(k(),m("img",{key:1,class:"user-icon",src:le("user"),alt:"logo"},null,8,X))])]),_:1})]),_:1})]),_:1})])]),l(oe,{style:{width:"50%"},modelValue:u(i),"onUpdate:modelValue":e[7]||(e[7]=s=>p(i)?i.value=s:i=s),center:"",title:"\u4FEE\u6539\u5BC6\u7801",onClose:e[8]||(e[8]=s=>f(Y.value))},{footer:a(()=>[n("span",$,[l(d,{type:"primary",onClick:e[5]||(e[5]=s=>Be(Y.value))},{default:a(()=>[y(" \u786E\u8BA4 ")]),_:1}),l(d,{onClick:e[6]||(e[6]=s=>p(i)?i.value=!1:i=!1)},{default:a(()=>[y("\u53D6\u6D88")]),_:1})])]),default:a(()=>[l(ge,{model:I.value,"label-width":"15%","status-icon":"",ref_key:"revisePasswordFormRef",ref:Y,rules:ue},{default:a(()=>[l(v,{prop:"oldPassword",label:"\u8BF7\u8F93\u5165\u65E7\u5BC6\u7801"},{default:a(()=>[l(J,{modelValue:I.value.oldPassword,"onUpdate:modelValue":e[2]||(e[2]=s=>I.value.oldPassword=s),placeholder:"\u65E7\u5BC6\u7801",type:"password","show-password":""},{prefix:a(()=>[l(c,{class:"el-input__icon"},{default:a(()=>[l(x)]),_:1})]),_:1},8,["modelValue"])]),_:1}),l(v,{prop:"newPassword",label:"\u8BF7\u8F93\u5165\u65B0\u5BC6\u7801"},{default:a(()=>[l(J,{modelValue:I.value.newPassword,"onUpdate:modelValue":e[3]||(e[3]=s=>I.value.newPassword=s),placeholder:"\u65E7\u5BC6\u7801",type:"password","show-password":""},{prefix:a(()=>[l(c,{class:"el-input__icon"},{default:a(()=>[l(x)]),_:1})]),_:1},8,["modelValue"])]),_:1}),l(v,{prop:"confirmPassword",label:"\u8BF7\u786E\u8BA4\u65B0\u5BC6\u7801"},{default:a(()=>[l(J,{modelValue:I.value.confirmPassword,"onUpdate:modelValue":e[4]||(e[4]=s=>I.value.confirmPassword=s),placeholder:"\u786E\u8BA4\u5BC6\u7801",type:"password","show-password":""},{prefix:a(()=>[l(c,{class:"el-input__icon"},{default:a(()=>[l(x)]),_:1})]),_:1},8,["modelValue"])]),_:1})]),_:1},8,["model","rules"])]),_:1},8,["modelValue"]),l(oe,{style:{width:"50%"},modelValue:u(A),"onUpdate:modelValue":e[12]||(e[12]=s=>p(A)?A.value=s:A=s),center:"",title:"\u4FEE\u6539\u6635\u79F0",onClose:e[13]||(e[13]=s=>f(S.value))},{footer:a(()=>[n("span",K,[l(d,{type:"primary",onClick:e[10]||(e[10]=s=>Qe(S.value))},{default:a(()=>[y(" \u786E\u8BA4 ")]),_:1}),l(d,{onClick:e[11]||(e[11]=s=>p(A)?A.value=!1:A=!1)},{default:a(()=>[y("\u53D6\u6D88")]),_:1})])]),default:a(()=>[l(ge,{model:E.value,"label-width":"15%","status-icon":"",ref_key:"reviseNicknameFormRef",ref:S,rules:Ce},{default:a(()=>[l(v,{prop:"nickname",label:"\u65B0\u6635\u79F0"},{default:a(()=>[l(J,{modelValue:E.value.nickname,"onUpdate:modelValue":e[9]||(e[9]=s=>E.value.nickname=s),placeholder:"\u8BF7\u8F93\u5165\u65B0\u6635\u79F0"},{prefix:a(()=>[l(c,{class:"el-input__icon"},{default:a(()=>[l(fe)]),_:1})]),_:1},8,["modelValue"])]),_:1})]),_:1},8,["model","rules"])]),_:1},8,["modelValue"])],64)}}},ie=Se(ee,[["__scopeId","data-v-e1a8929c"]])});export{ie as P,Ae as _,Oe as __tla};
