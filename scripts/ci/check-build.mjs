import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { execFileSync } from 'node:child_process';
const root=process.cwd(),dist=path.join(root,'dist');
const fail=message=>{throw new Error(message)};
if(!fs.existsSync(path.join(dist,'index.html')))fail('Missing dist/index.html');
const context={window:{}};vm.createContext(context);
for(const name of ['content-refined.js','aplus-refined.js','video-data.js'])vm.runInContext(fs.readFileSync(path.join(root,'src/visual',name),'utf8'),context);
const d=context.window.PORTFOLIO;
if(d.projects.length!==3||d.projects.reduce((n,p)=>n+p.images.length,0)!==23||d.aplusWorks.length!==3||d.videos.length!==5||d.tools.length!==6)fail('Unexpected portfolio inventory; review content and update the contract deliberately.');
if(d.videos.map(v=>v.id).join(',')!=='film-03,film-01,film-02,film-04,film-05'||d.videos[0].duration!==27)fail('Unexpected video ordering or first-video duration.');
const refs=[];
for(const p of d.projects)for(const image of [...p.images,p.cover,p.hero].filter(Boolean))refs.push('assets/visual/'+image);
for(const p of d.aplusWorks)for(const key of ['cover','full','original'])refs.push('assets/aplus/'+p[key]);
for(const v of d.videos)for(const key of ['file','poster'])refs.push('assets/video-inline/'+v[key]);
for(const t of d.tools)for(const g of t.gallery)refs.push('assets/tools/'+g.image);
for(const ref of new Set(refs))if(!fs.existsSync(path.join(dist,ref)))fail('Missing referenced media: '+ref);
const walk=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]);
for(const file of walk(dist)){
 if(fs.statSync(file).size>=25*1024*1024)fail('File exceeds Free plan 25MB limit: '+path.relative(dist,file));
 if(/(^|[\\/])\.env(?:\.|$)|[\\/]\.edgeone[\\/]|\.map$/.test(file))fail('Private or debug file found in public build.');
}
// These files are for the preserved GitHub Pages fallback, not for EdgeOne.
for(const name of ['CNAME','.nojekyll'])fs.rmSync(path.join(dist,name),{force:true});
const commit=process.env.GITHUB_SHA||execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim();
if(!/^[a-f0-9]{40}$/.test(commit))fail('Invalid source commit');
fs.writeFileSync(path.join(dist,'release.json'),JSON.stringify({commit,host:'edgeone',builtAt:new Date().toISOString(),workflowRun:process.env.GITHUB_RUN_ID||null},null,2)+'\n');
console.log(JSON.stringify({build:'verified',mediaReferences:new Set(refs).size,commit,releaseMarker:'release.json'}));
