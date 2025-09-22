// js/main.js - 主JavaScript逻辑文件

// 预设的文物数据 - 所有访问者都能看到
const presetArtifactData = [
    {
        id: 1001,
        name: "秤锤",
        level: "国家一级文物",
        description: "陕甘边区苏维埃政府成立后，为了鼓励商人们公平交易，铸造秤锤。其正面上部铸苏维埃政府和一个五角星，下部铸壹佰斤字样。背面铸镰刀锤子标志和“公平交易”字样。",
        imageUrl: "https://i.ibb.co/j9YBgynM/7.jpg",
        imageData: "https://i.ibb.co/j9YBgynM/7.jpg",
        uploadTime: "2025-01-15 10:30:00",
        isPreset: true
    },
    {
        id: 1002,
        name: "铜锣锅",
        level: "国家一级文物",
        description: "1934年11月，陕甘边苏维埃政府在南梁成立，部队长期居住在荔园堡附近的村民家里，刘志丹、习仲勋等老一辈无产阶级革命家与当地群众同甘共苦、患难与共，建立了深厚的革命情谊，在习仲勋辗转离开南梁时，将使用的一口铜锣锅留存与王继兰大妈作为纪念",
        imageUrl: "https://i.ibb.co/Lz697Zfn/2.jpg",
        imageData: "https://i.ibb.co/Lz697Zfn/2.jpg",
        uploadTime: "2025-01-15 10:35:00",
        isPreset: true
    },
    {
        id: 1003,
        name: "国旗",
        level: "国家一级文物",
        description: "齐心老人于2014年9月25 日在深圳市捐赠与我馆的珍贵文物。",
        imageUrl: "https://i.ibb.co/spJVyQX6/1.jpg",
        imageData: "https://i.ibb.co/spJVyQX6/1.jpg",
        uploadTime: "2025-01-15 10:40:00",
        isPreset: true
    },
    {
        id: 1004,
        name: "军装",
        level: "国家一级文物",
        description: "齐心老人于2014年9月25 日在深圳市捐赠与我馆的珍贵文物",
        imageUrl: "https://i.ibb.co/WvnqLqbs/2.jpg",
        imageData: "https://i.ibb.co/WvnqLqbs/2.jpg",
        uploadTime: "2025-01-15 10:45:00",
        isPreset: true
    }
];

// 预设的教育资源数据
const presetResourceData = [
    {
        id: 2001,
        title: "南梁精神专题讲解",
        type: "讲解词",
        fileName: "南梁精神讲解.txt",
        content: `南梁精神专题讲解

南梁精神是"面向群众、坚守信念、顾全大局、求实开拓"，这是老一辈无产阶级革命家在陕甘边革命根据地创建和发展过程中形成的宝贵精神财富。

一、面向群众
南梁革命根据地的创建始终坚持群众路线，革命先辈们深入农村，发动群众，依靠群众，为群众谋利益。他们与人民群众血肉相连，始终保持着密切联系。

二、坚守信念  
无论面临多么严峻的考验，革命先辈们始终坚持共产主义信念不动摇。他们在艰难困苦中依然保持着对革命事业的绝对忠诚，为了人民的解放事业义无反顾。

三、顾全大局
在革命的关键时刻，南梁的革命者们总是以大局为重，个人服从集体，局部服从整体。他们深刻理解革命事业的整体性和统一性。

四、求实开拓
南梁革命根据地的建设充分体现了实事求是、开拓创新的精神品质。革命先辈们在实践中不断探索，勇于创新，开创了革命的新局面。

南梁精神是中华民族宝贵的精神财富，在新时代仍具有重要的指导意义和现实价值。`,
        uploadTime: "2024-01-15 11:00:00",
        isPreset: true
    },
    {
        id: 2002,
        title: "刘志丹革命事迹介绍",
        type: "思政素材",
        fileName: "刘志丹事迹.txt",
        content: `刘志丹革命事迹介绍

刘志丹（1903年10月4日—1936年4月14日），原名刘景桂，字子丹、志丹，陕西保安县（今志丹县）人，是中国共产党的优秀党员，杰出的无产阶级革命家、军事家，陕甘边区革命根据地的主要创建者和领导者。

主要革命历程：
1. 1922年加入中国社会主义青年团
2. 1925年转入中国共产党
3. 1928年领导渭华起义
4. 1931年创建陕甘边红军和革命根据地
5. 1934年任陕甘边区革命委员会主席
6. 1936年在东征战役中英勇牺牲

重要贡献：
- 创建了陕甘边革命根据地，为中央红军长征提供了落脚点
- 培养了大批革命骨干力量
- 建立了人民当家作主的苏维埃政权
- 为中国革命事业做出了巨大贡献

刘志丹的革命精神和崇高品格，永远值得我们学习和传承。`,
        uploadTime: "2024-01-15 11:15:00",
        isPreset: true
    }
];

// 全局变量
let artifactData = [];
let resourceData = [];
let currentPage = 1;
const itemsPerPage = 6;
let filteredData = [];

// 数据初始化函数
function initializeData() {
    // 从localStorage加载用户数据
    const storedArtifacts = JSON.parse(localStorage.getItem('artifactData')) || [];
    const storedResources = JSON.parse(localStorage.getItem('resourceData')) || [];
    
    // 合并预设数据和用户数据（预设数据在前）
    artifactData = [...presetArtifactData, ...storedArtifacts.filter(item => !item.isPreset)];
    resourceData = [...presetResourceData, ...storedResources.filter(item => !item.isPreset)];
    
    console.log('数据初始化完成:', {
        总文物数量: artifactData.length,
        预设文物: presetArtifactData.length,
        用户上传: storedArtifacts.filter(item => !item.isPreset).length
    });
}

// 修改保存函数，只保存用户上传的数据
function saveUserData() {
    const userArtifacts = artifactData.filter(item => !item.isPreset);
    const userResources = resourceData.filter(item => !item.isPreset);
    
    localStorage.setItem('artifactData', JSON.stringify(userArtifacts));
    localStorage.setItem('resourceData', JSON.stringify(userResources));
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    loadStoredData();
    animateOnScroll();
    
    window.addEventListener('scroll', function() {
        animateOnScroll();
        updateNavbar();
    });

    // 平滑滚动
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                // 更新导航激活状态
                document.querySelectorAll('.nav-item a').forEach(a => a.classList.remove('active'));
                this.classList.add('active');
                // 关闭移动菜单
                document.getElementById('navMenu').classList.remove('active');
            }
        });
    });

    // 点击模态框外部关闭
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal') || e.target.classList.contains('ai-chat-modal')) {
            e.target.classList.remove('show');
        }
    });
});

// 加载存储的数据
function loadStoredData() {
    try {
        initializeData(); // 使用新的初始化函数
        updateArtifactsDisplay();
        updateResourcesDisplay();
        updatePublicArtifacts();
    } catch (error) {
        console.error('加载数据时出错:', error);
    }
}

// 滚动动画
function animateOnScroll() {
    const elements = document.querySelectorAll('.animate-on-scroll');
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('visible');
        }
    });
}

// 导航栏滚动效果
function updateNavbar() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}

// 汉堡菜单切换
function toggleMenu() {
    document.getElementById('navMenu').classList.toggle('active');
}

// 外部链接功能
function openVRTour() {
    window.open('https://www.720yun.com/t/1bvkuqr9diq#scene_id=41808513', '_blank');
}

function openAIChat() {
    document.getElementById('aiChatModal').classList.add('show');
}

function closeAIChat() {
    document.getElementById('aiChatModal').classList.remove('show');
}

function sendAIMessage() {
    const input = document.getElementById('aiChatInput');
    const message = input.value.trim();
    if (!message) return;

    const messagesDiv = document.getElementById('aiChatMessages');
    messagesDiv.innerHTML += `<div class="user-message">${message}</div>`;
    input.value = '';

    // 模拟AI回复
    setTimeout(() => {
        const responses = [
            `关于"${message}"，这是南梁革命历史中的重要内容。南梁革命根据地是陕甘边革命根据地的中心，为中国革命做出了历史性贡献。`,
            `您询问的"${message}"涉及南梁精神的核心内容。"面向群众、坚守信念、顾全大局、求实开拓"的南梁精神是老一辈革命家留给我们的宝贵财富。`,
            `关于"${message}"，我可以为您详细介绍。南梁革命纪念馆收藏了大量珍贵文物，见证了那段光辉的革命历史。`,
            `您提到的"${message}"是南梁历史的重要组成部分。刘志丹、谢子长、习仲勋等革命先辈在这里建立了陕甘边革命根据地。`
        ];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        messagesDiv.innerHTML += `<div class="ai-message">${randomResponse}</div>`;
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }, 1000);
}

function openKnowledgeGraph() {
    showAlert('知识图谱功能开发中，敬请期待...', 'success');
}

function openAILearning() {
    openAIChat();
}

function openEducationProgram() {
    showAlert('红色课程体系正在建设中，敬请期待...', 'success');
}

function openEducationResources() {
    if (resourceData.length === 0) {
        showAlert('暂无教育资源，请联系管理员上传内容', 'error');
    } else {
        showResourcesList();
    }
}

// 显示资源列表 - 改进版本
function showResourcesList() {
    const modal = document.getElementById('artifactModal');
    const content = resourceData.map(resource => `
        <div class="list-item" onclick="viewResource(${resource.id})" style="cursor: pointer; transition: background 0.2s; padding: 15px; border-radius: 8px; margin-bottom: 10px; border: 1px solid #eee;">
            <div>
                <div class="item-title" style="font-weight: 600; color: #333; margin-bottom: 5px;">
                    ${resource.title}
                    ${resource.isPreset ? '<span style="color: #28a745; font-size: 12px;">[演示数据]</span>' : ''}
                </div>
                <div class="item-meta" style="color: #666; font-size: 14px;">${resource.type} | ${resource.uploadTime}</div>
            </div>
        </div>
    `).join('');
    
    document.getElementById('artifactDetails').innerHTML = `
        <h2 style="color: var(--primary-red); margin-bottom: 2rem; text-align: center;">教育资源库</h2>
        <div class="content-list" style="max-height: 400px; overflow-y: auto;">${content || '<div style="text-align: center; color: #666; padding: 40px;">暂无教育资源</div>'}</div>
    `;
    modal.classList.add('show');
}

// 搜索和筛选
function filterArtifacts() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const levelFilter = document.getElementById('levelFilter').value;

    filteredData = artifactData.filter(artifact => {
        const matchesSearch = artifact.name.toLowerCase().includes(searchTerm) || 
                            (artifact.description || '').toLowerCase().includes(searchTerm);
        const matchesLevel = !levelFilter || artifact.level === levelFilter;
        return matchesSearch && matchesLevel;
    });

    currentPage = 1;
    updatePublicArtifacts();
}

// 更新公开文物显示 - 修复版本，确保图片直接显示
function updatePublicArtifacts() {
    const container = document.getElementById('artifactsDisplay');
    const dataToShow = filteredData.length > 0 ? filteredData : artifactData;
    
    if (dataToShow.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <h3>文物展示</h3>
                <div class="stats-grid" style="margin-top: 2rem;">
                    <div class="stat-item"><span class="stat-number">7</span><span class="stat-label">国家一级文物</span></div>
                    <div class="stat-item"><span class="stat-number">16</span><span class="stat-label">国家二级文物</span></div>
                    <div class="stat-item"><span class="stat-number">324</span><span class="stat-label">国家三级文物</span></div>
                    <div class="stat-item"><span class="stat-number">4889</span><span class="stat-label">一般文物藏品</span></div>
                </div>
            </div>
        `;
        document.getElementById('pagination').innerHTML = '';
        return;
    }

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageItems = dataToShow.slice(start, end);

    container.innerHTML = `
        <div class="artifacts-grid">
            ${pageItems.map(artifact => `
                <div class="artifact-card" onclick="showArtifactDetails(${artifact.id})" style="cursor: pointer; transition: transform 0.3s; border-radius: 15px; overflow: hidden; box-shadow: 0 5px 20px rgba(0,0,0,0.1);">
                    <div class="artifact-image-container">
                        <img src="${artifact.imageUrl || artifact.imageData}" 
                             alt="${artifact.name}"
                             style="width: 100%; height: 200px; object-fit: cover; border-radius: 15px 15px 0 0;"
                             onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
                             onload="this.style.display='block'; this.nextElementSibling.style.display='none';">
                        <div class="image-placeholder" style="display: none; width: 100%; height: 200px; background: #f5f5f5; border-radius: 15px 15px 0 0; justify-content: center; align-items: center; color: #999; font-size: 14px;">
                            图片加载失败
                        </div>
                    </div>
                    <div class="info" style="padding: 15px;">
                        <div class="name" style="font-weight: 600; color: #333; margin-bottom: 8px; font-size: 16px;">${artifact.name}</div>
                        <div class="level" style="background: linear-gradient(45deg, #c41e3a, #8b1538); color: white; padding: 4px 12px; border-radius: 12px; font-size: 12px; display: inline-block;">${artifact.level}</div>
                        ${artifact.description ? `<div class="description" style="margin-top: 10px; color: #666; font-size: 14px; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${artifact.description.substring(0, 50)}...</div>` : ''}
                    </div>
                </div>
            `).join('')}
        </div>
    `;

    updatePagination(dataToShow.length);
}

// 更新分页
function updatePagination(totalItems) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const pagination = document.getElementById('pagination');
    
    if (totalPages <= 1) {
        pagination.innerHTML = '';
        return;
    }

    let html = '';
    for (let i = 1; i <= totalPages; i++) {
        html += `<button class="page-btn ${i === currentPage ? 'active' : ''}" onclick="goToPage(${i})">${i}</button>`;
    }
    pagination.innerHTML = html;
}

function goToPage(page) {
    currentPage = page;
    updatePublicArtifacts();
    document.getElementById('artifacts').scrollIntoView({ behavior: 'smooth' });
}

// 管理后台功能
function openAdmin() {
    document.getElementById('adminModal').classList.add('show');
}

function closeModal(modalId) {
    document.getElementById('adminModal').classList.remove('show');
    document.getElementById('artifactModal').classList.remove('show');
}

function adminLogin() {
    const password = document.getElementById('adminPassword').value;
    if (password === 'nangliang2024') {
        document.getElementById('adminLogin').style.display = 'none';
        document.getElementById('adminPanel').style.display = 'block';
        updateArtifactsDisplay();
        updateResourcesDisplay();
    } else {
        showAlert('密码错误！');
    }
}

function switchTab(tab) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.admin-content').forEach(content => content.classList.remove('active'));
    
    event.target.classList.add('active');
    document.getElementById(tab + 'Admin').classList.add('active');
}

// 在管理后台显示中区分预设数据和用户数据
function updateArtifactsDisplay() {
    const container = document.getElementById('artifactsGrid');
    const count = document.getElementById('artifactCount');
    
    if (count) {
        const userCount = artifactData.filter(item => !item.isPreset).length;
        const presetCount = artifactData.filter(item => item.isPreset).length;
        count.textContent = `${artifactData.length} (预设:${presetCount}, 用户:${userCount})`;
    }
    
    if (artifactData.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>暂无上传的文物</p></div>';
        return;
    }
    
    container.innerHTML = artifactData.map(artifact => `
        <div class="list-item">
            <div style="display: flex; align-items: center; gap: 15px;">
                <img src="${artifact.imageUrl || artifact.imageData}" alt="${artifact.name}" 
                     style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px; border: 2px solid #ddd;"
                     onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0yMCAyMEg0MFY0MEgyMFYyMFoiIGZpbGw9IiNEREREREQiLz4KPHRleHQgeD0iMzAiIHk9IjM1IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiM5OTk5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiPuWbvueJhzwvdGV4dD4KPC9zdmc+'">
                <div>
                    <div class="item-title">
                        ${artifact.name}
                        ${artifact.isPreset ? '<span style="color: #28a745; font-size: 12px;">[演示数据]</span>' : ''}
                    </div>
                    <div class="item-meta">${artifact.level} | ${artifact.uploadTime}</div>
                </div>
            </div>
            <div>
                <button class="btn-view" onclick="viewArtifact(${artifact.id})">查看</button>
                ${!artifact.isPreset ? `<button class="btn-delete" onclick="deleteArtifact(${artifact.id})">删除</button>` : ''}
            </div>
        </div>
    `).join('');
}

// 更新资源显示（管理后台）
function updateResourcesDisplay() {
    const container = document.getElementById('resourcesList');
    const count = document.getElementById('resourceCount');
    
    if (count) {
        const userCount = resourceData.filter(item => !item.isPreset).length;
        const presetCount = resourceData.filter(item => item.isPreset).length;
        count.textContent = `${resourceData.length} (预设:${presetCount}, 用户:${userCount})`;
    }
    
    if (resourceData.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>暂无上传的教育资源</p></div>';
        return;
    }
    
    container.innerHTML = resourceData.map(resource => `
        <div class="list-item">
            <div>
                <div class="item-title">
                    ${resource.title}
                    ${resource.isPreset ? '<span style="color: #28a745; font-size: 12px;">[演示数据]</span>' : ''}
                </div>
                <div class="item-meta">${resource.type} | ${resource.uploadTime}</div>
            </div>
            <div>
                <button class="btn-view" onclick="viewResource(${resource.id})">查看</button>
                ${!resource.isPreset ? `<button class="btn-delete" onclick="deleteResource(${resource.id})">删除</button>` : ''}
            </div>
        </div>
    `).join('');
}

// 查看文物详情
function viewArtifact(id) {
    showArtifactDetails(id);
}

function showArtifactDetails(id) {
    const artifact = artifactData.find(a => a.id === id);
    if (!artifact) return;
    
    const modal = document.getElementById('artifactModal');
    document.getElementById('artifactDetails').innerHTML = `
        <h2 style="color: var(--primary-red); text-align: center; margin-bottom: 1rem;">${artifact.name}</h2>
        <div style="text-align: center; margin-bottom: 2rem;">
            <span style="background: linear-gradient(45deg, var(--primary-red), var(--deep-red)); color: white; padding: 5px 15px; border-radius: 15px; font-size: 14px;">${artifact.level}</span>
        </div>
        <img src="${artifact.imageUrl || artifact.imageData}" alt="${artifact.name}" 
             style="width: 100%; max-width: 600px; height: auto; border-radius: 10px; box-shadow: 0 8px 25px rgba(0,0,0,0.15); display: block; margin: 20px auto;"
             onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
        <div style="display: none; text-align: center; padding: 40px; background: #f5f5f5; border-radius: 10px; color: #666;">
            图片加载失败，请检查图片链接
        </div>
        <div style="background: var(--bg-light); padding: 20px; border-radius: 10px; margin-top: 20px;">
            <h3 style="color: var(--primary-red); margin-bottom: 1rem;">文物介绍</h3>
            <p style="line-height: 1.8; font-size: 16px;">${artifact.description || '这件珍贵文物见证了南梁革命根据地的光辉历史，承载着深厚的红色文化内涵。'}</p>
        </div>
        <div style="text-align: center; margin-top: 2rem; color: var(--text-gray); font-size: 0.9rem;">
            上传时间：${artifact.uploadTime}
        </div>
    `;
    modal.classList.add('show');
}

// 查看资源
function viewResource(id) {
    const resource = resourceData.find(r => r.id === id);
    if (!resource) return;
    
    const modal = document.getElementById('artifactModal');
    document.getElementById('artifactDetails').innerHTML = `
        <h2 style="color: var(--primary-red); text-align: center; margin-bottom: 1rem;">${resource.title}</h2>
        <div style="text-align: center; margin-bottom: 2rem;">
            <span style="background: linear-gradient(45deg, var(--primary-red), var(--deep-red)); color: white; padding: 5px 15px; border-radius: 15px; font-size: 14px;">${resource.type}</span>
        </div>
        <div style="background: var(--bg-light); padding: 20px; border-radius: 10px;">
            <pre style="white-space: pre-wrap; font-family: inherit; line-height: 1.6; word-wrap: break-word;">${resource.content}</pre>
        </div>
        <div style="text-align: center; margin-top: 2rem; color: var(--text-gray); font-size: 0.9rem;">
            文件：${resource.fileName} | 上传时间：${resource.uploadTime}
        </div>
    `;
    modal.classList.add('show');
}

// 确保删除函数不会删除预设数据
function deleteArtifact(id) {
    const artifact = artifactData.find(a => a.id === id);
    if (artifact && artifact.isPreset) {
        showAlert('不能删除演示数据！', 'error');
        return;
    }
    
    if (confirm('确定要删除这个文物吗？')) {
        artifactData = artifactData.filter(a => a.id !== id);
        saveUserData();
        updateArtifactsDisplay();
        updatePublicArtifacts();
        showAlert('文物删除成功！', 'success');
    }
}

function deleteResource(id) {
    const resource = resourceData.find(r => r.id === id);
    if (resource && resource.isPreset) {
        showAlert('不能删除演示数据！', 'error');
        return;
    }
    
    if (confirm('确定要删除这个资源吗？')) {
        resourceData = resourceData.filter(r => r.id !== id);
        saveUserData();
        updateResourcesDisplay();
        showAlert('资源删除成功！', 'success');
    }
}

// 显示提示信息
function showAlert(message, type = 'error') {
    const alert = document.createElement('div');
    alert.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        padding: 1rem 2rem;
        border-radius: 10px;
        z-index: 3000;
        font-weight: 500;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        animation: fadeIn 0.3s ease;
        max-width: 400px;
        text-align: center;
    `;
    
    if (type === 'success') {
        alert.style.background = '#d4edda';
        alert.style.color = '#155724';
        alert.style.border = '1px solid #c3e6cb';
    } else if (type === 'info') {
        alert.style.background = '#d1ecf1';
        alert.style.color = '#0c5460';
        alert.style.border = '1px solid #bee5eb';
    } else {
        alert.style.background = '#f8d7da';
        alert.style.color = '#721c24';
        alert.style.border = '1px solid #f5c6cb';
    }
    
    alert.innerHTML = `
        ${message}
        <span onclick="this.parentElement.remove()" style="margin-left: 1rem; cursor: pointer; font-weight: bold; font-size: 18px;">&times;</span>
    `;
    
    document.body.appendChild(alert);
    
    setTimeout(() => {
        if (alert.parentElement) {
            alert.remove();
        }
    }, 5000);
}
