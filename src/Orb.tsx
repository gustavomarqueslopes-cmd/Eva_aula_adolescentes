import {useEffect,useRef} from 'react';
export default function Orb({intensity=1,mode='care'}:{intensity?:number;mode?:'care'|'fracture'|'surge'}){
 const ref=useRef<HTMLCanvasElement>(null);
 useEffect(()=>{
  const canvas=ref.current;if(!canvas)return;const ctx=canvas.getContext('2d');if(!ctx)return;
  let raf=0,t=0;const nodes=Array.from({length:260},(_,i)=>{const a=i*2.399963229728653,z=1-2*(i+.5)/260,r=Math.sqrt(1-z*z);return {x:Math.cos(a)*r,y:z,z:Math.sin(a)*r,s:Math.random()*.4+.6}});
  const paint=()=>{
   const rect=canvas.getBoundingClientRect();const dpr=Math.min(2,window.devicePixelRatio||1);
   const w=Math.round(rect.width*dpr),h=Math.round(rect.height*dpr);if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;}
   ctx.clearRect(0,0,w,h); const min=Math.min(w,h);const cx=w/2,cy=h/2,r=min*.39;
   const rot=t*.0028;const col=mode==='fracture'?'255,94,121':mode==='surge'?'255,176,83':'94,231,252';
   const glow=ctx.createRadialGradient(cx,cy,0,cx,cy,r*1.5);glow.addColorStop(0,`rgba(${col},.19)`);glow.addColorStop(.42,`rgba(${col},.08)`);glow.addColorStop(1,'rgba(2,5,13,0)');ctx.fillStyle=glow;ctx.fillRect(0,0,w,h);
   ctx.save();ctx.translate(cx,cy);
   for(let ring=0;ring<3;ring++){
    ctx.save();ctx.rotate(rot*(ring%2?-1:1)*(.9+ring*.22)+ring*1.4);ctx.scale(1,.47+ring*.09);ctx.beginPath();ctx.ellipse(0,0,r*(1.08+ring*.18),r*(1.08+ring*.18),0,0,Math.PI*2);ctx.strokeStyle=`rgba(${col},${.27-ring*.065})`;ctx.lineWidth=Math.max(1,dpr)*(.85+ring*.18);ctx.stroke();ctx.restore();
   }
   const projected=nodes.map(n=>{const xx=n.x*Math.cos(rot)-n.z*Math.sin(rot);const zz=n.x*Math.sin(rot)+n.z*Math.cos(rot);const scale=1+.2*zz;return {x:xx*r*scale,y:n.y*r*scale,z:zz,s:n.s}});
   for(let i=0;i<projected.length;i++){
    const p=projected[i];if(p.z<-.18)continue;
    for(let j=i+1;j<Math.min(projected.length,i+21);j++){
     const q=projected[j];if(q.z<-.18)continue;
     const dx=p.x-q.x,dy=p.y-q.y,dist=dx*dx+dy*dy;
     if(dist<r*r*.14){ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.strokeStyle=`rgba(${col},${(.11+.1*Math.sin(t*.018+i))*(1-dist/(r*r*.14))})`;ctx.lineWidth=.75*dpr;ctx.stroke()}
    }
    ctx.beginPath();ctx.arc(p.x,p.y,(1.0+(p.z+1)*.8)*dpr*p.s,0,Math.PI*2);ctx.fillStyle=`rgba(${col},${.32+.6*(p.z+1)/2})`;ctx.fill();
   }
   ctx.restore();t+=intensity;raf=requestAnimationFrame(paint);
  };paint();return()=>cancelAnimationFrame(raf);
 },[intensity,mode]);
 return <canvas ref={ref} className="orb-canvas" aria-hidden="true"/>;
}
