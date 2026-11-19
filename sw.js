/* Service worker: primero la red (siempre la versión nueva) y, sin conexión, la última copia guardada */
const C='crm-venta-v5';
const PRE=['./','vendor/fonts.css','vendor/three.min.js','vendor/gsap.min.js','vendor/qr.js','vendor/fonts/space-grotesk-latin-wght-normal.woff2','vendor/fonts/jetbrains-mono-latin-wght-normal.woff2','manifest.webmanifest','icon-192.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(C).then(c=>Promise.all(PRE.map(u=>c.add(u).catch(()=>{})))).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C&&k.indexOf('crm-venta-')===0).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;
  const u=new URL(r.url);
  const ok=u.origin===location.origin;
  if(!ok)return;
  e.respondWith(fetch(r).then(res=>{if(res&&res.ok){const cp=res.clone();caches.open(C).then(c=>c.put(r,cp))}return res}).catch(()=>caches.match(r).then(m=>m||(r.mode==='navigate'?caches.match('./'):undefined))));
});
