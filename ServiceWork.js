// ---- Static Assets Caching (Precache) ----
const STATIC_CACHE = 'static-v1';
const PRECACHE_URLS = [
  '/',              // SPA shell
  '/index.html',
  '/MainChat.html',
  '/favicon.ico',
  '/manifest.webmanifest',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => (k !== STATIC_CACHE ? caches.delete(k) : null)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;

  const isNavigation = req.mode === 'navigate';
  if (isNavigation) {
    event.respondWith(
      fetch(req).catch(() => caches.match('/offline.html'))
    );
    return;
  }

  // Static assets (CSS/JS/img) → cache-first
  if (req.destination === 'style' || req.destination === 'script' || req.destination === 'image' || req.destination === 'font') {
    event.respondWith(
      caches.match(req).then((cached) => {
        return (
          cached ||
          fetch(req).then((resp) => {
            const clone = resp.clone();
            caches.open(STATIC_CACHE).then((c) => c.put(req, clone));
            return resp;
          })
        );
      })
    );
    return;
  }
// })
// [Mã câu hỏi (qCode): LiXMun7Z].  
// Một chương trình server cho phép giao tiếp qua giao thức UDP tại cổng 2207. Yêu cầu là xây dựng một chương trình client trao đổi thông tin với server theo kịch bản:
// a. Gửi thông điệp là một chuỗi chứa mã sinh viên và mã câu hỏi theo định dạng “;studentCode;qCode”. Ví dụ: “;B15DCCN004;99D9F604”
// b. Nhận thông điệp là một chuỗi từ server theo định dạng “requestId;z1,z2,...,z50” requestId là chuỗi ngẫu nhiên duy nhất
//     z1 -> z50 là 50 số nguyên ngẫu nhiên
//     c. Thực hiện tính số lớn thứ hai và số nhỏ thứ hai của thông điệp trong z1 -> z50 và gửi thông điệp lên server theo định dạng “requestId;secondMax,secondMin”
//     d. Đóng socket và kết thúc chương trình