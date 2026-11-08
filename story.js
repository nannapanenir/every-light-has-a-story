"use strict";
const $=id=>document.getElementById(id);
const dialogue=[
 {scene:0,who:'Narrator',line:'Every light has a story.',stage:'A single flame flickers in the darkness.'},
 {scene:0,who:'Narrator',line:'Long ago, after fourteen years of waiting, Ayodhya welcomed Lord Rama home.',stage:'A thousand lamps illuminate the city.'},
 {scene:0,who:'Narrator',line:'Every street glowed. Every heart celebrated. But among those thousands of lights… one carried a different wish.',stage:'We drift toward the riverbank.'},
 {scene:1,who:'Little Girl',line:'Grandma… everyone is celebrating because Rama has come home.',stage:'The girl watches lamps shine across the river.'},
 {scene:1,who:'Little Girl',line:'But what about those who are still far away?',stage:'She gazes down at the little lamp in her hands.'},
 {scene:1,who:'Little Girl',line:'Father could not come home this year. Do you think he can see these lights?',stage:'The water reflects thousands of golden flames.'},
 {scene:1,who:'Grandmother',line:'Perhaps not these flames, my child.',stage:'Grandmother smiles gently.'},
 {scene:1,who:'Grandmother',line:'But love has a way of reaching places that light cannot.',stage:'She places a reassuring hand on the girl’s shoulder.'},
 {scene:2,who:'Little Girl',line:'Then this one is for you, Father.',stage:'She shelters the flame and releases her diya onto the river.'},
 {scene:2,who:'Narrator',line:'That night, thousands of lamps celebrated a homecoming. But one little lamp carried the hope of another.',stage:'Her diya drifts away, glowing brighter.'},
 {scene:3,who:'Narrator',line:'Years became centuries. Cities changed. The world grew larger.',stage:'The tiny light rises into a star and travels onward.'},
 {scene:3,who:'Narrator',line:'And sometimes, the people we love moved farther away.',stage:'Families send their wishes across oceans and time zones.'},
 {scene:3,who:'Narrator',line:'But one thing never changed: the desire to send a little light to someone we miss.',stage:'One glowing light joins many others.'},
 {scene:4,who:'Narrator',line:'And tonight… among millions of lights shining across the world…',stage:'The lights come together over the river.'},
 {scene:4,who:'Narrator',line:'One of them is for you.',stage:'A single diya shines brighter than all the rest.'},
];
const scenes=[
 {title:'A City of a Thousand Lights',act:'ACT I · THE HOMECOMING',img:'/assets/ayodhya.webp'},
 {title:'The Little Girl and Her Diya',act:'ACT II · BY THE RIVER',img:'/assets/riverbank.webp'},
 {title:'The Journey of One Light',act:'ACT III · ONE SMALL WISH',img:'/assets/diya.webp'},
 {title:'The Light Travels On',act:'ACT IV · ACROSS TIME',img:'/assets/world.webp'},
 {title:'One Light for You',act:'ACT V · A LIGHT FOR YOU',img:'/assets/finale.webp'}
];
let step=-1,autoplay=false,voiceOn=false,autoplayTimer=null,voices=[],particles=[],isFinal=false;
const sender=(new URLSearchParams(location.search).get('from')||'Ram').trim().slice(0,36)||'Ram';$('sender').textContent=sender;
for(let i=0;i<25;i++){const s=document.createElement('div');s.className='spark';s.style.left=(Math.random()*100)+'%';s.style.top=(Math.random()*100)+'%';s.style.animationDelay=(-Math.random()*7)+'s';s.style.animationDuration=(5+Math.random()*6)+'s';$('sparkles').append(s)}
function setImage(path){$('bg').style.backgroundImage=`url("${path}")`}
function chooseVoice(){if(!('speechSynthesis'in window))return;voices=speechSynthesis.getVoices()}
chooseVoice();if('speechSynthesis'in window)speechSynthesis.addEventListener?.('voiceschanged',chooseVoice);
function stopSpeech(){if('speechSynthesis'in window)speechSynthesis.cancel()}
function speak(){stopSpeech();if(!voiceOn||step<0||step>=dialogue.length||!('speechSynthesis'in window))return;const d=dialogue[step],u=new SpeechSynthesisUtterance(d.line);u.lang='en-US';u.rate=d.who==='Little Girl'?.93:.88;u.pitch=d.who==='Little Girl'?1.26:d.who==='Grandmother'?.85:1;u.voice=voices.find(v=>/^en-(IN|GB)/i.test(v.lang))||voices.find(v=>v.lang.startsWith('en'))||null;speechSynthesis.speak(u)}
function clearTimer(){if(autoplayTimer!==null)clearTimeout(autoplayTimer);autoplayTimer=null}
function schedule(){clearTimer();if(!autoplay||isFinal)return;const n=dialogue[step]?.line.length||35;autoplayTimer=setTimeout(()=>advance(),Math.max(3600,Math.min(9800,n*65+1000)))}
function show(index){clearTimer();stopSpeech();step=index;isFinal=index>=dialogue.length;$('welcome').classList.add('hidden');$('progressRegion').classList.remove('hidden');$('tools').classList.remove('hidden');$('nav').classList.toggle('hidden',isFinal);$('story').classList.toggle('hidden',isFinal);$('end').classList.toggle('hidden',!isFinal);$('fill').style.width= (isFinal?100:100*(index+1)/dialogue.length)+'%';$('count').textContent=isFinal?'The end':`Line ${index+1} of ${dialogue.length}`;if(isFinal){autoplay=false;$('auto').textContent='▶ Autoplay: Off';$('actName').textContent='A LIGHT FOR YOU';setImage(scenes[4].img);for(let j=0;j<3;j++)setTimeout(()=>burst(innerWidth*(.22+.5*Math.random()),innerHeight*(.2+.3*Math.random())),j*500);return}const d=dialogue[index],s=scenes[d.scene];setImage(s.img);$('act').textContent=s.act;$('heading').textContent=s.title;$('speaker').textContent=d.who;$('dialogue').textContent='“'+d.line+'”';$('stage').textContent=d.stage;$('actName').textContent=s.act;$('back').disabled=index===0;$('next').textContent=index===dialogue.length-1?'Reveal Greeting →':'Next →';$('quote').classList.remove('fade');void $('quote').offsetWidth;$('quote').classList.add('fade');speak();schedule()}
function advance(){show(Math.min(dialogue.length,step+1))}
function back(){show(Math.max(0,step-1))}
function reset(){autoplay=false;clearTimer();stopSpeech();$('auto').textContent='▶ Autoplay: Off';show(0)}
$('begin').addEventListener('click',()=>show(0));$('next').addEventListener('click',advance);$('back').addEventListener('click',back);$('replay').addEventListener('click',reset);$('restart').addEventListener('click',reset);$('skip').addEventListener('click',()=>show(dialogue.length));$('auto').addEventListener('click',()=>{autoplay=!autoplay;$('auto').textContent=autoplay?'❚❚ Autoplay: On':'▶ Autoplay: Off';if(autoplay)schedule();else clearTimer()});$('voice').addEventListener('click',()=>{voiceOn=!voiceOn;$('voice').textContent=voiceOn?'Voice: On':'Voice: Off';$('voice').setAttribute('aria-pressed',String(voiceOn));if(voiceOn)speak();else stopSpeech()});$('share').addEventListener('click',async()=>{const url=new URL(location.href);url.searchParams.set('from',sender);try{if(navigator.share)await navigator.share({title:'Every Light Has a Story',text:'A little Diwali light for you',url:url.href});else if(navigator.clipboard){await navigator.clipboard.writeText(url.href);$('share').textContent='Link copied!'}else window.prompt('Copy this link',url.href)}catch(e){if(e.name!=='AbortError')console.warn(e)}});
const canvas=$('fireworks'),ctx=canvas.getContext('2d');function resize(){const d=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(innerWidth*d);canvas.height=Math.round(innerHeight*d);ctx.setTransform(d,0,0,d,0,0)}resize();addEventListener('resize',resize);function burst(x,y){for(let i=0;i<75;i++){const a=Math.random()*Math.PI*2,v=1+Math.random()*4;particles.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,life:1,h:[36,45,55,289,320][Math.floor(Math.random()*5)]})}}function animate(){ctx.clearRect(0,0,innerWidth,innerHeight);particles=particles.filter(p=>p.life>0);for(const p of particles){p.x+=p.vx;p.y+=p.vy;p.vy+=.03;p.life-=.012;ctx.globalAlpha=p.life;ctx.fillStyle=`hsl(${p.h} 100% 70%)`;ctx.beginPath();ctx.arc(p.x,p.y,Math.max(.2,p.life*2.5),0,Math.PI*2);ctx.fill()}ctx.globalAlpha=1;requestAnimationFrame(animate)}requestAnimationFrame(animate);$('shell').addEventListener('pointerdown',e=>{if(isFinal&&!e.target.closest('button'))burst(e.clientX,e.clientY)});document.addEventListener('keydown',e=>{if(step<0||e.target.closest('button'))return;if(e.key==='ArrowRight'){e.preventDefault();advance()}else if(e.key==='ArrowLeft'&&!isFinal){e.preventDefault();back()}});