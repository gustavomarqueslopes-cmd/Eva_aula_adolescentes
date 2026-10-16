import {rounds,initialTraits,applyEffects,winnerFromCounts,type Traits,type Option} from '../../src/story';

type Env = {DB:D1Database;ADMIN_KEY:string;VOTER_PEPPER:string;CORS_ORIGIN:string};
type Phase='intro'|'voting'|'result'|'consequence'|'final';
type History={roundIndex:number;winner:'A'|'B'|'C';counts:Record<string,number>;at:number};
type Stored={runId:string;phase:Phase;roundIndex:number;winner:'A'|'B'|'C'|null;traits:Traits;history:History[];updatedAt:number};
const fresh=():Stored=>({runId:crypto.randomUUID(),phase:'intro',roundIndex:0,winner:null,traits:{...initialTraits},history:[],updatedAt:Date.now()});
const json=(data:unknown,status=200,headers:HeadersInit={})=>new Response(JSON.stringify(data),{status,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store',...headers}});
const error=(message:string,status=400)=>json({error:message},status);
const isOption=(v:unknown):v is 'A'|'B'|'C'=>v==='A'||v==='B'||v==='C';
async function initialized(db:D1Database){await db.prepare('INSERT OR IGNORE INTO app_state(id,payload) VALUES(1,?)').bind(JSON.stringify(fresh())).run();}
async function getStored(db:D1Database):Promise<Stored>{await initialized(db);const r=await db.prepare('SELECT payload FROM app_state WHERE id=1').first<{payload:string}>();return JSON.parse(r!.payload) as Stored;}
async function save(db:D1Database,s:Stored){s.updatedAt=Date.now();await db.prepare('UPDATE app_state SET payload=? WHERE id=1').bind(JSON.stringify(s)).run();}
async function tally(db:D1Database,roundIndex:number){const result=await db.prepare('SELECT choice,COUNT(*) AS n FROM votes WHERE round_index=? GROUP BY choice').bind(roundIndex).all<{choice:string,n:number}>();return (result.results||[]).reduce((obj,row)=>({...obj,[row.choice]:row.n}),{A:0,B:0,C:0} as Record<string,number>);}
async function exposed(db:D1Database,showCounts=false){const s=await getStored(db),c=await tally(db,s.roundIndex);return {sessionCode:'EVA-01',runId:s.runId,phase:s.phase,roundIndex:s.roundIndex,winner:s.winner,traits:s.traits,history:s.history,updatedAt:s.updatedAt,totalVotes:c.A+c.B+c.C,counts:showCounts||!['intro','voting'].includes(s.phase)?c:null};}
async function fingerprint(input:string,pepper:string){const bytes=new TextEncoder().encode(`${pepper}:${input}`),digest=await crypto.subtle.digest('SHA-256',bytes);return Array.from(new Uint8Array(digest)).map(x=>x.toString(16).padStart(2,'0')).join('')}
async function authorized(request:Request,env:Env){const input=request.headers.get('X-EVA-ADMIN');if(!env.ADMIN_KEY||!input)return false;const left=await fingerprint(input,env.VOTER_PEPPER),right=await fingerprint(env.ADMIN_KEY,env.VOTER_PEPPER);return left===right;}
async function body(request:Request){if(Number(request.headers.get('Content-Length')||0)>8192)throw Error('Corpo da requisição excede o limite.');return request.json() as Promise<Record<string,unknown>>;}
export default {async fetch(req:Request,env:Env):Promise<Response>{
 const origin=req.headers.get('Origin')||'';const allowed=env.CORS_ORIGIN||'';
 const cors:Record<string,string>={'Vary':'Origin','Access-Control-Allow-Methods':'GET,POST,OPTIONS','Access-Control-Allow-Headers':'Content-Type,X-EVA-ADMIN'};
 if(origin===allowed)cors['Access-Control-Allow-Origin']=origin;
 if(req.method==='OPTIONS')return new Response(null,{status:204,headers:cors});
 if(origin&&origin!==allowed)return error('Origem não permitida.',403);
 try{
  const {pathname}=new URL(req.url);
  if(pathname==='/api/health'&&req.method==='GET')return json({status:'ok',product:'EVA',version:1},200,cors);
  if(!env.VOTER_PEPPER) return json({error:'VOTER_PEPPER não configurado no servidor.'},503,cors);
  if(pathname==='/api/state'&&req.method==='GET')return json(await exposed(env.DB),200,cors);
  if(pathname.startsWith('/api/admin/') && !(await authorized(req,env)))return json({error:'Chave administrativa inválida.'},401,cors);
  if(pathname==='/api/admin/state'&&req.method==='GET')return json(await exposed(env.DB,true),200,cors);
  if(pathname==='/api/vote'&&req.method==='POST'){
   const input=await body(req);const option=input.option,voterId=input.voterId;
   if(!isOption(option)||typeof voterId!=='string'||voterId.length<16||voterId.length>128)return json({error:'Voto inválido.'},400,cors);
   const s=await getStored(env.DB);if(s.phase!=='voting')return json({error:'A votação não está aberta.'},409,cors);
   const digest=await fingerprint(voterId,env.VOTER_PEPPER);
   try{
    const r=await env.DB.prepare(`INSERT INTO votes(round_index,voter_digest,choice)
       SELECT ?,?,? WHERE EXISTS(SELECT 1 FROM app_state WHERE id=1
       AND json_extract(payload,'$.phase')='voting'
       AND CAST(json_extract(payload,'$.roundIndex') AS INTEGER)=?)`).bind(s.roundIndex,digest,option,s.roundIndex).run();
    if(r.meta.changes!==1)return json({error:'A votação foi encerrada.'},409,cors);
    return json({success:true,message:'Voto recebido.'},200,cors);
   }catch(e){if(String(e).toLowerCase().includes('unique'))return json({error:'Este dispositivo já votou nesta rodada.'},409,cors);throw e}
  }
  if(pathname==='/api/admin/action'&&req.method==='POST'){
   const input=await body(req),action=input.action,override=input.override;
   const s=await getStored(env.DB);
   if(action==='reset'){await env.DB.batch([env.DB.prepare('DELETE FROM votes'),env.DB.prepare('UPDATE app_state SET payload=? WHERE id=1').bind(JSON.stringify(fresh()))]);return json(await exposed(env.DB,true),200,cors)}
   if(action==='open'&&s.phase==='intro'){s.phase='voting';await save(env.DB,s);return json(await exposed(env.DB,true),200,cors)}
   if(action==='close'&&s.phase==='voting'){
    const c=await tally(env.DB,s.roundIndex),v=winnerFromCounts(c);
    if(!v.winner&&!isOption(override))return json({error:v.tied.length?'Empate. Escolha uma opção empatada para continuar.':'Ainda não há votos registrados.'},409,cors);
    if(override && (!isOption(override)||!v.tied.includes(override)))return json({error:'É permitido escolher somente entre as opções líderes empatadas.'},409,cors);
    const selected=isOption(override)?override:v.winner!;
    const option=rounds[s.roundIndex].options.find(x=>x.id===selected)!;
    s.traits=applyEffects(s.traits,option.effects);s.winner=selected;s.phase='result';s.history.push({roundIndex:s.roundIndex,winner:selected,counts:c,at:Date.now()});await save(env.DB,s);return json(await exposed(env.DB,true),200,cors)
   }
   if(action==='next'&&s.phase==='result'){s.phase='consequence';await save(env.DB,s);return json(await exposed(env.DB,true),200,cors)}
   if(action==='next'&&s.phase==='consequence'){if(s.roundIndex===rounds.length-1)s.phase='final';else {s.roundIndex++;s.phase='intro';s.winner=null}await save(env.DB,s);return json(await exposed(env.DB,true),200,cors)}
   return json({error:'Transição inválida para a fase atual.'},409,cors);
  }
  return json({error:'Rota não encontrada.'},404,cors)
 }catch(e){return json({error:String(e instanceof Error?e.message:e)},500,cors)}
}};
