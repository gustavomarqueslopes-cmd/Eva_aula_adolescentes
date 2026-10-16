import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {join} from 'node:path';
const dir='.eva-engine-test';mkdirSync(dir,{recursive:true});
execFileSync('node',['node_modules/typescript/bin/tsc','src/story.ts','src/engine.ts','--outDir',dir,'--module','esnext','--moduleResolution','bundler','--target','es2022','--lib','es2022,dom','--skipLibCheck'],{stdio:'inherit'});
const js=readFileSync(join(dir,'engine.js'),'utf8').replace("from './story'","from './story.js'");writeFileSync(join(dir,'engine.js'),js);
writeFileSync(join(dir,'package.json'),'{"type":"module"}');
const {fresh,transition,publicState}=await import('../'+dir+'/engine.js');
let s=fresh();assert.equal(s.phase,'intro');
for(let i=0;i<6;i++){s=transition(s,'open');s.votes[String(i)]={a:'B',b:'B',c:'A'};s=transition(s,'close');assert.equal(s.winner,'B');s=transition(s,'next');assert.equal(s.phase,'consequence');s=transition(s,'next');assert.equal(s.phase,i===5?'final':'intro');}
assert.equal(s.history.length,6);assert.equal(publicState(s).history.length,6);
assert.equal(transition(s,'reset').history.length,0);
assert.throws(()=>transition(fresh(),'next'));
console.log('PASS: EVA 6 capítulos, consequência, final, reset e estados inválidos.');
