// js/main.js - 主JavaScript逻辑文件

// 全局变量 - 使用localStorage持久化
let artifactData = JSON.parse(localStorage.getItem('artifactData')) || [];
let resourceData = JSON.parse(localStorage.getItem('resourceData')) || [];
let currentPage = 1;
const itemsPerPage = 6;
let filteredData = [];

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

// 显示资源列表
function showResourcesList() {
    const modal = document.getElementById('artifactModal');
    const content = resourceData.map(resource => `
        <div class="list-item" onclick="viewResource(${resource.id})">
            <div>
                <div class="item-title">${resource.title}</div>
                <div class="item-meta">${resource.type} | ${resource.uploadTime}</div>
            </div>
        </div>
    `).join('');
    
    document.getElementById('artifactDetails').innerHTML = `
        <h2 style="color: var(--primary-red); margin-bottom: 2rem;">教育资源库</h2>
        <div class="content-list">${content}</div>
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

// 更新公开文物显示
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
                <div class="artifact-card" onclick="showArtifactDetails(${artifact.id})">
                    <img src="${artifact.imageData}" alt="${artifact.name}">
                    <div class="info">
                        <div class="name">${artifact.name}</div>
                        <div class="level">${artifact.level}</div>
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
    document.getElementById(modalId).classList.remove('show');
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
    `;
    
    if (type === 'success') {
        alert.style.background = '#d4edda';
        alert.style.color = '#155724';
        alert.style.border = '1px solid #c3e6cb';
    } else {
        alert.style.background = '#f8d7da';
        alert.style.color = '#721c24';
        alert.style.border = '1px solid #f5c6cb';
    }
    
    alert.innerHTML = `
        ${message}
        <span onclick="this.parentElement.remove()" style="margin-left: 1rem; cursor: pointer; font-weight: bold;">&times;</span>
    `;
    
    document.body.appendChild(alert);
    
    setTimeout(() => {
        if (alert.parentElement) {
            alert.remove();
        }
    }, 5000);
}