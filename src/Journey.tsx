import {useEffect,useRef,type ReactNode} from 'react'
import {motion,useScroll,useSpring,useTransform,useVelocity,type MotionValue} from 'framer-motion'
import {PLATFORMS} from './platforms'

const D=1000,F=380
const cl=(v:number,a=0,b=1)=>Math.min(b,Math.max(a,v)),sm=(v:number)=>v*v*(3-2*v)
const win=(t:number,a:number,b:number,f=.02)=>cl((t-a)/f)*cl((b-t)/f)
const rng=(s:number)=>()=>{s|=0;s=(s+0x6D2B79F5)|0;let t=Math.imul(s^(s>>>15),1|s);t=(t+Math.imul(t^(t>>>7),61|t))^t;return((t^(t>>>14))>>>0)/4294967296}
const MEDIA=PLATFORMS.map((q,i)=>q.media?i:-1).filter(i=>i>=0)

export function Stage({p,mode}:{p:MotionValue<number>;mode:'journey'|'final'}){
  const ref=useRef<HTMLCanvasElement>(null),{scrollY}=useScroll(),vel=useSpring(useVelocity(scrollY),{stiffness:80,damping:30})
  useEffect(()=>{
    const cv=ref.current;if(!cv)return
    const g=cv.getContext('2d');if(!g)return
    const rm=matchMedia('(prefers-reduced-motion:reduce)').matches,mob=matchMedia('(max-width:800px)').matches,R=rng(7)
    const NP=PLATFORMS.length,nL=mob?18:44,paths=PLATFORMS.map(q=>new Path2D(q.path))
    const L=Array.from({length:nL},(_,i)=>({pl:Math.floor(i*NP/nL),a:R()*6.283,r:.3+R()*.9,z:R()*D,s:R()-.5,h:-1,x:0,y:0,al:0}))
    L.forEach(e=>{const f=PLATFORMS[e.pl].family;e.h=L.findIndex(o=>PLATFORMS[o.pl].hub&&PLATFORMS[o.pl].family===f)})
    const Wn=Array.from({length:mob?6:12},()=>({a:R()*6.283,r:.25+R()*.7,z:R()*D,s:R()-.5,k:R()}))
    const Mz=Array.from({length:mob?6:10},()=>({a:R()*6.283,r:.3+R()*.8,z:R()*D,s:R()-.5,k:R()}))
    const Pt=Array.from({length:mob?60:180},()=>({x:R(),y:R(),sp:.3+R()*.7,ph:R()*6.283}))
    let W=1,H=1,raf=0,vis=true,mpx=0,mpy=0,mtx=0,mty=0
    const rs=()=>{const d=Math.min(devicePixelRatio||1,mob?1:1.5),r=cv.getBoundingClientRect();W=cv.width=Math.max(1,r.width*d);H=cv.height=Math.max(1,r.height*d)}
    rs()
    const io=new IntersectionObserver(e=>{vis=e[0].isIntersecting});io.observe(cv)
    const pm=(e:PointerEvent)=>{mtx=e.clientX/innerWidth-.5;mty=e.clientY/innerHeight-.5}
    addEventListener('resize',rs);addEventListener('pointermove',pm,{passive:true})
    const draw=(now:number)=>{
      raf=requestAnimationFrame(draw);if(!vis)return
      mpx+=(mtx-mpx)*.06;mpy+=(mty-mpy)*.06
      const tm=rm?0:now/1000,t=p.get(),vv=rm?0:cl(Math.abs(vel.get())/2500)
      const cx=W/2+mpx*W*.03,cy=H/2+mpy*H*.03,S=Math.min(W,H)*.5,u=Math.min(W,H)*.09
      let lk=0,dimOn=true
      g.clearRect(0,0,W,H);g.lineWidth=Math.max(1,W/1600)
      // logos never sit unreadably behind the central typography
      const logo=(e:{pl:number},x:number,y:number,sz:number,al:number,rot:number,free=false)=>{
        if(!free&&dimOn&&Math.abs(x-cx)<W*.36&&Math.abs(y-cy)<H*.11)al*=.12
        if(al<.01)return
        g.save();g.translate(x,y);g.rotate(rot);g.scale(sz/24,sz/24);g.translate(-12,-12);g.fillStyle=`rgba(242,242,240,${al})`;g.fill(paths[e.pl]);g.restore()}
      const frame=(px:number,py:number,w:number,al:number,rot:number,i:number)=>{
        if(al<.01)return;const h=w*.62
        g.save();g.translate(px,py);g.rotate(rot)
        g.fillStyle=`rgba(12,12,12,${al*.9})`;g.strokeStyle=`rgba(242,242,240,${al*.55})`;g.fillRect(-w/2,-h/2,w,h);g.strokeRect(-w/2,-h/2,w,h)
        g.fillStyle=`rgba(242,242,240,${al*.5})`;for(let d=0;d<3;d++)g.fillRect(-w/2+w*.04+d*w*.04,-h/2+h*.05,w*.02,w*.02)
        g.fillStyle=`rgba(242,242,240,${al*.85})`;g.fillRect(-w*.4,-h*.15,w*.5*(.6+((i*7)%4)/10),h*.1)
        g.fillStyle=`rgba(242,242,240,${al*.2})`;for(let d=0;d<3;d++)g.fillRect(-w*.4,h*.02+d*h*.12,w*(.7-d*.15),h*.05)
        g.fillRect(w*.15,-h*.42,w*.25,h*.25);g.restore()}
      if(mode==='journey'){
        const cam=D*cl((t-.05)/.25)+Math.max(0,t-.36)*500
        const chaos=cl((t-.14)/.1)*(1-cl((t-.28)/.04)),fz=sm(cl((t-.27)/.03))*(1-cl((t-.36)/.01)),k=sm(cl((t-.36)/.08))
        const amp=.15+1.6*chaos+1.2*vv,eco=sm(cl((t-.03)/.05))*(1-sm(cl((t-.45)/.03)))
        dimOn=k<.2||t>.5;lk=sm(cl((t-.12)/.08))*(1-k)*.2
        L.forEach(e=>{
          const zr=((((e.z-cam)%D)+D)%D)*(1-k)+520*k,pr=F/Math.max(zr,60)
          const ang=e.a+e.s*(t*3+tm*.08*(1-fz)*amp),rad=e.r*(1+.1*Math.sin(tm*.6+e.z)*(1-fz)*amp)*(1-k*.97)
          e.x=cx+Math.cos(ang)*rad*S*pr;e.y=cy+Math.sin(ang)*rad*S*pr*.8
          e.al=sm(cl(zr/180))*sm(cl((D-zr)/200))*(.3+.7*(1-zr/D))*eco
          logo(e,e.x,e.y,u*PLATFORMS[e.pl].scale*pr*1.3,e.al,Math.sin(tm*.4+e.a)*.15*amp)})
        // PERFORMANCE: platforms orbit the headline, signals stream outward
        const wp=win(t,.54,.65)
        if(wp>.01){
          L.forEach(e=>{const q=PLATFORMS[e.pl];if(!q.perf)return;const a=e.a+(tm*.15+t*5)*(.6+e.s*.4),rr=.8+e.r*.3
            logo(e,cx+Math.cos(a)*W*.34*rr,cy+Math.sin(a)*H*.3*rr,u*1.5*q.scale,wp*.85,0)})
          for(let i=0;i<Pt.length/2;i++){const q=Pt[i],r=(tm*q.sp*.15+t*3+q.x)%1,c=Math.cos(q.ph),s=Math.sin(q.ph)
            g.strokeStyle=`rgba(242,242,240,${wp*.35*(1-r)})`;g.beginPath();g.moveTo(cx+c*S*r*2.2,cy+s*S*r*1.6);g.lineTo(cx+c*S*(r+.06)*2.2,cy+s*S*(r+.06)*1.6);g.stroke()}}
        // DIGITAL: browser surfaces fly in, then assemble into two rows
        const wd=win(t,.65,.76)
        if(wd>.01){
          const as=sm(cl((t-.66)/.07)),c2=t*1400,cols=mob?3:6
          Wn.forEach((e,i)=>{
            const zr=(((e.z-c2)%D)+D)%D,pr=F/Math.max(zr,80),ang=e.a+e.s*t*2
            const sx=cx+Math.cos(ang)*e.r*S*pr*1.4,sy=cy+Math.sin(ang)*e.r*S*pr*.9
            const tx=cx+((i%cols)-(cols-1)/2)*W*(mob?.3:.16),ty=cy+(Math.floor(i/cols)%2?1:-1)*H*.3
            const w=(W*.13*pr*1.6)*(1-as)+W*(mob?.26:.14)*as
            frame(sx+(tx-sx)*as,sy+(ty-sy)*as,w,wd*(sm(cl(zr/150))*(1-as)+as*.9),(1-as)*e.s*.8,i)})}
        // CREATIVE: image/video-like surfaces pass through the camera
        const wc=win(t,.76,.87)
        if(wc>.01){
          const c3=t*1700
          Mz.forEach((e,i)=>{
            const zr=(((e.z-c3)%D)+D)%D,pr=F/Math.max(zr,80),ang=e.a+e.s*t*3
            const wv=(e.k>.5?.34:.2)*W*pr*1.2,hh=e.k>.5?wv*.6:wv*1.7,x1=cx+Math.cos(ang)*e.r*S*pr*1.5,y1=cy+Math.sin(ang)*e.r*S*pr*.9
            let al=wc*sm(cl(zr/160))*sm(cl((D-zr)/250));if(Math.abs(x1-cx)<W*.36&&Math.abs(y1-cy)<H*.14)al*=.25
            if(al<.02)return
            g.save();g.translate(x1,y1);g.rotate(e.s*.6+Math.sin(tm*.3+i)*.05)
            const gr=g.createLinearGradient(-wv/2,-hh/2,wv/2,hh/2);gr.addColorStop(0,`rgba(60,60,58,${al})`);gr.addColorStop(1,`rgba(170,170,166,${al})`)
            g.fillStyle=gr;g.fillRect(-wv/2,-hh/2,wv,hh)
            g.fillStyle=`rgba(10,10,10,${al*.6})`;g.beginPath();g.moveTo(-wv*.06,-wv*.08);g.lineTo(wv*.08,0);g.lineTo(-wv*.06,wv*.08);g.fill()
            g.translate(-wv*.4,-hh*.42);logo({pl:MEDIA[i%MEDIA.length]},0,0,Math.max(6,wv*.12),al,0,true);g.restore()})}
        // DATA: streams, nodes, numeric fragments, tracking path
        const wa=win(t,.87,1.01)
        if(wa>.01){
          g.font=`${Math.max(9,Math.round(u*.16))}px ui-monospace,monospace`
          Pt.forEach((q,i)=>{
            const f=(tm*q.sp*.03+q.x+t*1.2)%1,px=f*W,py=H*(.15+.7*q.y)+Math.sin(f*7+q.ph)*H*.07*(1+vv)
            let a=wa*(.15+.5*q.sp)*sm(cl(Math.min(f,1-f)*6));if(Math.abs(py-cy)<H*.1)a*=.3
            g.fillStyle=`rgba(242,242,240,${a})`;g.strokeStyle=`rgba(242,242,240,${a*.6})`
            g.fillRect(px,py,2*(1+q.sp),2*(1+q.sp))
            g.beginPath();g.moveTo(px,py);g.lineTo(px-W*.025*q.sp,py-Math.cos(f*7+q.ph)*H*.175*.025*q.sp);g.stroke()
            if(i%9===0)g.fillText((q.y*100).toFixed(1),px+6,py-6)
            if(i%12===0){g.beginPath();g.arc(px,py,u*.12*(1+.4*Math.sin(tm*2+q.ph)),0,6.283);g.stroke()}})
          const gp=cl((t-.87)/.1);g.strokeStyle=`rgba(242,242,240,${wa*.5})`;g.beginPath()
          for(let i=0;i<=60&&i/60<=gp;i++){const gx=W*(.08+.84*i/60),gy=H*.9-H*.12*(.5+.3*Math.sin(i*.35)+i/90);if(i)g.lineTo(gx,gy);else g.moveTo(gx,gy)}
          g.stroke()}
      }else{
        // FINAL: the same platforms, calm, orbiting VECTOR and fading until only the wordmark remains
        const fo=1-sm(cl((t-.3)/.3)),rsz=1-sm(cl((t-.1)/.5))*.85;lk=fo*.15
        L.forEach(e=>{
          const a=e.a+tm*.05*(.4+e.r*.3)+t*(e.s>0?1:-1),r=(.55+e.r*.55)*rsz,pr=.55+(1-e.z/D)*.6
          e.x=cx+Math.cos(a)*r*S*1.2;e.y=cy+Math.sin(a)*r*S*.85;e.al=fo*(.3+.5*pr)
          logo(e,e.x,e.y,u*PLATFORMS[e.pl].scale*pr,e.al,0)})}
      if(lk>.01)L.forEach((e,i)=>{if(e.h<0||e.h===i)return;const h=L[e.h],a=Math.min(e.al,h.al)*lk;if(a<.01)return
        g.strokeStyle=`rgba(242,242,240,${a})`;g.beginPath();g.moveTo(e.x,e.y);g.lineTo(h.x,h.y);g.stroke()})
    }
    raf=requestAnimationFrame(draw)
    return()=>{cancelAnimationFrame(raf);io.disconnect();removeEventListener('resize',rs);removeEventListener('pointermove',pm)}
  },[p,mode,vel])
  return <canvas ref={ref} aria-hidden/>
}

export function Beat({p,a,b,keep,children}:{p:MotionValue<number>;a:number;b:number;keep?:boolean;children:ReactNode}){
  const o=useTransform(p,[a,a+.015,b-.015,b],[0,1,1,keep?1:0]),y=useTransform(p,[a,b],[30,-30])
  return <motion.div className="bt" style={{opacity:o,y}}>{children}</motion.div>
}
const Scene=({p,a,b,t,s,keep}:{p:MotionValue<number>;a:number;b:number;t:string;s:string;keep?:boolean})=><Beat p={p} a={a} b={b} keep={keep}><h2 className="bt-h">{t}</h2><p>{s}</p></Beat>

export function Journey(){
  const ref=useRef<HTMLElement>(null),{scrollYProgress:p}=useScroll({target:ref,offset:['start start','end end']})
  const wo=useTransform(p,[0,.03,.25,.36,.44,.54,.57],[0,1,.5,.6,1,1,0]),cue=useTransform(p,[0,.03],[1,0])
  return(<section id="top" ref={ref} className="jy" aria-label="VECTOR digital ecosystem"><div className="jst">
    <Stage p={p} mode="journey"/>
    <motion.h1 className="wm" style={{opacity:wo}}>VECTOR<span className="sr"> — we build digital experiences that don't stand still.</span></motion.h1>
    <motion.span className="cue" style={{opacity:cue}} aria-hidden>Scroll</motion.span>
    <a className="skip" href="#work">Skip to work</a>
    <Beat p={p} a={.44} b={.545}><h2 className="bt-h">One business.<br/>Many channels.</h2><p>Strategy, technology and growth — connected.</p></Beat>
    <Scene p={p} a={.555} b={.645} t="Performance" s="Make every click count."/>
    <Scene p={p} a={.655} b={.755} t="Digital" s="Don't just exist online."/>
    <Scene p={p} a={.765} b={.865} t="Creative" s="Get remembered."/>
    <Scene p={p} a={.875} b={1} t="Data" s="Know what moves." keep/>
  </div></section>)
}
