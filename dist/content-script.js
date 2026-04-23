(()=>{var F=Object.freeze({CAPTURE:"capture",CAPTURE_TAB:"captureTab",DOWNLOAD:"download"}),J=Object.freeze({VISIBLE:"visible",ELEMENT:"element",REGION:"region"}),P=Object.freeze({HIGHLIGHT:"screenshot-element-highlight",CONFIRM:"screenshot-element-confirm",FILENAME_PROMPT:"screenshot-filename-prompt",REGION_OVERLAY:"screenshot-region-overlay",REGION_SELECTION:"screenshot-region-selection",REGION_ACTIONS:"screenshot-region-actions"}),$=Object.freeze({OVERLAY:"2147483646",DIALOG:"2147483647"});function ve(e="[snap]"){let t=(r,...a)=>{console[r](e,...a)};return{debug:(...r)=>t("debug",...r),info:(...r)=>t("info",...r),warn:(...r)=>t("warn",...r),error:(...r)=>t("error",...r)}}var Y=class extends Error{constructor(t){super(t),this.name="CaptureError"}},X=class extends Y{constructor(t){super("image load failed"),this.name="ImageLoadError",this.cause=t}},ee=class extends Y{constructor(t="2D canvas context is unavailable"){super(t),this.name="CanvasError"}},V=class extends Y{constructor(t,r){super(`${t}: ${r}`),this.name="RuntimeError",this.action=t}};function he({runtime:e,win:t}){async function r(){let i=await n(e,{action:F.CAPTURE_TAB});if(!(i!=null&&i.ok))throw new V(F.CAPTURE_TAB,(i==null?void 0:i.error)||"capture tab failed");if(!i.dataUrl)throw new V(F.CAPTURE_TAB,"missing data URL");return i.dataUrl}async function a(i,s){let u=await n(e,{action:F.DOWNLOAD,dataUrl:i,filename:s});if(!(u!=null&&u.ok))throw new V(F.DOWNLOAD,(u==null?void 0:u.error)||"download failed");return u.downloadId}function n(i,s){return new Promise((u,o)=>{i.sendMessage(s,l=>{let c=chrome.runtime.lastError;if(c){o(new V(s.action,c.message));return}u(l)})})}return{requestTabCapture:r,download:a,devicePixelRatio:()=>t.devicePixelRatio||1}}function me(e){return new Promise((t,r)=>{let a=new Image;a.onload=()=>t(a),a.onerror=()=>r(new X),a.src=e})}function be(e){let t=e.getContext("2d");if(!t)throw new ee;return t}function ze({dataUrl:e,highRes:t}){return me(e).then(r=>{let a=t?1:1/(window.devicePixelRatio||1),n=document.createElement("canvas"),i=be(n);return n.width=Math.max(1,Math.round(r.width*a)),n.height=Math.max(1,Math.round(r.height*a)),i.drawImage(r,0,0,n.width,n.height),n.toDataURL("image/png")})}function _e({captureClient:e,rect:t,highRes:r,win:a}){return e.requestTabCapture().then(me).then(n=>{let i=n.width/a.innerWidth,s=n.height/a.innerHeight,u=r?i:1,o=document.createElement("canvas"),l=be(o);return o.width=Math.max(1,Math.round(t.width*u)),o.height=Math.max(1,Math.round(t.height*u)),l.drawImage(n,t.left*i,t.top*s,t.width*i,t.height*s,0,0,o.width,o.height),o.toDataURL("image/png")})}function je({captureClient:e,element:t,highRes:r,win:a}){let n=t.getBoundingClientRect();return e.requestTabCapture().then(me).then(i=>{let s=i.width/a.innerWidth,u=i.height/a.innerHeight,o=r?s:1,l=document.createElement("canvas"),c=be(l);return l.width=Math.max(1,Math.round(n.width*o)),l.height=Math.max(1,Math.round(n.height*o)),c.drawImage(i,n.left*s,n.top*u,n.width*s,n.height*u,0,0,l.width,l.height),l.toDataURL("image/png")})}function xe({captureClient:e,promptService:t,session:r}){async function a({highRes:n}){if(r.acquire())try{let i=await e.requestTabCapture(),s=await ze({dataUrl:i,highRes:n}),u=await t.promptFilename();if(!u)return;await e.download(s,u)}finally{r.release()}}return{run:a}}function H(e,t,{id:r,textContent:a,attrs:n,styles:i}={}){let s=e.createElement(t);if(r&&(s.id=r),typeof a=="string"&&(s.textContent=a),n)for(let[u,o]of Object.entries(n))s.setAttribute(u,o);return i&&ye(s,i),s}function ye(e,t){Object.assign(e.style,t)}function A(e){e!=null&&e.parentNode&&e.parentNode.removeChild(e)}function te(e){return new Promise(t=>{window.setTimeout(t,e)})}var Ke={update:null,begin:null,loopBegin:null,changeBegin:null,change:null,changeComplete:null,loopComplete:null,complete:null,loop:1,direction:"normal",autoplay:!0,timelineOffset:0},Se={duration:1e3,delay:0,endDelay:0,easing:"easeOutElastic(1, .5)",round:0},Tt=["translateX","translateY","translateZ","rotate","rotateX","rotateY","rotateZ","scale","scaleX","scaleY","scaleZ","skew","skewX","skewY","perspective","matrix","matrix3d"],re={CSS:{},springs:{}};function R(e,t,r){return Math.min(Math.max(e,t),r)}function Z(e,t){return e.indexOf(t)>-1}function we(e,t){return e.apply(null,t)}var v={arr:function(e){return Array.isArray(e)},obj:function(e){return Z(Object.prototype.toString.call(e),"Object")},pth:function(e){return v.obj(e)&&e.hasOwnProperty("totalLength")},svg:function(e){return e instanceof SVGElement},inp:function(e){return e instanceof HTMLInputElement},dom:function(e){return e.nodeType||v.svg(e)},str:function(e){return typeof e=="string"},fnc:function(e){return typeof e=="function"},und:function(e){return typeof e>"u"},nil:function(e){return v.und(e)||e===null},hex:function(e){return/(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(e)},rgb:function(e){return/^rgb/.test(e)},hsl:function(e){return/^hsl/.test(e)},col:function(e){return v.hex(e)||v.rgb(e)||v.hsl(e)},key:function(e){return!Ke.hasOwnProperty(e)&&!Se.hasOwnProperty(e)&&e!=="targets"&&e!=="keyframes"}};function Qe(e){var t=/\(([^)]+)\)/.exec(e);return t?t[1].split(",").map(function(r){return parseFloat(r)}):[]}function Je(e,t){var r=Qe(e),a=R(v.und(r[0])?1:r[0],.1,100),n=R(v.und(r[1])?100:r[1],.1,100),i=R(v.und(r[2])?10:r[2],.1,100),s=R(v.und(r[3])?0:r[3],.1,100),u=Math.sqrt(n/a),o=i/(2*Math.sqrt(n*a)),l=o<1?u*Math.sqrt(1-o*o):0,c=1,f=o<1?(o*u+-s)/l:-s+u;function g(p){var d=t?t*p/1e3:p;return o<1?d=Math.exp(-d*o*u)*(c*Math.cos(l*d)+f*Math.sin(l*d)):d=(c+f*d)*Math.exp(-d*u),p===0||p===1?p:1-d}function w(){var p=re.springs[e];if(p)return p;for(var d=1/6,x=0,M=0;;)if(x+=d,g(x)===1){if(M++,M>=16)break}else M=0;var I=x*d*1e3;return re.springs[e]=I,I}return t?g:w}function At(e){return e===void 0&&(e=10),function(t){return Math.ceil(R(t,1e-6,1)*e)*(1/e)}}var Pt=(function(){var e=11,t=1/(e-1);function r(c,f){return 1-3*f+3*c}function a(c,f){return 3*f-6*c}function n(c){return 3*c}function i(c,f,g){return((r(f,g)*c+a(f,g))*c+n(f))*c}function s(c,f,g){return 3*r(f,g)*c*c+2*a(f,g)*c+n(f)}function u(c,f,g,w,p){var d,x,M=0;do x=f+(g-f)/2,d=i(x,w,p)-c,d>0?g=x:f=x;while(Math.abs(d)>1e-7&&++M<10);return x}function o(c,f,g,w){for(var p=0;p<4;++p){var d=s(f,g,w);if(d===0)return f;var x=i(f,g,w)-c;f-=x/d}return f}function l(c,f,g,w){if(!(0<=c&&c<=1&&0<=g&&g<=1))return;var p=new Float32Array(e);if(c!==f||g!==w)for(var d=0;d<e;++d)p[d]=i(d*t,c,g);function x(M){for(var I=0,h=1,m=e-1;h!==m&&p[h]<=M;++h)I+=t;--h;var L=(M-p[h])/(p[h+1]-p[h]),E=I+L*t,b=s(E,c,g);return b>=.001?o(M,E,c,g):b===0?E:u(M,I,I+t,c,g)}return function(M){return c===f&&g===w||M===0||M===1?M:i(x(M),f,w)}}return l})(),Xe=(function(){var e={linear:function(){return function(a){return a}}},t={Sine:function(){return function(a){return 1-Math.cos(a*Math.PI/2)}},Expo:function(){return function(a){return a?Math.pow(2,10*a-10):0}},Circ:function(){return function(a){return 1-Math.sqrt(1-a*a)}},Back:function(){return function(a){return a*a*(3*a-2)}},Bounce:function(){return function(a){for(var n,i=4;a<((n=Math.pow(2,--i))-1)/11;);return 1/Math.pow(4,3-i)-7.5625*Math.pow((n*3-2)/22-a,2)}},Elastic:function(a,n){a===void 0&&(a=1),n===void 0&&(n=.5);var i=R(a,1,10),s=R(n,.1,2);return function(u){return u===0||u===1?u:-i*Math.pow(2,10*(u-1))*Math.sin((u-1-s/(Math.PI*2)*Math.asin(1/i))*(Math.PI*2)/s)}}},r=["Quad","Cubic","Quart","Quint"];return r.forEach(function(a,n){t[a]=function(){return function(i){return Math.pow(i,n+2)}}}),Object.keys(t).forEach(function(a){var n=t[a];e["easeIn"+a]=n,e["easeOut"+a]=function(i,s){return function(u){return 1-n(i,s)(1-u)}},e["easeInOut"+a]=function(i,s){return function(u){return u<.5?n(i,s)(u*2)/2:1-n(i,s)(u*-2+2)/2}},e["easeOutIn"+a]=function(i,s){return function(u){return u<.5?(1-n(i,s)(1-u*2))/2:(n(i,s)(u*2-1)+1)/2}}}),e})();function Ce(e,t){if(v.fnc(e))return e;var r=e.split("(")[0],a=Xe[r],n=Qe(e);switch(r){case"spring":return Je(e,t);case"cubicBezier":return we(Pt,n);case"steps":return we(At,n);default:return we(a,n)}}function et(e){try{var t=document.querySelectorAll(e);return t}catch{return}}function ne(e,t){for(var r=e.length,a=arguments.length>=2?arguments[1]:void 0,n=[],i=0;i<r;i++)if(i in e){var s=e[i];t.call(a,s,i,e)&&n.push(s)}return n}function ae(e){return e.reduce(function(t,r){return t.concat(v.arr(r)?ae(r):r)},[])}function qe(e){return v.arr(e)?e:(v.str(e)&&(e=et(e)||e),e instanceof NodeList||e instanceof HTMLCollection?[].slice.call(e):[e])}function Ie(e,t){return e.some(function(r){return r===t})}function ke(e){var t={};for(var r in e)t[r]=e[r];return t}function Ee(e,t){var r=ke(e);for(var a in e)r[a]=t.hasOwnProperty(a)?t[a]:e[a];return r}function oe(e,t){var r=ke(e);for(var a in t)r[a]=v.und(e[a])?t[a]:e[a];return r}function Ot(e){var t=/rgb\((\d+,\s*[\d]+,\s*[\d]+)\)/g.exec(e);return t?"rgba("+t[1]+",1)":e}function Rt(e){var t=/^#?([a-f\d])([a-f\d])([a-f\d])$/i,r=e.replace(t,function(u,o,l,c){return o+o+l+l+c+c}),a=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(r),n=parseInt(a[1],16),i=parseInt(a[2],16),s=parseInt(a[3],16);return"rgba("+n+","+i+","+s+",1)"}function Bt(e){var t=/hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)/g.exec(e)||/hsla\((\d+),\s*([\d.]+)%,\s*([\d.]+)%,\s*([\d.]+)\)/g.exec(e),r=parseInt(t[1],10)/360,a=parseInt(t[2],10)/100,n=parseInt(t[3],10)/100,i=t[4]||1;function s(g,w,p){return p<0&&(p+=1),p>1&&(p-=1),p<1/6?g+(w-g)*6*p:p<1/2?w:p<2/3?g+(w-g)*(2/3-p)*6:g}var u,o,l;if(a==0)u=o=l=n;else{var c=n<.5?n*(1+a):n+a-n*a,f=2*n-c;u=s(f,c,r+1/3),o=s(f,c,r),l=s(f,c,r-1/3)}return"rgba("+u*255+","+o*255+","+l*255+","+i+")"}function Dt(e){if(v.rgb(e))return Ot(e);if(v.hex(e))return Rt(e);if(v.hsl(e))return Bt(e)}function N(e){var t=/[+-]?\d*\.?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?(%|px|pt|em|rem|in|cm|mm|ex|ch|pc|vw|vh|vmin|vmax|deg|rad|turn)?$/.exec(e);if(t)return t[1]}function Nt(e){if(Z(e,"translate")||e==="perspective")return"px";if(Z(e,"rotate")||Z(e,"skew"))return"deg"}function Me(e,t){return v.fnc(e)?e(t.target,t.id,t.total):e}function B(e,t){return e.getAttribute(t)}function Le(e,t,r){var a=N(t);if(Ie([r,"deg","rad","turn"],a))return t;var n=re.CSS[t+r];if(!v.und(n))return n;var i=100,s=document.createElement(e.tagName),u=e.parentNode&&e.parentNode!==document?e.parentNode:document.body;u.appendChild(s),s.style.position="absolute",s.style.width=i+r;var o=i/s.offsetWidth;u.removeChild(s);var l=o*parseFloat(t);return re.CSS[t+r]=l,l}function tt(e,t,r){if(t in e.style){var a=t.replace(/([a-z])([A-Z])/g,"$1-$2").toLowerCase(),n=e.style[t]||getComputedStyle(e).getPropertyValue(a)||"0";return r?Le(e,n,r):n}}function Te(e,t){if(v.dom(e)&&!v.inp(e)&&(!v.nil(B(e,t))||v.svg(e)&&e[t]))return"attribute";if(v.dom(e)&&Ie(Tt,t))return"transform";if(v.dom(e)&&t!=="transform"&&tt(e,t))return"css";if(e[t]!=null)return"object"}function rt(e){if(v.dom(e)){for(var t=e.style.transform||"",r=/(\w+)\(([^)]*)\)/g,a=new Map,n;n=r.exec(t);)a.set(n[1],n[2]);return a}}function Ft(e,t,r,a){var n=Z(t,"scale")?1:0+Nt(t),i=rt(e).get(t)||n;return r&&(r.transforms.list.set(t,i),r.transforms.last=t),a?Le(e,i,a):i}function Ae(e,t,r,a){switch(Te(e,t)){case"transform":return Ft(e,t,a,r);case"css":return tt(e,t,r);case"attribute":return B(e,t);default:return e[t]||0}}function Pe(e,t){var r=/^(\*=|\+=|-=)/.exec(e);if(!r)return e;var a=N(e)||0,n=parseFloat(t),i=parseFloat(e.replace(r[0],""));switch(r[0][0]){case"+":return n+i+a;case"-":return n-i+a;case"*":return n*i+a}}function nt(e,t){if(v.col(e))return Dt(e);if(/\s/g.test(e))return e;var r=N(e),a=r?e.substr(0,e.length-r.length):e;return t?a+t:a}function Oe(e,t){return Math.sqrt(Math.pow(t.x-e.x,2)+Math.pow(t.y-e.y,2))}function $t(e){return Math.PI*2*B(e,"r")}function Ht(e){return B(e,"width")*2+B(e,"height")*2}function Ut(e){return Oe({x:B(e,"x1"),y:B(e,"y1")},{x:B(e,"x2"),y:B(e,"y2")})}function at(e){for(var t=e.points,r=0,a,n=0;n<t.numberOfItems;n++){var i=t.getItem(n);n>0&&(r+=Oe(a,i)),a=i}return r}function Vt(e){var t=e.points;return at(e)+Oe(t.getItem(t.numberOfItems-1),t.getItem(0))}function ot(e){if(e.getTotalLength)return e.getTotalLength();switch(e.tagName.toLowerCase()){case"circle":return $t(e);case"rect":return Ht(e);case"line":return Ut(e);case"polyline":return at(e);case"polygon":return Vt(e)}}function zt(e){var t=ot(e);return e.setAttribute("stroke-dasharray",t),t}function _t(e){for(var t=e.parentNode;v.svg(t)&&v.svg(t.parentNode);)t=t.parentNode;return t}function it(e,t){var r=t||{},a=r.el||_t(e),n=a.getBoundingClientRect(),i=B(a,"viewBox"),s=n.width,u=n.height,o=r.viewBox||(i?i.split(" "):[0,0,s,u]);return{el:a,viewBox:o,x:o[0]/1,y:o[1]/1,w:s,h:u,vW:o[2],vH:o[3]}}function jt(e,t){var r=v.str(e)?et(e)[0]:e,a=t||100;return function(n){return{property:n,el:r,svg:it(r),totalLength:ot(r)*(a/100)}}}function qt(e,t,r){function a(c){c===void 0&&(c=0);var f=t+c>=1?t+c:0;return e.el.getPointAtLength(f)}var n=it(e.el,e.svg),i=a(),s=a(-1),u=a(1),o=r?1:n.w/n.vW,l=r?1:n.h/n.vH;switch(e.property){case"x":return(i.x-n.x)*o;case"y":return(i.y-n.y)*l;case"angle":return Math.atan2(u.y-s.y,u.x-s.x)*180/Math.PI}}function Ge(e,t){var r=/[+-]?\d*\.?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/g,a=nt(v.pth(e)?e.totalLength:e,t)+"";return{original:a,numbers:a.match(r)?a.match(r).map(Number):[0],strings:v.str(e)||t?a.split(r):[]}}function Re(e){var t=e?ae(v.arr(e)?e.map(qe):qe(e)):[];return ne(t,function(r,a,n){return n.indexOf(r)===a})}function st(e){var t=Re(e);return t.map(function(r,a){return{target:r,id:a,total:t.length,transforms:{list:rt(r)}}})}function Gt(e,t){var r=ke(t);if(/^spring/.test(r.easing)&&(r.duration=Je(r.easing)),v.arr(e)){var a=e.length,n=a===2&&!v.obj(e[0]);n?e={value:e}:v.fnc(t.duration)||(r.duration=t.duration/a)}var i=v.arr(e)?e:[e];return i.map(function(s,u){var o=v.obj(s)&&!v.pth(s)?s:{value:s};return v.und(o.delay)&&(o.delay=u?0:t.delay),v.und(o.endDelay)&&(o.endDelay=u===i.length-1?t.endDelay:0),o}).map(function(s){return oe(s,r)})}function Wt(e){for(var t=ne(ae(e.map(function(i){return Object.keys(i)})),function(i){return v.key(i)}).reduce(function(i,s){return i.indexOf(s)<0&&i.push(s),i},[]),r={},a=function(i){var s=t[i];r[s]=e.map(function(u){var o={};for(var l in u)v.key(l)?l==s&&(o.value=u[l]):o[l]=u[l];return o})},n=0;n<t.length;n++)a(n);return r}function Yt(e,t){var r=[],a=t.keyframes;a&&(t=oe(Wt(a),t));for(var n in t)v.key(n)&&r.push({name:n,tweens:Gt(t[n],e)});return r}function Zt(e,t){var r={};for(var a in e){var n=Me(e[a],t);v.arr(n)&&(n=n.map(function(i){return Me(i,t)}),n.length===1&&(n=n[0])),r[a]=n}return r.duration=parseFloat(r.duration),r.delay=parseFloat(r.delay),r}function Kt(e,t){var r;return e.tweens.map(function(a){var n=Zt(a,t),i=n.value,s=v.arr(i)?i[1]:i,u=N(s),o=Ae(t.target,e.name,u,t),l=r?r.to.original:o,c=v.arr(i)?i[0]:l,f=N(c)||N(o),g=u||f;return v.und(s)&&(s=l),n.from=Ge(c,g),n.to=Ge(Pe(s,c),g),n.start=r?r.end:0,n.end=n.start+n.delay+n.duration+n.endDelay,n.easing=Ce(n.easing,n.duration),n.isPath=v.pth(i),n.isPathTargetInsideSVG=n.isPath&&v.svg(t.target),n.isColor=v.col(n.from.original),n.isColor&&(n.round=1),r=n,n})}var ut={css:function(e,t,r){return e.style[t]=r},attribute:function(e,t,r){return e.setAttribute(t,r)},object:function(e,t,r){return e[t]=r},transform:function(e,t,r,a,n){if(a.list.set(t,r),t===a.last||n){var i="";a.list.forEach(function(s,u){i+=u+"("+s+") "}),e.style.transform=i}}};function ct(e,t){var r=st(e);r.forEach(function(a){for(var n in t){var i=Me(t[n],a),s=a.target,u=N(i),o=Ae(s,n,u,a),l=u||N(o),c=Pe(nt(i,l),o),f=Te(s,n);ut[f](s,n,c,a.transforms,!0)}})}function Qt(e,t){var r=Te(e.target,t.name);if(r){var a=Kt(t,e),n=a[a.length-1];return{type:r,property:t.name,animatable:e,tweens:a,duration:n.end,delay:a[0].delay,endDelay:n.endDelay}}}function Jt(e,t){return ne(ae(e.map(function(r){return t.map(function(a){return Qt(r,a)})})),function(r){return!v.und(r)})}function lt(e,t){var r=e.length,a=function(i){return i.timelineOffset?i.timelineOffset:0},n={};return n.duration=r?Math.max.apply(Math,e.map(function(i){return a(i)+i.duration})):t.duration,n.delay=r?Math.min.apply(Math,e.map(function(i){return a(i)+i.delay})):t.delay,n.endDelay=r?n.duration-Math.max.apply(Math,e.map(function(i){return a(i)+i.duration-i.endDelay})):t.endDelay,n}var We=0;function Xt(e){var t=Ee(Ke,e),r=Ee(Se,e),a=Yt(r,e),n=st(e.targets),i=Jt(n,a),s=lt(i,r),u=We;return We++,oe(t,{id:u,children:[],animatables:n,animations:i,duration:s.duration,delay:s.delay,endDelay:s.endDelay})}var O=[],ft=(function(){var e;function t(){!e&&(!Ye()||!k.suspendWhenDocumentHidden)&&O.length>0&&(e=requestAnimationFrame(r))}function r(n){for(var i=O.length,s=0;s<i;){var u=O[s];u.paused?(O.splice(s,1),i--):(u.tick(n),s++)}e=s>0?requestAnimationFrame(r):void 0}function a(){k.suspendWhenDocumentHidden&&(Ye()?e=cancelAnimationFrame(e):(O.forEach(function(n){return n._onDocumentVisibility()}),ft()))}return typeof document<"u"&&document.addEventListener("visibilitychange",a),t})();function Ye(){return!!document&&document.hidden}function k(e){e===void 0&&(e={});var t=0,r=0,a=0,n,i=0,s=null;function u(h){var m=window.Promise&&new Promise(function(L){return s=L});return h.finished=m,m}var o=Xt(e),l=u(o);function c(){var h=o.direction;h!=="alternate"&&(o.direction=h!=="normal"?"normal":"reverse"),o.reversed=!o.reversed,n.forEach(function(m){return m.reversed=o.reversed})}function f(h){return o.reversed?o.duration-h:h}function g(){t=0,r=f(o.currentTime)*(1/k.speed)}function w(h,m){m&&m.seek(h-m.timelineOffset)}function p(h){if(o.reversePlayback)for(var L=i;L--;)w(h,n[L]);else for(var m=0;m<i;m++)w(h,n[m])}function d(h){for(var m=0,L=o.animations,E=L.length;m<E;){var b=L[m],y=b.animatable,C=b.tweens,T=C.length-1,S=C[T];T&&(S=ne(C,function(Lt){return h<Lt.end})[0]||S);for(var K=R(h-S.start-S.delay,0,S.duration)/S.duration,D=isNaN(K)?1:S.easing(K),Q=S.to.strings,de=S.round,pe=[],kt=S.to.numbers.length,_=void 0,q=0;q<kt;q++){var G=void 0,$e=S.to.numbers[q],He=S.from.numbers[q]||0;S.isPath?G=qt(S.value,D*$e,S.isPathTargetInsideSVG):G=He+D*($e-He),de&&(S.isColor&&q>2||(G=Math.round(G*de)/de)),pe.push(G)}var Ue=Q.length;if(!Ue)_=pe[0];else{_=Q[0];for(var W=0;W<Ue;W++){var gr=Q[W],Ve=Q[W+1],ge=pe[W];isNaN(ge)||(Ve?_+=ge+Ve:_+=ge+" ")}}ut[b.type](y.target,b.property,_,y.transforms),b.currentValue=_,m++}}function x(h){o[h]&&!o.passThrough&&o[h](o)}function M(){o.remaining&&o.remaining!==!0&&o.remaining--}function I(h){var m=o.duration,L=o.delay,E=m-o.endDelay,b=f(h);o.progress=R(b/m*100,0,100),o.reversePlayback=b<o.currentTime,n&&p(b),!o.began&&o.currentTime>0&&(o.began=!0,x("begin")),!o.loopBegan&&o.currentTime>0&&(o.loopBegan=!0,x("loopBegin")),b<=L&&o.currentTime!==0&&d(0),(b>=E&&o.currentTime!==m||!m)&&d(m),b>L&&b<E?(o.changeBegan||(o.changeBegan=!0,o.changeCompleted=!1,x("changeBegin")),x("change"),d(b)):o.changeBegan&&(o.changeCompleted=!0,o.changeBegan=!1,x("changeComplete")),o.currentTime=R(b,0,m),o.began&&x("update"),h>=m&&(r=0,M(),o.remaining?(t=a,x("loopComplete"),o.loopBegan=!1,o.direction==="alternate"&&c()):(o.paused=!0,o.completed||(o.completed=!0,x("loopComplete"),x("complete"),!o.passThrough&&"Promise"in window&&(s(),l=u(o)))))}return o.reset=function(){var h=o.direction;o.passThrough=!1,o.currentTime=0,o.progress=0,o.paused=!0,o.began=!1,o.loopBegan=!1,o.changeBegan=!1,o.completed=!1,o.changeCompleted=!1,o.reversePlayback=!1,o.reversed=h==="reverse",o.remaining=o.loop,n=o.children,i=n.length;for(var m=i;m--;)o.children[m].reset();(o.reversed&&o.loop!==!0||h==="alternate"&&o.loop===1)&&o.remaining++,d(o.reversed?o.duration:0)},o._onDocumentVisibility=g,o.set=function(h,m){return ct(h,m),o},o.tick=function(h){a=h,t||(t=a),I((a+(r-t))*k.speed)},o.seek=function(h){I(f(h))},o.pause=function(){o.paused=!0,g()},o.play=function(){o.paused&&(o.completed&&o.reset(),o.paused=!1,O.push(o),g(),ft())},o.reverse=function(){c(),o.completed=!o.reversed,g()},o.restart=function(){o.reset(),o.play()},o.remove=function(h){var m=Re(h);dt(m,o)},o.reset(),o.autoplay&&o.play(),o}function Ze(e,t){for(var r=t.length;r--;)Ie(e,t[r].animatable.target)&&t.splice(r,1)}function dt(e,t){var r=t.animations,a=t.children;Ze(e,r);for(var n=a.length;n--;){var i=a[n],s=i.animations;Ze(e,s),!s.length&&!i.children.length&&a.splice(n,1)}!r.length&&!a.length&&t.pause()}function er(e){for(var t=Re(e),r=O.length;r--;){var a=O[r];dt(t,a)}}function tr(e,t){t===void 0&&(t={});var r=t.direction||"normal",a=t.easing?Ce(t.easing):null,n=t.grid,i=t.axis,s=t.from||0,u=s==="first",o=s==="center",l=s==="last",c=v.arr(e),f=parseFloat(c?e[0]:e),g=c?parseFloat(e[1]):0,w=N(c?e[1]:e)||0,p=t.start||0+(c?f:0),d=[],x=0;return function(M,I,h){if(u&&(s=0),o&&(s=(h-1)/2),l&&(s=h-1),!d.length){for(var m=0;m<h;m++){if(!n)d.push(Math.abs(s-m));else{var L=o?(n[0]-1)/2:s%n[0],E=o?(n[1]-1)/2:Math.floor(s/n[0]),b=m%n[0],y=Math.floor(m/n[0]),C=L-b,T=E-y,S=Math.sqrt(C*C+T*T);i==="x"&&(S=-C),i==="y"&&(S=-T),d.push(S)}x=Math.max.apply(Math,d)}a&&(d=d.map(function(D){return a(D/x)*x})),r==="reverse"&&(d=d.map(function(D){return i?D<0?D*-1:-D:Math.abs(x-D)}))}var K=c?(g-f)/x:f;return p+K*(Math.round(d[I]*100)/100)+w}}function rr(e){e===void 0&&(e={});var t=k(e);return t.duration=0,t.add=function(r,a){var n=O.indexOf(t),i=t.children;n>-1&&O.splice(n,1);function s(g){g.passThrough=!0}for(var u=0;u<i.length;u++)s(i[u]);var o=oe(r,Ee(Se,e));o.targets=o.targets||e.targets;var l=t.duration;o.autoplay=!1,o.direction=t.direction,o.timelineOffset=v.und(a)?l:Pe(a,l),s(t),t.seek(o.timelineOffset);var c=k(o);s(c),i.push(c);var f=lt(i,e);return t.delay=f.delay,t.endDelay=f.endDelay,t.duration=f.duration,t.seek(0),t.reset(),t.autoplay&&t.play(),t},t}k.version="3.2.1";k.speed=1;k.suspendWhenDocumentHidden=!0;k.running=O;k.remove=er;k.get=Ae;k.set=ct;k.convertPx=Le;k.path=jt;k.setDashoffset=zt;k.stagger=tr;k.timeline=rr;k.easing=Ce;k.penner=Xe;k.random=function(e,t){return Math.floor(Math.random()*(t-e+1))+e};var z=k;var pt={dark:{panelBg:"linear-gradient(180deg, #272729, #1d1d1f)",border:"rgba(255, 255, 255, 0.10)",shadow:"0 8px 32px rgba(0, 0, 0, 0.4), 0 2px 8px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.06)",secondaryBg:"rgba(255, 255, 255, 0.08)",secondaryBgHover:"rgba(255, 255, 255, 0.14)",secondaryBorder:"rgba(255, 255, 255, 0.12)",color:"#ffffff"},light:{panelBg:"linear-gradient(180deg, #ffffff, #f5f5f7)",border:"rgba(0, 0, 0, 0.10)",shadow:"0 8px 32px rgba(0, 0, 0, 0.18), 0 2px 8px rgba(0, 0, 0, 0.10), inset 0 1px 0 rgba(255, 255, 255, 0.9)",secondaryBg:"rgba(0, 0, 0, 0.04)",secondaryBgHover:"rgba(0, 0, 0, 0.08)",secondaryBorder:"rgba(0, 0, 0, 0.10)",color:"#1d1d1f"}};function gt(e){var t;return(t=e.matchMedia)!=null&&t.call(e,"(prefers-color-scheme: dark)").matches?"dark":"light"}function vt(e){return H(e,"div",{id:P.HIGHLIGHT,styles:{position:"fixed",pointerEvents:"none",zIndex:$.OVERLAY,display:"none",background:"rgba(0, 113, 227, 0.12)",border:"2px solid rgba(0, 113, 227, 0.75)",borderRadius:"3px",transition:"top 0.05s, left 0.05s, width 0.05s, height 0.05s"}})}function se(e,t){if(!e)return;if(!t){e.style.display="none";return}let r=t.getBoundingClientRect(),a=e.style.display==="none";e.style.display="block",e.style.left=`${r.left}px`,e.style.top=`${r.top}px`,e.style.width=`${r.width}px`,e.style.height=`${r.height}px`,a&&z({targets:e,opacity:[0,1],scale:[.94,1],duration:200,easing:"easeOutCubic"})}function ht({doc:e,rect:t,win:r=window,onRetake:a,onSave:n}){let i=H(e,"div",{id:P.CONFIRM,styles:{position:"fixed",inset:"0",zIndex:$.OVERLAY}}),s=e.createElementNS("http://www.w3.org/2000/svg","svg");s.setAttribute("width","100%"),s.setAttribute("height","100%"),ye(s,{position:"absolute",inset:"0",width:"100%",height:"100%"});let u=e.createElementNS("http://www.w3.org/2000/svg","defs"),o=e.createElementNS("http://www.w3.org/2000/svg","mask"),l=`element-mask-${Date.now()}`;o.setAttribute("id",l);let c=e.createElementNS("http://www.w3.org/2000/svg","rect");c.setAttribute("width","100%"),c.setAttribute("height","100%"),c.setAttribute("fill","white");let f=e.createElementNS("http://www.w3.org/2000/svg","rect");f.setAttribute("x",`${t.left}`),f.setAttribute("y",`${t.top}`),f.setAttribute("width",`${t.width}`),f.setAttribute("height",`${t.height}`),f.setAttribute("fill","black"),o.append(c,f),u.appendChild(o),s.appendChild(u);let g=e.createElementNS("http://www.w3.org/2000/svg","rect");g.setAttribute("width","100%"),g.setAttribute("height","100%"),g.setAttribute("fill","rgba(0, 0, 0, 0.5)"),g.setAttribute("mask",`url(#${l})`),s.appendChild(g);let w=pt[gt(r)],p=nr({doc:e,rect:t,win:r,tokens:w,onRetake:a,onSave:n});return i.append(s,p),i}function mt(e){return H(e,"div",{id:P.REGION_OVERLAY,styles:{position:"fixed",inset:"0",zIndex:$.OVERLAY,cursor:"crosshair",background:"rgba(0, 0, 0, 0.18)",userSelect:"none"}})}function bt(e){return H(e,"div",{id:P.REGION_SELECTION,styles:{position:"fixed",display:"none",border:"2px solid rgba(0, 113, 227, 0.9)",background:"rgba(0, 113, 227, 0.12)",boxSizing:"border-box",pointerEvents:"none"}})}function Be(e,t){!e||!t||(e.style.display="block",e.style.left=`${t.left}px`,e.style.top=`${t.top}px`,e.style.width=`${t.width}px`,e.style.height=`${t.height}px`)}function De(e){e&&(e.style.display="none")}function xt({doc:e,rect:t,win:r,onRetake:a,onSave:n}){let i=pt[gt(r)],s=H(e,"div",{id:P.REGION_ACTIONS,styles:yt(t,r,i)}),u=ie(e,{label:"Retake",variant:"secondary",tokens:i}),o=ie(e,{label:"Save",variant:"primary",tokens:i});return s.addEventListener("mousedown",l=>{l.stopPropagation()}),u.addEventListener("click",a),o.addEventListener("click",n),s.append(u,o),r.requestAnimationFrame(()=>{z({targets:s,opacity:[0,1],translateY:[10,0],easing:"spring(1, 80, 10, 0)"})}),s}function ue(e){return e?!!e.closest([`#${P.HIGHLIGHT}`,`#${P.CONFIRM}`,`#${P.FILENAME_PROMPT}`].join(", ")):!1}function j(e){return!!e.getElementById(P.FILENAME_PROMPT)}function ie(e,{label:t,variant:r="secondary",tokens:a}){let n=r==="primary",i=n?"#0071e3":a.secondaryBg,s=n?"#0077ed":a.secondaryBgHover,u=H(e,"button",{textContent:t,styles:{padding:"7px 14px",border:"1px solid",borderColor:n?"transparent":a.secondaryBorder,borderRadius:"8px",background:i,color:n?"#ffffff":a.color,cursor:"pointer",fontSize:"13px",fontWeight:"500",fontFamily:"Inter, -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",letterSpacing:"-0.08px",lineHeight:"1",whiteSpace:"nowrap",boxShadow:n?"inset 0 1px 0 rgba(255, 255, 255, 0.12)":"none"}});return u.addEventListener("mouseenter",()=>{u.style.background=s}),u.addEventListener("mouseleave",()=>{u.style.background=i}),u}function nr({doc:e,rect:t,win:r,tokens:a,onRetake:n,onSave:i}){let s=H(e,"div",{styles:yt(t,r,a)}),u=ie(e,{label:"Retake",variant:"secondary",tokens:a}),o=ie(e,{label:"Save",variant:"primary",tokens:a});return u.addEventListener("click",n),o.addEventListener("click",i),s.append(u,o),r.requestAnimationFrame(()=>{z({targets:s,opacity:[0,1],translateY:[10,0],easing:"spring(1, 80, 10, 0)"})}),s}function ce(e){e.body.style.overflow="hidden"}function U(e){e.body.style.overflow=""}function yt(e,t,r){let n=Math.min(Math.max(e.right-184,8),t.innerWidth-184-8),i=Math.min(Math.max(e.bottom+8,8),t.innerHeight-56);return{position:"fixed",zIndex:$.DIALOG,display:"flex",gap:"6px",padding:"6px",left:`${n}px`,top:`${i}px`,opacity:"0",borderRadius:"12px",background:r.panelBg,border:`1px solid ${r.border}`,boxShadow:r.shadow,backdropFilter:"blur(20px) saturate(1.4)",WebkitBackdropFilter:"blur(20px) saturate(1.4)"}}function Ne({captureClient:e,promptService:t,doc:r,win:a,session:n}){async function i({highRes:s}){if(!n.acquire())return;let u=ar({captureClient:e,promptService:t,doc:r,win:a,highRes:s});try{await u.start()}finally{u.cleanup(),n.release()}}return{run:i}}function ar({captureClient:e,promptService:t,doc:r,win:a,highRes:n}){let i=null,s=null,u=null,o=null,l=!1,c=[];async function f(){return u=vt(r),r.body.appendChild(u),E(r,"keydown",I,!0),w(),new Promise(y=>{c.push(y)})}function g(){for(p(),U(r),A(o),A(u),o=null,u=null,s=null,i=null;c.length>0;){let y=c.pop();if(typeof y=="function")try{y()}catch{}}}function w(){l||(l=!0,E(r,"mousemove",x,!0),E(r,"mousedown",M,!0))}function p(){l&&(l=!1,b(r,"mousemove",x,!0),b(r,"mousedown",M,!0))}function d(){let y=c.findLast(C=>typeof C=="function");g(),y&&y()}function x(y){let C=or(y.target);i=C,se(u,C)}function M(y){i&&(j(r)||(y.preventDefault(),y.stopPropagation(),s=i,p(),se(u,s),h()))}function I(y){j(r)||y.key==="Escape"&&(y.preventDefault(),d())}function h(){A(o);let y=s.getBoundingClientRect();o=ht({doc:r,rect:y,onRetake:m,onSave:L}),r.body.appendChild(o),ce(r)}function m(y){y.stopPropagation(),s=null,U(r),A(o),o=null,se(u,null),w()}async function L(y){y.stopPropagation();let C=await t.promptFilename();if(!C)return;let T=s;if(!T){d();return}U(r),A(o),A(u),o=null,u=null,await te(50);let S=await je({captureClient:e,element:T,highRes:n,win:a});await e.download(S,C),d()}function E(y,C,T,S){y.addEventListener(C,T,S),c.push(()=>{y.removeEventListener(C,T,S)})}function b(y,C,T,S){y.removeEventListener(C,T,S)}return{start:f,cleanup:g}}function or(e){return!(e instanceof Element)||ue(e)?null:e}function wt(e){let r=((e||"").trim()||"screenshot").replace(/[<>:"/\\|?*\u0000-\u001F]/g,"-").replace(/\.+$/g,"").slice(0,200);return r.endsWith(".png")?r:`${r}.png`}function le(e){return{x:e.clientX,y:e.clientY}}function fe(e,t,r){let a=Math.min(Math.max(Math.min(e.x,t.x),0),r.innerWidth),n=Math.min(Math.max(Math.min(e.y,t.y),0),r.innerHeight),i=Math.min(Math.max(Math.max(e.x,t.x),0),r.innerWidth),s=Math.min(Math.max(Math.max(e.y,t.y),0),r.innerHeight);return{left:a,top:n,right:i,bottom:s,width:Math.max(0,i-a),height:Math.max(0,s-n)}}function Et(e,t=8){return e&&e.width>=t&&e.height>=t}function Fe({captureClient:e,promptService:t,doc:r,win:a,session:n}){async function i({highRes:s}){if(!n.acquire())return;let u=ir({captureClient:e,promptService:t,doc:r,win:a,highRes:s});try{await u.start()}finally{u.cleanup(),n.release()}}return{run:i}}function ir({captureClient:e,promptService:t,doc:r,win:a,highRes:n}){let i=null,s=null,u=null,o=null,l=null,c="idle",f=null,g=!1;async function w(){return i=mt(r),s=bt(r),i.appendChild(s),r.body.appendChild(i),i.addEventListener("mousedown",x,!0),i.addEventListener("mousemove",M,!0),i.addEventListener("mouseup",I,!0),r.addEventListener("keydown",h,!0),new Promise(b=>{f=b})}function p(){i&&(i.removeEventListener("mousedown",x,!0),i.removeEventListener("mousemove",M,!0),i.removeEventListener("mouseup",I,!0)),r.removeEventListener("keydown",h,!0),U(r),A(u),A(i),u=null,i=null,s=null,o=null,l=null,c="idle"}function d(){g||(g=!0,p(),f==null||f())}function x(b){c!=="confirming"&&b.button===0&&(j(r)||ue(b.target)||(b.preventDefault(),b.stopPropagation(),c="dragging",o=le(b),l=fe(o,o,a),A(u),u=null,Be(s,l)))}function M(b){c!=="dragging"||!o||(b.preventDefault(),l=fe(o,le(b),a),Be(s,l))}function I(b){if(!(c!=="dragging"||!o)){if(b.preventDefault(),b.stopPropagation(),l=fe(o,le(b),a),o=null,!Et(l)){l=null,c="idle",De(s);return}c="confirming",m()}}function h(b){j(r)||b.key==="Escape"&&(b.preventDefault(),d())}function m(){ce(r),A(u),u=xt({doc:r,rect:l,win:a,onRetake:L,onSave:E}),i.appendChild(u)}function L(b){b.stopPropagation(),c="idle",l=null,U(r),A(u),u=null,De(s)}async function E(b){b.stopPropagation();let y=await t.promptFilename();if(!y)return;let C=l;if(!C){d();return}U(r),A(u),A(i),u=null,i=null,s=null,r.removeEventListener("keydown",h,!0),await te(50);let T=await _e({captureClient:e,rect:C,highRes:n,win:a});await e.download(T,y),d()}return{start:w,cleanup:p}}function Mt(){let e=new Map;function t(n,i){e.set(n,i)}function r(n){e.delete(n)}function a(n){return e.get(n)}return{register:t,unregister:r,get:a}}function St(){let e=!1;function t(){return e?!1:(e=!0,!0)}function r(){e=!1}return{acquire:t,release:r,isActive:()=>e}}var sr={dark:{bg:"#000000",panel:"#1d1d1f",panelElevated:"#272729",text:"#f5f5f7",muted:"#86868b",border:"#3a3a3c",borderStrong:"#48484a",button:"#2c2c2e",buttonHover:"#3a3a3c",buttonActive:"#0071e3",buttonActiveText:"#ffffff",input:"#1d1d1f",ring:"rgba(0, 113, 227, 0.35)",shadow:"0 24px 80px rgba(0, 0, 0, 0.56)",backdrop:"rgba(0, 0, 0, 0.64)",accentSoft:"rgba(0, 113, 227, 0.08)",accentStrong:"rgba(0, 113, 227, 0.18)"},light:{bg:"#f5f5f7",panel:"#ffffff",panelElevated:"#ffffff",text:"#1d1d1f",muted:"#6e6e73",border:"#d2d2d7",borderStrong:"#c7c7cc",button:"#ffffff",buttonHover:"#f5f5f7",buttonActive:"#0071e3",buttonActiveText:"#ffffff",input:"#f5f5f7",ring:"rgba(0, 113, 227, 0.25)",shadow:"0 24px 80px rgba(0, 0, 0, 0.18)",backdrop:"rgba(0, 0, 0, 0.28)",accentSoft:"rgba(0, 113, 227, 0.06)",accentStrong:"rgba(0, 113, 227, 0.14)"}};function Ct({doc:e,win:t=window,storage:r=(a=>(a=chrome.storage)==null?void 0:a.sync)()}){async function n(){var u;let s=await ur(r);return s===!0?"dark":s===!1?"light":(u=t.matchMedia)!=null&&u.call(t,"(prefers-color-scheme: dark)").matches?"dark":"light"}function i(s="screenshot"){return n().then(u=>new Promise(o=>{let l=e.createElement("div");l.id=P.FILENAME_PROMPT,cr(l,{position:"fixed",inset:"0",zIndex:$.DIALOG});let c=l.attachShadow({mode:"open"}),f=sr[u];c.innerHTML=fr(f);let g=c.querySelector(".snap-root"),w=c.querySelector(".snap-backdrop"),p=c.querySelector(".snap-dialog"),d=c.querySelector(".snap-input"),x=c.querySelector(".snap-shell"),M=c.querySelector('[data-action="cancel"]');d.value=s,d.placeholder=s;function I(E){c.removeEventListener("keydown",L),c.removeEventListener("keypress",m),c.removeEventListener("keyup",m),g.classList.remove("is-open"),z({targets:x,opacity:0,translateY:8,scale:.97,duration:180,easing:"easeInCubic",complete(){lr(l),o(E)}})}function h(){I(wt(d.value))}function m(E){E.stopPropagation()}function L(E){if(E.stopPropagation(),E.key==="Escape"){E.preventDefault(),I(null);return}E.key==="Enter"&&(c.activeElement||e.activeElement)===d&&(E.preventDefault(),h())}w.addEventListener("click",()=>I(null)),M.addEventListener("click",()=>I(null)),p.addEventListener("submit",E=>{E.preventDefault(),h()}),c.addEventListener("keydown",L),c.addEventListener("keypress",m),c.addEventListener("keyup",m),e.body.appendChild(l),t.requestAnimationFrame(()=>{g.classList.add("is-open"),d.focus(),d.select(),z({targets:x,opacity:[0,1],translateY:[12,0],scale:[.97,1],easing:"spring(1, 100, 12, 0)"})})}))}return{promptFilename:i}}function ur(e){return new Promise(t=>{if(!(e!=null&&e.get)){t(null);return}try{e.get("theme",r=>{var a;if((a=chrome.runtime)!=null&&a.lastError){t(null);return}t(typeof(r==null?void 0:r.theme)=="boolean"?r.theme:null)})}catch{t(null)}})}function cr(e,t){Object.assign(e.style,t)}function lr(e){e!=null&&e.parentNode&&e.parentNode.removeChild(e)}function fr(e){return`
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
				z-index: ${$.DIALOG};
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
								<div class="snap-suffix">.png</div>
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
	`}function dr({runtime:e,doc:t,win:r,logger:a=ve()}={}){let n=Mt(),i=St(),s=he({runtime:e,win:r}),u=Ct({doc:t});function o(){e.onMessage.addListener(g)}function l(p,d){n.register(p,d)}function c(p){n.unregister(p)}function f(p){return p&&typeof p=="object"&&p.action===F.CAPTURE&&typeof p.mode=="string"}function g(p){if(!f(p))return;let d=n.get(p.mode);if(!d){a.warn(`[snap] unsupported capture mode: ${String(p.mode)}`);return}w(d,{highRes:!!p.hiRes})}async function w(p,d){try{await p.run(d)}catch(x){a.error("[snap] capture failed",x)}}return{init:o,registerMode:l,unregisterMode:c,captureClient:s,promptService:u,session:i}}function pr(e){e.registerMode(J.VISIBLE,xe({captureClient:e.captureClient,promptService:e.promptService,session:e.session})),e.registerMode(J.ELEMENT,Ne({captureClient:e.captureClient,promptService:e.promptService,doc:document,win:window,session:e.session})),e.registerMode(J.REGION,Fe({captureClient:e.captureClient,promptService:e.promptService,doc:document,win:window,session:e.session}))}function It({runtime:e=chrome.runtime,doc:t=document,win:r=window,logger:a=ve()}={}){if(r.__snapInjected)return a.debug("[snap] already injected; skipping"),null;r.__snapInjected=!0;let n=dr({runtime:e,doc:t,win:r,logger:a});return pr(n),n.init(),n}It();})();
