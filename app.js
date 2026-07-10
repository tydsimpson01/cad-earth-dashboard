const players = [
  {id:"chico#3456", name:"chico", role:"TOP", rank:"Gold II", wr:"60%", kda:"2.9", cs:"7.2", kp:"65%", goal:"CS ≥ 8/min", champs:["Ornn","Gnar","Malphite"]},
  {id:"Aigis#SEES", name:"Aigis", role:"JUNGLE", rank:"Gold III", wr:"55%", kda:"3.4", cs:"5.1", kp:"72%", goal:"Earlier objective setup", champs:["Vi","Nocturne","Jarvan IV"]},
  {id:"Nemoupi#2427", name:"Nemoupi", role:"MID", rank:"Platinum IV", wr:"65%", kda:"3.6", cs:"7.6", kp:"68%", goal:"Roam on first reset", champs:["Ahri","Orianna","Viktor"]},
  {id:"redakted#GONE", name:"redakted", role:"BOT", rank:"Gold II", wr:"60%", kda:"3.2", cs:"8.1", kp:"63%", goal:"Fewer late deaths", champs:["Jinx","Kai'Sa","Ezreal"]},
  {id:"Rylionn#NA1", name:"Rylionn", role:"SUPPORT", rank:"Gold III", wr:"55%", kda:"3.8", cs:"1.2", kp:"74%", goal:"Vision before dragon", champs:["Nautilus","Rakan","Milio"]}
];

const matches = [
  {result:"Victory", score:"18 / 6 / 24", duration:"32:14", when:"24 hours ago", comp:"Front-to-back", notes:"Strong second dragon setup and clean Baron conversion.", tags:["Good draft","Objective control"]},
  {result:"Defeat", score:"8 / 12 / 10", duration:"28:09", when:"2 days ago", comp:"Pick composition", notes:"Two deaths before third dragon removed contest options.", tags:["Pre-dragon deaths","Late reset"]},
  {result:"Victory", score:"22 / 9 / 28", duration:"35:42", when:"4 days ago", comp:"Wombo engage", notes:"Clear engage windows and disciplined side waves.", tags:["Teamfight win","Strong comms"]},
  {result:"Defeat", score:"5 / 11 / 7", duration:"26:11", when:"5 days ago", comp:"Scaling", notes:"Drafted for late game, then fought every early neutral objective anyway.", tags:["Win-condition error","Forced fights"]}
];

const compositions = [
  {name:"Earthquake", type:"Front-to-back", picks:["Ornn","Vi","Orianna","Jinx","Milio"], engage:9, peel:8, scale:9, balance:8},
  {name:"Hard Reset", type:"Pick / dive", picks:["Gnar","Nocturne","Ahri","Kai'Sa","Nautilus"], engage:9, peel:5, scale:7, balance:8},
  {name:"Safe Mode", type:"Control / scaling", picks:["Malphite","Jarvan IV","Viktor","Ezreal","Rakan"], engage:8, peel:7, scale:8, balance:7}
];

function setView(id){
  document.querySelectorAll(".view").forEach(v=>v.classList.toggle("active",v.id===id));
  document.querySelectorAll(".nav-link").forEach(b=>b.classList.toggle("active",b.dataset.view===id));
  const titles={overview:"Team Overview",players:"Player Development",matches:"Match Review",compositions:"Composition Library",goals:"Weekly Goals",notes:"Coach Notes"};
  document.getElementById("page-title").textContent=titles[id];
  window.scrollTo({top:0,behavior:"smooth"});
}
document.querySelectorAll(".nav-link").forEach(btn=>btn.addEventListener("click",()=>setView(btn.dataset.view)));
document.querySelectorAll("[data-view-jump]").forEach(btn=>btn.addEventListener("click",()=>setView(btn.dataset.viewJump)));

document.getElementById("roster-table").innerHTML = players.map(p=>`
<tr><td><span class="player-name">${p.id}</span></td><td><span class="role-tag">${p.role}</span></td><td>${p.rank}</td><td class="positive">${p.wr}</td><td>${p.kda}</td><td>${p.cs}</td><td>${p.kp}</td><td>${p.goal}</td></tr>`).join("");

document.getElementById("player-grid").innerHTML = players.map(p=>`
<article class="player-card">
  <div class="player-head"><div><span class="player-role">${p.role}</span><div class="player-id">${p.id}</div></div><strong>${p.rank}</strong></div>
  <div class="stat-strip">
    <div class="mini-stat"><strong>${p.wr}</strong><span>WIN RATE</span></div>
    <div class="mini-stat"><strong>${p.kda}</strong><span>KDA</span></div>
    <div class="mini-stat"><strong>${p.cs}</strong><span>CS / MIN</span></div>
    <div class="mini-stat"><strong>${p.kp}</strong><span>KILL PART.</span></div>
  </div>
  <p><span class="eyebrow">CHAMPION POOL</span></p>
  <div class="champions">${p.champs.map(c=>`<span class="champion-pill">${c}</span>`).join("")}</div>
  <div class="coach-callout"><span class="callout-icon">✓</span><p><b>Current goal:</b> ${p.goal}</p></div>
</article>`).join("");

document.getElementById("recent-match-list").innerHTML = matches.slice(0,4).map(m=>`
<div class="match-row"><div><span class="result ${m.result==="Victory"?"positive":"negative"}">${m.result}</span><span>${m.duration}</span></div><div><b>${m.comp}</b><span>${m.when}</span></div><div class="score"><b>${m.score}</b><span>Team K/D/A</span></div></div>`).join("");

document.getElementById("match-grid").innerHTML = matches.map(m=>`
<article class="match-card">
  <div class="match-meta"><span class="${m.result==="Victory"?"positive":"negative"}">${m.result}</span><span>${m.when}</span></div>
  <h3>${m.comp}</h3><p>${m.notes}</p>
  <div class="match-meta"><span>${m.duration}</span><span>${m.score}</span></div>
  <div class="tag-row">${m.tags.map(t=>`<span class="tag">${t}</span>`).join("")}</div>
</article>`).join("");

document.getElementById("composition-grid").innerHTML = compositions.map(c=>`
<article class="composition-card">
  <div class="composition-meta"><span>${c.type}</span><span>Saved draft</span></div>
  <h3>${c.name}</h3>
  <div class="champions">${c.picks.map(p=>`<span class="champion-pill">${p}</span>`).join("")}</div>
  <div class="rating-grid">
    <div><strong>${c.engage}/10</strong><span>ENGAGE</span></div>
    <div><strong>${c.peel}/10</strong><span>PEEL</span></div>
    <div><strong>${c.scale}/10</strong><span>SCALING</span></div>
    <div><strong>${c.balance}/10</strong><span>BALANCE</span></div>
  </div>
</article>`).join("");

document.getElementById("goal-grid").innerHTML = players.map((p,i)=>{
  const progress=[72,58,66,61,70][i];
  return `<article class="goal-card"><span class="player-role">${p.role}</span><h3>${p.id}</h3><p>${p.goal}</p><div class="progress"><i style="width:${progress}%"></i></div><small>${progress}% toward weekly target</small></article>`;
}).join("");

const noteTitle=document.getElementById("note-title");
const noteBody=document.getElementById("note-body");
const savedNotes=document.getElementById("saved-notes");
function getNotes(){return JSON.parse(localStorage.getItem("cadEarthNotes")||"[]")}
function renderNotes(){
  const notes=getNotes();
  savedNotes.innerHTML=notes.length?notes.map(n=>`<article class="saved-note"><h4>${escapeHtml(n.title)}</h4><small>${n.date}</small><p>${escapeHtml(n.body)}</p></article>`).join(""):`<div class="notice">No local notes saved yet.</div>`;
}
function escapeHtml(v){return v.replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
document.getElementById("save-note").addEventListener("click",()=>{
  if(!noteTitle.value.trim()||!noteBody.value.trim()) return alert("Add both a title and note body.");
  const notes=getNotes();
  notes.unshift({title:noteTitle.value.trim(),body:noteBody.value.trim(),date:new Date().toLocaleString()});
  localStorage.setItem("cadEarthNotes",JSON.stringify(notes));
  noteTitle.value="";noteBody.value="";renderNotes();
});
document.getElementById("clear-note").addEventListener("click",()=>{noteTitle.value="";noteBody.value=""});
renderNotes();
