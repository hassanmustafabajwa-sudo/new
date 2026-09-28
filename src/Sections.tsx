import {useRef} from 'react'
import {motion,useScroll,useTransform} from 'framer-motion'
import {Stage} from './Journey'

const SV:[string,string][]=[['Performance marketing','Meta, Google, TikTok and YouTube campaigns built to make every click count.'],['Digital experiences','Immersive interfaces and brand worlds that move.'],['Websites','Fast, premium websites and landing pages.'],['E-commerce','Store design, optimisation, and Amazon PPC/FBA support.'],['SEO','Technical and strategic search visibility.'],['Content & social','Strategy, creative direction and management.'],['Growth strategy','Measurement, testing and continuous improvement.']]
export function Services(){
  return(<section id="services" className="wrap hd" aria-labelledby="sv-h"><h2 id="sv-h" className="big">What we build</h2>
    <ol className="sv">{SV.map(([n,d],i)=><motion.li key={n} initial={{opacity:.18,x:40}} whileInView={{opacity:1,x:0}} viewport={{amount:.7}} transition={{duration:.7,ease:[.2,.8,.2,1]}}><span className="mut">{String(i+1).padStart(2,'0')}</span><h3>{n}</h3><p className="mut">{d}</p></motion.li>)}</ol></section>)
}
export function Final(){
  const ref=useRef<HTMLElement>(null),{scrollYProgress:p}=useScroll({target:ref,offset:['start start','end end']})
  const wm=useTransform(p,[0,.62,.74],[1,1,0]),ro=useTransform(p,[.7,.82],[0,1]),ry=useTransform(p,[.7,.82],[40,0])
  return(<section ref={ref} className="fn" aria-label="Ready to move"><div className="jst"><Stage p={p} mode="final"/>
    <motion.h2 className="wm" style={{opacity:wm}}>VECTOR</motion.h2>
    <motion.div className="bt rdy" style={{opacity:ro,y:ry}}><h2 className="bt-h">Ready to move?</h2><p>Build something that moves.</p><a className="btn" href="#contact">Start a project →</a></motion.div></div></section>)
}
