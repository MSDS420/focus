(() => {
'use strict';
const KEY='summit-v1',XP={easy:5,medium:10,hard:20},DIFF={easy:'Fácil',medium:'Média',hard:'Difícil'};
const names=[['first','Primeiro Passo','Conclua sua primeira tarefa.','↗'],['summit','Topo da Montanha','Conclua todas as tarefas de um dia.','⌃'],['three','Consistência','Alcance 3 dias perfeitos seguidos.','✦'],['seven','Uma Semana de Progresso','Alcance 7 dias perfeitos seguidos.','▦'],['century','Centenário','Acumule 100 XP.','✧']];
const titles=[[50,'Mestre de Si'],[40,'Inabalável'],[30,'Excepcional'],[23,'Imparável'],[17,'Incansável'],[12,'Disciplinado'],[8,'Determinado'],[5,'Obstinado'],[3,'Persistente'],[1,'Iniciante']];
const $=id=>document.getElementById(id), keyDate=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`,today=()=>keyDate(new Date()),shift=(k,n)=>{let[y,m,d]=k.split('-').map(Number);return keyDate(new Date(y,m-1,d+n,12))};
function load(){
  const base={tasks:[],xp:0,perfectDays:{},best:0,achievements:[],bonus:[],xpByDay:{},milestones:{},lastOpen:today()};
  try{const s=JSON.parse(localStorage.getItem(KEY));if(!s||!Array.isArray(s.tasks))return base;
    const xpByDay=s.xpByDay&&typeof s.xpByDay==='object'&&!Array.isArray(s.xpByDay)?Object.fromEntries(Object.entries(s.xpByDay).map(([k,v])=>[k,Math.max(0,Number(v)||0)])):{};
    const milestones=s.milestones&&typeof s.milestones==='object'&&!Array.isArray(s.milestones)?s.milestones:{};
const todayXpKnown=Object.prototype.hasOwnProperty.call(xpByDay,today());if(!todayXpKnown){const priorTaskXp=s.tasks.reduce((sum,t)=>sum+(t&&t.rewarded&&t.completedOn===today()?(Number(t.rewardedXp)||XP[t.difficulty]||0):0),0),priorBonus=Array.isArray(s.bonus)&&s.bonus.includes(today())?25:0;xpByDay[today()]=priorTaskXp+priorBonus}
    return {...base,...s,xpByDay,milestones,tasks:s.tasks.filter(t=>t&&typeof t.id==='string'&&typeof t.title==='string'&&/^\d{4}-\d\d-\d\d$/.test(t.dueDate)).map(t=>({...t,difficulty:XP[t.difficulty]?t.difficulty:'medium',completed:!!t.completed,rewarded:!!t.rewarded,rewardedXp:Number(t.rewardedXp)||0}))};
  }catch{return base}
}
let state=load(),selected=today(),previewSequence=null;function save(){try{localStorage.setItem(KEY,JSON.stringify(state));return true}catch{notify('Não foi possível salvar. Verifique o espaço disponível no navegador.','error');return false}}function notify(msg,kind=''){let n=document.createElement('div');n.className=`toast ${kind}`;n.textContent=msg;$('toast').append(n);setTimeout(()=>n.remove(),3500)}
const due=k=>state.tasks.filter(t=>t.dueDate===k),wasDone=(t,k)=>t.completedOn===k||(t.completions||[]).includes(k);
function closeDays(){let c=state.lastOpen||today(),now=today(),guard=0;if(c>now)c=now;while(c<now&&guard++<4000){if(!(c in state.perfectDays)){let ts=due(c);state.perfectDays[c]=!!ts.length&&ts.every(t=>wasDone(t,c))}c=shift(c,1)}state.lastOpen=now;let run=0,prev=null;for(let k of Object.keys(state.perfectDays).filter(k=>state.perfectDays[k]).sort()){run=prev&&shift(prev,1)===k?run+1:1;state.best=Math.max(state.best,run);prev=k}}
function todayPerfect(){let ts=due(today());return !!ts.length&&ts.every(t=>t.completed)}function streak(){let k=today(),n=0;if(!todayPerfect()&&!state.perfectDays[k])k=shift(k,-1);while(k===today()?todayPerfect():state.perfectDays[k]){n++;k=shift(k,-1)}return n}
function celebrate(type){
  const complete=type==='complete';$('celebration-dialog').className=`celebration-dialog ${complete?'trophy-mode':'half-mode'}`;$('celebration-icon').textContent=complete?'🏆':'✦';$('celebration-title').textContent=complete?'100% concluído!':'Metade já foi!';$('celebration-text').textContent=complete?'Você concluiu todos os objetivos de hoje. Parabéns!':'Você já concluiu metade dos objetivos de hoje. Continue assim!';const xp=$('celebration-xp');xp.hidden=!complete;if(complete)xp.textContent=`+${state.xpByDay[today()]||0} XP gerados hoje`;
  const confetti=$('confetti');confetti.replaceChildren();if(complete){const colors=['#a780ff','#61d6a5','#ffc96b','#ff687a','#67c9ff'];for(let i=0;i<36;i++){const piece=document.createElement('i'),angle=Math.random()*Math.PI*2,distance=90+Math.random()*130;piece.className='confetti-piece';piece.style.left='50%';piece.style.top='42%';piece.style.setProperty('--delay',`${Math.random()*.18}s`);piece.style.setProperty('--dx',`${Math.cos(angle)*distance}px`);piece.style.setProperty('--dy',`${Math.sin(angle)*distance}px`);piece.style.setProperty('--piece-color',colors[i%colors.length]);confetti.append(piece)}}$('celebration-dialog').showModal()
}
function checkMilestones(){const tasks=due(today());if(!tasks.length)return;const done=tasks.filter(t=>t.completed).length,percent=Math.floor(done/tasks.length*100),day=state.milestones[today()]||(state.milestones[today()]={});if(percent>=50&&!day.half){day.half=true;if(percent<100)celebrate('half')}if(percent===100&&!day.complete){day.complete=true;celebrate('complete')}}
function level(x){let l=1,left=x,need=100;while(left>=need){left-=need;l++;need=100+50*(l-1)}return{l,left,need}}function awardAchievements(){for(let [id,name] of names){let ok=id==='first'?state.tasks.some(t=>t.rewarded):id==='summit'?Object.values(state.perfectDays).some(Boolean):id==='three'?state.best>=3:id==='seven'?state.best>=7:state.xp>=100;if(ok&&!state.achievements.includes(id)){state.achievements.push(id);notify(`Conquista desbloqueada: ${name}!`)}}}
function paint(p){
  const phases=p===100?['Topo alcançado!','Dia perfeito. Celebre sua conquista.']:p>=60?['Falta pouco para o topo!','Olha o quanto você já avançou.']:p>=25?['Você está no caminho certo!','Mantenha esse ritmo, cada passo conta.']:p>=10?['Continue avançando!','Você já deu passos importantes.']:p>0?['Um passo de cada vez!','Seu progresso já começou.']:['Pronto para começar?','Toda jornada começa com um passo.'];
  $('motivation-title').textContent=phases[0];$('motivation-text').textContent=phases[1];
  const color=p===0?'#ff687a':p<=20?'#ff963f':p<50?'#ffc96b':p<100?'#61d6a5':'#a780ff';const meter=$('stage-meter');meter.setAttribute('aria-valuenow',p);
  Array.from(meter.children).forEach((segment,index)=>{const fill=Math.max(0,Math.min(1,(p-index*10)/10));segment.classList.toggle('active',fill>0);segment.style.background=fill===0?'#393744':`linear-gradient(90deg,${color} ${fill*100}%,#393744 ${fill*100}%)`});
  document.documentElement.style.setProperty('--prog',color);$('percent').textContent=p+'%';
}
function drawAchievements(){let root=$('achievements');root.replaceChildren();for(let [id,name,desc,icon] of names){let ok=state.achievements.includes(id),el=document.createElement('div');el.className='achievement '+(ok?'':'locked');el.innerHTML=`<div class="ach-icon">${icon}</div><div><div class="ach-name"></div><div class="ach-desc"></div></div><span class="ach-status">${ok?'Conquistada':'Bloqueada'}</span>`;el.querySelector('.ach-name').textContent=name;el.querySelector('.ach-desc').textContent=desc;root.append(el)}$('achievement-count').textContent=`${state.achievements.length}/5`}
function dateLabel(k){if(k===today())return'Hoje';let[y,m,d]=k.split('-').map(Number);return new Intl.DateTimeFormat('pt-BR',{day:'numeric',month:'short'}).format(new Date(y,m-1,d,12))}
function taskNode(t){
  const category=t.dueDate>today()?'upcoming':t.dueDate<today()?'overdue':'today';
  const el=document.createElement('article');el.className=`task task-${category} ${t.completed?'done':''}`;
  el.innerHTML=`<input class="check" type="checkbox" aria-label="Concluir tarefa"><div class="task-date"><span></span><strong></strong></div><div class="task-main"><div class="task-name"></div><div class="task-sub"></div></div><details class="task-menu"><summary aria-label="Ações da tarefa">⋯</summary><div class="task-actions"><button type="button" data-a="edit">Editar</button><button type="button" data-a="move">Reagendar</button><button type="button" data-a="delete">Excluir</button></div></details>`;
  const checkbox=el.querySelector('.check');checkbox.checked=t.completed;checkbox.setAttribute('aria-label',`${t.completed?'Reabrir':'Concluir'} ${t.title}`);checkbox.addEventListener('change',()=>toggle(t.id));
  el.querySelector('.task-name').textContent=t.title;
  const [year,month,day]=t.dueDate.split('-').map(Number),date=new Date(year,month-1,day,12);
  el.querySelector('.task-date span').textContent=new Intl.DateTimeFormat('pt-BR',{month:'short'}).format(date).replace('.','').toUpperCase();el.querySelector('.task-date strong').textContent=day;
  const subtitle=t.dueDate===today()?'Hoje':t.dueDate===shift(today(),1)?'Amanhã':new Intl.DateTimeFormat('pt-BR',{weekday:'long'}).format(date);
  el.querySelector('.task-sub').textContent=category==='upcoming'?subtitle:`${DIFF[t.difficulty]} · ${XP[t.difficulty]} XP`;
  el.querySelectorAll('[data-a]').forEach(b=>b.addEventListener('click',()=>taskActionMenu(b,t.id,b.dataset.a)));
  return el;
}
function taskActionMenu(button,id,action){const menu=button.closest('details');if(action==='edit'||action==='move'){menu.open=false;taskAction(id,action)}else taskAction(id,action)}
function group(id,arr,msg){let e=$(id);e.replaceChildren();if(!arr.length){let p=document.createElement('div');p.className='empty';p.textContent=msg;e.append(p)}else arr.forEach(t=>e.append(taskNode(t)))}
function render(){let now=new Date();$('date').textContent=new Intl.DateTimeFormat('pt-BR',{weekday:'short',day:'numeric',month:'long'}).format(now);$('day-heading-text').textContent=selected===today()?'Deveres de hoje':`Deveres de ${dateLabel(selected)}`;let td=due(selected),done=td.filter(t=>t.completed).length,p=td.length?Math.floor(done/td.length*100):0;paint(p);$('count').textContent=`${done} de ${td.length} tarefas concluídas`;$('today-count').textContent=td.length;group('tasks-today',td,'Nenhuma tarefa para esta data.');let up=state.tasks.filter(t=>t.dueDate>today()).sort((a,b)=>a.dueDate.localeCompare(b.dueDate)),late=state.tasks.filter(t=>t.dueDate<today()&&!t.completed).sort((a,b)=>a.dueDate.localeCompare(b.dueDate));$('upcoming-count').textContent=up.length;$('overdue-count').textContent=late.length;group('tasks-upcoming',up,'Sem próximos deveres.');group('tasks-overdue',late,'Tudo em dia por aqui.');let v=level(state.xp),pct=Math.floor(v.left/v.need*100);$('xp').textContent=state.xp;$('level').textContent=String(v.l).padStart(2,'0');$('title').textContent=titles.find(([n])=>v.l>=n)[1];$('xp-left').textContent=`${v.left} XP`;$('xp-next').textContent=`${v.need-v.left} XP para o próximo nível`;requestAnimationFrame(()=>$('level-progress').style.width=pct+'%');document.querySelector('.level-track').setAttribute('role','progressbar');document.querySelector('.level-track').setAttribute('aria-valuenow',pct);$('streak').textContent=`${streak()} ${streak()===1?'dia':'dias'}`;$('record').textContent=`${state.best} ${state.best===1?'dia':'dias'}`;drawAchievements()}
function awardTodayBonus(){let ts=due(today());if(ts.length&&ts.every(x=>x.completed)&&!state.bonus.includes(today())){state.xp+=25;state.xpByDay[today()]=(Number(state.xpByDay[today()])||0)+25;state.bonus.push(today());notify('Bônus de dia completo: +25 XP!')}}function toggle(id){let t=state.tasks.find(x=>x.id===id);if(!t)return;let old=level(state.xp).l;t.completed=!t.completed;if(t.completed){t.completedOn=today();if(!t.rewarded){state.xp+=XP[t.difficulty];t.rewardedXp=XP[t.difficulty];state.xpByDay[today()]=(Number(state.xpByDay[today()])||0)+XP[t.difficulty];t.rewarded=true}awardTodayBonus();checkMilestones();if(level(state.xp).l>old)notify(`Você evoluiu para o nível ${level(state.xp).l}!`)}else t.completedOn=null;awardAchievements();save();render()}
function open(t){$('form').reset();$('task-id').value=t?.id||'';$('dialog-title').textContent=t?'Editar tarefa':'Nova tarefa';$('task-name').value=t?.title||'';$('difficulty').value=t?.difficulty||'medium';$('due').value=t?.dueDate||selected;$('dialog').showModal();$('task-name').focus()}function action(id,a){let t=state.tasks.find(x=>x.id===id);if(a==='edit')return open(t);if(a==='move'){open(t);$('due').focus()}if(a==='delete'&&confirm(`Excluir “${t.title}”?`)){state.tasks=state.tasks.filter(x=>x.id!==id);save();render()}}
$('add').onclick=()=>open();$('add-today').onclick=()=>open();$('form').onsubmit=e=>{e.preventDefault();let id=$('task-id').value,t=state.tasks.find(x=>x.id===id),title=$('task-name').value.trim(),difficulty=$('difficulty').value,dueDate=$('due').value;if(!title||!dueDate)return;if(t)Object.assign(t,{title,difficulty,dueDate});else state.tasks.push({id:crypto.randomUUID?.()||String(Date.now()),title,difficulty,dueDate,completed:false,completedOn:null,rewarded:false,rewardedXp:0});save();$('dialog').close();render()};$('close').onclick=$('cancel').onclick=()=>$('dialog').close();$('celebration-close').onclick=()=>$('celebration-dialog').close();$('celebration-dialog').addEventListener('close',()=>{if(previewSequence==='half'){previewSequence='complete';celebrate('complete')}else if(previewSequence==='complete')previewSequence=null});$('preview-celebrations').onclick=()=>{previewSequence='half';celebrate('half')};if(window.location&&new URLSearchParams(window.location.search).get('demo')==='celebrations')$('preview-celebrations').hidden=false;$('calendar-toggle').onclick=()=>{$('calendar').hidden=!$('calendar').hidden;$('calendar-toggle').setAttribute('aria-expanded',String(!$('calendar').hidden));$('calendar-date').value=selected};$('calendar-date').onchange=e=>{if(e.target.value){selected=e.target.value;render()}};$('today').onclick=()=>{selected=today();$('calendar-date').value=selected;render()};
closeDays();awardTodayBonus();checkMilestones();awardAchievements();save();render();window.Summit={getState:()=>structuredClone(state),levelFor:level,calcStreak:streak,paintProgress:paint,localDateKey:keyDate,addDays:shift,closeElapsedDays:closeDays};
})();




























