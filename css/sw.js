/* ===============================================
   南梁革命纪念馆 - Service Worker
   PWA功能支持和离线缓存
   =============================================== */

const CACHE_NAME = 'nangliang-memorial-v1.2.0';
const STATIC_CACHE = 'nangliang-static-v1.2.0';
const DYNAMIC_CACHE = 'nangliang-dynamic-v1.2.0';

// 需要缓存的静态资源
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/css/style.css',
    '/css/components.css',
    '/css/responsive.css',
    '/js/main.js',
    '/js/components.js',
    '/js/utils.js',
    '/js/jquery.min.js',
    '/manifest.json',
    '/images/logo.png',
    '/images/favicon.ico',
    // 可以添加更多静态资源
];

// 需要动态缓存的资源模式
const DYNAMIC_CACHE_PATTERNS = [
    /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
    /\.(?:css|js)$/,
    /^https:\/\/fonts\./,
    /^https:\/\/cdnjs\./
];

// 离线页面
const OFFLINE_PAGE = '/offline.html';

// Service Worker 安装事件
self.addEventListener('install', event => {
    console.log('[SW] 安装中...');
    
    event.waitUntil(
        Promise.all([
            // 缓存静态资源
            caches.open(STATIC_CACHE).then(cache => {
                console.log('[SW] 缓存静态资源');
                return cache.addAll(STATIC_ASSETS);
            }),
            
            // 跳过等待，立即激活
            self.skipWaiting()
        ])
    );
});

// Service Worker 激活事件
self.addEventListener('activate', event => {
    console.log('[SW] 激活中...');
    
    event.waitUntil(
        Promise.all([
            // 清理旧缓存
            cleanupOldCaches(),
            
            // 立即控制所有页面
            self.clients.claim()
        ])
    );
});

// 请求拦截和缓存策略
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);
    
    // 只处理 HTTP/HTTPS 请求
    if (!request.url.startsWith('http')) {
        return;
    }
    
    // 根据不同类型的请求采用不同的缓存策略
    if (isStaticAsset(request)) {
        // 静态资源：缓存优先策略
        event.respondWith(cacheFirst(request));
    } else if (isApiRequest(request)) {
        // API请求：网络优先策略
        event.respondWith(networkFirst(request));
    } else if (isImageRequest(request)) {
        // 图片资源：缓存优先，失败时使用占位图
        event.respondWith(imageRequest(request));
    } else {
        // 其他请求：网络优先，失败时返回离线页面
        event.respondWith(networkFirstWithOffline(request));
    }
});

// 推送消息处理
self.addEventListener('push', event => {
    console.log('[SW] 收到推送消息');
    
    let notificationData = {
        title: '南梁革命纪念馆',
        body: '有新的展览信息或活动通知',
        icon: '/images/logo.png',
        badge: '/images/badge.png',
        data: {
            url: '/'
        }
    };
    
    if (event.data) {
        try {
            notificationData = { ...notificationData, ...event.data.json() };
        } catch (error) {
            console.error('[SW] 推送数据解析失败:', error);
        }
    }
    
    event.waitUntil(
        self.registration.showNotification(notificationData.title, {
            body: notificationData.body,
            icon: notificationData.icon,
            badge: notificationData.badge,
            data: notificationData.data,
            requireInteraction: true,
            actions: [
                {
                    action: 'open',
                    title: '查看详情',
                    icon: '/images/open-icon.png'
                },
                {
                    action: 'close',
                    title: '关闭',
                    icon: '/images/close-icon.png'
                }
            ]
        })
    );
});

// 通知点击处理
self.addEventListener('notificationclick', event => {
    console.log('[SW] 通知被点击');
    
    event.notification.close();
    
    if (event.action === 'open' || !event.action) {
        const urlToOpen = event.notification.data?.url || '/';
        
        event.waitUntil(
            clients.matchAll({ type: 'window', includeUncontrolled: true })
                .then(clientList => {
                    // 查找是否已有窗口打开
                    for (const client of clientList) {
                        if (client.url === urlToOpen && 'focus' in client) {
                            return client.focus();
                        }
                    }
                    
                    // 如果没有找到，打开新窗口
                    if (clients.openWindow) {
                        return clients.openWindow(urlToOpen);
                    }
                })
        );
    }
});

// 后台同步
self.addEventListener('sync', event => {
    console.log('[SW] 后台同步:', event.tag);
    
    if (event.tag === 'background-sync-data') {
        event.waitUntil(syncData());
    }
});

// ===================================
// 缓存策略实现
// ===================================

/**
 * 缓存优先策略
 */
async function cacheFirst(request) {
    try {
        const cache = await caches.open(STATIC_CACHE);
        const cachedResponse = await cache.match(request);
        
        if (cachedResponse) {
            console.log('[SW] 从缓存返回:', request.url);
            return cachedResponse;
        }
        
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        console.error('[SW] 缓存优先策略失败:', error);
        return new Response('网络错误', { status: 503 });
    }
}

/**
 * 网络优先策略
 */
async function networkFirst(request) {
    try {
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        console.log('[SW] 网络请求失败，尝试缓存');
        
        const cache = await caches.open(DYNAMIC_CACHE);
        const cachedResponse = await cache.match(request);
        
        if (cachedResponse) {
            return cachedResponse;
        }
        
        return new Response('离线状态，数据不可用', { status: 503 });
    }
}

/**
 * 图片请求处理
 */
async function imageRequest(request) {
    try {
        const cache = await caches.open(DYNAMIC_CACHE);
        const cachedResponse = await cache.match(request);
        
        if (cachedResponse) {
            return cachedResponse;
        }
        
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        console.log('[SW] 图片加载失败，返回占位图');
        
        // 返回占位图或默认图片
        return fetch('/images/placeholder.png').catch(() => {
            return new Response('', { 
                status: 204,
                headers: { 'Content-Type': 'image/png' }
            });
        });
    }
}

/**
 * 网络优先，失败时返回离线页面
 */
async function networkFirstWithOffline(request) {
    try {
        return await fetch(request);
    } catch (error) {
        console.log('[SW] 网络不可用，返回离线页面');
        
        // 如果是导航请求，返回离线页面
        if (request.mode === 'navigate') {
            const cache = await caches.open(STATIC_CACHE);
            return cache.match(OFFLINE_PAGE) || cache.match('/index.html');
        }
        
        return new Response('离线状态', { status: 503 });
    }
}

// ===================================
// 工具函数
// ===================================

/**
 * 判断是否为静态资源
 */
function isStaticAsset(request) {
    return STATIC_ASSETS.some(asset => request.url.includes(asset)) ||
           request.url.includes('.css') ||
           request.url.includes('.js') ||
           request.url.includes('/fonts/');
}

/**
 * 判断是否为API请求
 */
function isApiRequest(request) {
    return request.url.includes('/api/') ||
           request.url.includes('/data/') ||
           request.method !== 'GET';
}

/**
 * 判断是否为图片请求
 */
function isImageRequest(request) {
    return DYNAMIC_CACHE_PATTERNS[0].test(request.url) ||
           request.destination === 'image';
}

/**
 * 清理旧缓存
 */
async function cleanupOldCaches() {
    const cacheNames = await caches.keys();
    const validCaches = [STATIC_CACHE, DYNAMIC_CACHE];
    
    return Promise.all(
        cacheNames
            .filter(cacheName => !validCaches.includes(cacheName))
            .map(cacheName => {
                console.log('[SW] 删除旧缓存:', cacheName);
                return caches.delete(cacheName);
            })
    );
}

/**
 * 数据同步
 */
async function syncData() {
    try {
        console.log('[SW] 执行后台数据同步');
        
        // 这里可以实现具体的数据同步逻辑
        // 例如：上传离线时收集的用户数据
        const offlineData = await getOfflineData();
        
        if (offlineData.length > 0) {
            await uploadOfflineData(offlineData);
            await clearOfflineData();
        }
        
        console.log('[SW] 数据同步完成');
    } catch (error) {
        console.error('[SW] 数据同步失败:', error);
        throw error; // 重新抛出错误，触发重试
    }
}

/**
 * 获取离线数据
 */
async function getOfflineData() {
    try {
        const db = await openIndexedDB();
        return await db.getAll('offline-data');
    } catch (error) {
        console.error('[SW] 获取离线数据失败:', error);
        return [];
    }
}

/**
 * 上传离线数据
 */
async function uploadOfflineData(data) {
    const response = await fetch('/api/sync', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    
    if (!response.ok) {
        throw new Error('数据上传失败');
    }
}

/**
 * 清理离线数据
 */
async function clearOfflineData() {
    try {
        const db = await openIndexedDB();
        await db.clear('offline-data');
    } catch (error) {
        console.error('[SW] 清理离线数据失败:', error);
    }
}

/**
 * 打开IndexedDB
 */
function openIndexedDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('nangliang-memorial', 1);
        
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);
        
        request.onupgradeneeded = event => {
            const db = event.target.result;
            
            if (!db.objectStoreNames.contains('offline-data')) {
                db.createObjectStore('offline-data', { keyPath: 'id', autoIncrement: true });
            }
        };
    });
}

// ===================================
// 性能监控
// ===================================

/**
 * 记录性能指标
 */
function logPerformance(label, startTime) {
    const duration = performance.now() - startTime;
    console.log(`[SW] ${label}: ${duration.toFixed(2)}ms`);
}

/**
 * 缓存统计
 */
async function getCacheStats() {
    const cacheNames = await caches.keys();
    const stats = {};
    
    for (const cacheName of cacheNames) {
        const cache = await caches.open(cacheName);
        const keys = await cache.keys();
        stats[cacheName] = keys.length;
    }
    
    console.log('[SW] 缓存统计:', stats);
    return stats;
}

// 定期清理和统计
setInterval(async () => {
    await getCacheStats();
    
    // 清理过期的动态缓存
    const cache = await caches.open(DYNAMIC_CACHE);
    const keys = await cache.keys();
    
    if (keys.length > 100) { // 限制动态缓存数量
        const oldestKeys = keys.slice(0, 20);
        await Promise.all(oldestKeys.map(key => cache.delete(key)));
        console.log('[SW] 清理了20个旧的动态缓存项');
    }
}, 60000); // 每分钟检查一次