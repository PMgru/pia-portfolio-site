(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[964],{4830:function(e,t,s){(window.__NEXT_P=window.__NEXT_P||[]).push(["/admin",function(){return s(6237)}])},1593:function(e,t,s){"use strict";s.d(t,{Z:function(){return a}});/**
 * @license lucide-react v0.378.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let a=(0,s(1462).Z)("ArrowRight",[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"m12 5 7 7-7 7",key:"xquz4c"}]])},3980:function(e,t,s){"use strict";s.d(t,{Z:function(){return a}});/**
 * @license lucide-react v0.378.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let a=(0,s(1462).Z)("Eye",[["path",{d:"M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z",key:"rwhkz3"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]])},3460:function(e,t,s){"use strict";s.d(t,{Z:function(){return a}});/**
 * @license lucide-react v0.378.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let a=(0,s(1462).Z)("Lock",[["rect",{width:"18",height:"11",x:"3",y:"11",rx:"2",ry:"2",key:"1w4ew1"}],["path",{d:"M7 11V7a5 5 0 0 1 10 0v4",key:"fwvmzm"}]])},2608:function(e,t,s){"use strict";s.d(t,{Z:function(){return a}});/**
 * @license lucide-react v0.378.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let a=(0,s(1462).Z)("Mail",[["rect",{width:"20",height:"16",x:"2",y:"4",rx:"2",key:"18n3k1"}],["path",{d:"m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7",key:"1ocrg3"}]])},6237:function(e,t,s){"use strict";s.r(t),s.d(t,{default:function(){return j}});var a=s(5893),r=s(1822),i=s.n(r),o=s(7294),n=s(1163),d=s(9008),l=s.n(d),c=s(1664),f=s.n(c),p=s(1462);/**
 * @license lucide-react v0.378.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let m=(0,p.Z)("ShieldCheck",[["path",{d:"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",key:"oel41y"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]]);var u=s(2608),g=s(3460);/**
 * @license lucide-react v0.378.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let x=(0,p.Z)("EyeOff",[["path",{d:"M9.88 9.88a3 3 0 1 0 4.24 4.24",key:"1jxqfv"}],["path",{d:"M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68",key:"9wicm4"}],["path",{d:"M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61",key:"1jreej"}],["line",{x1:"2",x2:"22",y1:"2",y2:"22",key:"a6p6uj"}]]);var h=s(3980),y=s(1593),b=s(6501);function j(){let e=(0,n.useRouter)(),[t,s]=(0,o.useState)(""),[r,d]=(0,o.useState)(""),[c,p]=(0,o.useState)(!1),[j,v]=(0,o.useState)(!1),w=async s=>{s.preventDefault(),v(!0);try{let s=await fetch("/api/auth",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:t,password:r}),credentials:"include"}),a=await s.json();if(!s.ok)throw Error(a.message||"Login failed");b.ZP.success("Access Granted!",{style:{background:"#111827",color:"#F0F2F8",border:"1px solid rgba(201,168,76,0.3)"},icon:"\uD83D\uDD13"}),setTimeout(()=>e.push("/admin/dashboard"),800)}catch(e){b.ZP.error(e.message||"Invalid credentials",{style:{background:"#111827",color:"#EF4444",border:"1px solid rgba(239,68,68,0.3)"}})}finally{v(!1)}};return(0,a.jsxs)(a.Fragment,{children:[(0,a.jsxs)(l(),{children:[(0,a.jsx)("title",{className:"jsx-f755d1ddf815bf27",children:"Admin Access — PM Admin Suite"}),(0,a.jsx)("meta",{name:"robots",content:"noindex,nofollow",className:"jsx-f755d1ddf815bf27"})]}),(0,a.jsx)(b.x7,{position:"top-right"}),(0,a.jsxs)("div",{style:{minHeight:"100vh",display:"grid",gridTemplateColumns:"1fr 1fr",background:"#080B14"},className:"jsx-f755d1ddf815bf27",children:[(0,a.jsxs)("div",{style:{position:"relative",overflow:"hidden",background:"linear-gradient(135deg, #0A0F1E, #080B14)"},className:"jsx-f755d1ddf815bf27",children:[(0,a.jsx)("div",{style:{position:"absolute",top:"30%",left:"30%",width:400,height:400,borderRadius:"50%",background:"radial-gradient(circle, rgba(201,168,76,0.12) 0%, transparent 70%)",pointerEvents:"none"},className:"jsx-f755d1ddf815bf27"}),(0,a.jsx)("div",{style:{position:"absolute",inset:0,backgroundImage:"linear-gradient(rgba(201,168,76,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.04) 1px, transparent 1px)",backgroundSize:"50px 50px"},className:"jsx-f755d1ddf815bf27"}),(0,a.jsx)("div",{style:{position:"absolute",bottom:0,left:"50%",transform:"translateX(-50%)",width:"80%",maxWidth:340},className:"jsx-f755d1ddf815bf27",children:(0,a.jsx)("img",{src:"/images/pial-photo.jpg",alt:"Pial Mahmud",style:{width:"100%",height:"auto",objectFit:"contain",objectPosition:"bottom",filter:"drop-shadow(0 -20px 60px rgba(201,168,76,0.15))"},onError:e=>{e.target.style.display="none"},className:"jsx-f755d1ddf815bf27"})}),(0,a.jsxs)("div",{style:{position:"absolute",top:0,left:0,right:0,padding:"48px 40px"},className:"jsx-f755d1ddf815bf27",children:[(0,a.jsxs)(f(),{href:"/",style:{display:"flex",alignItems:"center",gap:12,textDecoration:"none"},children:[(0,a.jsx)("div",{style:{width:40,height:40,borderRadius:10,background:"linear-gradient(135deg, #C9A84C, #A07830)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"Playfair Display, serif",fontWeight:700,color:"#080B14",fontSize:18},className:"jsx-f755d1ddf815bf27",children:"P"}),(0,a.jsxs)("span",{style:{fontFamily:"Playfair Display, serif",fontWeight:700,fontSize:22,color:"#F0F2F8"},className:"jsx-f755d1ddf815bf27",children:["Pial",(0,a.jsx)("span",{style:{color:"#C9A84C"},className:"jsx-f755d1ddf815bf27",children:"."})]})]}),(0,a.jsxs)("div",{style:{marginTop:48},className:"jsx-f755d1ddf815bf27",children:[(0,a.jsx)("div",{style:{fontSize:11,fontWeight:700,color:"#C9A84C",textTransform:"uppercase",letterSpacing:"0.2em",marginBottom:12},className:"jsx-f755d1ddf815bf27",children:"✦ Admin Suite"}),(0,a.jsxs)("h1",{style:{fontFamily:"Playfair Display, serif",fontSize:"clamp(32px, 3vw, 44px)",fontWeight:800,color:"#F0F2F8",lineHeight:1.2,marginBottom:16},className:"jsx-f755d1ddf815bf27",children:["Your Digital",(0,a.jsx)("br",{className:"jsx-f755d1ddf815bf27"}),"Command Center"]}),(0,a.jsx)("p",{style:{fontSize:14,color:"#6B7A99",lineHeight:1.8},className:"jsx-f755d1ddf815bf27",children:"Manage content, track analytics, optimize your SEO engine, and train your AI chatbot — all in one premium dashboard."})]}),(0,a.jsx)("div",{style:{marginTop:36,display:"flex",flexDirection:"column",gap:12},className:"jsx-f755d1ddf815bf27",children:["Real-time Analytics Dashboard","Content & Blog Management","SEO Performance Engine","AI Chatbot Training"].map(e=>(0,a.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:10},className:"jsx-f755d1ddf815bf27",children:[(0,a.jsx)("div",{style:{width:6,height:6,borderRadius:"50%",background:"#C9A84C"},className:"jsx-f755d1ddf815bf27"}),(0,a.jsx)("span",{style:{fontSize:13,color:"#9CA3AF"},className:"jsx-f755d1ddf815bf27",children:e})]},e))})]})]}),(0,a.jsx)("div",{style:{display:"flex",alignItems:"center",justifyContent:"center",padding:"48px 60px",background:"#080B14"},className:"jsx-f755d1ddf815bf27",children:(0,a.jsxs)("div",{style:{width:"100%",maxWidth:400},className:"jsx-f755d1ddf815bf27",children:[(0,a.jsx)("div",{style:{width:56,height:56,borderRadius:14,background:"linear-gradient(135deg, rgba(201,168,76,0.15), rgba(201,168,76,0.05))",border:"1px solid rgba(201,168,76,0.2)",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:28},className:"jsx-f755d1ddf815bf27",children:(0,a.jsx)(m,{size:24,color:"#C9A84C"})}),(0,a.jsx)("h2",{style:{fontFamily:"Playfair Display, serif",fontSize:32,fontWeight:800,color:"#F0F2F8",marginBottom:8},className:"jsx-f755d1ddf815bf27",children:"Sign In"}),(0,a.jsx)("p",{style:{fontSize:14,color:"#6B7A99",marginBottom:36},className:"jsx-f755d1ddf815bf27",children:"Enter your credentials to access the admin suite."}),(0,a.jsxs)("div",{style:{padding:"12px 16px",borderRadius:10,marginBottom:28,background:"rgba(201,168,76,0.06)",border:"1px solid rgba(201,168,76,0.15)"},className:"jsx-f755d1ddf815bf27",children:[(0,a.jsx)("div",{style:{fontSize:11,fontWeight:700,color:"#C9A84C",marginBottom:6,textTransform:"uppercase",letterSpacing:"0.08em"},className:"jsx-f755d1ddf815bf27",children:"\uD83D\uDCA1 Demo Credentials"}),(0,a.jsxs)("div",{style:{fontSize:12,color:"#9CA3AF"},className:"jsx-f755d1ddf815bf27",children:["Email: ",(0,a.jsx)("strong",{style:{color:"#F0F2F8"},className:"jsx-f755d1ddf815bf27",children:"pial@pialmahmud.com"})]}),(0,a.jsxs)("div",{style:{fontSize:12,color:"#9CA3AF",marginTop:2},className:"jsx-f755d1ddf815bf27",children:["Password: ",(0,a.jsx)("strong",{style:{color:"#F0F2F8"},className:"jsx-f755d1ddf815bf27",children:"admin123"})]})]}),(0,a.jsxs)("form",{onSubmit:w,style:{display:"flex",flexDirection:"column",gap:20},className:"jsx-f755d1ddf815bf27",children:[(0,a.jsxs)("div",{className:"jsx-f755d1ddf815bf27",children:[(0,a.jsx)("label",{style:{display:"block",fontSize:11,fontWeight:700,color:"#6B7A99",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:8},className:"jsx-f755d1ddf815bf27",children:"Email Address"}),(0,a.jsxs)("div",{style:{position:"relative"},className:"jsx-f755d1ddf815bf27",children:[(0,a.jsx)(u.Z,{size:16,color:"#6B7A99",style:{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",pointerEvents:"none"}}),(0,a.jsx)("input",{id:"admin-email",type:"email",value:t,onChange:e=>s(e.target.value),placeholder:"pial@pialmahmud.com",style:{paddingLeft:44},required:!0,className:"jsx-f755d1ddf815bf27 form-input"})]})]}),(0,a.jsxs)("div",{className:"jsx-f755d1ddf815bf27",children:[(0,a.jsx)("label",{style:{display:"block",fontSize:11,fontWeight:700,color:"#6B7A99",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:8},className:"jsx-f755d1ddf815bf27",children:"Password"}),(0,a.jsxs)("div",{style:{position:"relative"},className:"jsx-f755d1ddf815bf27",children:[(0,a.jsx)(g.Z,{size:16,color:"#6B7A99",style:{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",pointerEvents:"none"}}),(0,a.jsx)("input",{id:"admin-password",type:c?"text":"password",value:r,onChange:e=>d(e.target.value),placeholder:"••••••••",style:{paddingLeft:44,paddingRight:44},required:!0,className:"jsx-f755d1ddf815bf27 form-input"}),(0,a.jsx)("button",{type:"button",onClick:()=>p(!c),style:{position:"absolute",right:14,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:"#6B7A99",cursor:"pointer"},className:"jsx-f755d1ddf815bf27",children:c?(0,a.jsx)(x,{size:16}):(0,a.jsx)(h.Z,{size:16})})]})]}),(0,a.jsx)("button",{id:"admin-login-btn",type:"submit",disabled:j,style:{width:"100%",padding:"15px 24px",borderRadius:8,marginTop:8,background:j?"rgba(201,168,76,0.5)":"linear-gradient(135deg, #C9A84C, #A07830)",color:"#080B14",fontWeight:800,fontSize:14,letterSpacing:"0.06em",textTransform:"uppercase",border:"none",cursor:j?"wait":"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:10,transition:"all 0.3s",boxShadow:"0 10px 30px rgba(201,168,76,0.2)"},className:"jsx-f755d1ddf815bf27",children:j?(0,a.jsx)("span",{style:{width:20,height:20,borderRadius:"50%",border:"2px solid #080B14",borderTopColor:"transparent",animation:"spin 0.8s linear infinite",display:"inline-block"},className:"jsx-f755d1ddf815bf27"}):(0,a.jsxs)(a.Fragment,{children:["Unlock Admin Suite ",(0,a.jsx)(y.Z,{size:16})]})})]}),(0,a.jsx)("div",{style:{marginTop:28,borderTop:"1px solid rgba(255,255,255,0.06)",paddingTop:24,textAlign:"center"},className:"jsx-f755d1ddf815bf27",children:(0,a.jsx)(f(),{href:"/",style:{fontSize:13,color:"#6B7A99",textDecoration:"none"},children:"← Return to Portfolio"})})]})})]}),(0,a.jsx)(i(),{id:"f755d1ddf815bf27",children:"@-webkit-keyframes spin{to{-webkit-transform:rotate(360deg);transform:rotate(360deg)}}@-moz-keyframes spin{to{-moz-transform:rotate(360deg);transform:rotate(360deg)}}@-o-keyframes spin{to{-o-transform:rotate(360deg);transform:rotate(360deg)}}@keyframes spin{to{-webkit-transform:rotate(360deg);-moz-transform:rotate(360deg);-o-transform:rotate(360deg);transform:rotate(360deg)}}@media(max-width:768px){div[style*=\"gridTemplateColumns: '1fr 1fr'\"].jsx-f755d1ddf815bf27{grid-template-columns:1fr!important}}"})]})}},6501:function(e,t,s){"use strict";let a,r;s.d(t,{x7:function(){return ep},ZP:function(){return em}});var i,o=s(7294);let n={data:""},d=e=>{if("object"==typeof window){let t=(e?e.querySelector("#_goober"):window._goober)||Object.assign(document.createElement("style"),{innerHTML:" ",id:"_goober"});return t.nonce=window.__nonce__,t.parentNode||(e||document.head).appendChild(t),t.firstChild}return e||n},l=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,c=/\/\*[^]*?\*\/|  +/g,f=/\n+/g,p=(e,t)=>{let s="",a="",r="";for(let i in e){let o=e[i];"@"==i[0]?"i"==i[1]?s=i+" "+o+";":a+="f"==i[1]?p(o,i):i+"{"+p(o,"k"==i[1]?"":t)+"}":"object"==typeof o?a+=p(o,t?t.replace(/([^,])+/g,e=>i.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,t=>/&/.test(t)?t.replace(/&/g,e):e?e+" "+t:t)):i):null!=o&&(i="-"==i[1]?i:i.replace(/[A-Z]/g,"-$&").toLowerCase(),r+=p.p?p.p(i,o):i+":"+o+";")}return s+(t&&r?t+"{"+r+"}":r)+a},m={},u=e=>{if("object"==typeof e){let t="";for(let s in e)t+=s+u(e[s]);return t}return e},g=(e,t,s,a,r)=>{var i;let o=u(e),n=m[o]||(m[o]=(e=>{let t=0,s=11;for(;t<e.length;)s=101*s+e.charCodeAt(t++)>>>0;return"go"+s})(o));if(!m[n]){let t=o!==e?e:(e=>{let t,s,a=[{}];for(;t=l.exec(e.replace(c,""));)t[4]?a.shift():t[3]?(s=t[3].replace(f," ").trim(),a.unshift(a[0][s]=a[0][s]||{})):a[0][t[1]]=t[2].replace(f," ").trim();return a[0]})(e);m[n]=p(r?{["@keyframes "+n]:t}:t,s?"":"."+n)}let d=s&&m.g;return s&&(m.g=m[n]),i=m[n],d?t.data=t.data.replace(d,i):-1===t.data.indexOf(i)&&(t.data=a?i+t.data:t.data+i),n},x=(e,t,s)=>e.reduce((e,a,r)=>{let i=t[r];if(i&&i.call){let e=i(s),t=e&&e.props&&e.props.className||/^go/.test(e)&&e;i=t?"."+t:e&&"object"==typeof e?e.props?"":p(e,""):!1===e?"":e}return e+a+(null==i?"":i)},"");function h(e){let t=this||{},s=e.call?e(t.p):e;return g(s.unshift?s.raw?x(s,[].slice.call(arguments,1),t.p):s.reduce((e,s)=>Object.assign(e,s&&s.call?s(t.p):s),{}):s,d(t.target),t.g,t.o,t.k)}h.bind({g:1});let y,b,j,v=h.bind({k:1});function w(e,t){let s=this||{};return function(){let a=arguments;function r(i,o){let n=Object.assign({},i),d=n.className||r.className;s.p=Object.assign({theme:b&&b()},n),s.o=/go\d/.test(d),n.className=h.apply(s,a)+(d?" "+d:""),t&&(n.ref=o);let l=e;return e[0]&&(l=n.as||e,delete n.as),j&&l[0]&&j(n),y(l,n)}return t?t(r):r}}var k=e=>"function"==typeof e,N=(e,t)=>k(e)?e(t):e,C=(a=0,()=>(++a).toString()),A=()=>{if(void 0===r&&"u">typeof window){let e=matchMedia("(prefers-reduced-motion: reduce)");r=!e||e.matches}return r},E="default",z=(e,t)=>{let{toastLimit:s}=e.settings;switch(t.type){case 0:return{...e,toasts:[t.toast,...e.toasts].slice(0,s)};case 1:return{...e,toasts:e.toasts.map(e=>e.id===t.toast.id?{...e,...t.toast}:e)};case 2:let{toast:a}=t;return z(e,{type:e.toasts.find(e=>e.id===a.id)?1:0,toast:a});case 3:let{toastId:r}=t;return{...e,toasts:e.toasts.map(e=>e.id===r||void 0===r?{...e,dismissed:!0,visible:!1}:e)};case 4:return void 0===t.toastId?{...e,toasts:[]}:{...e,toasts:e.toasts.filter(e=>e.id!==t.toastId)};case 5:return{...e,pausedAt:t.time};case 6:let i=t.time-(e.pausedAt||0);return{...e,pausedAt:void 0,toasts:e.toasts.map(e=>({...e,pauseDuration:e.pauseDuration+i}))}}},S=[],F={toasts:[],pausedAt:void 0,settings:{toastLimit:20}},D={},P=(e,t=E)=>{D[t]=z(D[t]||F,e),S.forEach(([e,s])=>{e===t&&s(D[t])})},T=e=>Object.keys(D).forEach(t=>P(e,t)),B=e=>Object.keys(D).find(t=>D[t].toasts.some(t=>t.id===e)),I=(e=E)=>t=>{P(t,e)},O={blank:4e3,error:4e3,success:2e3,loading:1/0,custom:4e3},Z=(e={},t=E)=>{let[s,a]=(0,o.useState)(D[t]||F),r=(0,o.useRef)(D[t]);(0,o.useEffect)(()=>(r.current!==D[t]&&a(D[t]),S.push([t,a]),()=>{let e=S.findIndex(([e])=>e===t);e>-1&&S.splice(e,1)}),[t]);let i=s.toasts.map(t=>{var s,a,r;return{...e,...e[t.type],...t,removeDelay:t.removeDelay||(null==(s=e[t.type])?void 0:s.removeDelay)||(null==e?void 0:e.removeDelay),duration:t.duration||(null==(a=e[t.type])?void 0:a.duration)||(null==e?void 0:e.duration)||O[t.type],style:{...e.style,...null==(r=e[t.type])?void 0:r.style,...t.style}}});return{...s,toasts:i}},$=(e,t="blank",s)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:t,ariaProps:{role:"status","aria-live":"polite"},message:e,pauseDuration:0,...s,id:(null==s?void 0:s.id)||C()}),_=e=>(t,s)=>{let a=$(t,e,s);return I(a.toasterId||B(a.id))({type:2,toast:a}),a.id},M=(e,t)=>_("blank")(e,t);M.error=_("error"),M.success=_("success"),M.loading=_("loading"),M.custom=_("custom"),M.dismiss=(e,t)=>{let s={type:3,toastId:e};t?I(t)(s):T(s)},M.dismissAll=e=>M.dismiss(void 0,e),M.remove=(e,t)=>{let s={type:4,toastId:e};t?I(t)(s):T(s)},M.removeAll=e=>M.remove(void 0,e),M.promise=(e,t,s)=>{let a=M.loading(t.loading,{...s,...null==s?void 0:s.loading});return"function"==typeof e&&(e=e()),e.then(e=>{let r=t.success?N(t.success,e):void 0;return r?M.success(r,{id:a,...s,...null==s?void 0:s.success}):M.dismiss(a),e}).catch(e=>{let r=t.error?N(t.error,e):void 0;r?M.error(r,{id:a,...s,...null==s?void 0:s.error}):M.dismiss(a)}),e};var R=1e3,L=(e,t="default")=>{let{toasts:s,pausedAt:a}=Z(e,t),r=(0,o.useRef)(new Map).current,i=(0,o.useCallback)((e,t=R)=>{if(r.has(e))return;let s=setTimeout(()=>{r.delete(e),n({type:4,toastId:e})},t);r.set(e,s)},[]);(0,o.useEffect)(()=>{if(a)return;let e=Date.now(),r=s.map(s=>{if(s.duration===1/0)return;let a=(s.duration||0)+s.pauseDuration-(e-s.createdAt);if(a<0){s.visible&&M.dismiss(s.id);return}return setTimeout(()=>M.dismiss(s.id,t),a)});return()=>{r.forEach(e=>e&&clearTimeout(e))}},[s,a,t]);let n=(0,o.useCallback)(I(t),[t]),d=(0,o.useCallback)(()=>{n({type:5,time:Date.now()})},[n]),l=(0,o.useCallback)((e,t)=>{n({type:1,toast:{id:e,height:t}})},[n]),c=(0,o.useCallback)(()=>{a&&n({type:6,time:Date.now()})},[a,n]),f=(0,o.useCallback)((e,t)=>{let{reverseOrder:a=!1,gutter:r=8,defaultPosition:i}=t||{},o=s.filter(t=>(t.position||i)===(e.position||i)&&t.height),n=o.findIndex(t=>t.id===e.id),d=o.filter((e,t)=>t<n&&e.visible).length;return o.filter(e=>e.visible).slice(...a?[d+1]:[0,d]).reduce((e,t)=>e+(t.height||0)+r,0)},[s]);return(0,o.useEffect)(()=>{s.forEach(e=>{if(e.dismissed)i(e.id,e.removeDelay);else{let t=r.get(e.id);t&&(clearTimeout(t),r.delete(e.id))}})},[s,i]),{toasts:s,handlers:{updateHeight:l,startPause:d,endPause:c,calculateOffset:f}}},W=v`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,H=v`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,q=v`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,Y=w("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${W} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${H} 0.15s ease-out forwards;
    animation-delay: 150ms;
    position: absolute;
    border-radius: 3px;
    opacity: 0;
    background: ${e=>e.secondary||"#fff"};
    bottom: 9px;
    left: 4px;
    height: 2px;
    width: 12px;
  }

  &:before {
    animation: ${q} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`,U=v`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,X=w("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${e=>e.secondary||"#e0e0e0"};
  border-right-color: ${e=>e.primary||"#616161"};
  animation: ${U} 1s linear infinite;
`,V=v`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`,G=v`
0% {
	height: 0;
	width: 0;
	opacity: 0;
}
40% {
  height: 0;
	width: 6px;
	opacity: 1;
}
100% {
  opacity: 1;
  height: 10px;
}`,J=w("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${V} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${G} 0.2s ease-out forwards;
    opacity: 0;
    animation-delay: 200ms;
    position: absolute;
    border-right: 2px solid;
    border-bottom: 2px solid;
    border-color: ${e=>e.secondary||"#fff"};
    bottom: 6px;
    left: 6px;
    height: 10px;
    width: 6px;
  }
`,K=w("div")`
  position: absolute;
`,Q=w("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,ee=v`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`,et=w("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${ee} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,es=({toast:e})=>{let{icon:t,type:s,iconTheme:a}=e;return void 0!==t?"string"==typeof t?o.createElement(et,null,t):t:"blank"===s?null:o.createElement(Q,null,o.createElement(X,{...a}),"loading"!==s&&o.createElement(K,null,"error"===s?o.createElement(Y,{...a}):o.createElement(J,{...a})))},ea=e=>`
0% {transform: translate3d(0,${-200*e}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`,er=e=>`
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${-150*e}%,-1px) scale(.6); opacity:0;}
`,ei=w("div")`
  display: flex;
  align-items: center;
  background: #fff;
  color: #363636;
  line-height: 1.3;
  will-change: transform;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05);
  max-width: 350px;
  pointer-events: auto;
  padding: 8px 10px;
  border-radius: 8px;
`,eo=w("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`,en=(e,t)=>{let s=e.includes("top")?1:-1,[a,r]=A()?["0%{opacity:0;} 100%{opacity:1;}","0%{opacity:1;} 100%{opacity:0;}"]:[ea(s),er(s)];return{animation:t?`${v(a)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${v(r)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}},ed=o.memo(({toast:e,position:t,style:s,children:a})=>{let r=e.height?en(e.position||t||"top-center",e.visible):{opacity:0},i=o.createElement(es,{toast:e}),n=o.createElement(eo,{...e.ariaProps},N(e.message,e));return o.createElement(ei,{className:e.className,style:{...r,...s,...e.style}},"function"==typeof a?a({icon:i,message:n}):o.createElement(o.Fragment,null,i,n))});i=o.createElement,p.p=void 0,y=i,b=void 0,j=void 0;var el=({id:e,className:t,style:s,onHeightUpdate:a,children:r})=>{let i=o.useCallback(t=>{if(t){let s=()=>{a(e,t.getBoundingClientRect().height)};s(),new MutationObserver(s).observe(t,{subtree:!0,childList:!0,characterData:!0})}},[e,a]);return o.createElement("div",{ref:i,className:t,style:s},r)},ec=(e,t)=>{let s=e.includes("top"),a=e.includes("center")?{justifyContent:"center"}:e.includes("right")?{justifyContent:"flex-end"}:{};return{left:0,right:0,display:"flex",position:"absolute",transition:A()?void 0:"all 230ms cubic-bezier(.21,1.02,.73,1)",transform:`translateY(${t*(s?1:-1)}px)`,...s?{top:0}:{bottom:0},...a}},ef=h`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`,ep=({reverseOrder:e,position:t="top-center",toastOptions:s,gutter:a,children:r,toasterId:i,containerStyle:n,containerClassName:d})=>{let{toasts:l,handlers:c}=L(s,i);return o.createElement("div",{"data-rht-toaster":i||"",style:{position:"fixed",zIndex:9999,top:16,left:16,right:16,bottom:16,pointerEvents:"none",...n},className:d,onMouseEnter:c.startPause,onMouseLeave:c.endPause},l.map(s=>{let i=s.position||t,n=ec(i,c.calculateOffset(s,{reverseOrder:e,gutter:a,defaultPosition:t}));return o.createElement(el,{id:s.id,key:s.id,onHeightUpdate:c.updateHeight,className:s.visible?ef:"",style:n},"custom"===s.type?N(s.message,s):r?r(s):o.createElement(ed,{toast:s,position:i}))}))},em=M}},function(e){e.O(0,[996,888,774,179],function(){return e(e.s=4830)}),_N_E=e.O()}]);