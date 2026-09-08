import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const source=readFileSync(new URL('../src/scripts/workshop-video.js',import.meta.url),'utf8');
class Target {
 constructor(values={}){Object.assign(this,values);this.events={};}
 addEventListener(name,fn){(this.events[name]??=[]).push(fn);}
 emit(name){for(const fn of this.events[name]??[])fn({type:name});}
}
function setup({desktop=true,reduced=false,saveData=false,effectiveType='4g',observer=true,hidden=false,fail}={}){
 let intersect;
 const video=new Target({hidden:true,paused:true,ended:false,muted:true,currentTime:0,src:'',dataset:{src:'clip.mp4'},error:null,playCalls:0,loadCalls:0});
 video.getAttribute=name=>name==='src'?(video.src||null):null;
 video.load=()=>{video.loadCalls++;video.error=null};
 video.pause=()=>{video.paused=true;video.emit('pause')};
 video.play=async()=>{video.playCalls++;if(fail){const f=fail;fail=null;throw Object.assign(new Error(f),{name:f})}video.paused=false;video.ended=false;video.emit('play')};
 const poster=new Target({hidden:false}),toggle=new Target(),sound=new Target(),status=new Target({textContent:''}),frame={};
 const doc=new Target({hidden});doc.querySelector=s=>({'#verified-excerpt':video,'.excerpt-poster':poster,'.excerpt-toggle':toggle,'.excerpt-sound':sound,'#moment-status':status,'.moment-frame':frame}[s]);
 const wide=new Target({matches:desktop}),motion=new Target({matches:reduced}),connection=new Target({saveData,effectiveType});
 const context={document:doc,navigator:{connection},matchMedia:q=>q.includes('reduced-motion')?motion:wide};
 if(observer)context.IntersectionObserver=class{constructor(callback){intersect=callback}observe(){}};
 context.window=context;vm.runInNewContext(source,context);
 return{video,poster,toggle,sound,status,doc,wide,motion,connection,view:ratio=>intersect?.([{isIntersecting:ratio>0,intersectionRatio:ratio}])};
}
const settle=async()=>{await Promise.resolve();await Promise.resolve()};
let count=0;
async function test(name,fn){await fn();count++;console.log('PASS '+name)}
await test('Desktop waits for visibility, starts muted and stops offscreen without resuming',async()=>{
 const s=setup();assert.equal(s.video.src,'');s.view(.49);assert.equal(s.video.src,'');s.view(.6);await settle();assert.equal(s.video.paused,false);assert.equal(s.video.muted,true);assert.equal(s.video.loadCalls,1);s.view(0);assert.equal(s.video.paused,true);s.view(.8);await settle();assert.equal(s.video.playCalls,1);
});
for(const options of [{desktop:false},{reduced:true},{saveData:true},{effectiveType:'2g'},{effectiveType:'slow-2g'},{observer:false}])await test('Preference blocks loading but allows explicit play '+JSON.stringify(options),async()=>{
 const s=setup(options);s.view(1);await settle();assert.equal(s.video.src,'');s.toggle.emit('click');await settle();assert.equal(s.video.paused,false);assert.equal(s.video.muted,false);
});
await test('Explicit pause survives visibility and preference changes',async()=>{
 const s=setup();s.view(1);await settle();s.toggle.emit('click');s.view(0);s.view(1);s.wide.emit('change');await settle();assert.equal(s.video.paused,true);assert.equal(s.video.playCalls,1);
});
await test('Sound action restarts at zero and mute preserves playback',async()=>{
 const s=setup();s.view(1);await settle();s.video.currentTime=12;s.sound.emit('click');await settle();assert.equal(s.video.currentTime,0);assert.equal(s.video.muted,false);assert.equal(s.video.paused,false);s.sound.emit('click');assert.equal(s.video.muted,true);assert.equal(s.video.paused,false);
});
await test('Hidden tab postpones first autoplay, then pauses without resume',async()=>{
 const s=setup({hidden:true});s.view(1);assert.equal(s.video.src,'');s.doc.hidden=false;s.doc.emit('visibilitychange');await settle();assert.equal(s.video.paused,false);s.doc.hidden=true;s.doc.emit('visibilitychange');assert.equal(s.video.paused,true);s.doc.hidden=false;s.doc.emit('visibilitychange');await settle();assert.equal(s.video.playCalls,1);
});
await test('Changing reduced motion pauses an automatic run',async()=>{
 const s=setup();s.view(1);await settle();s.motion.matches=true;s.motion.emit('change');assert.equal(s.video.paused,true);
});
await test('Autoplay rejection keeps a poster and permits a user retry',async()=>{
 const s=setup({fail:'NotAllowedError'});s.view(1);await settle();assert.equal(s.poster.hidden,false);assert.equal(s.video.hidden,true);assert.match(s.status.textContent,/Press Play/);assert.equal(s.toggle.disabled,false);s.toggle.emit('click');await settle();assert.equal(s.video.paused,false);
});
await test('Interrupted pending autoplay restores the poster',async()=>{
 const s=setup({fail:'AbortError'});s.view(1);s.view(0);await settle();assert.equal(s.video.hidden,true);assert.equal(s.poster.hidden,false);assert.equal(s.sound.hidden,true);assert.equal(s.toggle.disabled,false);
});
await test('Network failure restores poster and retries loading',async()=>{
 const s=setup();s.view(1);await settle();s.video.error={code:2};s.video.emit('error');assert.equal(s.poster.hidden,false);assert.equal(s.video.hidden,true);s.toggle.emit('click');await settle();assert.equal(s.video.loadCalls,2);assert.equal(s.video.paused,false);
});
await test('End returns to the poster with a working Replay action',async()=>{
 const s=setup();s.view(1);await settle();s.video.currentTime=35.04;s.video.paused=true;s.video.ended=true;s.video.emit('ended');assert.equal(s.poster.hidden,false);assert.equal(s.toggle.textContent,'Replay workshop excerpt');s.toggle.emit('click');await settle();assert.equal(s.video.currentTime,0);assert.equal(s.video.hidden,false);assert.equal(s.video.paused,false);
});
console.log(`${count} playback contract cases passed.`);
