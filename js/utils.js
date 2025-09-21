/* ===============================================
   南梁革命纪念馆 - 工具函数库
   =============================================== */

/**
 * 工具函数库
 * 包含常用的辅助函数和工具方法
 */

const Utils = {
    
    // ===================================
    // 日期时间工具
    // ===================================
    
    /**
     * 格式化日期
     * @param {Date|string|number} date - 日期对象、字符串或时间戳
     * @param {string} format - 格式化模式
     * @returns {string} 格式化后的日期字符串
     */
    formatDate(date, format = 'YYYY-MM-DD HH:mm:ss') {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');
        const seconds = String(d.getSeconds()).padStart(2, '0');
        
        return format
            .replace('YYYY', year)
            .replace('MM', month)
            .replace('DD', day)
            .replace('HH', hours)
            .replace('mm', minutes)
            .replace('ss', seconds);
    },
    
    /**
     * 获取相对时间
     * @param {Date|string|number} date - 日期
     * @returns {string} 相对时间字符串
     */
    getRelativeTime(date) {
        const now = new Date();
        const target = new Date(date);
        const diff = now - target;
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        
        if (days > 0) return `${days}天前`;
        if (hours > 0) return `${hours}小时前`;
        if (minutes > 0) return `${minutes}分钟前`;
        return '刚刚';
    },
    
    // ===================================
    // 字符串处理工具
    // ===================================
    
    /**
     * 安全的HTML转义
     * @param {string} str - 需要转义的字符串
     * @returns {string} 转义后的字符串
     */
    escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    },
    
    /**
     * 生成唯一ID
     * @param {string} prefix - ID前缀
     * @returns {string} 唯一ID
     */
    generateId(prefix = 'id') {
        return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    },
    
    /**
     * 截断文本
     * @param {string} text - 原文本
     * @param {number} length - 最大长度
     * @param {string} suffix - 后缀
     * @returns {string} 截断后的文本
     */
    truncateText(text, length = 100, suffix = '...') {
        if (text.length <= length) return text;
        return text.substring(0, length) + suffix;
    },
    
    /**
     * 将驼峰命名转换为短横线命名
     * @param {string} str - 驼峰命名字符串
     * @returns {string} 短横线命名字符串
     */
    camelToKebab(str) {
        return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
    },
    
    // ===================================
    // 数组和对象工具
    // ===================================
    
    /**
     * 深度克隆对象
     * @param {any} obj - 要克隆的对象
     * @returns {any} 克隆后的对象
     */
    deepClone(obj) {
        if (obj === null || typeof obj !== 'object') return obj;
        if (obj instanceof Date) return new Date(obj.getTime());
        if (obj instanceof Array) return obj.map(item => this.deepClone(item));
        if (typeof obj === 'object') {
            const cloned = {};
            Object.keys(obj).forEach(key => {
                cloned[key] = this.deepClone(obj[key]);
            });
            return cloned;
        }
    },
    
    /**
     * 数组去重
     * @param {Array} arr - 原数组
     * @param {string} key - 去重键名（对象数组时使用）
     * @returns {Array} 去重后的数组
     */
    uniqueArray(arr, key = null) {
        if (!key) return [...new Set(arr)];
        const seen = new Set();
        return arr.filter(item => {
            const value = item[key];
            if (seen.has(value)) return false;
            seen.add(value);
            return true;
        });
    },
    
    /**
     * 数组分组
     * @param {Array} arr - 原数组
     * @param {string|Function} key - 分组键或函数
     * @returns {Object} 分组后的对象
     */
    groupBy(arr, key) {
        return arr.reduce((groups, item) => {
            const group = typeof key === 'function' ? key(item) : item[key];
            groups[group] = groups[group] || [];
            groups[group].push(item);
            return groups;
        }, {});
    },
    
    // ===================================
    // DOM操作工具
    // ===================================
    
    /**
     * 创建DOM元素
     * @param {string} tag - 标签名
     * @param {Object} attributes - 属性对象
     * @param {string|Node} content - 内容
     * @returns {Element} DOM元素
     */
    createElement(tag, attributes = {}, content = '') {
        const element = document.createElement(tag);
        
        Object.keys(attributes).forEach(key => {
            if (key === 'className') {
                element.className = attributes[key];
            } else if (key === 'dataset') {
                Object.keys(attributes[key]).forEach(dataKey => {
                    element.dataset[dataKey] = attributes[key][dataKey];
                });
            } else {
                element.setAttribute(key, attributes[key]);
            }
        });
        
        if (typeof content === 'string') {
            element.innerHTML = content;
        } else if (content instanceof Node) {
            element.appendChild(content);
        }
        
        return element;
    },
    
    /**
     * 查找最近的父元素
     * @param {Element} element - 起始元素
     * @param {string} selector - 选择器
     * @returns {Element|null} 找到的父元素
     */
    closest(element, selector) {
        if (element.closest) {
            return element.closest(selector);
        }
        
        // 兼容旧浏览器
        while (element && element !== document) {
            if (element.matches && element.matches(selector)) {
                return element;
            }
            element = element.parentElement;
        }
        return null;
    },
    
    // ===================================
    // 性能优化工具
    // ===================================
    
    /**
     * 防抖函数
     * @param {Function} func - 要防抖的函数
     * @param {number} wait - 等待时间（毫秒）
     * @returns {Function} 防抖后的函数
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func.apply(this, args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    /**
     * 节流函数
     * @param {Function} func - 要节流的函数
     * @param {number} limit - 时间间隔（毫秒）
     * @returns {Function} 节流后的函数
     */
    throttle(func, limit) {
        let lastFunc;
        let lastRan;
        return function(...args) {
            if (!lastRan) {
                func.apply(this, args);
                lastRan = Date.now();
            } else {
                clearTimeout(lastFunc);
                lastFunc = setTimeout(() => {
                    if ((Date.now() - lastRan) >= limit) {
                        func.apply(this, args);
                        lastRan = Date.now();
                    }
                }, limit - (Date.now() - lastRan));
            }
        };
    },
    
    // ===================================
    // 文件处理工具
    // ===================================
    
    /**
     * 文件大小格式化
     * @param {number} bytes - 字节数
     * @param {number} decimals - 小数位数
     * @returns {string} 格式化后的大小
     */
    formatFileSize(bytes, decimals = 2) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    },
    
    /**
     * 读取文件为Base64
     * @param {File} file - 文件对象
     * @returns {Promise<string>} Base64字符串
     */
    fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
            reader.readAsDataURL(file);
        });
    },
    
    // ===================================
    // 验证工具
    // ===================================
    
    /**
     * 邮箱验证
     * @param {string} email - 邮箱地址
     * @returns {boolean} 是否有效
     */
    isValidEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    },
    
    /**
     * 手机号验证
     * @param {string} phone - 手机号
     * @returns {boolean} 是否有效
     */
    isValidPhone(phone) {
        const regex = /^1[3-9]\d{9}$/;
        return regex.test(phone);
    },
    
    /**
     * URL验证
     * @param {string} url - URL地址
     * @returns {boolean} 是否有效
     */
    isValidUrl(url) {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    },
    
    // ===================================
    // 存储工具
    // ===================================
    
    /**
     * 安全的localStorage操作
     */
    storage: {
        set(key, value) {
            try {
                localStorage.setItem(key, JSON.stringify(value));
                return true;
            } catch (error) {
                console.warn('localStorage写入失败:', error);
                return false;
            }
        },
        
        get(key, defaultValue = null) {
            try {
                const item = localStorage.getItem(key);
                return item ? JSON.parse(item) : defaultValue;
            } catch (error) {
                console.warn('localStorage读取失败:', error);
                return defaultValue;
            }
        },
        
        remove(key) {
            try {
                localStorage.removeItem(key);
                return true;
            } catch (error) {
                console.warn('localStorage删除失败:', error);
                return false;
            }
        },
        
        clear() {
            try {
                localStorage.clear();
                return true;
            } catch (error) {
                console.warn('localStorage清空失败:', error);
                return false;
            }
        }
    },
    
    // ===================================
    // 网络请求工具
    // ===================================
    
    /**
     * 简单的HTTP请求封装
     * @param {string} url - 请求URL
     * @param {Object} options - 请求选项
     * @returns {Promise} 请求Promise
     */
    async request(url, options = {}) {
        const defaultOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            timeout: 10000,
        };
        
        const config = { ...defaultOptions, ...options };
        
        try {
            const response = await fetch(url, config);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                return await response.json();
            } else {
                return await response.text();
            }
        } catch (error) {
            console.error('请求失败:', error);
            throw error;
        }
    },
    
    // ===================================
    // 设备检测工具
    // ===================================
    
    /**
     * 设备类型检测
     */
    device: {
        isMobile() {
            return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        },
        
        isTablet() {
            return /iPad|Android(?!.*Mobile)/i.test(navigator.userAgent);
        },
        
        isDesktop() {
            return !this.isMobile() && !this.isTablet();
        },
        
        isIOS() {
            return /iPad|iPhone|iPod/.test(navigator.userAgent);
        },
        
        isAndroid() {
            return /Android/.test(navigator.userAgent);
        },
        
        getViewportSize() {
            return {
                width: window.innerWidth || document.documentElement.clientWidth,
                height: window.innerHeight || document.documentElement.clientHeight
            };
        }
    },
    
    // ===================================
    // 动画工具
    // ===================================
    
    /**
     * 简单的动画函数
     * @param {Function} callback - 动画回调
     * @param {number} duration - 持续时间（毫秒）
     * @param {Function} easing - 缓动函数
     */
    animate(callback, duration = 300, easing = t => t) {
        const start = performance.now();
        
        function frame(time) {
            const progress = Math.min((time - start) / duration, 1);
            const value = easing(progress);
            callback(value);
            
            if (progress < 1) {
                requestAnimationFrame(frame);
            }
        }
        
        requestAnimationFrame(frame);
    },
    
    /**
     * 缓动函数集合
     */
    easing: {
        linear: t => t,
        easeInQuad: t => t * t,
        easeOutQuad: t => t * (2 - t),
        easeInOutQuad: t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
        easeInCubic: t => t * t * t,
        easeOutCubic: t => (--t) * t * t + 1,
        easeInOutCubic: t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
    },
    
    // ===================================
    // 错误处理工具
    // ===================================
    
    /**
     * 错误日志记录
     * @param {Error} error - 错误对象
     * @param {Object} context - 上下文信息
     */
    logError(error, context = {}) {
        const errorInfo = {
            message: error.message,
            stack: error.stack,
            timestamp: new Date().toISOString(),
            url: window.location.href,
            userAgent: navigator.userAgent,
            context: context
        };
        
        console.error('错误日志:', errorInfo);
        
        // 在生产环境中，这里可以发送错误报告到服务器
        if (typeof window.errorReporter === 'function') {
            window.errorReporter(errorInfo);
        }
    }
};

// 将Utils挂载到全局对象上
if (typeof window !== 'undefined') {
    window.Utils = Utils;
}

// Node.js环境下的导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Utils;
}

export default Utils;
