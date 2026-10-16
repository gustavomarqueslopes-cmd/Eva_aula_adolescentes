import {applyEffects,initialTraits,rounds,winnerFromCounts,type Traits,type Option} from './story';
export type Phase='intro'|'voting'|'result'|'consequence'|'final';
export type History={roundIndex:number;winner:Option['id'];counts:Record<string,number>;at:number};
export type GameState={version:number;sessionCode:string;runId:string;phase:Phase;roundIndex:number;votes:Record<string,Record<string,Option['id']>>;winner:Option['id']|null;traits:Traits;history:History[];updatedAt:number};
export const fresh=():GameState=>({version:1,sessionCode:'EVA-01',runId:crypto.randomUUID(),phase:'intro',roundIndex:0,votes:{},winner:null,traits:{...initialTraits},history:[],updatedAt:Date.now()});
export const counts=(s:GameState):Record<string,number>=> Object.values(s.votes[String(s.roundIndex)]||{}).reduce((a,v)=>({...a,[v]:(a[v]||0)+1}),{A:0,B:0,C:0} as Record<string,number>);
export function transition(s:GameState,action:'open'|'close'|'next'|'reset',override?:Option['id']):GameState {
 if(action==='reset')return fresh();
 const n=structuredClone(s);
 if(action==='open' && n.phase==='intro') n.phase='voting';
 else if(action==='close' && n.phase==='voting'){
  const c=counts(n),v=winnerFromCounts(c);
  if(!v.winner && !override)throw Error(v.tied.length?'Empate. Escolha uma das opções empatadas no Estúdio.':'Nenhum voto foi recebido.');
  if(override && !v.tied.includes(override))throw Error('A opção escolhida não está empatada na liderança.');
  const w=override||v.winner!; const opt=rounds[n.roundIndex].options.find(o=>o.id===w)!;
  n.winner=w; n.traits=applyEffects(n.traits,opt.effects);
  n.history.push({roundIndex:n.roundIndex,winner:w,counts:c,at:Date.now()}); n.phase='result';
 }else if(action==='next' && n.phase==='result')n.phase='consequence';
 else if(action==='next' && n.phase==='consequence'){
  if(n.roundIndex>=rounds.length-1)n.phase='final';
  else {n.roundIndex++;n.winner=null;n.phase='intro';}
 }else throw Error('Esta ação não é permitida na fase atual.');
 n.updatedAt=Date.now();return n;
}
export function publicState(s:GameState,forAdmin=false){
 return {sessionCode:s.sessionCode,runId:s.runId,phase:s.phase,roundIndex:s.roundIndex,winner:s.winner,traits:s.traits,history:s.history,updatedAt:s.updatedAt,totalVotes:counts(s).A+counts(s).B+counts(s).C,counts:(forAdmin||!['voting','intro'].includes(s.phase))?counts(s):null};
}
