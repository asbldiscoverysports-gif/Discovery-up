const CACHE = "discovery-up-v2";
const CORE = ["./","./index.html","./styles.css","./animations.css","./app.js","./manifest.webmanifest","./logo-discovery-up.svg","./icon-192.png","./icon-512.png","./assets/discovery-sports.webp","./assets/pulse/recovery.webp",...Array.from({length:12},(_,i)=>`./assets/pulse/level-${String(i+1).padStart(2,"0")}.webp`)];
self.addEventListener("install",event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(CORE)));self.skipWaiting()});
self.addEventListener("activate",event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)))));self.clients.claim()});
self.addEventListener("fetch",event=>{if(event.request.method!=="GET")return;event.respondWith(caches.match(event.request).then(hit=>hit||fetch(event.request).then(response=>{const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(event.request,copy));return response}).catch(()=>caches.match("./index.html"))))});
