import assert from 'node:assert/strict';
const commit=process.env.GITHUB_SHA||process.argv[2];
assert.match(commit||'',/^[a-f0-9]{40}$/,'Expected full source commit');
const origin='https://chaojifeishu.xyz';
let lastError='';
for(let attempt=1;attempt<=18;attempt++){
 try{
  const response=await fetch(`${origin}/release.json?commit=${commit}&attempt=${attempt}`,{signal:AbortSignal.timeout(12000),headers:{'cache-control':'no-cache'}});
  assert.equal(response.status,200,'Release marker HTTP status');
  const release=await response.json();assert.equal(release.commit,commit,'The live domain must serve this exact source commit');assert.equal(release.host,'edgeone');
  const page=await fetch(`${origin}/?release=${commit}`,{signal:AbortSignal.timeout(12000)});assert.equal(page.status,200);
  const html=await page.text();assert.ok(html.includes('id="hero-feature"'));assert.ok(html.includes('id="reader-more"'));
  const refs=[...html.matchAll(/(?:src|href)="(\/assets\/[^"?#]+\.(?:js|css))/g)].map(m=>m[1]);assert.ok(refs.length>=2,'Production JS/CSS links');
  for(const asset of new Set(refs)){const r=await fetch(origin+asset,{method:'HEAD',signal:AbortSignal.timeout(12000)});assert.equal(r.status,200,asset)}
  const video=await fetch(origin+'/assets/video-inline/film-03-cut-27s.mp4',{headers:{Range:'bytes=0-1023'},signal:AbortSignal.timeout(12000)});
  assert.ok([200,206].includes(video.status),'Video reachable');await video.body?.cancel();
  console.log(JSON.stringify({live:'verified',origin,commit,assets:refs.length,videoStatus:video.status}));process.exit(0);
 }catch(error){lastError=error.message;console.log(`Waiting for the published build (${attempt}/18): ${lastError}`)}
 await new Promise(resolve=>setTimeout(resolve,10000));
}
throw new Error('Deployment could not be verified on the live domain: '+lastError);
