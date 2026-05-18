(()=>{var z=Object.freeze({CAPTURE:"capture",CAPTURE_TAB:"captureTab",DOWNLOAD:"download"}),ne=Object.freeze({VISIBLE:"visible",ELEMENT:"element",REGION:"region"}),O=Object.freeze({HIGHLIGHT:"screenshot-element-highlight",CONFIRM:"screenshot-element-confirm",FILENAME_PROMPT:"screenshot-filename-prompt",REGION_OVERLAY:"screenshot-region-overlay",REGION_SELECTION:"screenshot-region-selection",REGION_ACTIONS:"screenshot-region-actions"}),V=Object.freeze({OVERLAY:"2147483646",DIALOG:"2147483647"});function me(e="[snap]"){let t=(r,...n)=>{console[r](e,...n)};return{debug:(...r)=>t("debug",...r),info:(...r)=>t("info",...r),warn:(...r)=>t("warn",...r),error:(...r)=>t("error",...r)}}var te=class extends Error{constructor(t){super(t),this.name="CaptureError"}},ae=class extends te{constructor(t){super("image load failed"),this.name="ImageLoadError",this.cause=t}},oe=class extends te{constructor(t="2D canvas context is unavailable"){super(t),this.name="CanvasError"}},q=class extends te{constructor(t,r){super(`${t}: ${r}`),this.name="RuntimeError",this.action=t}};function be({runtime:e,win:t}){async function r(){let i=await a(e,{action:z.CAPTURE_TAB});if(!(i!=null&&i.ok))throw new q(z.CAPTURE_TAB,(i==null?void 0:i.error)||"capture tab failed");if(!i.dataUrl)throw new q(z.CAPTURE_TAB,"missing data URL");return i.dataUrl}async function n(i,s){let u=await a(e,{action:z.DOWNLOAD,dataUrl:i,filename:s});if(!(u!=null&&u.ok))throw new q(z.DOWNLOAD,(u==null?void 0:u.error)||"download failed");return u.downloadId}function a(i,s){return new Promise((u,o)=>{i.sendMessage(s,p=>{let c=chrome.runtime.lastError;if(c){o(new q(s.action,c.message));return}u(p)})})}return{requestTabCapture:r,download:n,devicePixelRatio:()=>t.devicePixelRatio||1}}function xe(e){return new Promise((t,r)=>{let n=new Image;n.onload=()=>t(n),n.onerror=()=>r(new ae),n.src=e})}function ye(e){let t=e.getContext("2d");if(!t)throw new oe;return t}function we(e,t="png",r=85){return t==="jpeg"?e.toDataURL("image/jpeg",r/100):t==="webp"?e.toDataURL("image/webp",r/100):e.toDataURL("image/png")}async function Y(e){try{let t=await fetch(e).then(r=>r.blob());await navigator.clipboard.write([new ClipboardItem({[t.type]:t})])}catch{}}function qe({dataUrl:e,highRes:t,format:r="png",quality:n=85}){return xe(e).then(a=>{let i=t?1:1/(window.devicePixelRatio||1),s=document.createElement("canvas"),u=ye(s);return s.width=Math.max(1,Math.round(a.width*i)),s.height=Math.max(1,Math.round(a.height*i)),u.drawImage(a,0,0,s.width,s.height),we(s,r,n)})}function Ge({captureClient:e,rect:t,highRes:r,format:n="png",quality:a=85,win:i}){return e.requestTabCapture().then(xe).then(s=>{let u=s.width/i.innerWidth,o=s.height/i.innerHeight,p=r?u:1,c=document.createElement("canvas"),l=ye(c);return c.width=Math.max(1,Math.round(t.width*p)),c.height=Math.max(1,Math.round(t.height*p)),l.drawImage(s,t.left*u,t.top*o,t.width*u,t.height*o,0,0,c.width,c.height),we(c,n,a)})}function We({captureClient:e,element:t,highRes:r,format:n="png",quality:a=85,win:i}){let s=t.getBoundingClientRect();return e.requestTabCapture().then(xe).then(u=>{let o=u.width/i.innerWidth,p=u.height/i.innerHeight,c=r?o:1,l=document.createElement("canvas"),f=ye(l);return l.width=Math.max(1,Math.round(s.width*c)),l.height=Math.max(1,Math.round(s.height*c)),f.drawImage(u,s.left*o,s.top*p,s.width*o,s.height*p,0,0,l.width,l.height),we(l,n,a)})}function _(e,t,{id:r,textContent:n,attrs:a,styles:i}={}){let s=e.createElement(t);if(r&&(s.id=r),typeof n=="string"&&(s.textContent=n),a)for(let[u,o]of Object.entries(a))s.setAttribute(u,o);return i&&Ee(s,i),s}function Ee(e,t){Object.assign(e.style,t)}function A(e){e!=null&&e.parentNode&&e.parentNode.removeChild(e)}function Z(e){return new Promise(t=>{window.setTimeout(t,e)})}function Ye(e,t="png"){let r=`.${t}`;return`${((e||"").trim()||"screenshot").replace(/[<>:"/\\|?*\u0000-\u001F]/g,"-").replace(/\.+$/g,"").slice(0,200).replace(/\.(png|jpe?g|webp)$/i,"")}${r}`}function K(e="png"){let t=new Date,r=i=>String(i).padStart(2,"0"),n=`${t.getFullYear()}-${r(t.getMonth()+1)}-${r(t.getDate())}`,a=`${r(t.getHours())}-${r(t.getMinutes())}-${r(t.getSeconds())}`;return`snap-${n}-${a}.${e}`}function ie(e){return{x:e.clientX,y:e.clientY}}function se(e,t,r){let n=Math.min(Math.max(Math.min(e.x,t.x),0),r.innerWidth),a=Math.min(Math.max(Math.min(e.y,t.y),0),r.innerHeight),i=Math.min(Math.max(Math.max(e.x,t.x),0),r.innerWidth),s=Math.min(Math.max(Math.max(e.y,t.y),0),r.innerHeight);return{left:n,top:a,right:i,bottom:s,width:Math.max(0,i-n),height:Math.max(0,s-a)}}function Ze(e,t=8){return e&&e.width>=t&&e.height>=t}function Me({captureClient:e,promptService:t,session:r}){async function n({highRes:a,format:i="png",quality:s=85,delay:u=0,clipboard:o=!1,autoSave:p=!1}){if(r.acquire())try{u>0&&await Z(u*1e3);let c=await e.requestTabCapture(),l=await qe({dataUrl:c,highRes:a,format:i,quality:s}),f;if(p)f=K(i);else if(f=await t.promptFilename("screenshot",i),!f)return;await e.download(l,f),o&&await Y(l)}finally{r.release()}}return{run:n}}var tt={update:null,begin:null,loopBegin:null,changeBegin:null,change:null,changeComplete:null,loopComplete:null,complete:null,loop:1,direction:"normal",autoplay:!0,timelineOffset:0},ke={duration:1e3,delay:0,endDelay:0,easing:"easeOutElastic(1, .5)",round:0},Ot=["translateX","translateY","translateZ","rotate","rotateX","rotateY","rotateZ","scale","scaleX","scaleY","scaleZ","skew","skewX","skewY","perspective","matrix","matrix3d"],ue={CSS:{},springs:{}};function N(e,t,r){return Math.min(Math.max(e,t),r)}function re(e,t){return e.indexOf(t)>-1}function Se(e,t){return e.apply(null,t)}var h={arr:function(e){return Array.isArray(e)},obj:function(e){return re(Object.prototype.toString.call(e),"Object")},pth:function(e){return h.obj(e)&&e.hasOwnProperty("totalLength")},svg:function(e){return e instanceof SVGElement},inp:function(e){return e instanceof HTMLInputElement},dom:function(e){return e.nodeType||h.svg(e)},str:function(e){return typeof e=="string"},fnc:function(e){return typeof e=="function"},und:function(e){return typeof e>"u"},nil:function(e){return h.und(e)||e===null},hex:function(e){return/(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(e)},rgb:function(e){return/^rgb/.test(e)},hsl:function(e){return/^hsl/.test(e)},col:function(e){return h.hex(e)||h.rgb(e)||h.hsl(e)},key:function(e){return!tt.hasOwnProperty(e)&&!ke.hasOwnProperty(e)&&e!=="targets"&&e!=="keyframes"}};function rt(e){var t=/\(([^)]+)\)/.exec(e);return t?t[1].split(",").map(function(r){return parseFloat(r)}):[]}function nt(e,t){var r=rt(e),n=N(h.und(r[0])?1:r[0],.1,100),a=N(h.und(r[1])?100:r[1],.1,100),i=N(h.und(r[2])?10:r[2],.1,100),s=N(h.und(r[3])?0:r[3],.1,100),u=Math.sqrt(a/n),o=i/(2*Math.sqrt(a*n)),p=o<1?u*Math.sqrt(1-o*o):0,c=1,l=o<1?(o*u+-s)/p:-s+u;function f(d){var g=t?t*d/1e3:d;return o<1?g=Math.exp(-g*o*u)*(c*Math.cos(p*g)+l*Math.sin(p*g)):g=(c+l*g)*Math.exp(-g*u),d===0||d===1?d:1-g}function b(){var d=ue.springs[e];if(d)return d;for(var g=1/6,x=0,M=0;;)if(x+=g,f(x)===1){if(M++,M>=16)break}else M=0;var L=x*g*1e3;return ue.springs[e]=L,L}return t?f:b}function Rt(e){return e===void 0&&(e=10),function(t){return Math.ceil(N(t,1e-6,1)*e)*(1/e)}}var Bt=(function(){var e=11,t=1/(e-1);function r(c,l){return 1-3*l+3*c}function n(c,l){return 3*l-6*c}function a(c){return 3*c}function i(c,l,f){return((r(l,f)*c+n(l,f))*c+a(l))*c}function s(c,l,f){return 3*r(l,f)*c*c+2*n(l,f)*c+a(l)}function u(c,l,f,b,d){var g,x,M=0;do x=l+(f-l)/2,g=i(x,b,d)-c,g>0?f=x:l=x;while(Math.abs(g)>1e-7&&++M<10);return x}function o(c,l,f,b){for(var d=0;d<4;++d){var g=s(l,f,b);if(g===0)return l;var x=i(l,f,b)-c;l-=x/g}return l}function p(c,l,f,b){if(!(0<=c&&c<=1&&0<=f&&f<=1))return;var d=new Float32Array(e);if(c!==l||f!==b)for(var g=0;g<e;++g)d[g]=i(g*t,c,f);function x(M){for(var L=0,v=1,m=e-1;v!==m&&d[v]<=M;++v)L+=t;--v;var C=(M-d[v])/(d[v+1]-d[v]),T=L+C*t,w=s(T,c,f);return w>=.001?o(M,T,c,f):w===0?T:u(M,L,L+t,c,f)}return function(M){return c===l&&f===b||M===0||M===1?M:i(x(M),l,b)}}return p})(),at=(function(){var e={linear:function(){return function(n){return n}}},t={Sine:function(){return function(n){return 1-Math.cos(n*Math.PI/2)}},Expo:function(){return function(n){return n?Math.pow(2,10*n-10):0}},Circ:function(){return function(n){return 1-Math.sqrt(1-n*n)}},Back:function(){return function(n){return n*n*(3*n-2)}},Bounce:function(){return function(n){for(var a,i=4;n<((a=Math.pow(2,--i))-1)/11;);return 1/Math.pow(4,3-i)-7.5625*Math.pow((a*3-2)/22-n,2)}},Elastic:function(n,a){n===void 0&&(n=1),a===void 0&&(a=.5);var i=N(n,1,10),s=N(a,.1,2);return function(u){return u===0||u===1?u:-i*Math.pow(2,10*(u-1))*Math.sin((u-1-s/(Math.PI*2)*Math.asin(1/i))*(Math.PI*2)/s)}}},r=["Quad","Cubic","Quart","Quint"];return r.forEach(function(n,a){t[n]=function(){return function(i){return Math.pow(i,a+2)}}}),Object.keys(t).forEach(function(n){var a=t[n];e["easeIn"+n]=a,e["easeOut"+n]=function(i,s){return function(u){return 1-a(i,s)(1-u)}},e["easeInOut"+n]=function(i,s){return function(u){return u<.5?a(i,s)(u*2)/2:1-a(i,s)(u*-2+2)/2}},e["easeOutIn"+n]=function(i,s){return function(u){return u<.5?(1-a(i,s)(1-u*2))/2:(a(i,s)(u*2-1)+1)/2}}}),e})();function Le(e,t){if(h.fnc(e))return e;var r=e.split("(")[0],n=at[r],a=rt(e);switch(r){case"spring":return nt(e,t);case"cubicBezier":return Se(Bt,a);case"steps":return Se(Rt,a);default:return Se(n,a)}}function ot(e){try{var t=document.querySelectorAll(e);return t}catch{return}}function ce(e,t){for(var r=e.length,n=arguments.length>=2?arguments[1]:void 0,a=[],i=0;i<r;i++)if(i in e){var s=e[i];t.call(n,s,i,e)&&a.push(s)}return a}function le(e){return e.reduce(function(t,r){return t.concat(h.arr(r)?le(r):r)},[])}function Ke(e){return h.arr(e)?e:(h.str(e)&&(e=ot(e)||e),e instanceof NodeList||e instanceof HTMLCollection?[].slice.call(e):[e])}function Te(e,t){return e.some(function(r){return r===t})}function Ae(e){var t={};for(var r in e)t[r]=e[r];return t}function Ce(e,t){var r=Ae(e);for(var n in e)r[n]=t.hasOwnProperty(n)?t[n]:e[n];return r}function fe(e,t){var r=Ae(e);for(var n in t)r[n]=h.und(e[n])?t[n]:e[n];return r}function Dt(e){var t=/rgb\((\d+,\s*[\d]+,\s*[\d]+)\)/g.exec(e);return t?"rgba("+t[1]+",1)":e}function $t(e){var t=/^#?([a-f\d])([a-f\d])([a-f\d])$/i,r=e.replace(t,function(u,o,p,c){return o+o+p+p+c+c}),n=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(r),a=parseInt(n[1],16),i=parseInt(n[2],16),s=parseInt(n[3],16);return"rgba("+a+","+i+","+s+",1)"}function Ft(e){var t=/hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)/g.exec(e)||/hsla\((\d+),\s*([\d.]+)%,\s*([\d.]+)%,\s*([\d.]+)\)/g.exec(e),r=parseInt(t[1],10)/360,n=parseInt(t[2],10)/100,a=parseInt(t[3],10)/100,i=t[4]||1;function s(f,b,d){return d<0&&(d+=1),d>1&&(d-=1),d<1/6?f+(b-f)*6*d:d<1/2?b:d<2/3?f+(b-f)*(2/3-d)*6:f}var u,o,p;if(n==0)u=o=p=a;else{var c=a<.5?a*(1+n):a+n-a*n,l=2*a-c;u=s(l,c,r+1/3),o=s(l,c,r),p=s(l,c,r-1/3)}return"rgba("+u*255+","+o*255+","+p*255+","+i+")"}function Nt(e){if(h.rgb(e))return Dt(e);if(h.hex(e))return $t(e);if(h.hsl(e))return Ft(e)}function U(e){var t=/[+-]?\d*\.?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?(%|px|pt|em|rem|in|cm|mm|ex|ch|pc|vw|vh|vmin|vmax|deg|rad|turn)?$/.exec(e);if(t)return t[1]}function Ht(e){if(re(e,"translate")||e==="perspective")return"px";if(re(e,"rotate")||re(e,"skew"))return"deg"}function Ie(e,t){return h.fnc(e)?e(t.target,t.id,t.total):e}function H(e,t){return e.getAttribute(t)}function Pe(e,t,r){var n=U(t);if(Te([r,"deg","rad","turn"],n))return t;var a=ue.CSS[t+r];if(!h.und(a))return a;var i=100,s=document.createElement(e.tagName),u=e.parentNode&&e.parentNode!==document?e.parentNode:document.body;u.appendChild(s),s.style.position="absolute",s.style.width=i+r;var o=i/s.offsetWidth;u.removeChild(s);var p=o*parseFloat(t);return ue.CSS[t+r]=p,p}function it(e,t,r){if(t in e.style){var n=t.replace(/([a-z])([A-Z])/g,"$1-$2").toLowerCase(),a=e.style[t]||getComputedStyle(e).getPropertyValue(n)||"0";return r?Pe(e,a,r):a}}function Oe(e,t){if(h.dom(e)&&!h.inp(e)&&(!h.nil(H(e,t))||h.svg(e)&&e[t]))return"attribute";if(h.dom(e)&&Te(Ot,t))return"transform";if(h.dom(e)&&t!=="transform"&&it(e,t))return"css";if(e[t]!=null)return"object"}function st(e){if(h.dom(e)){for(var t=e.style.transform||"",r=/(\w+)\(([^)]*)\)/g,n=new Map,a;a=r.exec(t);)n.set(a[1],a[2]);return n}}function Ut(e,t,r,n){var a=re(t,"scale")?1:0+Ht(t),i=st(e).get(t)||a;return r&&(r.transforms.list.set(t,i),r.transforms.last=t),n?Pe(e,i,n):i}function Re(e,t,r,n){switch(Oe(e,t)){case"transform":return Ut(e,t,n,r);case"css":return it(e,t,r);case"attribute":return H(e,t);default:return e[t]||0}}function Be(e,t){var r=/^(\*=|\+=|-=)/.exec(e);if(!r)return e;var n=U(e)||0,a=parseFloat(t),i=parseFloat(e.replace(r[0],""));switch(r[0][0]){case"+":return a+i+n;case"-":return a-i+n;case"*":return a*i+n}}function ut(e,t){if(h.col(e))return Nt(e);if(/\s/g.test(e))return e;var r=U(e),n=r?e.substr(0,e.length-r.length):e;return t?n+t:n}function De(e,t){return Math.sqrt(Math.pow(t.x-e.x,2)+Math.pow(t.y-e.y,2))}function zt(e){return Math.PI*2*H(e,"r")}function Vt(e){return H(e,"width")*2+H(e,"height")*2}function _t(e){return De({x:H(e,"x1"),y:H(e,"y1")},{x:H(e,"x2"),y:H(e,"y2")})}function ct(e){for(var t=e.points,r=0,n,a=0;a<t.numberOfItems;a++){var i=t.getItem(a);a>0&&(r+=De(n,i)),n=i}return r}function jt(e){var t=e.points;return ct(e)+De(t.getItem(t.numberOfItems-1),t.getItem(0))}function lt(e){if(e.getTotalLength)return e.getTotalLength();switch(e.tagName.toLowerCase()){case"circle":return zt(e);case"rect":return Vt(e);case"line":return _t(e);case"polyline":return ct(e);case"polygon":return jt(e)}}function qt(e){var t=lt(e);return e.setAttribute("stroke-dasharray",t),t}function Gt(e){for(var t=e.parentNode;h.svg(t)&&h.svg(t.parentNode);)t=t.parentNode;return t}function ft(e,t){var r=t||{},n=r.el||Gt(e),a=n.getBoundingClientRect(),i=H(n,"viewBox"),s=a.width,u=a.height,o=r.viewBox||(i?i.split(" "):[0,0,s,u]);return{el:n,viewBox:o,x:o[0]/1,y:o[1]/1,w:s,h:u,vW:o[2],vH:o[3]}}function Wt(e,t){var r=h.str(e)?ot(e)[0]:e,n=t||100;return function(a){return{property:a,el:r,svg:ft(r),totalLength:lt(r)*(n/100)}}}function Yt(e,t,r){function n(c){c===void 0&&(c=0);var l=t+c>=1?t+c:0;return e.el.getPointAtLength(l)}var a=ft(e.el,e.svg),i=n(),s=n(-1),u=n(1),o=r?1:a.w/a.vW,p=r?1:a.h/a.vH;switch(e.property){case"x":return(i.x-a.x)*o;case"y":return(i.y-a.y)*p;case"angle":return Math.atan2(u.y-s.y,u.x-s.x)*180/Math.PI}}function Qe(e,t){var r=/[+-]?\d*\.?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/g,n=ut(h.pth(e)?e.totalLength:e,t)+"";return{original:n,numbers:n.match(r)?n.match(r).map(Number):[0],strings:h.str(e)||t?n.split(r):[]}}function $e(e){var t=e?le(h.arr(e)?e.map(Ke):Ke(e)):[];return ce(t,function(r,n,a){return a.indexOf(r)===n})}function dt(e){var t=$e(e);return t.map(function(r,n){return{target:r,id:n,total:t.length,transforms:{list:st(r)}}})}function Zt(e,t){var r=Ae(t);if(/^spring/.test(r.easing)&&(r.duration=nt(r.easing)),h.arr(e)){var n=e.length,a=n===2&&!h.obj(e[0]);a?e={value:e}:h.fnc(t.duration)||(r.duration=t.duration/n)}var i=h.arr(e)?e:[e];return i.map(function(s,u){var o=h.obj(s)&&!h.pth(s)?s:{value:s};return h.und(o.delay)&&(o.delay=u?0:t.delay),h.und(o.endDelay)&&(o.endDelay=u===i.length-1?t.endDelay:0),o}).map(function(s){return fe(s,r)})}function Kt(e){for(var t=ce(le(e.map(function(i){return Object.keys(i)})),function(i){return h.key(i)}).reduce(function(i,s){return i.indexOf(s)<0&&i.push(s),i},[]),r={},n=function(i){var s=t[i];r[s]=e.map(function(u){var o={};for(var p in u)h.key(p)?p==s&&(o.value=u[p]):o[p]=u[p];return o})},a=0;a<t.length;a++)n(a);return r}function Qt(e,t){var r=[],n=t.keyframes;n&&(t=fe(Kt(n),t));for(var a in t)h.key(a)&&r.push({name:a,tweens:Zt(t[a],e)});return r}function Jt(e,t){var r={};for(var n in e){var a=Ie(e[n],t);h.arr(a)&&(a=a.map(function(i){return Ie(i,t)}),a.length===1&&(a=a[0])),r[n]=a}return r.duration=parseFloat(r.duration),r.delay=parseFloat(r.delay),r}function Xt(e,t){var r;return e.tweens.map(function(n){var a=Jt(n,t),i=a.value,s=h.arr(i)?i[1]:i,u=U(s),o=Re(t.target,e.name,u,t),p=r?r.to.original:o,c=h.arr(i)?i[0]:p,l=U(c)||U(o),f=u||l;return h.und(s)&&(s=p),a.from=Qe(c,f),a.to=Qe(Be(s,c),f),a.start=r?r.end:0,a.end=a.start+a.delay+a.duration+a.endDelay,a.easing=Le(a.easing,a.duration),a.isPath=h.pth(i),a.isPathTargetInsideSVG=a.isPath&&h.svg(t.target),a.isColor=h.col(a.from.original),a.isColor&&(a.round=1),r=a,a})}var pt={css:function(e,t,r){return e.style[t]=r},attribute:function(e,t,r){return e.setAttribute(t,r)},object:function(e,t,r){return e[t]=r},transform:function(e,t,r,n,a){if(n.list.set(t,r),t===n.last||a){var i="";n.list.forEach(function(s,u){i+=u+"("+s+") "}),e.style.transform=i}}};function gt(e,t){var r=dt(e);r.forEach(function(n){for(var a in t){var i=Ie(t[a],n),s=n.target,u=U(i),o=Re(s,a,u,n),p=u||U(o),c=Be(ut(i,p),o),l=Oe(s,a);pt[l](s,a,c,n.transforms,!0)}})}function er(e,t){var r=Oe(e.target,t.name);if(r){var n=Xt(t,e),a=n[n.length-1];return{type:r,property:t.name,animatable:e,tweens:n,duration:a.end,delay:n[0].delay,endDelay:a.endDelay}}}function tr(e,t){return ce(le(e.map(function(r){return t.map(function(n){return er(r,n)})})),function(r){return!h.und(r)})}function vt(e,t){var r=e.length,n=function(i){return i.timelineOffset?i.timelineOffset:0},a={};return a.duration=r?Math.max.apply(Math,e.map(function(i){return n(i)+i.duration})):t.duration,a.delay=r?Math.min.apply(Math,e.map(function(i){return n(i)+i.delay})):t.delay,a.endDelay=r?a.duration-Math.max.apply(Math,e.map(function(i){return n(i)+i.duration-i.endDelay})):t.endDelay,a}var Je=0;function rr(e){var t=Ce(tt,e),r=Ce(ke,e),n=Qt(r,e),a=dt(e.targets),i=tr(a,n),s=vt(i,r),u=Je;return Je++,fe(t,{id:u,children:[],animatables:a,animations:i,duration:s.duration,delay:s.delay,endDelay:s.endDelay})}var $=[],ht=(function(){var e;function t(){!e&&(!Xe()||!k.suspendWhenDocumentHidden)&&$.length>0&&(e=requestAnimationFrame(r))}function r(a){for(var i=$.length,s=0;s<i;){var u=$[s];u.paused?($.splice(s,1),i--):(u.tick(a),s++)}e=s>0?requestAnimationFrame(r):void 0}function n(){k.suspendWhenDocumentHidden&&(Xe()?e=cancelAnimationFrame(e):($.forEach(function(a){return a._onDocumentVisibility()}),ht()))}return typeof document<"u"&&document.addEventListener("visibilitychange",n),t})();function Xe(){return!!document&&document.hidden}function k(e){e===void 0&&(e={});var t=0,r=0,n=0,a,i=0,s=null;function u(v){var m=window.Promise&&new Promise(function(C){return s=C});return v.finished=m,m}var o=rr(e),p=u(o);function c(){var v=o.direction;v!=="alternate"&&(o.direction=v!=="normal"?"normal":"reverse"),o.reversed=!o.reversed,a.forEach(function(m){return m.reversed=o.reversed})}function l(v){return o.reversed?o.duration-v:v}function f(){t=0,r=l(o.currentTime)*(1/k.speed)}function b(v,m){m&&m.seek(v-m.timelineOffset)}function d(v){if(o.reversePlayback)for(var C=i;C--;)b(v,a[C]);else for(var m=0;m<i;m++)b(v,a[m])}function g(v){for(var m=0,C=o.animations,T=C.length;m<T;){var w=C[m],R=w.animatable,B=w.tweens,F=B.length-1,S=B[F];F&&(S=ce(B,function(Pt){return v<Pt.end})[0]||S);for(var E=N(v-S.start-S.delay,0,S.duration)/S.duration,y=isNaN(E)?1:S.easing(E),I=S.to.strings,P=S.round,D=[],At=S.to.numbers.length,W=void 0,J=0;J<At;J++){var X=void 0,ze=S.to.numbers[J],Ve=S.from.numbers[J]||0;S.isPath?X=Yt(S.value,y*ze,S.isPathTargetInsideSVG):X=Ve+y*(ze-Ve),P&&(S.isColor&&J>2||(X=Math.round(X*P)/P)),D.push(X)}var _e=I.length;if(!_e)W=D[0];else{W=I[0];for(var ee=0;ee<_e;ee++){var mr=I[ee],je=I[ee+1],he=D[ee];isNaN(he)||(je?W+=he+je:W+=he+" ")}}pt[w.type](R.target,w.property,W,R.transforms),w.currentValue=W,m++}}function x(v){o[v]&&!o.passThrough&&o[v](o)}function M(){o.remaining&&o.remaining!==!0&&o.remaining--}function L(v){var m=o.duration,C=o.delay,T=m-o.endDelay,w=l(v);o.progress=N(w/m*100,0,100),o.reversePlayback=w<o.currentTime,a&&d(w),!o.began&&o.currentTime>0&&(o.began=!0,x("begin")),!o.loopBegan&&o.currentTime>0&&(o.loopBegan=!0,x("loopBegin")),w<=C&&o.currentTime!==0&&g(0),(w>=T&&o.currentTime!==m||!m)&&g(m),w>C&&w<T?(o.changeBegan||(o.changeBegan=!0,o.changeCompleted=!1,x("changeBegin")),x("change"),g(w)):o.changeBegan&&(o.changeCompleted=!0,o.changeBegan=!1,x("changeComplete")),o.currentTime=N(w,0,m),o.began&&x("update"),v>=m&&(r=0,M(),o.remaining?(t=n,x("loopComplete"),o.loopBegan=!1,o.direction==="alternate"&&c()):(o.paused=!0,o.completed||(o.completed=!0,x("loopComplete"),x("complete"),!o.passThrough&&"Promise"in window&&(s(),p=u(o)))))}return o.reset=function(){var v=o.direction;o.passThrough=!1,o.currentTime=0,o.progress=0,o.paused=!0,o.began=!1,o.loopBegan=!1,o.changeBegan=!1,o.completed=!1,o.changeCompleted=!1,o.reversePlayback=!1,o.reversed=v==="reverse",o.remaining=o.loop,a=o.children,i=a.length;for(var m=i;m--;)o.children[m].reset();(o.reversed&&o.loop!==!0||v==="alternate"&&o.loop===1)&&o.remaining++,g(o.reversed?o.duration:0)},o._onDocumentVisibility=f,o.set=function(v,m){return gt(v,m),o},o.tick=function(v){n=v,t||(t=n),L((n+(r-t))*k.speed)},o.seek=function(v){L(l(v))},o.pause=function(){o.paused=!0,f()},o.play=function(){o.paused&&(o.completed&&o.reset(),o.paused=!1,$.push(o),f(),ht())},o.reverse=function(){c(),o.completed=!o.reversed,f()},o.restart=function(){o.reset(),o.play()},o.remove=function(v){var m=$e(v);mt(m,o)},o.reset(),o.autoplay&&o.play(),o}function et(e,t){for(var r=t.length;r--;)Te(e,t[r].animatable.target)&&t.splice(r,1)}function mt(e,t){var r=t.animations,n=t.children;et(e,r);for(var a=n.length;a--;){var i=n[a],s=i.animations;et(e,s),!s.length&&!i.children.length&&n.splice(a,1)}!r.length&&!n.length&&t.pause()}function nr(e){for(var t=$e(e),r=$.length;r--;){var n=$[r];mt(t,n)}}function ar(e,t){t===void 0&&(t={});var r=t.direction||"normal",n=t.easing?Le(t.easing):null,a=t.grid,i=t.axis,s=t.from||0,u=s==="first",o=s==="center",p=s==="last",c=h.arr(e),l=parseFloat(c?e[0]:e),f=c?parseFloat(e[1]):0,b=U(c?e[1]:e)||0,d=t.start||0+(c?l:0),g=[],x=0;return function(M,L,v){if(u&&(s=0),o&&(s=(v-1)/2),p&&(s=v-1),!g.length){for(var m=0;m<v;m++){if(!a)g.push(Math.abs(s-m));else{var C=o?(a[0]-1)/2:s%a[0],T=o?(a[1]-1)/2:Math.floor(s/a[0]),w=m%a[0],R=Math.floor(m/a[0]),B=C-w,F=T-R,S=Math.sqrt(B*B+F*F);i==="x"&&(S=-B),i==="y"&&(S=-F),g.push(S)}x=Math.max.apply(Math,g)}n&&(g=g.map(function(y){return n(y/x)*x})),r==="reverse"&&(g=g.map(function(y){return i?y<0?y*-1:-y:Math.abs(x-y)}))}var E=c?(f-l)/x:l;return d+E*(Math.round(g[L]*100)/100)+b}}function or(e){e===void 0&&(e={});var t=k(e);return t.duration=0,t.add=function(r,n){var a=$.indexOf(t),i=t.children;a>-1&&$.splice(a,1);function s(f){f.passThrough=!0}for(var u=0;u<i.length;u++)s(i[u]);var o=fe(r,Ce(ke,e));o.targets=o.targets||e.targets;var p=t.duration;o.autoplay=!1,o.direction=t.direction,o.timelineOffset=h.und(n)?p:Be(n,p),s(t),t.seek(o.timelineOffset);var c=k(o);s(c),i.push(c);var l=vt(i,e);return t.delay=l.delay,t.endDelay=l.endDelay,t.duration=l.duration,t.seek(0),t.reset(),t.autoplay&&t.play(),t},t}k.version="3.2.1";k.speed=1;k.suspendWhenDocumentHidden=!0;k.running=$;k.remove=nr;k.get=Re;k.set=gt;k.convertPx=Pe;k.path=Wt;k.setDashoffset=qt;k.stagger=ar;k.timeline=or;k.easing=Le;k.penner=at;k.random=function(e,t){return Math.floor(Math.random()*(t-e+1))+e};var G=k;var bt={dark:{panelBg:"linear-gradient(180deg, #272729, #1d1d1f)",border:"rgba(255, 255, 255, 0.10)",shadow:"0 8px 32px rgba(0, 0, 0, 0.4), 0 2px 8px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.06)",secondaryBg:"rgba(255, 255, 255, 0.08)",secondaryBgHover:"rgba(255, 255, 255, 0.14)",secondaryBorder:"rgba(255, 255, 255, 0.12)",color:"#ffffff"},light:{panelBg:"linear-gradient(180deg, #ffffff, #f5f5f7)",border:"rgba(0, 0, 0, 0.10)",shadow:"0 8px 32px rgba(0, 0, 0, 0.18), 0 2px 8px rgba(0, 0, 0, 0.10), inset 0 1px 0 rgba(255, 255, 255, 0.9)",secondaryBg:"rgba(0, 0, 0, 0.04)",secondaryBgHover:"rgba(0, 0, 0, 0.08)",secondaryBorder:"rgba(0, 0, 0, 0.10)",color:"#1d1d1f"}};function xt(e){var t;return(t=e.matchMedia)!=null&&t.call(e,"(prefers-color-scheme: dark)").matches?"dark":"light"}function yt(e){return _(e,"div",{id:O.HIGHLIGHT,styles:{position:"fixed",pointerEvents:"none",zIndex:V.OVERLAY,display:"none",background:"rgba(0, 113, 227, 0.12)",border:"2px solid rgba(0, 113, 227, 0.75)",borderRadius:"3px",transition:"top 0.05s, left 0.05s, width 0.05s, height 0.05s"}})}function pe(e,t){if(!e)return;if(!t){e.style.display="none";return}let r=t.getBoundingClientRect(),n=e.style.display==="none";e.style.display="block",e.style.left=`${r.left}px`,e.style.top=`${r.top}px`,e.style.width=`${r.width}px`,e.style.height=`${r.height}px`,n&&G({targets:e,opacity:[0,1],scale:[.94,1],duration:200,easing:"easeOutCubic"})}function wt({doc:e,rect:t,win:r=window,onRetake:n,onSave:a}){let i=_(e,"div",{id:O.CONFIRM,styles:{position:"fixed",inset:"0",zIndex:V.OVERLAY}}),s=e.createElementNS("http://www.w3.org/2000/svg","svg");s.setAttribute("width","100%"),s.setAttribute("height","100%"),Ee(s,{position:"absolute",inset:"0",width:"100%",height:"100%"});let u=e.createElementNS("http://www.w3.org/2000/svg","defs"),o=e.createElementNS("http://www.w3.org/2000/svg","mask"),p=`element-mask-${Date.now()}`;o.setAttribute("id",p);let c=e.createElementNS("http://www.w3.org/2000/svg","rect");c.setAttribute("width","100%"),c.setAttribute("height","100%"),c.setAttribute("fill","white");let l=e.createElementNS("http://www.w3.org/2000/svg","rect");l.setAttribute("x",`${t.left}`),l.setAttribute("y",`${t.top}`),l.setAttribute("width",`${t.width}`),l.setAttribute("height",`${t.height}`),l.setAttribute("fill","black"),o.append(c,l),u.appendChild(o),s.appendChild(u);let f=e.createElementNS("http://www.w3.org/2000/svg","rect");f.setAttribute("width","100%"),f.setAttribute("height","100%"),f.setAttribute("fill","rgba(0, 0, 0, 0.5)"),f.setAttribute("mask",`url(#${p})`),s.appendChild(f);let b=bt[xt(r)],d=ir({doc:e,rect:t,win:r,tokens:b,onRetake:n,onSave:a});return i.append(s,d),i}function Et(e){return _(e,"div",{id:O.REGION_OVERLAY,styles:{position:"fixed",inset:"0",zIndex:V.OVERLAY,cursor:"crosshair",background:"rgba(0, 0, 0, 0.18)",userSelect:"none"}})}function Mt(e){return _(e,"div",{id:O.REGION_SELECTION,styles:{position:"fixed",display:"none",border:"2px solid rgba(0, 113, 227, 0.9)",background:"rgba(0, 113, 227, 0.12)",boxSizing:"border-box",pointerEvents:"none"}})}function Fe(e,t){!e||!t||(e.style.display="block",e.style.left=`${t.left}px`,e.style.top=`${t.top}px`,e.style.width=`${t.width}px`,e.style.height=`${t.height}px`)}function Ne(e){e&&(e.style.display="none")}function St({doc:e,rect:t,win:r,onRetake:n,onSave:a}){let i=bt[xt(r)],s=_(e,"div",{id:O.REGION_ACTIONS,styles:Ct(t,r,i)}),u=de(e,{label:"Retake",variant:"secondary",tokens:i}),o=de(e,{label:"Save",variant:"primary",tokens:i});return s.addEventListener("mousedown",p=>{p.stopPropagation()}),u.addEventListener("click",n),o.addEventListener("click",a),s.append(u,o),r.requestAnimationFrame(()=>{G({targets:s,opacity:[0,1],translateY:[10,0],easing:"spring(1, 80, 10, 0)"})}),s}function ge(e){return e?!!e.closest([`#${O.HIGHLIGHT}`,`#${O.CONFIRM}`,`#${O.FILENAME_PROMPT}`].join(", ")):!1}function Q(e){return!!e.getElementById(O.FILENAME_PROMPT)}function de(e,{label:t,variant:r="secondary",tokens:n}){let a=r==="primary",i=a?"#0071e3":n.secondaryBg,s=a?"#0077ed":n.secondaryBgHover,u=_(e,"button",{textContent:t,styles:{padding:"7px 14px",border:"1px solid",borderColor:a?"transparent":n.secondaryBorder,borderRadius:"8px",background:i,color:a?"#ffffff":n.color,cursor:"pointer",fontSize:"13px",fontWeight:"500",fontFamily:"Inter, -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",letterSpacing:"-0.08px",lineHeight:"1",whiteSpace:"nowrap",boxShadow:a?"inset 0 1px 0 rgba(255, 255, 255, 0.12)":"none"}});return u.addEventListener("mouseenter",()=>{u.style.background=s}),u.addEventListener("mouseleave",()=>{u.style.background=i}),u}function ir({doc:e,rect:t,win:r,tokens:n,onRetake:a,onSave:i}){let s=_(e,"div",{styles:Ct(t,r,n)}),u=de(e,{label:"Retake",variant:"secondary",tokens:n}),o=de(e,{label:"Save",variant:"primary",tokens:n});return u.addEventListener("click",a),o.addEventListener("click",i),s.append(u,o),r.requestAnimationFrame(()=>{G({targets:s,opacity:[0,1],translateY:[10,0],easing:"spring(1, 80, 10, 0)"})}),s}function ve(e){e.body.style.overflow="hidden"}function j(e){e.body.style.overflow=""}function Ct(e,t,r){let a=Math.min(Math.max(e.right-184,8),t.innerWidth-184-8),i=Math.min(Math.max(e.bottom+8,8),t.innerHeight-56);return{position:"fixed",zIndex:V.DIALOG,display:"flex",gap:"6px",padding:"6px",left:`${a}px`,top:`${i}px`,opacity:"0",borderRadius:"12px",background:r.panelBg,border:`1px solid ${r.border}`,boxShadow:r.shadow,backdropFilter:"blur(20px) saturate(1.4)",WebkitBackdropFilter:"blur(20px) saturate(1.4)"}}function He({captureClient:e,promptService:t,doc:r,win:n,session:a}){async function i({highRes:s,format:u="png",quality:o=85,delay:p=0,clipboard:c=!1,autoSave:l=!1}){if(!a.acquire())return;let f=sr({captureClient:e,promptService:t,doc:r,win:n,highRes:s,format:u,quality:o,delay:p,clipboard:c,autoSave:l});try{await f.start()}finally{f.cleanup(),a.release()}}return{run:i}}function sr({captureClient:e,promptService:t,doc:r,win:n,highRes:a,format:i="png",quality:s=85,delay:u=0,clipboard:o=!1,autoSave:p=!1}){let c=null,l=null,f=null,b=null,d=!1,g=[];async function x(){return f=yt(r),r.body.appendChild(f),S(r,"keydown",w,!0),L(),new Promise(y=>{g.push(y)})}function M(){for(v(),j(r),A(b),A(f),b=null,f=null,l=null,c=null;g.length>0;){let y=g.pop();if(typeof y=="function")try{y()}catch{}}}function L(){d||(d=!0,S(r,"mousemove",C,!0),S(r,"mousedown",T,!0))}function v(){d&&(d=!1,E(r,"mousemove",C,!0),E(r,"mousedown",T,!0))}function m(){let y=g.findLast(I=>typeof I=="function");M(),y&&y()}function C(y){let I=ur(y.target);c=I,pe(f,I)}function T(y){c&&(Q(r)||(y.preventDefault(),y.stopPropagation(),l=c,v(),pe(f,l),R()))}function w(y){Q(r)||y.key==="Escape"&&(y.preventDefault(),m())}function R(){A(b);let y=l.getBoundingClientRect();b=wt({doc:r,rect:y,onRetake:B,onSave:F}),r.body.appendChild(b),ve(r)}function B(y){y.stopPropagation(),l=null,j(r),A(b),b=null,pe(f,null),L()}async function F(y){y.stopPropagation();let I;if(p)I=K(i);else if(I=await t.promptFilename("screenshot",i),!I)return;let P=l;if(!P){m();return}j(r),A(b),A(f),b=null,f=null,await Z(50+u*1e3);let D=await We({captureClient:e,element:P,highRes:a,format:i,quality:s,win:n});await e.download(D,I),o&&await Y(D),m()}function S(y,I,P,D){y.addEventListener(I,P,D),g.push(()=>{y.removeEventListener(I,P,D)})}function E(y,I,P,D){y.removeEventListener(I,P,D)}return{start:x,cleanup:M}}function ur(e){return!(e instanceof Element)||ge(e)?null:e}function Ue({captureClient:e,promptService:t,doc:r,win:n,session:a}){async function i({highRes:s,format:u="png",quality:o=85,delay:p=0,clipboard:c=!1,autoSave:l=!1}){if(!a.acquire())return;let f=cr({captureClient:e,promptService:t,doc:r,win:n,highRes:s,format:u,quality:o,delay:p,clipboard:c,autoSave:l});try{await f.start()}finally{f.cleanup(),a.release()}}return{run:i}}function cr({captureClient:e,promptService:t,doc:r,win:n,highRes:a,format:i="png",quality:s=85,delay:u=0,clipboard:o=!1,autoSave:p=!1}){let c=null,l=null,f=null,b=null,d=null,g="idle",x=null,M=!1;async function L(){return c=Et(r),l=Mt(r),c.appendChild(l),r.body.appendChild(c),c.addEventListener("mousedown",C,!0),c.addEventListener("mousemove",T,!0),c.addEventListener("mouseup",w,!0),r.addEventListener("keydown",R,!0),new Promise(E=>{x=E})}function v(){c&&(c.removeEventListener("mousedown",C,!0),c.removeEventListener("mousemove",T,!0),c.removeEventListener("mouseup",w,!0)),r.removeEventListener("keydown",R,!0),j(r),A(f),A(c),f=null,c=null,l=null,b=null,d=null,g="idle"}function m(){M||(M=!0,v(),x==null||x())}function C(E){g!=="confirming"&&E.button===0&&(Q(r)||ge(E.target)||(E.preventDefault(),E.stopPropagation(),g="dragging",b=ie(E),d=se(b,b,n),A(f),f=null,Fe(l,d)))}function T(E){g!=="dragging"||!b||(E.preventDefault(),d=se(b,ie(E),n),Fe(l,d))}function w(E){if(!(g!=="dragging"||!b)){if(E.preventDefault(),E.stopPropagation(),d=se(b,ie(E),n),b=null,!Ze(d)){d=null,g="idle",Ne(l);return}g="confirming",B()}}function R(E){Q(r)||E.key==="Escape"&&(E.preventDefault(),m())}function B(){ve(r),A(f),f=St({doc:r,rect:d,win:n,onRetake:F,onSave:S}),c.appendChild(f)}function F(E){E.stopPropagation(),g="idle",d=null,j(r),A(f),f=null,Ne(l)}async function S(E){E.stopPropagation();let y;if(p)y=K(i);else if(y=await t.promptFilename("screenshot",i),!y)return;let I=d;if(!I){m();return}j(r),A(f),A(c),f=null,c=null,l=null,r.removeEventListener("keydown",R,!0),await Z(50+u*1e3);let P=await Ge({captureClient:e,rect:I,highRes:a,format:i,quality:s,win:n});await e.download(P,y),o&&await Y(P),m()}return{start:L,cleanup:v}}function It(){let e=new Map;function t(a,i){e.set(a,i)}function r(a){e.delete(a)}function n(a){return e.get(a)}return{register:t,unregister:r,get:n}}function kt(){let e=!1;function t(){return e?!1:(e=!0,!0)}function r(){e=!1}return{acquire:t,release:r,isActive:()=>e}}var lr={dark:{bg:"#000000",panel:"#1d1d1f",panelElevated:"#272729",text:"#f5f5f7",muted:"#86868b",border:"#3a3a3c",borderStrong:"#48484a",button:"#2c2c2e",buttonHover:"#3a3a3c",buttonActive:"#0071e3",buttonActiveText:"#ffffff",input:"#1d1d1f",ring:"rgba(0, 113, 227, 0.35)",shadow:"0 24px 80px rgba(0, 0, 0, 0.56)",backdrop:"rgba(0, 0, 0, 0.64)",accentSoft:"rgba(0, 113, 227, 0.08)",accentStrong:"rgba(0, 113, 227, 0.18)"},light:{bg:"#f5f5f7",panel:"#ffffff",panelElevated:"#ffffff",text:"#1d1d1f",muted:"#6e6e73",border:"#d2d2d7",borderStrong:"#c7c7cc",button:"#ffffff",buttonHover:"#f5f5f7",buttonActive:"#0071e3",buttonActiveText:"#ffffff",input:"#f5f5f7",ring:"rgba(0, 113, 227, 0.25)",shadow:"0 24px 80px rgba(0, 0, 0, 0.18)",backdrop:"rgba(0, 0, 0, 0.28)",accentSoft:"rgba(0, 113, 227, 0.06)",accentStrong:"rgba(0, 113, 227, 0.14)"}};function Lt({doc:e,win:t=window,storage:r=(n=>(n=chrome.storage)==null?void 0:n.sync)()}){async function a(){var u;let s=await fr(r);return s===!0?"dark":s===!1?"light":(u=t.matchMedia)!=null&&u.call(t,"(prefers-color-scheme: dark)").matches?"dark":"light"}function i(s="screenshot",u="png"){return a().then(o=>new Promise(p=>{let c=e.createElement("div");c.id=O.FILENAME_PROMPT,dr(c,{position:"fixed",inset:"0",zIndex:V.DIALOG});let l=c.attachShadow({mode:"open"}),f=lr[o];l.innerHTML=gr(f,u);let b=l.querySelector(".snap-root"),d=l.querySelector(".snap-backdrop"),g=l.querySelector(".snap-dialog"),x=l.querySelector(".snap-input"),M=l.querySelector(".snap-shell"),L=l.querySelector('[data-action="cancel"]');x.value=s,x.placeholder=s;function v(w){l.removeEventListener("keydown",T),l.removeEventListener("keypress",C),l.removeEventListener("keyup",C),b.classList.remove("is-open"),G({targets:M,opacity:0,translateY:8,scale:.97,duration:180,easing:"easeInCubic",complete(){pr(c),p(w)}})}function m(){v(Ye(x.value,u))}function C(w){w.stopPropagation()}function T(w){if(w.stopPropagation(),w.key==="Escape"){w.preventDefault(),v(null);return}w.key==="Enter"&&(l.activeElement||e.activeElement)===x&&(w.preventDefault(),m())}d.addEventListener("click",()=>v(null)),L.addEventListener("click",()=>v(null)),g.addEventListener("submit",w=>{w.preventDefault(),m()}),l.addEventListener("keydown",T),l.addEventListener("keypress",C),l.addEventListener("keyup",C),e.body.appendChild(c),t.requestAnimationFrame(()=>{b.classList.add("is-open"),x.focus(),x.select(),G({targets:M,opacity:[0,1],translateY:[12,0],scale:[.97,1],easing:"spring(1, 100, 12, 0)"})})}))}return{promptFilename:i}}function fr(e){return new Promise(t=>{if(!(e!=null&&e.get)){t(null);return}try{e.get("theme",r=>{var n;if((n=chrome.runtime)!=null&&n.lastError){t(null);return}t(typeof(r==null?void 0:r.theme)=="boolean"?r.theme:null)})}catch{t(null)}})}function dr(e,t){Object.assign(e.style,t)}function pr(e){e!=null&&e.parentNode&&e.parentNode.removeChild(e)}function gr(e,t="png"){return`
		<style>
			:host { all: initial; }

			.snap-root {
				--bg: ${e.bg};
				--panel: ${e.panel};
				--panel-elevated: ${e.panelElevated};
				--text: ${e.text};
				--muted: ${e.muted};
				--border: ${e.border};
				--border-strong: ${e.borderStrong};
				--button: ${e.button};
				--button-hover: ${e.buttonHover};
				--button-active: ${e.buttonActive};
				--button-active-text: ${e.buttonActiveText};
				--input: ${e.input};
				--ring: ${e.ring};
				--shadow: ${e.shadow};
				--backdrop: ${e.backdrop};
				--accent-soft: ${e.accentSoft};
				--accent-strong: ${e.accentStrong};

				position: fixed;
				inset: 0;
				display: grid;
				place-items: center;
				font-family: Inter, -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'SF Pro Display', 'Helvetica Neue', Helvetica, Arial, sans-serif;
				color: var(--text);
				z-index: ${V.DIALOG};
			}

			*, *::before, *::after { box-sizing: border-box; }

			.snap-backdrop {
				position: absolute;
				inset: 0;
				background: radial-gradient(1200px 600px at 50% -10%, var(--accent-soft), transparent 55%), var(--backdrop);
				backdrop-filter: blur(10px) saturate(1.05);
				-webkit-backdrop-filter: blur(10px) saturate(1.05);
				opacity: 0;
				transition: opacity 180ms ease;
			}

			.snap-shell {
				position: relative;
				width: min(92vw, 420px);
				opacity: 0;
				transform: translateY(12px) scale(0.97);
			}

			.snap-root.is-open .snap-backdrop { opacity: 1; }

			.snap-dialog {
				position: relative;
				overflow: hidden;
				border-radius: 20px;
				border: 1px solid var(--border);
				background: linear-gradient(180deg, color-mix(in srgb, var(--panel-elevated) 88%, white 12%), var(--panel));
				box-shadow: var(--shadow);
			}

			.snap-dialog::before {
				content: "";
				position: absolute;
				inset: 0 0 auto 0;
				height: 1px;
				background: linear-gradient(90deg, transparent, var(--border-strong), transparent);
				opacity: 0.75;
			}

			.snap-header { padding: 18px 18px 10px; display: flex; align-items: center; gap: 14px; }

			.snap-heading { min-width: 0; }

			.snap-eyebrow {
				margin: 0 0 4px;
				font-size: 11px;
				font-weight: 600;
				letter-spacing: 0.06em;
				text-transform: uppercase;
				color: var(--muted);
			}

			.snap-title {
				margin: 0;
				font-size: 20px;
				line-height: 1.19;
				font-weight: 600;
				letter-spacing: -0.374px;
				color: var(--text);
			}

			.snap-subtitle {
				margin: 6px 0 0;
				font-size: 14px;
				line-height: 1.43;
				letter-spacing: -0.224px;
				color: var(--muted);
			}

			.snap-body { padding: 0 18px 18px; display: grid; gap: 14px; }

			.snap-field { display: grid; gap: 8px; }

			.snap-label { font-size: 12px; font-weight: 600; color: var(--muted); }

			.snap-input-wrap {
				display: grid;
				grid-template-columns: 1fr auto;
				align-items: center;
				gap: 8px;
				min-height: 48px;
				padding: 6px;
				border-radius: 16px;
				border: 1px solid var(--border);
				background: var(--input);
				transition: border-color 120ms ease, box-shadow 120ms ease, transform 80ms ease;
			}

			.snap-input-wrap:focus-within {
				border-color: var(--border-strong);
				box-shadow: 0 0 0 4px var(--ring);
			}

			.snap-input {
				width: 100%;
				min-width: 0;
				padding: 10px 12px;
				border: 0;
				outline: 0;
				background: transparent;
				color: var(--text);
				font: inherit;
				font-size: 14px;
				font-weight: 600;
			}

			.snap-input::placeholder { color: var(--muted); }

			.snap-suffix {
				padding: 8px 10px;
				border-radius: 12px;
				border: 1px solid var(--border);
				background: var(--button);
				color: var(--muted);
				font-size: 12px;
				font-weight: 700;
				letter-spacing: 0.02em;
				white-space: nowrap;
			}

			.snap-footer { display: flex; justify-content: flex-end; gap: 8px; padding-top: 4px; }

			.snap-button {
				appearance: none;
				border: 1px solid var(--border);
				background: var(--button);
				color: var(--text);
				font: inherit;
				font-size: 13px;
				font-weight: 600;
				min-height: 40px;
				padding: 10px 14px;
				border-radius: 12px;
				cursor: pointer;
				transition: background-color 120ms ease, border-color 120ms ease, color 120ms ease, transform 80ms ease, box-shadow 120ms ease;
			}

			.snap-button:hover {
				border-color: var(--border-strong);
				background: var(--button-hover);
			}

			.snap-button:active { transform: translateY(1px); }

			.snap-button:focus-visible, .snap-input:focus-visible { outline: none; }

			.snap-button--primary {
				background: var(--button-active);
				border-color: var(--button-active);
				color: var(--button-active-text);
				box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08), 0 1px 2px rgba(0, 0, 0, 0.08);
			}

			.snap-button--primary:hover { filter: brightness(0.98); }

			@media (max-width: 420px) {
				.snap-header { padding: 16px 16px 10px; }
				.snap-body { padding: 0 16px 16px; }
				.snap-footer { flex-direction: column-reverse; }
				.snap-button { width: 100%; }
			}
		</style>

		<div class="snap-root">
			<div class="snap-backdrop"></div>
			<div class="snap-shell" role="dialog" aria-modal="true" aria-labelledby="snap-title">
				<form class="snap-dialog">
					<div class="snap-header">
						<div class="snap-heading">
							<p class="snap-eyebrow">Save</p>
							<h2 class="snap-title" id="snap-title">Name your screenshot</h2>
							<p class="snap-subtitle">Choose a filename for your PNG export.</p>
						</div>
					</div>
					<div class="snap-body">
						<label class="snap-field">
							<span class="snap-label">Filename</span>
							<div class="snap-input-wrap">
								<input class="snap-input" type="text" autocomplete="off" spellcheck="false"/>
								<div class="snap-suffix">.${t}</div>
							</div>
						</label>
						<div class="snap-footer">
							<button class="snap-button" type="button" data-action="cancel">Cancel</button>
							<button class="snap-button snap-button--primary" type="submit">Save PNG</button>
						</div>
					</div>
				</form>
			</div>
		</div>
	`}function vr({runtime:e,doc:t,win:r,logger:n=me()}={}){let a=It(),i=kt(),s=be({runtime:e,win:r}),u=Lt({doc:t});function o(){e.onMessage.addListener(f)}function p(d,g){a.register(d,g)}function c(d){a.unregister(d)}function l(d){return d&&typeof d=="object"&&d.action===z.CAPTURE&&typeof d.mode=="string"}function f(d){if(!l(d))return;let g=a.get(d.mode);if(!g){n.warn(`[snap] unsupported capture mode: ${String(d.mode)}`);return}b(g,{highRes:!!d.hiRes,format:d.format||"png",quality:d.quality??85,delay:d.delay??0,clipboard:!!d.clipboard,autoSave:!!d.autoSave})}async function b(d,g){try{await d.run(g)}catch(x){n.error("[snap] capture failed",x)}}return{init:o,registerMode:p,unregisterMode:c,captureClient:s,promptService:u,session:i}}function hr(e){e.registerMode(ne.VISIBLE,Me({captureClient:e.captureClient,promptService:e.promptService,session:e.session})),e.registerMode(ne.ELEMENT,He({captureClient:e.captureClient,promptService:e.promptService,doc:document,win:window,session:e.session})),e.registerMode(ne.REGION,Ue({captureClient:e.captureClient,promptService:e.promptService,doc:document,win:window,session:e.session}))}function Tt({runtime:e=chrome.runtime,doc:t=document,win:r=window,logger:n=me()}={}){if(r.__snapInjected)return n.debug("[snap] already injected; skipping"),null;r.__snapInjected=!0;let a=vr({runtime:e,doc:t,win:r,logger:n});return hr(a),a.init(),a}Tt();})();
