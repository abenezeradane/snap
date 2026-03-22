(()=>{var I=Object.freeze({CAPTURE:"capture",CAPTURE_TAB:"captureTab",DOWNLOAD:"download"}),B=Object.freeze({VISIBLE:"visible",ELEMENT:"element",REGION:"region"}),v=Object.freeze({HIGHLIGHT:"screenshot-element-highlight",CONFIRM:"screenshot-element-confirm",FILENAME_PROMPT:"screenshot-filename-prompt",REGION_OVERLAY:"screenshot-region-overlay",REGION_SELECTION:"screenshot-region-selection",REGION_ACTIONS:"screenshot-region-actions"}),R=Object.freeze({OVERLAY:"2147483646",DIALOG:"2147483647"});function Y(e="[snap]"){let n=(t,...i)=>{console[t](e,...i)};return{debug:(...t)=>n("debug",...t),info:(...t)=>n("info",...t),warn:(...t)=>n("warn",...t),error:(...t)=>n("error",...t)}}var D=class extends Error{constructor(n){super(n),this.name="CaptureError"}},U=class extends D{constructor(n){super("image load failed"),this.name="ImageLoadError",this.cause=n}},_=class extends D{constructor(n="2D canvas context is unavailable"){super(n),this.name="CanvasError"}},O=class extends D{constructor(n,t){super(`${n}: ${t}`),this.name="RuntimeError",this.action=n}};function W({runtime:e,win:n}){async function t(){let r=await a(e,{action:I.CAPTURE_TAB});if(!(r!=null&&r.ok))throw new O(I.CAPTURE_TAB,(r==null?void 0:r.error)||"capture tab failed");if(!r.dataUrl)throw new O(I.CAPTURE_TAB,"missing data URL");return r.dataUrl}async function i(r,s){let o=await a(e,{action:I.DOWNLOAD,dataUrl:r,filename:s});if(!(o!=null&&o.ok))throw new O(I.DOWNLOAD,(o==null?void 0:o.error)||"download failed");return o.downloadId}function a(r,s){return new Promise((o,c)=>{r.sendMessage(s,p=>{let l=chrome.runtime.lastError;if(l){c(new O(s.action,l.message));return}o(p)})})}return{requestTabCapture:t,download:i,devicePixelRatio:()=>n.devicePixelRatio||1}}function X(e){return new Promise((n,t)=>{let i=new Image;i.onload=()=>n(i),i.onerror=()=>t(new U),i.src=e})}function Z(e){let n=e.getContext("2d");if(!n)throw new _;return n}function re({dataUrl:e,highRes:n}){return X(e).then(t=>{let i=n?1:1/(window.devicePixelRatio||1),a=document.createElement("canvas"),r=Z(a);return a.width=Math.max(1,Math.round(t.width*i)),a.height=Math.max(1,Math.round(t.height*i)),r.drawImage(t,0,0,a.width,a.height),a.toDataURL("image/png")})}function oe({captureClient:e,rect:n,highRes:t,win:i}){return e.requestTabCapture().then(X).then(a=>{let r=a.width/i.innerWidth,s=a.height/i.innerHeight,o=t?r:1,c=document.createElement("canvas"),p=Z(c);return c.width=Math.max(1,Math.round(n.width*o)),c.height=Math.max(1,Math.round(n.height*o)),p.drawImage(a,n.left*r,n.top*s,n.width*r,n.height*s,0,0,c.width,c.height),c.toDataURL("image/png")})}function ae({captureClient:e,element:n,highRes:t,win:i}){let a=n.getBoundingClientRect();return e.requestTabCapture().then(X).then(r=>{let s=r.width/i.innerWidth,o=r.height/i.innerHeight,c=t?s:1,p=document.createElement("canvas"),l=Z(p);return p.width=Math.max(1,Math.round(a.width*c)),p.height=Math.max(1,Math.round(a.height*c)),l.drawImage(r,a.left*s,a.top*o,a.width*s,a.height*o,0,0,p.width,p.height),p.toDataURL("image/png")})}function K({captureClient:e,promptService:n,session:t}){async function i({highRes:a}){if(t.acquire())try{let r=await e.requestTabCapture(),s=await re({dataUrl:r,highRes:a}),o=await n.promptFilename();if(!o)return;await e.download(s,o)}finally{t.release()}}return{run:i}}function k(e,n,{id:t,textContent:i,attrs:a,styles:r}={}){let s=e.createElement(n);if(t&&(s.id=t),typeof i=="string"&&(s.textContent=i),a)for(let[o,c]of Object.entries(a))s.setAttribute(o,c);return r&&J(s,r),s}function J(e,n){Object.assign(e.style,n)}function x(e){e!=null&&e.parentNode&&e.parentNode.removeChild(e)}function H(e){return new Promise(n=>{window.setTimeout(n,e)})}function ie(e){return k(e,"div",{id:v.HIGHLIGHT,styles:{position:"fixed",pointerEvents:"none",zIndex:R.OVERLAY,display:"none",background:"rgba(255, 105, 180, 0.25)",border:"2px solid rgba(255, 105, 180, 0.7)",transition:"top 0.05s, left 0.05s, width 0.05s, height 0.05s"}})}function G(e,n){if(!e)return;if(!n){e.style.display="none";return}let t=n.getBoundingClientRect();e.style.display="block",e.style.left=`${t.left}px`,e.style.top=`${t.top}px`,e.style.width=`${t.width}px`,e.style.height=`${t.height}px`}function se({doc:e,rect:n,onRetake:t,onSave:i}){let a=k(e,"div",{id:v.CONFIRM,styles:{position:"fixed",inset:"0",zIndex:R.OVERLAY}}),r=e.createElementNS("http://www.w3.org/2000/svg","svg");r.setAttribute("width","100%"),r.setAttribute("height","100%"),J(r,{position:"absolute",inset:"0",width:"100%",height:"100%"});let s=e.createElementNS("http://www.w3.org/2000/svg","defs"),o=e.createElementNS("http://www.w3.org/2000/svg","mask"),c=`element-mask-${Date.now()}`;o.setAttribute("id",c);let p=e.createElementNS("http://www.w3.org/2000/svg","rect");p.setAttribute("width","100%"),p.setAttribute("height","100%"),p.setAttribute("fill","white");let l=e.createElementNS("http://www.w3.org/2000/svg","rect");l.setAttribute("x",`${n.left}`),l.setAttribute("y",`${n.top}`),l.setAttribute("width",`${n.width}`),l.setAttribute("height",`${n.height}`),l.setAttribute("fill","black"),o.append(p,l),s.appendChild(o),r.appendChild(s);let g=e.createElementNS("http://www.w3.org/2000/svg","rect");g.setAttribute("width","100%"),g.setAttribute("height","100%"),g.setAttribute("fill","rgba(0, 0, 0, 0.5)"),g.setAttribute("mask",`url(#${c})`),r.appendChild(g);let w=xe({doc:e,rect:n,win:window,onRetake:t,onSave:i});return a.append(r,w),a}function ce(e){return k(e,"div",{id:v.REGION_OVERLAY,styles:{position:"fixed",inset:"0",zIndex:R.OVERLAY,cursor:"crosshair",background:"rgba(0, 0, 0, 0.18)",userSelect:"none"}})}function le(e){return k(e,"div",{id:v.REGION_SELECTION,styles:{position:"fixed",display:"none",border:"2px solid rgba(74, 144, 217, 0.95)",background:"rgba(74, 144, 217, 0.18)",boxSizing:"border-box",pointerEvents:"none"}})}function Q(e,n){!e||!n||(e.style.display="block",e.style.left=`${n.left}px`,e.style.top=`${n.top}px`,e.style.width=`${n.width}px`,e.style.height=`${n.height}px`)}function ee(e){e&&(e.style.display="none")}function pe({doc:e,rect:n,win:t,onRetake:i,onSave:a}){let r=k(e,"div",{id:v.REGION_ACTIONS,styles:ue(n,t)}),s=z(e,{label:"Retake",background:"#666",color:"#fff"}),o=z(e,{label:"Save",background:"#4a90d9",color:"#fff"});return r.addEventListener("mousedown",c=>{c.stopPropagation()}),s.addEventListener("click",i),o.addEventListener("click",a),r.append(s,o),r}function F(e){return e?!!e.closest([`#${v.HIGHLIGHT}`,`#${v.CONFIRM}`,`#${v.FILENAME_PROMPT}`].join(", ")):!1}function $(e){return!!e.getElementById(v.FILENAME_PROMPT)}function z(e,{label:n,background:t,color:i}){return k(e,"button",{textContent:n,styles:{padding:"6px 16px",border:"none",borderRadius:"4px",background:t,color:i,cursor:"pointer",fontSize:"13px",fontFamily:"system-ui, sans-serif"}})}function xe({doc:e,rect:n,win:t,onRetake:i,onSave:a}){let r=k(e,"div",{styles:ue(n,t)}),s=z(e,{label:"Retake",background:"#666",color:"#fff"}),o=z(e,{label:"Save",background:"#4a90d9",color:"#fff"});return s.addEventListener("click",i),o.addEventListener("click",a),r.append(s,o),r}function q(e){e.body.style.overflow="hidden"}function L(e){e.body.style.overflow=""}function ue(e,n){let i=Math.min(Math.max(e.right-160,8),n.innerWidth-160-8),a=Math.min(Math.max(e.bottom+8,8),n.innerHeight-44);return{position:"fixed",zIndex:R.DIALOG,display:"flex",gap:"8px",padding:"4px",left:`${i}px`,top:`${a}px`}}function te({captureClient:e,promptService:n,doc:t,win:i,session:a}){async function r({highRes:s}){if(!a.acquire())return;let o=ve({captureClient:e,promptService:n,doc:t,win:i,highRes:s});try{await o.start()}finally{o.cleanup(),a.release()}}return{run:r}}function ve({captureClient:e,promptService:n,doc:t,win:i,highRes:a}){let r=null,s=null,o=null,c=null,p=!1,l=[];async function g(){return o=ie(t),t.body.appendChild(o),P(t,"keydown",A,!0),M(),new Promise(u=>{l.push(u)})}function w(){for(f(),L(t),x(c),x(o),c=null,o=null,s=null,r=null;l.length>0;){let u=l.pop();if(typeof u=="function")try{u()}catch{}}}function M(){p||(p=!0,P(t,"mousemove",C,!0),P(t,"mousedown",y,!0))}function f(){p&&(p=!1,d(t,"mousemove",C,!0),d(t,"mousedown",y,!0))}function m(){let u=l.findLast(b=>typeof b=="function");w(),u&&u()}function C(u){let b=we(u.target);r=b,G(o,b)}function y(u){r&&($(t)||(u.preventDefault(),u.stopPropagation(),s=r,f(),G(o,s),E()))}function A(u){$(t)||u.key==="Escape"&&(u.preventDefault(),m())}function E(){x(c);let u=s.getBoundingClientRect();c=se({doc:t,rect:u,onRetake:N,onSave:h}),t.body.appendChild(c),q(t)}function N(u){u.stopPropagation(),s=null,L(t),x(c),c=null,G(o,null),M()}async function h(u){u.stopPropagation();let b=await n.promptFilename();if(!b)return;let S=s;if(!S){m();return}L(t),x(c),x(o),c=null,o=null,await H(50);let T=await ae({captureClient:e,element:S,highRes:a,win:i});await e.download(T,b),m()}function P(u,b,S,T){u.addEventListener(b,S,T),l.push(()=>{u.removeEventListener(b,S,T)})}function d(u,b,S,T){u.removeEventListener(b,S,T)}return{start:g,cleanup:w}}function we(e){return!(e instanceof Element)||F(e)?null:e}function de(e){let t=((e||"").trim()||"screenshot").replace(/[<>:"/\\|?*\u0000-\u001F]/g,"-").replace(/\.+$/g,"").slice(0,200);return t.endsWith(".png")?t:`${t}.png`}function j(e){return{x:e.clientX,y:e.clientY}}function V(e,n,t){let i=Math.min(Math.max(Math.min(e.x,n.x),0),t.innerWidth),a=Math.min(Math.max(Math.min(e.y,n.y),0),t.innerHeight),r=Math.min(Math.max(Math.max(e.x,n.x),0),t.innerWidth),s=Math.min(Math.max(Math.max(e.y,n.y),0),t.innerHeight);return{left:i,top:a,right:r,bottom:s,width:Math.max(0,r-i),height:Math.max(0,s-a)}}function fe(e,n=8){return e&&e.width>=n&&e.height>=n}function ne({captureClient:e,promptService:n,doc:t,win:i,session:a}){async function r({highRes:s}){if(!a.acquire())return;let o=ye({captureClient:e,promptService:n,doc:t,win:i,highRes:s});try{await o.start()}finally{o.cleanup(),a.release()}}return{run:r}}function ye({captureClient:e,promptService:n,doc:t,win:i,highRes:a}){let r=null,s=null,o=null,c=null,p=null,l="idle",g=null,w=!1;async function M(){return r=ce(t),s=le(t),r.appendChild(s),t.body.appendChild(r),r.addEventListener("mousedown",C,!0),r.addEventListener("mousemove",y,!0),r.addEventListener("mouseup",A,!0),t.addEventListener("keydown",E,!0),new Promise(d=>{g=d})}function f(){r&&(r.removeEventListener("mousedown",C,!0),r.removeEventListener("mousemove",y,!0),r.removeEventListener("mouseup",A,!0)),t.removeEventListener("keydown",E,!0),L(t),x(o),x(r),o=null,r=null,s=null,c=null,p=null,l="idle"}function m(){w||(w=!0,f(),g==null||g())}function C(d){l!=="confirming"&&d.button===0&&($(t)||F(d.target)||(d.preventDefault(),d.stopPropagation(),l="dragging",c=j(d),p=V(c,c,i),x(o),o=null,Q(s,p)))}function y(d){l!=="dragging"||!c||(d.preventDefault(),p=V(c,j(d),i),Q(s,p))}function A(d){if(!(l!=="dragging"||!c)){if(d.preventDefault(),d.stopPropagation(),p=V(c,j(d),i),c=null,!fe(p)){p=null,l="idle",ee(s);return}l="confirming",N()}}function E(d){$(t)||d.key==="Escape"&&(d.preventDefault(),m())}function N(){q(t),x(o),o=pe({doc:t,rect:p,win:i,onRetake:h,onSave:P}),r.appendChild(o)}function h(d){d.stopPropagation(),l="idle",p=null,L(t),x(o),o=null,ee(s)}async function P(d){d.stopPropagation();let u=await n.promptFilename();if(!u)return;let b=p;if(!b){m();return}L(t),x(o),x(r),o=null,r=null,s=null,t.removeEventListener("keydown",E,!0),await H(50);let S=await oe({captureClient:e,rect:b,highRes:a,win:i});await e.download(S,u),m()}return{start:M,cleanup:f}}function me(){let e=new Map;function n(a,r){e.set(a,r)}function t(a){e.delete(a)}function i(a){return e.get(a)}return{register:n,unregister:t,get:i}}function ge(){let e=!1;function n(){return e?!1:(e=!0,!0)}function t(){e=!1}return{acquire:n,release:t,isActive:()=>e}}var Ee={dark:{bg:"#101114",panel:"#17181c",panelElevated:"#1b1d22",text:"#f3f3f1",muted:"#9a9a95",border:"#2a2c31",borderStrong:"#3a3d45",button:"#1b1d22",buttonHover:"#20232a",buttonActive:"#f3f3f1",buttonActiveText:"#111214",input:"#14161a",ring:"rgba(243, 243, 241, 0.08)",shadow:"0 24px 80px rgba(0, 0, 0, 0.45)",backdrop:"rgba(7, 8, 10, 0.56)",accentSoft:"rgba(243, 243, 241, 0.06)",accentStrong:"rgba(243, 243, 241, 0.12)"},light:{bg:"#f6f6f4",panel:"#ffffff",panelElevated:"#ffffff",text:"#171717",muted:"#8a8a86",border:"#ddddda",borderStrong:"#cfcfca",button:"#ffffff",buttonHover:"#fafaf8",buttonActive:"#111214",buttonActiveText:"#ffffff",input:"#fcfcfb",ring:"rgba(17, 18, 20, 0.08)",shadow:"0 24px 80px rgba(0, 0, 0, 0.18)",backdrop:"rgba(15, 17, 20, 0.26)",accentSoft:"rgba(17, 18, 20, 0.05)",accentStrong:"rgba(17, 18, 20, 0.08)"}};function he({doc:e,win:n=window,storage:t=(i=>(i=chrome.storage)==null?void 0:i.sync)()}){async function a(){var o;let s=await Ce(t);return s===!0?"dark":s===!1?"light":(o=n.matchMedia)!=null&&o.call(n,"(prefers-color-scheme: dark)").matches?"dark":"light"}function r(s="screenshot"){return a().then(o=>new Promise(c=>{let p=e.createElement("div");p.id=v.FILENAME_PROMPT,Se(p,{position:"fixed",inset:"0",zIndex:R.DIALOG});let l=p.attachShadow({mode:"open"}),g=Ee[o];l.innerHTML=Ie(g);let w=l.querySelector(".snap-root"),M=l.querySelector(".snap-backdrop"),f=l.querySelector(".snap-dialog"),m=l.querySelector(".snap-input"),C=l.querySelector('[data-action="cancel"]');m.value=s,m.placeholder=s;function y(h){l.removeEventListener("keydown",N),l.removeEventListener("keypress",E),l.removeEventListener("keyup",E),Me(p),c(h)}function A(){y(de(m.value))}function E(h){h.stopPropagation()}function N(h){if(h.stopPropagation(),h.key==="Escape"){h.preventDefault(),y(null);return}h.key==="Enter"&&(l.activeElement||e.activeElement)===m&&(h.preventDefault(),A())}M.addEventListener("click",()=>y(null)),C.addEventListener("click",()=>y(null)),f.addEventListener("submit",h=>{h.preventDefault(),A()}),l.addEventListener("keydown",N),l.addEventListener("keypress",E),l.addEventListener("keyup",E),e.body.appendChild(p),n.requestAnimationFrame(()=>{w.classList.add("is-open"),m.focus(),m.select()})}))}return{promptFilename:r}}function Ce(e){return new Promise(n=>{if(!(e!=null&&e.get)){n(null);return}try{e.get("theme",t=>{var i;if((i=chrome.runtime)!=null&&i.lastError){n(null);return}n(typeof(t==null?void 0:t.theme)=="boolean"?t.theme:null)})}catch{n(null)}})}function Se(e,n){Object.assign(e.style,n)}function Me(e){e!=null&&e.parentNode&&e.parentNode.removeChild(e)}function Ie(e){return`
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
				font-family: Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
				color: var(--text);
				z-index: ${R.DIALOG};
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
				transform: translateY(10px) scale(0.985);
				transition: opacity 180ms ease, transform 220ms cubic-bezier(0.2, 0.8, 0.2, 1);
			}

			.snap-root.is-open .snap-backdrop { opacity: 1; }
			.snap-root.is-open .snap-shell {
				opacity: 1;
				transform: translateY(0) scale(1);
			}

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

			.snap-badge {
				flex: 0 0 auto;
				width: 40px;
				height: 40px;
				display: grid;
				place-items: center;
				border-radius: 14px;
				background: linear-gradient(180deg, color-mix(in srgb, var(--button-active) 22%, transparent), color-mix(in srgb, var(--button-active) 10%, transparent));
				border: 1px solid color-mix(in srgb, var(--button-active) 20%, var(--border));
				color: var(--text);
				box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05);
			}

			.snap-badge-icon { width: 18px; height: 18px; display: block; }

			.snap-heading { min-width: 0; }

			.snap-eyebrow {
				margin: 0 0 4px;
				font-size: 11px;
				font-weight: 700;
				letter-spacing: 0.08em;
				text-transform: uppercase;
				color: var(--muted);
			}

			.snap-title {
				margin: 0;
				font-size: 20px;
				line-height: 1.1;
				font-weight: 700;
				letter-spacing: -0.04em;
				color: var(--text);
			}

			.snap-subtitle {
				margin: 6px 0 0;
				font-size: 13px;
				line-height: 1.5;
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
						<div class="snap-badge" aria-hidden="true">
							<svg class="snap-badge-icon" viewBox="0 0 24 24" fill="none">
								<path d="M12 3.5C12.6 6.9 14.1 9.4 16.1 10.9C17.6 12 19.4 12.7 21 13C17.7 13.6 15.2 15.1 13.7 17.1C12.6 18.6 11.9 20.4 11.6 22C11 18.6 9.5 16.1 7.5 14.6C6 13.5 4.2 12.8 2.6 12.5C5.9 11.9 8.4 10.4 9.9 8.4C11 6.9 11.7 5.1 12 3.5Z" fill="currentColor"/>
							</svg>
						</div>
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
	`}function Re({runtime:e,doc:n,win:t,logger:i=Y()}={}){let a=me(),r=ge(),s=W({runtime:e,win:t}),o=he({doc:n});function c(){e.onMessage.addListener(w)}function p(f,m){a.register(f,m)}function l(f){a.unregister(f)}function g(f){return f&&typeof f=="object"&&f.action===I.CAPTURE&&typeof f.mode=="string"}function w(f){if(!g(f))return;let m=a.get(f.mode);if(!m){i.warn(`[snap] unsupported capture mode: ${String(f.mode)}`);return}M(m,{highRes:!!f.hiRes})}async function M(f,m){try{await f.run(m)}catch(C){i.error("[snap] capture failed",C)}}return{init:c,registerMode:p,unregisterMode:l,captureClient:s,promptService:o,session:r}}function ke(e){e.registerMode(B.VISIBLE,K({captureClient:e.captureClient,promptService:e.promptService,session:e.session})),e.registerMode(B.ELEMENT,te({captureClient:e.captureClient,promptService:e.promptService,doc:document,win:window,session:e.session})),e.registerMode(B.REGION,ne({captureClient:e.captureClient,promptService:e.promptService,doc:document,win:window,session:e.session}))}function be({runtime:e=chrome.runtime,doc:n=document,win:t=window,logger:i=Y()}={}){if(t.__snapInjected)return i.debug("[snap] already injected; skipping"),null;t.__snapInjected=!0;let a=Re({runtime:e,doc:n,win:t,logger:i});return ke(a),a.init(),a}be();})();
