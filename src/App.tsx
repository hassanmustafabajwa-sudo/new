import {useCallback,useEffect,useRef,useState,type FormEvent,type ReactNode,type CSSProperties} from 'react'
import {AnimatePresence,MotionConfig,motion,useMotionValue,useMotionValueEvent,useScroll,useSpring,useTransform,type MotionValue} from 'framer-motion'
import {CAPS,PROJECTS,SERVICES,STEPS,type Project,TONES,TAGS} from './data'
import {CONTACT} from './config'
import {Journey} from './Journey'
import {Services,Final} from './Sections'

const ease=[.2,.8,.2,1] as const

const Mask=({children,d=0,on}:{children:ReactNode;d?:number;on?:boolean})=>(<span className="ln"><motion.span initial={{y:'105%'}} {...(on===undefined?{whileInView:{y:0},viewport:{once:true}}:{animate:{y:on?0:'105%'}})} transition={{duration:1,ease,delay:d}}>{children}</motion.span></span>)

function Intro({done}:{done:()=>void}){
  useEffect(()=>{const t=setTimeout(done,2200);addEventListener('keydown',done);return()=>{clearTimeout(t);removeEventListener('keydown',done)}},[done])
  return(<motion.div className="intro" onClick={done} role="button" tabIndex={0} aria-label="Skip intro" initial={{clipPath:'inset(0 0 0% 0)'}} exit={{clipPath:'inset(0 0 100% 0)'}} transition={{duration:1,ease:[.77,0,.18,1]}}>
    <div className="w" aria-hidden>{[...'VECTOR'].map((c,i)=><span key={i}><motion.i initial={{y:'105%'}} animate={{y:0}} transition={{duration:.8,ease,delay:i*.07}}>{c}</motion.i></span>)}</div><small>Click or press any key to skip</small></motion.div>)
}

function Mag({href,cls,children}:{href:string;cls:string;children:ReactNode}){
  const x=useMotionValue(0),y=useMotionValue(0),sx=useSpring(x,{stiffness:220,damping:16}),sy=useSpring(y,{stiffness:220,damping:16})
  return <motion.a href={href} className={cls} style={{x:sx,y:sy}} onPointerMove={e=>{const r=e.currentTarget.getBoundingClientRect();x.set((e.clientX-r.left-r.width/2)*.3);y.set((e.clientY-r.top-r.height/2)*.4)}} onPointerLeave={()=>{x.set(0);y.set(0)}}>{children}</motion.a>
}
function Mock({p,i}:{p:Project;i:number}){
  const [bg,fg,ac]=TONES[p.id]
  return(<div className={`mk v${i%3}`} style={{background:bg,color:fg,'--ac':ac} as CSSProperties} role="img" aria-label={`${p.name} concept preview`}>
    <div className="mb"><i/><i/><i/><span>{p.id}.com</span></div>
    <div className="mn"><b>{p.name}</b><span>About</span><span>Menu</span><span className="pill">Book</span></div>
    <div className="mt">{TAGS[p.id]}</div>
    <div className="mg"><div/><div/><div/></div></div>)
}
function Work({open}:{open:(id:string)=>void}){
  const ref=useRef<HTMLElement>(null),n=PROJECTS.length,[a,setA]=useState(0)
  const {scrollYProgress:p}=useScroll({target:ref,offset:['start start','end end']})
  const x=useTransform(p,[0,1],['0vw',`-${(n-1)*64}vw`]),w=useTransform(p,[0,1],['0%','100%'])
  useMotionValueEvent(p,'change',v=>setA(Math.min(n-1,Math.round(v*(n-1)))))
  return(<section id="work" ref={ref} className="hw" style={{height:`${n*75+25}vh`}} aria-labelledby="w-h"><div className="hs">
    <div className="whd wrap"><h2 id="w-h" className="big">Made to make an impact.</h2><p className="mut">Dummy concept projects. Edit src/data.ts to add real work.</p></div>
    <motion.div className="trk" style={{x}}>{PROJECTS.map((pr,i)=>(
      <article className="card" key={pr.id}><span className="num" aria-hidden>{String(i+1).padStart(2,'0')}</span>
        <motion.button className="mkw" onClick={()=>open(pr.id)} aria-label={`Open ${pr.name} case study`} whileHover={{y:-8}} transition={{duration:.5,ease}}><Mock p={pr} i={i}/><span className="vw">View case study</span></motion.button>
        <div className="cm"><h3>{pr.name}</h3><span className="mut">{String(i+1).padStart(2,'0')} — {pr.cat.toUpperCase()}</span></div><p className="mut cd">{pr.overview}</p></article>))}</motion.div>
    <div className="wp wrap" aria-hidden><span>{String(a+1).padStart(2,'0')} / {String(n).padStart(2,'0')}</span><div className="bar"><motion.i style={{width:w}}/></div></div></div></section>)
}

function Case({p,close}:{p:Project;close:()=>void}){
  const i=PROJECTS.indexOf(p),btn=useRef<HTMLButtonElement>(null)
  useEffect(()=>{btn.current?.focus();const k=(e:KeyboardEvent)=>{if(e.key==='Escape')close()};addEventListener('keydown',k);return()=>removeEventListener('keydown',k)},[close])
  const rows:[string,string][]=[['Project overview',p.overview],['Challenge',p.challenge],['Creative direction',p.direction],['Work delivered',p.delivered.join(', ')+'.']]
  return(<motion.section className="case" role="dialog" aria-modal aria-label={`${p.name} case study`} initial={{clipPath:'circle(0% at 50% 100%)'}} animate={{clipPath:'circle(150% at 50% 100%)'}} exit={{clipPath:'circle(0% at 50% 100%)'}} transition={{duration:.9,ease:[.77,0,.18,1]}}><div className="wrap">
    <button ref={btn} className="btn ghost" onClick={close}>Close case study</button><p className="mut" style={{marginTop:40}}>{p.cat}</p><h2 className="big">{p.name}</h2>
    <div className="im static"><Mock p={p} i={i}/></div>
    <div className="cols">{rows.map(([h,t])=><div className="cr" key={h}><h4>{h}</h4><p>{t}</p></div>)}</div><p className="mut note">Illustrative concept with placeholder artwork. Replace with real screenshots.</p></div></motion.section>)
}

function Process(){
  const ref=useRef<HTMLDivElement>(null),{scrollYProgress:p}=useScroll({target:ref,offset:['start 70%','end 60%']}),h=useTransform(p,[0,1],['0%','100%'])
  return(<section id="process" className="wrap hd" aria-labelledby="p-h"><h2 id="p-h" className="big" style={{maxWidth:'11ch'}}><Mask>From first thought</Mask><Mask d={.1}>to final experience.</Mask></h2>
    <div className="steps" ref={ref}><div className="rail"><motion.i style={{height:h}}/></div>
      {STEPS.map((s,i)=><motion.div className="stp" key={s[0]} initial={{opacity:.2,x:30}} whileInView={{opacity:1,x:0}} viewport={{amount:.6}} transition={{duration:.7,ease}}><span>Step {i+1}</span><h3>{s[0]}</h3><p>{s[1]}</p></motion.div>)}</div></section>)
}

type F={name:string;email:string;company:string;url:string;services:string[];budget:string;currency:string;details:string}
const EMPTY:F={name:'',email:'',company:'',url:'',services:[],budget:'',currency:'',details:''}
function Contact(){
  const [f,setF]=useState<F>(EMPTY),[er,setEr]=useState<Record<string,string>>({}),[st,setSt]=useState<{t:'idle'|'loading'|'ok'|'err';m?:string}>({t:'idle'})
  const set=<K extends keyof F>(k:K,v:F[K])=>setF(o=>({...o,[k]:v}))
  const submit=async(e:FormEvent)=>{e.preventDefault();const x:Record<string,string>={}
    if(f.name.trim().length<2)x.name='Enter your full name.'
    if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.email))x.email='Enter a valid work email.'
    if(!f.company.trim())x.company='Enter your company name.'
    if(f.url&&!/^https?:\/\/.+\..+/.test(f.url))x.url='Start the URL with http:// or https://.'
    if(!f.services.length)x.services='Select at least one service.'
    if(!f.budget)x.budget='Choose a budget range.'
    if(f.details.trim().length<10)x.details='Add a few details about the project.'
    setEr(x);if(Object.keys(x).length){setSt({t:'idle'});return}
    setSt({t:'loading'})
    try{const r=await fetch('/api/contact',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(f)})
      if(!r.ok){const j=await r.json().catch(()=>({}));throw new Error((j as {error?:string}).error||'Request failed')}
      setSt({t:'ok',m:`Sent. We will reply to ${f.email} soon.`});setF(EMPTY)}
    catch(err){setSt({t:'err',m:`Not sent: ${err instanceof Error?err.message:'network error'}. Try again or use WhatsApp or email.`})}}
  const Fld=({id,label,k,type='text',auto}:{id:string;label:string;k:'name'|'email'|'company'|'url'|'currency';type?:string;auto?:string})=>(<div className="f"><label htmlFor={id}>{label}</label><input id={id} type={type} autoComplete={auto} value={f[k]} onChange={e=>set(k,e.target.value)} aria-invalid={!!er[k]}/><span className="err">{er[k]}</span></div>)
  return(<section id="contact" className="wrap hd" aria-labelledby="c-h"><h2 id="c-h" className="big" style={{maxWidth:'11ch'}}><Mask>Let's build</Mask><Mask d={.1}>something that moves.</Mask></h2>
    <p className="mut" style={{marginTop:20}}>Have an ambitious idea? Tell us where you want to go.</p>
    <form onSubmit={submit} noValidate>{Fld({id:"n",label:"Full name",k:"name",auto:"name"})}{Fld({id:"e",label:"Work email",k:"email",type:"email",auto:"email"})}{Fld({id:"co",label:"Company",k:"company",auto:"organization"})}{Fld({id:"u",label:"Website URL (optional)",k:"url",type:"url"})}
      <fieldset className="f w"><legend>Services required</legend><div className="chips">{SERVICES.map(s=><label key={s}><input type="checkbox" checked={f.services.includes(s)} onChange={()=>set('services',f.services.includes(s)?f.services.filter(x=>x!==s):[...f.services,s])}/><span>{s}</span></label>)}</div><span className="err">{er.services}</span></fieldset>
      <div className="f"><label htmlFor="b">Estimated budget</label><select id="b" value={f.budget} onChange={e=>set('budget',e.target.value)}><option value="">Select a range</option><option>Under PKR 150,000</option><option>PKR 150,000 – 500,000</option><option>PKR 500,000 – 1,500,000</option><option>PKR 1,500,000+</option><option>International (state currency)</option></select><span className="err">{er.budget}</span></div>
      {Fld({id:"cu",label:"Currency and amount, if not PKR",k:"currency"})}
      <div className="f w"><label htmlFor="d">Project details</label><textarea id="d" rows={4} value={f.details} onChange={e=>set('details',e.target.value)}/><span className="err">{er.details}</span></div>
      <div className="f w btns"><button className="btn" type="submit" disabled={st.t==='loading'}>{st.t==='loading'?'Sending…':'Send project brief'}</button>{CONTACT.whatsapp&&<a className="btn ghost" target="_blank" rel="noopener" href={`https://wa.me/${CONTACT.whatsapp}`}>WhatsApp us</a>}{CONTACT.email&&<a className="btn ghost" href={`mailto:${CONTACT.email}`}>Email us</a>}</div>
      <p role="status" aria-live="polite" className={`w st-${st.t}`}>{st.m}</p></form></section>)
}

function Footer(){
  const [a,setA]=useState(0)
  const links=[CONTACT.email&&{n:CONTACT.email,u:`mailto:${CONTACT.email}`},CONTACT.whatsapp&&{n:'WhatsApp',u:`https://wa.me/${CONTACT.whatsapp}`},...CONTACT.socials.filter(s=>s.url).map(s=>({n:s.name,u:s.url as string}))].filter(Boolean) as {n:string;u:string}[]
  return(<footer className="wrap"><div className="g"><div><b className="logo">VECTOR</b><p className="mut" style={{maxWidth:'32ch',marginTop:12}}>A digital agency for websites, growth, and experiences that keep moving.</p></div>
    <div><b>Navigate</b><ul><li><a href="#services">Services</a></li><li><a href="#work">Work</a></li><li><a href="#process">Process</a></li><li><a href="#contact">Contact</a></li></ul></div>
    <div><b>Services</b><ul>{SERVICES.slice(0,4).map(s=><li key={s}>{s}</li>)}</ul></div>
    <div><b>Contact</b><ul>{links.length?links.map(l=><li key={l.n}><a href={l.u} rel="noopener">{l.n}</a></li>):<li className="mut">Set contact details in .env</li>}</ul></div></div>
    <div className="fm" onPointerMove={e=>setA((e.clientX/innerWidth-.5)*40)} aria-hidden><motion.svg viewBox="0 0 400 60" preserveAspectRatio="none" animate={{skewX:a}} transition={{type:'spring',stiffness:60,damping:15}}>{Array.from({length:40},(_,i)=><line key={i} x1={i*10} y1={60} x2={i*10+20} y2={0} stroke="#f2f2f0" strokeOpacity={.15+(i%4)/10}/>)}</motion.svg></div>
    <p className="mut" style={{fontSize:14,marginTop:24}}>© {new Date().getFullYear()} Vector. All rights reserved.</p></footer>)
}

export default function App(){
  const [ready,setReady]=useState(()=>{try{return !!sessionStorage.getItem('v')}catch{return false}})
  const [cid,setCid]=useState<string|null>(()=>location.hash.startsWith('#case-')?location.hash.slice(6):null)
  const finish=useCallback(()=>{setReady(true);try{sessionStorage.setItem('v','1')}catch{/* ignore */}},[])
  useEffect(()=>{document.body.style.overflow=(!ready||cid)?'hidden':''},[ready,cid])
  const open=useCallback((id:string)=>{history.pushState(null,'','#case-'+id);setCid(id)},[])
  const close=useCallback(()=>{if(location.hash.startsWith('#case-'))history.replaceState(null,'','#work');setCid(null)},[])
  useEffect(()=>{const h=()=>setCid(location.hash.startsWith('#case-')?location.hash.slice(6):null);addEventListener('popstate',h);return()=>removeEventListener('popstate',h)},[])
  const cp=PROJECTS.find(p=>p.id===cid)
  return(<MotionConfig reducedMotion="user">
    <AnimatePresence>{!ready&&<Intro key="i" done={finish}/>}</AnimatePresence>
    <nav><a href="#top" className="logo">VECTOR</a><ul><li><a href="#services">Services</a></li><li><a href="#work">Work</a></li><li><a href="#process">Process</a></li><li><a href="#contact">Contact</a></li></ul></nav>
    <main><Journey/><Work open={open}/><Services/><Process/><Final/><Contact/></main><Footer/>
    <AnimatePresence>{cp&&<Case key={cp.id} p={cp} close={close}/>}</AnimatePresence></MotionConfig>)
}
