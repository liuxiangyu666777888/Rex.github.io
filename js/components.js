// 文物管理相关功能 - 修复版本
function uploadArtifact() {
    console.log('开始添加文物...');
    
    const name = document.getElementById('artifactName').value.trim();
    const level = document.getElementById('artifactLevel').value;
    const description = document.getElementById('artifactDescription').value.trim();
    const imageUrl = document.getElementById('artifactImageUrl').value.trim(); // 改为URL
    
    if (!name || !imageUrl) {
        showAlert('请填写文物名称和图片URL！');
        return;
    }

    // 验证URL
    try {
        new URL(imageUrl);
    } catch (error) {
        showAlert('请输入有效的图片URL！');
        return;
    }

    // GitHub blob链接检测
    if (imageUrl.includes('github.com') && imageUrl.includes('/blob/')) {
        showAlert('检测到GitHub blob链接！请改用：\n1. raw.githubusercontent.com 链接\n2. 或 GitHub Pages 链接', 'error');
        return;
    }

    try {
        const artifact = {
            id: Date.now(),
            name: name,
            level: level,
            description: description,
            imageUrl: imageUrl,  // 直接保存URL
            uploadTime: new Date().toLocaleString()
        };
        
        artifactData.push(artifact);
        localStorage.setItem('artifactData', JSON.stringify(artifactData));
        
        document.getElementById('artifactName').value = '';
        document.getElementById('artifactDescription').value = '';
        document.getElementById('artifactImageUrl').value = '';
        
        updateArtifactsDisplay();
        updatePublicArtifacts();
        showAlert('文物添加成功！', 'success');
    } catch (error) {
        console.error('添加错误:', error);
        showAlert('添加失败！', 'error');
    }
}

// 上传资源
function uploadResource() {
    console.log('开始上传资源...'); // 添加调试日志
    
    const title = document.getElementById('resourceTitle').value.trim();
    const type = document.getElementById('resourceType').value;
    const fileInput = document.getElementById('resourceFile');
    const file = fileInput.files[0];
    
    if (!title || !file) {
        showAlert('请填写资源标题并选择文件！');
        return;
    }

    // 检查文件大小 - 20MB限制
    const maxSize = 20 * 1024 * 1024; // 20MB
    if (file.size > maxSize) {
        showAlert(`文件大小不能超过20MB，当前文件大小：${(file.size / (1024 * 1024)).toFixed(2)}MB`);
        return;
    }

    showAlert('正在上传资源，请稍候...', 'info');

    const reader = new FileReader();
    
    reader.onload = function(e) {
        try {
            const resource = {
                id: Date.now(),
                title: title,
                type: type,
                fileName: file.name,
                content: e.target.result,
                uploadTime: new Date().toLocaleString()
            };
            
            resourceData.push(resource);
            localStorage.setItem('resourceData', JSON.stringify(resourceData));
            
            // 清空表单
            document.getElementById('resourceTitle').value = '';
            document.getElementById('resourceFile').value = '';
            
            updateResourcesDisplay();
            showAlert('教育资源上传成功！', 'success');
        } catch (error) {
            console.error('资源上传错误:', error);
            showAlert('上传失败，请重试！', 'error');
        }
    };
    
    reader.onerror = function(error) {
        console.error('文件读取错误:', error);
        showAlert('文件读取失败，请重试！', 'error');
    };
    
    reader.readAsText(file, 'UTF-8');
}

// 更新文物显示（管理后台）
function updateArtifactsDisplay() {
    const container = document.getElementById('artifactsGrid');
    const count = document.getElementById('artifactCount');
    
    if (count) count.textContent = artifactData.length;
    
    if (artifactData.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>暂无上传的文物</p></div>';
        return;
    }
    
    container.innerHTML = artifactData.map(artifact => `
        <div class="list-item">
            <div>
                <div class="item-title">${artifact.name}</div>
                <div class="item-meta">${artifact.level} | ${artifact.uploadTime}</div>
            </div>
            <div>
                <button class="btn-view" onclick="viewArtifact(${artifact.id})">查看</button>
                <button class="btn-delete" onclick="deleteArtifact(${artifact.id})">删除</button>
            </div>
        </div>
    `).join('');
}

// 更新资源显示（管理后台）
function updateResourcesDisplay() {
    const container = document.getElementById('resourcesList');
    const count = document.getElementById('resourceCount');
    
    if (count) count.textContent = resourceData.length;
    
    if (resourceData.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>暂无上传的教育资源</p></div>';
        return;
    }
    
    container.innerHTML = resourceData.map(resource => `
        <div class="list-item">
            <div>
                <div class="item-title">${resource.title}</div>
                <div class="item-meta">${resource.type} | ${resource.uploadTime}</div>
            </div>
            <div>
                <button class="btn-view" onclick="viewResource(${resource.id})">查看</button>
                <button class="btn-delete" onclick="deleteResource(${resource.id})">删除</button>
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
        <img src="${artifact.imageUrl}" alt="${artifact.name}" style="width: 100%; max-width: 600px; height: auto; border-radius: 10px; box-shadow: 0 8px 25px rgba(0,0,0,0.15); display: block; margin: 20px auto;">
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
            <pre style="white-space: pre-wrap; font-family: inherit; line-height: 1.6;">${resource.content}</pre>
        </div>
        <div style="text-align: center; margin-top: 2rem; color: var(--text-gray); font-size: 0.9rem;">
            文件：${resource.fileName} | 上传时间：${resource.uploadTime}
        </div>
    `;
    modal.classList.add('show');
}

// 删除功能
function deleteArtifact(id) {
    if (confirm('确定要删除这个文物吗？')) {
        artifactData = artifactData.filter(a => a.id !== id);
        localStorage.setItem('artifactData', JSON.stringify(artifactData));
        updateArtifactsDisplay();
        updatePublicArtifacts();
        showAlert('文物删除成功！', 'success');
    }
}

function deleteResource(id) {
    if (confirm('确定要删除这个资源吗？')) {
        resourceData = resourceData.filter(r => r.id !== id);
        localStorage.setItem('resourceData', JSON.stringify(resourceData));
        updateResourcesDisplay();
        showAlert('资源删除成功！', 'success');
    }
}

// AI聊天组件增强功能
class AIAssistant {
    constructor() {
        this.responses = {
            greetings: [
                "您好！我是小南，南梁革命纪念馆的AI智能讲解员。",
                "欢迎来到南梁革命纪念馆！我是您的专属导览员小南。",
                "很高兴为您服务！我对南梁历史非常了解。"
            ],
            historical_figures: {
                "刘志丹": "刘志丹（1903-1936），陕甘边革命根据地的主要创建者和领导者之一，被毛泽东称赞为'群众领袖，民族英雄'。",
                "谢子长": "谢子长（1897-1935），陕甘边革命根据地的重要创建者，被称为'陕北红军和苏区创建人之一'。",
                "习仲勋": "习仲勋（1913-2002），陕甘边革命根据地的重要领导人，新中国成立后担任多项重要职务。"
            },
            nangliang_spirit: "南梁精神是'面向群众、坚守信念、顾全大局、求实开拓'，这是老一辈无产阶级革命家留给我们的宝贵精神财富。",
            museum_info: "南梁革命纪念馆位于甘肃省庆阳市华池县，是国家二级博物馆，全国爱国主义教育示范基地，馆藏文物5236件。"
        };
    }

    generateResponse(userMessage) {
        const message = userMessage.toLowerCase();
        
        // 问候检测
        if (this.containsKeywords(message, ['你好', '您好', 'hello', '嗨'])) {
            return this.getRandomResponse(this.responses.greetings);
        }
        
        // 历史人物检测
        for (const [figure, description] of Object.entries(this.responses.historical_figures)) {
            if (message.includes(figure)) {
                return description;
            }
        }
        
        // 南梁精神检测
        if (this.containsKeywords(message, ['南梁精神', '精神', '理念'])) {
            return this.responses.nangliang_spirit;
        }
        
        // 纪念馆信息检测
        if (this.containsKeywords(message, ['纪念馆', '博物馆', '地址', '位置', '开放时间'])) {
            return this.responses.museum_info;
        }
        
        // 默认回复
        return `关于"${userMessage}"，这是南梁革命历史中的重要内容。南梁革命根据地为中国革命做出了历史性贡献，如果您需要了解更多具体信息，请告诉我您最感兴趣的方面。`;
    }

    containsKeywords(text, keywords) {
        return keywords.some(keyword => text.includes(keyword));
    }

    getRandomResponse(responses) {
        return responses[Math.floor(Math.random() * responses.length)];
    }
}

// 初始化AI助手
const aiAssistant = new AIAssistant();

// 重写发送AI消息函数，使用增强的AI助手
function sendAIMessage() {
    const input = document.getElementById('aiChatInput');
    const message = input.value.trim();
    if (!message) return;

    const messagesDiv = document.getElementById('aiChatMessages');
    messagesDiv.innerHTML += `<div class="user-message">${message}</div>`;
    input.value = '';

    // 使用AI助手生成回复
    setTimeout(() => {
        const response = aiAssistant.generateResponse(message);
        messagesDiv.innerHTML += `<div class="ai-message">${response}</div>`;
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }, 800);

    // 滚动到底部
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// 表单验证组件（保持不变，但更新文件大小限制）
class FormValidator {
    static validateArtifactForm() {
        const name = document.getElementById('artifactName').value.trim();
        const file = document.getElementById('artifactImage').files[0];
        
        if (!name) {
            showAlert('请输入文物名称');
            return false;
        }
        
        if (!file) {
            showAlert('请选择文物图片');
            return false;
        }
        
        // 检查文件类型
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            showAlert('请选择有效的图片文件（JPG、PNG、GIF、WebP）');
            return false;
        }
        
        // 检查文件大小（最大20MB）
        if (file.size > 20 * 1024 * 1024) {
            showAlert('图片文件大小不能超过20MB');
            return false;
        }
        
        return true;
    }

    static validateResourceForm() {
        const title = document.getElementById('resourceTitle').value.trim();
        const file = document.getElementById('resourceFile').files[0];
        
        if (!title) {
            showAlert('请输入资源标题');
            return false;
        }
        
        if (!file) {
            showAlert('请选择资源文件');
            return false;
        }
        
        // 检查文件大小（最大20MB）
        if (file.size > 20 * 1024 * 1024) {
            showAlert('文件大小不能超过20MB');
            return false;
        }
        
        return true;
    }
}

// 增强的上传函数（加入验证）
function uploadArtifactWithValidation() {
    if (!FormValidator.validateArtifactForm()) {
        return;
    }
    uploadArtifact();
}

function uploadResourceWithValidation() {
    if (!FormValidator.validateResourceForm()) {
        return;
    }
    uploadResource();
}

// 搜索建议功能
class SearchSuggestion {
    constructor() {
        this.suggestions = [
            '刘志丹', '谢子长', '习仲勋', '南梁精神', '革命文物',
            '红军', '苏维埃', '根据地', '抗日战争', '解放战争'
        ];
    }

    showSuggestions(inputElement) {
        const value = inputElement.value.toLowerCase();
        if (value.length < 1) return;

        const matches = this.suggestions.filter(suggestion => 
            suggestion.toLowerCase().includes(value)
        );

        if (matches.length > 0) {
            this.displaySuggestions(matches, inputElement);
        }
    }

    displaySuggestions(suggestions, inputElement) {
        // 移除现有的建议框
        const existingSuggestions = document.querySelector('.search-suggestions');
        if (existingSuggestions) {
            existingSuggestions.remove();
        }

        // 创建新的建议框
        const suggestionsDiv = document.createElement('div');
        suggestionsDiv.className = 'search-suggestions';
        suggestionsDiv.style.cssText = `
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: white;
            border: 1px solid #ddd;
            border-radius: 0 0 10px 10px;
            max-height: 200px;
            overflow-y: auto;
            z-index: 100;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        `;

        suggestions.forEach(suggestion => {
            const item = document.createElement('div');
            item.textContent = suggestion;
            item.style.cssText = `
                padding: 10px 15px;
                cursor: pointer;
                border-bottom: 1px solid #eee;
                transition: background-color 0.2s;
            `;
            
            item.addEventListener('mouseenter', () => {
                item.style.backgroundColor = '#f5f5f5';
            });
            
            item.addEventListener('mouseleave', () => {
                item.style.backgroundColor = 'white';
            });
            
            item.addEventListener('click', () => {
                inputElement.value = suggestion;
                suggestionsDiv.remove();
                if (typeof filterArtifacts === 'function') {
                    filterArtifacts();
                }
            });
            
            suggestionsDiv.appendChild(item);
        });

        // 设置输入框容器为相对定位
        const container = inputElement.parentElement;
        container.style.position = 'relative';
        container.appendChild(suggestionsDiv);

        // 点击其他地方时隐藏建议
        document.addEventListener('click', function hideSuggestions(e) {
            if (!container.contains(e.target)) {
                suggestionsDiv.remove();
                document.removeEventListener('click', hideSuggestions);
            }
        });
    }
}

// 初始化搜索建议
const searchSuggestion = new SearchSuggestion();

// 为搜索框添加建议功能
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            searchSuggestion.showSuggestions(this);
        });
    }
});

// 文件拖放上传功能
function initDragAndDrop() {
    const fileInputs = document.querySelectorAll('input[type="file"]');
    
    fileInputs.forEach(input => {
        const container = input.parentElement;
        
        container.addEventListener('dragover', (e) => {
            e.preventDefault();
            container.style.background = '#f0f8ff';
            container.style.border = '2px dashed #007bff';
        });
        
        container.addEventListener('dragleave', (e) => {
            e.preventDefault();
            container.style.background = '';
            container.style.border = '';
        });
        
        container.addEventListener('drop', (e) => {
            e.preventDefault();
            container.style.background = '';
            container.style.border = '';
            
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                input.files = files;
                // 触发change事件
                input.dispatchEvent(new Event('change'));
            }
        });
    });
}

// 数据导出功能
function exportAllData() {
    const data = {
        artifacts: artifactData,
        resources: resourceData,
        exportTime: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `nangliang_data_${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
    
    console.log('=== 导出的数据（可复制） ===');
    console.log(dataStr);
    
    showAlert('数据已导出！\n1. 已下载JSON文件\n2. 控制台也有输出（F12查看）', 'success');
}
// 页面加载完成后初始化拖放功能
document.addEventListener('DOMContentLoaded', initDragAndDrop);
