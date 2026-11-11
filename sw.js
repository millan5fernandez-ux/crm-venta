/* Service worker: primero la red (siempre la versión nueva) y, sin conexión, la última copia guardada */
const C='crm-v1';
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;
  const u=new URL(r.url);
  const ok=u.origin===location.origin||u.hostname==='cdnjs.cloudflare.com'||u.hostname==='fonts.googleapis.com'||u.hostname==='fonts.gstatic.com';
  if(!ok)return;
  e.respondWith(fetch(r).then(res=>{if(res&&res.ok){const cp=res.clone();caches.open(C).then(c=>c.put(r,cp))}return res}).catch(()=>caches.match(r).then(m=>m||(r.mode==='navigate'?caches.match('./'):undefined))));
});
