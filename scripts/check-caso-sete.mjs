import fs from 'node:fs';
import assert from 'node:assert/strict';
const scenes=JSON.parse(fs.readFileSync('src/case-scenes.json','utf8'));
const codes=JSON.parse(fs.readFileSync('src/codes-hashes.json','utf8'));
const app=fs.readFileSync('src/main.tsx','utf8');
assert.equal(scenes.length,14,'A aula exige 14 cenas.');
assert.equal(scenes[1].lines.length,8,'A história do Projeto Ponte exige oito atos.');
for (const [ix,scene] of scenes.entries()){
 assert.ok(scene.lines.length>0,`Cena ${ix+1} sem falas.`);
 for (const [n,line] of scene.lines.entries()) assert.ok(line.length>20 && line.length<360,`Cena ${ix+1}, fala ${n+1} incompleta ou longa demais.`);
}
const intro=scenes.slice(0,6).flatMap(s=>s.lines).join(' ');
assert.doesNotMatch(intro,/não autorizou (a )?(foto|divulgaç[aã]o de sua foto)|não autorizou divulgar/i,'O segredo de Lia não pode aparecer antes da revelação.');
assert.equal(scenes[6].kind,'alert','A revelação é a cena 7.');
assert.match(scenes[6].lines.join(' '),/Lia autorizou.*ensaio/i);
assert.match(scenes[7].label,/MARCOS 10:17/);
assert.match(scenes[9].action,/A3/);
assert.match(scenes[10].action,/FINAL/);
for(const k of [...['A','B','C','D'].flatMap(g=>[1,2,3].map(n=>`${g}${n}`)),'FINAL']){
 assert.match(codes[k]||'',/^[a-f\d]{64}$/i,`Hash ausente para ${k}`);
}
assert.ok(app.includes('BroadcastChannel'), 'Sincronização local ausente.');
assert.ok(app.includes('setAutoProject'), 'Controle de reprodução do Projeto Ponte ausente.');
assert.ok(app.includes('jumpWarning'), 'Aviso de revelação antecipada ausente.');
assert.ok(!app.includes('href="#/controle"><LayoutDashboard'), 'Link reservado do professor não pode aparecer no telão.');
assert.ok(app.includes('resetWarning'), 'Reset precisa exigir confirmação.');
assert.ok(app.includes('confirmReset'), 'Reset completo ausente.');
assert.ok(app.includes('setState(next)'), 'Transição de sessão precisa atualizar as duas janelas.');
assert.ok(app.includes('STAGE_BUS'), 'Detecção de telão ausente.');
assert.ok(!app.includes('setState(old=>{'), 'Gravação dentro do updater do React pode duplicar o reset no StrictMode.');
console.log('PASSOU: 14 cenas, oito quadros de introdução, segredo preservado, 13 códigos, controles e sincronização local.');