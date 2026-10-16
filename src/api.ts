import {fresh,transition,publicState,counts,type GameState} from './engine';
import type {Option} from './story';

const PREFIX='eva::local::v2';
const API=(import.meta.env.VITE_API_URL||'').replace(/\/$/,'');
export const isDemo=!API;
const channel=typeof BroadcastChannel!=='undefined'?new BroadcastChannel('eva-sync'):null;

function storageRead():GameState{
 try {const raw=localStorage.getItem(PREFIX); if(raw){const s=JSON.parse(raw) as GameState;if(s?.version===1&&s?.sessionCode)return s;}}catch{}return fresh();
}
function storageWrite(s:GameState){localStorage.setItem(PREFIX,JSON.stringify(s));channel?.postMessage('updated');window.dispatchEvent(new Event('eva-state-updated'));}
function getVoterId():string{
 let id=localStorage.getItem('eva::anonymous-id');if(!id){id=crypto.randomUUID();localStorage.setItem('eva::anonymous-id',id)}return id;
}
async function request<T>(path:string,init:RequestInit={},key=''):Promise<T>{
 const response=await fetch(`${API}${path}`,{...init,headers:{'Content-Type':'application/json',...(key?{'X-EVA-ADMIN':key}:{}),...(init.headers||{})},cache:'no-store'});
 const data=await response.json().catch(()=>({error:'Resposta inválida do serviço.'}));
 if(!response.ok) throw new Error(data.error||'Não foi possível completar a operação.');
 return data as T;
}
export type PublicState=ReturnType<typeof publicState>;
export async function readState(adminKey=''):Promise<PublicState>{
 if(isDemo)return publicState(storageRead(),true);
 return request<PublicState>(adminKey?'/api/admin/state':'/api/state',{},adminKey);
}
export async function submitVote(option:Option['id']):Promise<{success:boolean;message:string}>{
 if(!isDemo)return request('/api/vote',{method:'POST',body:JSON.stringify({option,voterId:getVoterId()})});
 const s=storageRead();if(s.phase!=='voting')throw Error('A votação não está aberta.');
 const voter=getVoterId(),key=String(s.roundIndex);s.votes[key] ||= {};
 if(s.votes[key][voter])throw Error('Seu voto já foi registrado nesta rodada.');
 s.votes[key][voter]=option;s.updatedAt=Date.now();storageWrite(s);
 return {success:true,message:'Voto recebido. Sua escolha não aparece no telão.'};
}
export async function adminAction(action:'open'|'close'|'next'|'reset',adminKey:string,override?:Option['id']):Promise<PublicState>{
 if(!isDemo)return request('/api/admin/action',{method:'POST',body:JSON.stringify({action,override})},adminKey);
 const n=transition(storageRead(),action,override);storageWrite(n);return publicState(n,true);
}
export function getMyVote(roundIndex:number,runId:string):Option['id']|null{
 if(!isDemo)return sessionStorage.getItem(`eva:vote:${runId}:${roundIndex}`) as Option['id']||null;
 return storageRead().votes[String(roundIndex)]?.[getVoterId()]||null;
}
export function rememberVote(roundIndex:number,runId:string,opt:Option['id']){sessionStorage.setItem(`eva:vote:${runId}:${roundIndex}`,opt)}
export function onStateChange(f:()=>void){const handler=()=>f();window.addEventListener('storage',handler);window.addEventListener('eva-state-updated',handler);channel?.addEventListener('message',handler);return()=>{window.removeEventListener('storage',handler);window.removeEventListener('eva-state-updated',handler);channel?.removeEventListener('message',handler)}}
export {counts};
