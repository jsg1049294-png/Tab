/**
 * TAP – YouTube player + tools
 * Reload page after deploy.
 */
(function(){
"use strict";
const SONGS=[
{t:"coachlim (Blackberrysky)",a:"coacheslimes",yt:""},
{t:"BMW3",a:"2hermanoz",yt:"8BvhsJnTkBI"},
{t:"AKON",a:"Jazeek",yt:"eZlFOSbgDlo"},
{t:"3ER BMW",a:"Tream, treamiboii",yt:"wv5AAsUKaJ8"},
{t:"500 PS",a:"Bonez MC, RAF Camora",yt:"hLWGlq_2qbk"},
{t:"Coachlim (Azet 9 Milly parodie)",a:"coacheslimes",yt:""},
{t:"Coachlim (Fast Life)",a:"coacheslimes",yt:""},
{t:"Coachlim - Lelele (Azet)",a:"coacheslimes",yt:""},
{t:"panzerknacker.wav",a:"LENNSKO",yt:""},
{t:"VERLIEBT IN MICH",a:"FAYAN, Dalton",yt:"SzS53sQt_7Q"},
{t:"Leck Sibbi",a:"Nimo",yt:"LYaUsLGLCb4"},
{t:"Bamba (feat. Aitch & BIA)",a:"Luciano, Aitch, BIA",yt:"oglRrpIsVaE"},
{t:"Chabos wissen wer der Babo ist",a:"Haftbefehl",yt:"wLC0D41eVgo"},
{t:"Show Me Love",a:"WizTheMc, bees & honey",yt:"Z3aduh5fxCo"},
{t:"H&K",a:"LACAZETTE",yt:"VN6KKXUMaik"},
{t:"Hin und Her",a:"AK AUSSERKONTROLLE",yt:"HHNUdLoRGYc"},
{t:"Von hier an blind",a:"Wir sind Helden",yt:"xyNWUY-wH5g"},
{t:"All The Way Up (feat. Infared)",a:"Fat Joe, Remy Ma",yt:"y6fLHxWiXfE"},
{t:"Eligella Fick Mich",a:"Lil Koassy",yt:""}
];
let musicIdx=0,playing=false,shuffle=false;
const win=document.getElementById("tap-window");
const titlebar=document.getElementById("tap-titlebar");
const restoreBtn=document.getElementById("tap-restore");
let drag=null;
function onDown(e){if(e.target.closest(".tap-win-btns"))return;const t=e.touches?e.touches[0]:e;const r=win.getBoundingClientRect();drag={x:t.clientX,y:t.clientY,l:r.left,t:r.top};if(e.touches)e.preventDefault();}
function onMove(e){if(!drag)return;const t=e.touches?e.touches[0]:e;if(e.touches)e.preventDefault();win.style.left=drag.l+(t.clientX-drag.x)+"px";win.style.top=drag.t+(t.clientY-drag.y)+"px";win.style.transform="none";}
function onUp(){drag=null;}
titlebar.addEventListener("mousedown",onDown);titlebar.addEventListener("touchstart",onDown,{passive:false});
window.addEventListener("mousemove",onMove);window.addEventListener("touchmove",onMove,{passive:false});
window.addEventListener("mouseup",onUp);window.addEventListener("touchend",onUp);
document.getElementById("tap-min").onclick=()=>{win.classList.add("minimized");restoreBtn.hidden=false;};
document.getElementById("tap-close").onclick=()=>{win.classList.add("hidden");restoreBtn.hidden=false;};
restoreBtn.onclick=()=>{win.classList.remove("hidden","minimized");restoreBtn.hidden=true;};
function showView(name){document.querySelectorAll(".view").forEach(v=>v.classList.remove("active"));document.querySelectorAll(".nav-btn").forEach(b=>b.classList.toggle("active",b.dataset.view===name));const el=document.getElementById("view-"+name);if(el)el.classList.add("active");}
document.getElementById("tap-nav").addEventListener("click",e=>{const btn=e.target.closest(".nav-btn");if(btn)showView(btn.dataset.view);});
document.querySelectorAll(".home-card").forEach(c=>c.addEventListener("click",()=>showView(c.dataset.view)));
function loadYt(id){let box=document.getElementById("yt-embed");if(!box){box=document.createElement("div");box.id="yt-embed";box.style.cssText="margin:10px 0;border-radius:12px;overflow:hidden;aspect-ratio:16/9;background:#000;border:1px solid rgba(0,240,200,.25)";const pn=document.querySelector(".player-now");if(pn)pn.insertAdjacentElement("afterend",box);}if(!id){box.innerHTML='<div style="padding:24px;text-align:center;color:#8a9a9a">Kein Embed – Suche öffnen</div>';return;}box.innerHTML='<iframe width="100%" height="100%" src="https://www.youtube.com/embed/'+id+'?autoplay=1&rel=0" allow="autoplay;encrypted-media;picture-in-picture" allowfullscreen style="width:100%;height:100%;border:0;min-height:180px"></iframe>';}
function renderPlaylist(filter){const list=document.getElementById("music-list");if(!list)return;list.innerHTML="";const f=(filter||"").toLowerCase();SONGS.forEach((s,i)=>{if(f&&!s.t.toLowerCase().includes(f)&&!s.a.toLowerCase().includes(f))return;const row=document.createElement("div");row.className="song-row"+(i===musicIdx?" active":"");row.innerHTML=`<span class="num">${i+1}</span><div class="meta"><b>${s.t}</b><span>${s.a}</span></div><span class="dur">${s.yt?"▶":"↗"}</span>`;row.onclick=()=>selectSong(i,true);list.appendChild(row);});const cnt=document.getElementById("music-count");if(cnt)cnt.textContent=SONGS.length+" Songs · "+SONGS.filter(s=>s.yt).length+" mit YouTube";}
function selectSong(i,play){musicIdx=i;const s=SONGS[i];document.getElementById("music-title").textContent=s.t;document.getElementById("music-artist").textContent=s.a;renderPlaylist(document.getElementById("music-search")?.value);if(play){if(s.yt)loadYt(s.yt);else{loadYt("");window.open("https://www.youtube.com/results?search_query="+encodeURIComponent(s.t+" "+s.a),"_blank");}playing=true;const pb=document.getElementById("music-play");if(pb)pb.textContent="⏸";}}
document.getElementById("music-play")?.addEventListener("click",()=>{if(!playing)selectSong(musicIdx,true);else{playing=false;document.getElementById("music-play").textContent="▶";const box=document.getElementById("yt-embed");if(box)box.innerHTML="";}});
document.getElementById("music-next")?.addEventListener("click",()=>{musicIdx=shuffle?Math.floor(Math.random()*SONGS.length):(musicIdx+1)%SONGS.length;selectSong(musicIdx,true);});
document.getElementById("music-prev")?.addEventListener("click",()=>{musicIdx=(musicIdx-1+SONGS.length)%SONGS.length;selectSong(musicIdx,true);});
document.getElementById("music-shuffle")?.addEventListener("click",function(){shuffle=!shuffle;this.classList.toggle("active",shuffle);});
document.getElementById("music-search")?.addEventListener("input",e=>renderPlaylist(e.target.value));
document.getElementById("music-title").textContent=SONGS[0].t;
document.getElementById("music-artist").textContent=SONGS[0].a;
renderPlaylist();
/* AutoClicker minimal so page does not break */
const ac={positions:[],intervalMs:500,running:false,timerId:null,posIndex:0,picking:false,clickCount:0};
const positionsEl=document.getElementById("ac-positions");
const overlay=document.getElementById("ac-picker-overlay");
function placeMarkers(){document.querySelectorAll(".ac-marker").forEach(m=>m.remove());ac.positions.forEach((p,i)=>{const m=document.createElement("div");m.className="ac-marker";m.textContent=String(i+1);m.style.left=p.x+"px";m.style.top=p.y+"px";document.body.appendChild(m);});}
function renderPos(){if(!positionsEl)return;positionsEl.innerHTML="";ac.positions.forEach((p,i)=>{const row=document.createElement("div");row.className="ac-pos-item";row.innerHTML=`<span class="ac-pos-num">${i+1}</span><span class="coords">x:${Math.round(p.x)} y:${Math.round(p.y)}</span><button>×</button>`;row.querySelector("button").onclick=()=>{ac.positions=ac.positions.filter(x=>x.id!==p.id);renderPos();placeMarkers();};positionsEl.appendChild(row);});placeMarkers();}
document.getElementById("ac-pick")?.addEventListener("click",()=>{ac.picking=true;if(overlay)overlay.hidden=false;});
function handlePick(e){if(!ac.picking)return;if(e.target.closest(".tap-window")||e.target.closest(".tap-restore"))return;e.preventDefault();const pt=e.changedTouches?e.changedTouches[0]:e;ac.positions.push({id:Date.now(),x:pt.clientX,y:pt.clientY});ac.picking=false;if(overlay)overlay.hidden=true;renderPos();}
document.addEventListener("click",handlePick,true);document.addEventListener("touchend",handlePick,true);
function sim(x,y){const el=document.elementFromPoint(x,y);if(!el)return;try{el.click();}catch(_){}}
function tick(){if(!ac.running||!ac.positions.length)return;const p=ac.positions[ac.posIndex%ac.positions.length];sim(p.x,p.y);ac.clickCount++;ac.posIndex++;const sc=document.getElementById("ac-stat-clicks");if(sc)sc.textContent=ac.clickCount;ac.timerId=setTimeout(tick,ac.intervalMs);}
document.getElementById("ac-start")?.addEventListener("click",()=>{if(!ac.positions.length){alert("Position wählen");return;}ac.running=true;ac.clickCount=0;ac.posIndex=0;tick();});
document.getElementById("ac-stop")?.addEventListener("click",()=>{ac.running=false;clearTimeout(ac.timerId);});
document.querySelectorAll(".chip").forEach(chip=>{if(chip.closest("#kc-chips"))return;chip.addEventListener("click",()=>{document.querySelectorAll(".ac-chips .chip").forEach(c=>c.classList.remove("active"));chip.classList.add("active");ac.intervalMs=+chip.dataset.ms;});});
/* Key clicker */
const KEYS=[{label:"Space",key:" ",code:"Space"},{label:"Enter",key:"Enter",code:"Enter"},{label:"W",key:"w",code:"KeyW"},{label:"A",key:"a",code:"KeyA"},{label:"S",key:"s",code:"KeyS"},{label:"D",key:"d",code:"KeyD"},{label:"↑",key:"ArrowUp",code:"ArrowUp"},{label:"↓",key:"ArrowDown",code:"ArrowDown"}];
const kc={key:KEYS[0],intervalMs:500,running:false,timerId:null,count:0};
const keypad=document.getElementById("kc-keypad");
if(keypad){KEYS.forEach((k,i)=>{const b=document.createElement("button");b.textContent=k.label;if(i===0)b.classList.add("active");b.onclick=()=>{keypad.querySelectorAll("button").forEach(x=>x.classList.remove("active"));b.classList.add("active");kc.key=k;const s=document.getElementById("kc-selected");if(s)s.textContent=k.label;};keypad.appendChild(b);});}
function fireKey(){const o={key:kc.key.key,code:kc.key.code,bubbles:true,cancelable:true};try{document.dispatchEvent(new KeyboardEvent("keydown",o));document.dispatchEvent(new KeyboardEvent("keyup",o));}catch(_){}}
function ktick(){if(!kc.running)return;fireKey();kc.count++;const el=document.getElementById("kc-stat-clicks");if(el)el.textContent=kc.count;kc.timerId=setTimeout(ktick,kc.intervalMs);}
document.getElementById("kc-start")?.addEventListener("click",()=>{kc.running=true;kc.count=0;document.getElementById("kc-stat-status").textContent="Läuft";ktick();});
document.getElementById("kc-stop")?.addEventListener("click",()=>{kc.running=false;clearTimeout(kc.timerId);document.getElementById("kc-stat-status").textContent="Bereit";});
/* calc */
let calcExpr="";const calcDisp=document.getElementById("calc-display");
document.querySelector(".calc-keys")?.addEventListener("click",e=>{const btn=e.target.closest("[data-k]");if(!btn)return;const k=btn.dataset.k;if(k==="C")calcExpr="";else if(k==="="){try{let ex=calcExpr.replace(/×/g,"*").replace(/÷/g,"/").replace(/−/g,"-");calcExpr=String(Function('return ('+ex+')')());}catch{calcExpr="Fehler";}}else{if(calcExpr==="Fehler")calcExpr="";calcExpr+=k==="*"?"×":k==="/"?"÷":k==="-"?"−":k;}if(calcDisp)calcDisp.textContent=calcExpr||"0";});
/* browser */
const frame=document.getElementById("br-frame");const urlInput=document.getElementById("br-url");
function loadUrl(u){if(!/^https?:\/\//i.test(u))u="https://"+u;if(urlInput)urlInput.value=u;if(frame)frame.src=u;}
document.getElementById("br-go")?.addEventListener("click",()=>loadUrl(urlInput.value.trim()));
loadUrl("https://example.com");
const bmTa=document.getElementById("bookmarklet-code");
if(bmTa)bmTa.value="javascript:void(function(){window.open('https://jsg1049294-png.github.io/Tab/','_blank');})();";
document.getElementById("btn-copy-bm")?.addEventListener("click",async()=>{try{await navigator.clipboard.writeText(bmTa.value);}catch{bmTa.select();}});
})();
