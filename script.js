// 全局字体设置变量
let globalFontSettings = {
    font: 'default',
    applyToAll: false
};

// 数据API配置
const DATA_CONFIG = {
    dataUrl: './data.json',
    githubRepo: 'kikiali81/car-sponsor-website', // 你的GitHub仓库
    githubToken: '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' // 你的GitHub Token
};

// 从GitHub加载数据
async function loadDataFromGitHub() {
    try {
        const response = await fetch(DATA_CONFIG.dataUrl + '?t=' + Date.now());
        if (response.ok) {
            const data = await response.json();
            
            // 更新全局数据
            vehiclesData = data.vehicles || [];
            siteSettings = data.siteSettings || siteSettings;
            sponsorsData = data.sponsors || sponsorsData;
            paymentQRCodes = data.paymentQRCodes || paymentQRCodes;
            
            console.log('✅ 数据加载成功，来自GitHub');
            return true;
        }
    } catch (error) {
        console.log('⚠️ GitHub数据加载失败，使用默认数据:', error);
    }
    return false;
}

// 保存数据到GitHub（需要配置GitHub Token）
async function saveDataToGitHub() {
    // 这个功能需要GitHub Personal Access Token
    // 现在先显示提示
    showNotification('💡 配置已保存到本地，上传到GitHub需要额外配置');
    
    // 同时保存到localStorage作为备份
    const dataToSave = {
        vehicles: vehiclesData,
        siteSettings: siteSettings,
        sponsors: sponsorsData,
        paymentQRCodes: paymentQRCodes,
        lastUpdated: new Date().toISOString()
    };
    
    localStorage.setItem('websiteData', JSON.stringify(dataToSave));
}

// 页面加载动画
document.addEventListener('DOMContentLoaded', async function() {
    // 先尝试从GitHub加载数据
    await loadDataFromGitHub();
    
    // 初始化页面
    renderVehiclesGrid();
    renderSponsorsGrid();
    loadSiteSettings();
    initializeBillsManagement();
    
    // 添加页面加载动画
    const cards = document.querySelectorAll('.vehicle-card, .sponsor-card');
    
    // 创建观察者来实现滚动动画
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });
    
    // 初始化卡片样式并观察
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(50px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
    });
    
    // 添加鼠标跟踪效果
    document.addEventListener('mousemove', (e) => {
        const cursor = document.querySelector('.cursor');
        if (!cursor) {
            const newCursor = document.createElement('div');
            newCursor.className = 'cursor';
            newCursor.style.cssText = `
                position: fixed;
                width: 20px;
                height: 20px;
                background: radial-gradient(circle, #ff6b35, #ffd23f);
                border-radius: 50%;
                pointer-events: none;
                z-index: 9999;
                opacity: 0.7;
                transition: transform 0.1s ease;
            `;
            document.body.appendChild(newCursor);
        }
        
        const cursor2 = document.querySelector('.cursor');
        cursor2.style.left = e.clientX - 10 + 'px';
        cursor2.style.top = e.clientY - 10 + 'px';
    });
    
    // 车辆卡片悬停效果增强
    const vehicleCards = document.querySelectorAll('.vehicle-card');
    vehicleCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-15px) scale(1.03)';
            
            // 添加粒子效果
            createParticles(this);
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // 创建粒子效果
    function createParticles(element) {
        for (let i = 0; i < 5; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: 4px;
                height: 4px;
                background: #ffd23f;
                border-radius: 50%;
                pointer-events: none;
                z-index: 1000;
            `;
            
            const rect = element.getBoundingClientRect();
            particle.style.left = rect.left + Math.random() * rect.width + 'px';
            particle.style.top = rect.top + Math.random() * rect.height + 'px';
            
            document.body.appendChild(particle);
            
            // 动画粒子
            particle.animate([
                { transform: 'translateY(0) scale(1)', opacity: 1 },
                { transform: 'translateY(-50px) scale(0)', opacity: 0 }
            ], {
                duration: 1000,
                easing: 'ease-out'
            }).onfinish = () => particle.remove();
        }
    }
    
    // 平滑滚动
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // 添加键盘导航
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowDown') {
            window.scrollBy({ top: 100, behavior: 'smooth' });
        } else if (e.key === 'ArrowUp') {
            window.scrollBy({ top: -100, behavior: 'smooth' });
        }
    });
});

// 动态背景效果
function createFloatingElements() {
    const container = document.querySelector('.container');
    
    for (let i = 0; i < 10; i++) {
        const element = document.createElement('div');
        element.style.cssText = `
            position: fixed;
            width: ${Math.random() * 6 + 2}px;
            height: ${Math.random() * 6 + 2}px;
            background: rgba(255, 215, 63, ${Math.random() * 0.5 + 0.1});
            border-radius: 50%;
            pointer-events: none;
            z-index: -1;
            left: ${Math.random() * 100}vw;
            top: ${Math.random() * 100}vh;
        `;
        
        document.body.appendChild(element);
        
        // 动画浮动元素
        element.animate([
            { transform: 'translateY(0px) translateX(0px)' },
            { transform: `translateY(${Math.random() * 200 - 100}px) translateX(${Math.random() * 200 - 100}px)` }
        ], {
            duration: Math.random() * 10000 + 5000,
            direction: 'alternate',
            iterations: Infinity,
            easing: 'ease-in-out'
        });
    }
}

// 启动浮动元素
createFloatingElements();

// 管理面板功能
let adminMode = false;
let keySequence = [];
const adminKey = ['a', 'd', 'm', 'i', 'n']; // 按顺序按下 a-d-m-i-n 激活管理面板

// 图片上传相关变量
let currentVehicleImage = null;

// 网站设置数据
let siteSettings = {
    title: 'Grizzly 充电车辆展示',
    subtitle: 'Premium Electric Vehicles Collection',
    copyright: '© 2024 Grizzly 充电车辆展示 | 感谢所有赞助商的支持',
    vehiclesSectionTitle: '充电车辆展示',
    sponsorsSectionTitle: '感谢给我们的充电'
};

// 赞助商数据
let sponsorsData = {
    diamond: {
        title: '充电者',
        name: '超级汽车集团',
        icon: 'fas fa-crown'
    },
    platinum: {
        title: '充电者',
        name: '极速改装店',
        icon: 'fas fa-gem'
    },
    gold: {
        title: '充电者',
        name: '梦想车行',
        icon: 'fas fa-star'
    }
};

// 车辆数据 - 添加示例数据
let vehiclesData = [
    {
        id: 1640000000000,
        name: "警用超跑",
        type: "premium",
        speed: "350km/h",
        power: "800HP",
        engine: "V8涡轮增压",
        sponsor: "警察局",
        price: "200",
        badge: "超级跑车",
        image: null,
        font: "default"
    }
];

// 监听键盘事件激活管理面板
document.addEventListener('keydown', function(e) {
    keySequence.push(e.key.toLowerCase());
    
    // 保持序列长度不超过管理员密钥长度
    if (keySequence.length > adminKey.length) {
        keySequence.shift();
    }
    
    // 检查是否匹配管理员密钥
    if (keySequence.join('') === adminKey.join('')) {
        toggleAdminPanel();
        keySequence = []; // 重置序列
    }
});

// 切换管理面板显示
function toggleAdminPanel() {
    const panel = document.getElementById('adminPanel');
    const overlay = document.getElementById('adminOverlay');
    
    if (panel.classList.contains('hidden')) {
        panel.classList.remove('hidden');
        overlay.classList.remove('hidden');
        adminMode = true;
        loadVehiclesList();
        loadAdminSettings();
        initializeImageUpload(); // 初始化图片上传功能
        initializePaymentQRUpload(); // 初始化支付二维码上传功能
        loadPaymentQRCodes(); // 加载支付二维码
    } else {
        panel.classList.add('hidden');
        overlay.classList.add('hidden');
        adminMode = false;
    }
}

// 初始化图片上传功能
function initializeImageUpload() {
    const vehicleImageInput = document.getElementById('vehicleImage');
    const imagePreview = document.getElementById('imagePreview');
    const previewImg = document.getElementById('previewImg');
    const removeImageBtn = document.getElementById('removeImage');
    
    // 图片选择事件
    vehicleImageInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                currentVehicleImage = e.target.result;
                previewImg.src = e.target.result;
                imagePreview.classList.remove('hidden');
            };
            reader.readAsDataURL(file);
        }
    });
    
    // 移除图片事件
    removeImageBtn.addEventListener('click', function() {
        currentVehicleImage = null;
        vehicleImageInput.value = '';
        imagePreview.classList.add('hidden');
        previewImg.src = '';
    });
}

// 关闭管理面板
document.getElementById('closeAdmin').addEventListener('click', toggleAdminPanel);
document.getElementById('adminOverlay').addEventListener('click', toggleAdminPanel);

// 标签页切换
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const tabName = this.dataset.tab;
        
        // 移除所有活动状态
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        
        // 激活当前标签
        this.classList.add('active');
        document.getElementById(tabName + '-tab').classList.add('active');
    });
});

// 渲染车辆网格
function renderVehiclesGrid() {
    const grid = document.getElementById('vehiclesGrid');
    grid.innerHTML = '';
    
    if (vehiclesData.length === 0) {
        grid.innerHTML = '<div class="empty-message">暂无车辆数据</div>';
        return;
    }
    
    vehiclesData.forEach(vehicle => {
        const vehicleCard = createVehicleCard(vehicle);
        grid.appendChild(vehicleCard);
    });
    
    // 重新绑定悬停效果
    bindVehicleHoverEffects();
    
    // 应用全局字体（如果已设置）
    if (globalFontSettings.applyToAll && globalFontSettings.font !== 'default') {
        applyGlobalFont(globalFontSettings.font);
    }
}

// 绑定车辆悬停效果
function bindVehicleHoverEffects() {
    const vehicleCards = document.querySelectorAll('.vehicle-card');
    vehicleCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-15px) scale(1.03)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// 创建车辆卡片
function createVehicleCard(vehicle) {
    const card = document.createElement('div');
    card.className = `vehicle-card ${vehicle.type}`;
    card.setAttribute('data-vehicle-id', vehicle.id);
    
    // 添加字体类
    const fontClass = vehicle.font && vehicle.font !== 'default' ? `font-${vehicle.font}` : '';
    
    const iconClass = vehicle.type === 'motorcycle' ? 'motorcycle' : 
                     vehicle.type === 'offroad' ? 'truck' : 'car';
    
    const imageContent = vehicle.image ? 
        `<img src="${vehicle.image}" alt="${vehicle.name}">` :
        `<div class="vehicle-placeholder">
            <i class="fas fa-${iconClass}"></i>
        </div>`;
    
    card.innerHTML = `
        <div class="vehicle-image">
            ${imageContent}
            <div class="vehicle-badge ${fontClass}">${vehicle.badge}</div>
        </div>
        <div class="vehicle-info">
            <h3 class="vehicle-name ${fontClass}">${vehicle.name}</h3>
            <div class="vehicle-specs">
                <span class="spec"><i class="fas fa-tachometer-alt"></i> ${vehicle.speed}</span>
                <span class="spec"><i class="fas fa-horse"></i> ${vehicle.power}</span>
            </div>
            <div class="vehicle-details">
                <p class="vehicle-engine"><i class="fas fa-cog"></i> ${vehicle.engine}</p>
                <p class="vehicle-sponsor"><i class="fas fa-handshake"></i> ${vehicle.sponsor}</p>
            </div>
            <div class="vehicle-price ${fontClass}">¥${vehicle.price}</div>
        </div>
    `;
    
    // 添加点击事件
    card.addEventListener('click', () => showVehicleDetail(vehicle));
    
    return card;
}



// 关闭车辆详情
function closeVehicleDetail() {
    const modal = document.getElementById('vehicleDetailModal');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
    document.removeEventListener('keydown', handleEscKey);
}

// 处理ESC键
function handleEscKey(e) {
    if (e.key === 'Escape') {
        closeVehicleDetail();
    }
}

// 绑定车辆悬停效果 - 更新版本
function bindVehicleHoverEffects() {
    const vehicleCards = document.querySelectorAll('.vehicle-card');
    vehicleCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-15px) scale(1.03)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// 渲染车辆网格 - 更新版本
function renderVehiclesGrid() {
    const grid = document.getElementById('vehiclesGrid');
    grid.innerHTML = '';
    
    if (vehiclesData.length === 0) {
        grid.innerHTML = '<div class="empty-message">暂无车辆数据</div>';
        return;
    }
    
    vehiclesData.forEach(vehicle => {
        const vehicleCard = createVehicleCard(vehicle);
        grid.appendChild(vehicleCard);
    });
    
    // 重新绑定悬停效果
    bindVehicleHoverEffects();
}

// 渲染赞助商网格
function renderSponsorsGrid() {
    const grid = document.querySelector('.sponsors-grid');
    grid.innerHTML = '';
    
    Object.values(sponsorsData).forEach(sponsor => {
        const sponsorCard = createSponsorCard(sponsor);
        grid.appendChild(sponsorCard);
    });
    
    // 应用全局字体（如果已设置）
    if (globalFontSettings.applyToAll && globalFontSettings.font !== 'default') {
        applyGlobalFont(globalFontSettings.font);
    }
}

// 创建赞助商卡片
function createSponsorCard(sponsor) {
    const card = document.createElement('div');
    card.className = 'sponsor-card';
    
    card.innerHTML = `
        <div class="sponsor-icon">
            <i class="${sponsor.icon}"></i>
        </div>
        <h3>${sponsor.title}</h3>
        <p>${sponsor.name}</p>
    `;
    
    return card;
}

// 更新网站设置
function updateSiteSettings() {
    // 更新页面标题
    document.title = siteSettings.title;
    
    // 更新主标题
    const titleParts = siteSettings.title.split(' ');
    const mainTitle = document.querySelector('.main-title');
    if (titleParts.length >= 3) {
        mainTitle.innerHTML = `
            <span class="title-text">${titleParts[0]}</span>
            <span class="title-highlight">${titleParts[1]}</span>
            <span class="title-text">${titleParts[2]}</span>
        `;
    } else {
        mainTitle.innerHTML = `<span class="title-text">${siteSettings.title}</span>`;
    }
    
    // 更新副标题
    document.querySelector('.subtitle').textContent = siteSettings.subtitle;
    
    // 更新章节标题
    const sectionTitles = document.querySelectorAll('.section-title');
    if (sectionTitles[0]) sectionTitles[0].textContent = siteSettings.sponsorsSectionTitle;
    if (sectionTitles[1]) sectionTitles[1].textContent = siteSettings.vehiclesSectionTitle;
    
    // 更新版权信息
    document.querySelector('.footer-content p').innerHTML = siteSettings.copyright;
}

// 加载网站设置到管理面板
function loadAdminSettings() {
    document.getElementById('siteTitle').value = siteSettings.title;
    document.getElementById('siteSubtitle').value = siteSettings.subtitle;
    document.getElementById('copyrightText').value = siteSettings.copyright;
    document.getElementById('sponsorsSectionTitle').value = siteSettings.sponsorsSectionTitle;
    document.getElementById('vehiclesSectionTitle').value = siteSettings.vehiclesSectionTitle;
    
    // 加载全局字体设置
    const savedGlobalFont = localStorage.getItem('globalFontSettings');
    if (savedGlobalFont) {
        globalFontSettings = JSON.parse(savedGlobalFont);
        document.getElementById('globalFont').value = globalFontSettings.font;
        if (globalFontSettings.applyToAll) {
            applyGlobalFont(globalFontSettings.font);
        }
    }
    
    // 更新赞助商预览
    document.getElementById('diamondSponsor').textContent = sponsorsData.diamond.name;
    document.getElementById('platinumSponsor').textContent = sponsorsData.platinum.name;
    document.getElementById('goldSponsor').textContent = sponsorsData.gold.name;
}

// 加载车辆列表到管理面板
function loadVehiclesList() {
    const list = document.getElementById('vehiclesList');
    list.innerHTML = '';
    
    if (vehiclesData.length === 0) {
        list.innerHTML = '<div class="empty-message">暂无车辆数据</div>';
        return;
    }
    
    vehiclesData.forEach(vehicle => {
        const item = document.createElement('div');
        item.className = 'vehicle-item';
        
        item.innerHTML = `
            <div class="vehicle-info">
                <strong>${vehicle.name}</strong> - ${vehicle.badge} - ${vehicle.price}
                ${vehicle.image ? '<span class="has-image">📷</span>' : ''}
            </div>
            <div class="vehicle-actions">
                <button class="edit-btn" onclick="editVehicle(${vehicle.id})">编辑</button>
                <button class="delete-btn" onclick="deleteVehicle(${vehicle.id})">删除</button>
            </div>
        `;
        
        list.appendChild(item);
    });
}

// 删除车辆
function deleteVehicle(id) {
    vehiclesData = vehiclesData.filter(v => v.id !== id);
    renderVehiclesGrid();
    loadVehiclesList();
    saveDataToGitHub(); // 保存到GitHub
    showNotification('车辆删除成功！');
}

// 车辆类型选择器变化事件
document.getElementById('vehicleType').addEventListener('change', function() {
    const customInput = document.getElementById('customVehicleType');
    if (this.value === 'custom') {
        customInput.classList.remove('hidden');
        customInput.required = true;
    } else {
        customInput.classList.add('hidden');
        customInput.required = false;
        customInput.value = '';
    }
});

// 在车辆类型选择器变化事件后添加字体选择器事件
document.getElementById('vehicleFont').addEventListener('change', function() {
    const preview = document.getElementById('fontPreview');
    const selectedFont = this.value;
    
    if (selectedFont !== 'default') {
        preview.className = `font-preview font-${selectedFont}`;
        preview.textContent = '字体预览 - FONT PREVIEW';
        preview.style.display = 'block';
    } else {
        preview.style.display = 'none';
    }
});

// 全局字体选择器事件
document.getElementById('globalFont').addEventListener('change', function() {
    const preview = document.getElementById('globalFontPreview');
    const selectedFont = this.value;
    
    if (selectedFont !== 'default') {
        preview.className = `global-font-preview global-font-${selectedFont}`;
        preview.textContent = '全局字体预览 - GLOBAL FONT PREVIEW';
        preview.style.display = 'block';
    } else {
        preview.style.display = 'none';
    }
});

// 应用全局字体按钮事件
document.getElementById('applyGlobalFont').addEventListener('click', function() {
    const selectedFont = document.getElementById('globalFont').value;
    globalFontSettings.font = selectedFont;
    globalFontSettings.applyToAll = true;
    
    // 保存设置
    localStorage.setItem('globalFontSettings', JSON.stringify(globalFontSettings));
    
    // 应用字体
    applyGlobalFont(selectedFont);
    
    showNotification('全局字体应用成功！');
});

// 应用全局字体函数
function applyGlobalFont(fontName) {
    // 移除之前的全局字体类
    const fontClasses = ['global-font-impact', 'global-font-bebas', 'global-font-oswald', 
                        'global-font-anton', 'global-font-racing', 'global-font-orbitron', 'global-font-teko'];
    
    fontClasses.forEach(className => {
        document.querySelectorAll(`.${className}`).forEach(el => {
            el.classList.remove(className);
        });
    });
    
    if (fontName !== 'default') {
        const fontClass = `global-font-${fontName}`;
        
        // 应用到主要文本元素
        const selectors = [
            '.main-title',
            '.section-title', 
            '.vehicle-name',
            '.vehicle-badge',
            '.vehicle-info',
            '.sponsor-name',
            '.sponsor-level',
            '.footer-content',
            '.admin-section h3',
            '.tab-btn',
            'input[type="text"]',
            'textarea',
            'select',
            'button',
            '.vehicle-detail h2',
            '.vehicle-detail .detail-info'
        ];
        
        selectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                el.classList.add(fontClass);
            });
        });
    }
}

// 修改添加车辆的逻辑
document.getElementById('addVehicleForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const typeSelect = document.getElementById('vehicleType');
    const customTypeInput = document.getElementById('customVehicleType');
    const fontSelect = document.getElementById('vehicleFont');
    let selectedOption = typeSelect.options[typeSelect.selectedIndex];
    let vehicleType = typeSelect.value;
    let vehicleBadge = selectedOption.text;
    
    // 如果选择了自定义类型
    if (vehicleType === 'custom') {
        vehicleType = 'custom';
        vehicleBadge = customTypeInput.value;
    }
    
    const newVehicle = {
        id: Date.now(),
        name: document.getElementById('vehicleName').value,
        type: vehicleType,
        speed: document.getElementById('vehicleSpeed').value,
        power: document.getElementById('vehiclePower').value,
        engine: document.getElementById('vehicleEngine').value,
        sponsor: document.getElementById('vehicleSponsor').value,
        price: document.getElementById('vehiclePrice').value,
        badge: vehicleBadge,
        image: currentVehicleImage,
        font: fontSelect.value // 添加字体选择
    };
    
    vehiclesData.push(newVehicle);
    renderVehiclesGrid();
    loadVehiclesList();
    saveDataToGitHub(); // 保存到GitHub
    this.reset();
    
    // 重置图片相关状态
    currentVehicleImage = null;
    document.getElementById('imagePreview').classList.add('hidden');
    
    // 重置自定义类型输入框
    document.getElementById('customVehicleType').classList.add('hidden');
    document.getElementById('customVehicleType').required = false;
    
    showNotification('车辆添加成功！');
});

// 编辑车辆
function editVehicle(id) {
    const vehicle = vehiclesData.find(v => v.id === id);
    if (vehicle) {
        document.getElementById('vehicleName').value = vehicle.name;
        
        // 检查是否为自定义类型
        const typeSelect = document.getElementById('vehicleType');
        const customInput = document.getElementById('customVehicleType');
        
        // 检查是否为预定义类型
        const predefinedTypes = ['premium', 'luxury', 'sport', 'offroad', 'motorcycle', 'classic'];
        if (predefinedTypes.includes(vehicle.type)) {
            typeSelect.value = vehicle.type;
            customInput.classList.add('hidden');
            customInput.required = false;
        } else {
            // 自定义类型
            typeSelect.value = 'custom';
            customInput.value = vehicle.badge;
            customInput.classList.remove('hidden');
            customInput.required = true;
        }
        
        document.getElementById('vehicleSpeed').value = vehicle.speed;
        document.getElementById('vehiclePower').value = vehicle.power;
        document.getElementById('vehicleEngine').value = vehicle.engine;
        document.getElementById('vehicleSponsor').value = vehicle.sponsor;
        document.getElementById('vehiclePrice').value = vehicle.price;
        
        // 设置字体选择
        const fontSelect = document.getElementById('vehicleFont');
        if (vehicle.font) {
            fontSelect.value = vehicle.font;
            // 触发字体预览
            const event = new Event('change');
            fontSelect.dispatchEvent(event);
        }
        
        // 处理图片
        if (vehicle.image) {
            currentVehicleImage = vehicle.image;
            document.getElementById('previewImg').src = vehicle.image;
            document.getElementById('imagePreview').classList.remove('hidden');
        }
        
        // 删除原车辆，新表单提交时会添加更新后的车辆
        deleteVehicle(id);
    }
}

// 赞助商表单提交
document.getElementById('sponsorForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const level = document.getElementById('sponsorLevel').value;
    const name = document.getElementById('sponsorName').value;
    
    if (sponsorsData[level]) {
        sponsorsData[level].name = name;
        renderSponsorsGrid();
        loadAdminSettings(); // 更新管理面板中的赞助商预览
        saveDataToGitHub(); // 保存到GitHub
        showNotification('赞助商更新成功！');
        this.reset();
    }
});

// 网站设置表单提交
document.getElementById('settingsForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    siteSettings.title = document.getElementById('siteTitle').value;
    siteSettings.subtitle = document.getElementById('siteSubtitle').value;
    siteSettings.copyright = document.getElementById('copyrightText').value;
    siteSettings.sponsorsSectionTitle = document.getElementById('sponsorsSectionTitle').value;
    siteSettings.vehiclesSectionTitle = document.getElementById('vehiclesSectionTitle').value;
    
    updateSiteSettings();
    saveDataToGitHub(); // 保存到GitHub
    showNotification('网站设置保存成功！');
});

// 显示通知
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(45deg, #2ecc71, #27ae60);
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        z-index: 10001;
        font-weight: 600;
        box-shadow: 0 5px 15px rgba(46, 204, 113, 0.4);
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// 数据管理功能
document.getElementById('exportData').addEventListener('click', function() {
    const data = {
        vehicles: vehiclesData,
        sponsors: sponsorsData,
        settings: siteSettings,
        timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'grizzly-data.json';
    a.click();
    
    URL.revokeObjectURL(url);
    showNotification('数据导出成功！');
});

document.getElementById('importData').addEventListener('click', function() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const data = JSON.parse(e.target.result);
                    
                    if (data.vehicles) vehiclesData = data.vehicles;
                    if (data.sponsors) sponsorsData = data.sponsors;
                    if (data.settings) siteSettings = data.settings;
                    
                    renderVehiclesGrid();
                    renderSponsorsGrid();
                    updateSiteSettings();
                    loadVehiclesList();
                    loadAdminSettings();
                    
                    showNotification('数据导入成功！');
                } catch (error) {
                    showNotification('数据格式错误！');
                }
            };
            reader.readAsText(file);
        }
    };
    
    input.click();
});

document.getElementById('resetData').addEventListener('click', function() {
    if (confirm('确定要重置所有数据吗？此操作不可撤销！')) {
        // 重置为空数据
        vehiclesData = [];
        
        sponsorsData = {
            diamond: {
                title: '钻石赞助商',
                name: '超级汽车集团',
                icon: 'fas fa-crown'
            },
            platinum: {
                title: '白金赞助商',
                name: '极速改装店',
                icon: 'fas fa-gem'
            },
            gold: {
                title: '黄金赞助商',
                name: '梦想车行',
                icon: 'fas fa-star'
            }
        };
        
        siteSettings = {
            title: 'Grizzly 充电车辆展示',
            subtitle: 'Premium Electric Vehicles Collection',
            copyright: '© 2024 Grizzly 充电车辆展示 | 感谢所有赞助商的支持',
            vehiclesSectionTitle: '充电车辆展示',
            sponsorsSectionTitle: '感谢给我们的充电'
        };
        
        renderVehiclesGrid();
        renderSponsorsGrid();
        updateSiteSettings();
        loadVehiclesList();
        loadAdminSettings();
        
        showNotification('数据重置成功！');
    }
});

// 初始化网站设置
function loadSiteSettings() {
    updateSiteSettings();
}

// 添加CSS动画
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .empty-message {
        text-align: center;
        color: #888;
        font-size: 18px;
        padding: 40px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 10px;
        margin: 20px 0;
    }
    
    .has-image {
        color: #2ecc71;
        margin-left: 10px;
    }
`;
document.head.appendChild(style);

// 在文件末尾添加支付相关功能
let selectedPaymentMethod = null;

// 支付二维码数据
let paymentQRCodes = {
    wechat: null,
    alipay: null
};

// 账单管理相关变量
let bills = [];

// 生成订单号
function generateOrderId() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `ORD${timestamp}${random}`;
}

// 记录支付成功的订单
function recordPayment(vehicle, paymentMethod, amount) {
    const bill = {
        id: generateOrderId(),
        vehicleId: vehicle.id,
        vehicleName: vehicle.name,
        vehicleType: vehicle.badge,
        paymentMethod: paymentMethod,
        amount: amount,
        timestamp: Date.now(),
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
        status: 'completed'
    };
    
    bills.push(bill);
    saveBills();
    updateBillsStats();
    showNotification(`订单 ${bill.id} 支付成功！`);
    
    return bill;
}

// 保存账单到本地存储
function saveBills() {
    localStorage.setItem('bills', JSON.stringify(bills));
}

// 加载账单
function loadBills() {
    const saved = localStorage.getItem('bills');
    if (saved) {
        bills = JSON.parse(saved);
    }
}

// 更新账单统计
function updateBillsStats() {
    const totalOrders = bills.length;
    const totalRevenue = bills.reduce((sum, bill) => {
        const amount = parseFloat(bill.amount.replace(/[^\d.]/g, '')) || 0;
        return sum + amount;
    }, 0);
    
    const today = new Date().toLocaleDateString();
    const todayOrders = bills.filter(bill => bill.date === today).length;
    
    document.getElementById('totalOrders').textContent = totalOrders;
    document.getElementById('totalRevenue').textContent = `¥${totalRevenue.toLocaleString()}`;
    document.getElementById('todayOrders').textContent = todayOrders;
}

// 渲染账单列表
function renderBillsList(filteredBills = bills) {
    const billsList = document.getElementById('billsList');
    
    if (filteredBills.length === 0) {
        billsList.innerHTML = '<div class="empty-state">暂无账单记录</div>';
        return;
    }
    
    billsList.innerHTML = filteredBills.map(bill => `
        <div class="bill-item">
            <div class="bill-header">
                <span class="bill-id">#${bill.id}</span>
                <span class="bill-status">${bill.status === 'completed' ? '已完成' : '处理中'}</span>
            </div>
            <div class="bill-details">
                <div class="bill-detail">
                    <strong>车辆:</strong> ${bill.vehicleName}
                </div>
                <div class="bill-detail">
                    <strong>类型:</strong> ${bill.vehicleType}
                </div>
                <div class="bill-detail">
                    <strong>支付方式:</strong> 
                    <i class="fab fa-${bill.paymentMethod === 'wechat' ? 'weixin' : 'alipay'} payment-icon ${bill.paymentMethod}"></i>
                    ${bill.paymentMethod === 'wechat' ? '微信支付' : '支付宝'}
                </div>
                <div class="bill-detail">
                    <strong>金额:</strong> ${bill.amount}
                </div>
                <div class="bill-detail">
                    <strong>时间:</strong> ${bill.date} ${bill.time}
                </div>
            </div>
        </div>
    `).join('');
}

// 筛选账单
function filterBills() {
    const searchTerm = document.getElementById('billSearch').value.toLowerCase();
    const paymentFilter = document.getElementById('billPaymentFilter').value;
    const dateFilter = document.getElementById('billDateFilter').value;
    
    let filteredBills = bills.filter(bill => {
        const matchesSearch = bill.id.toLowerCase().includes(searchTerm) || 
                            bill.vehicleName.toLowerCase().includes(searchTerm);
        
        const matchesPayment = paymentFilter === 'all' || bill.paymentMethod === paymentFilter;
        
        let matchesDate = true;
        if (dateFilter !== 'all') {
            const billDate = new Date(bill.timestamp);
            const now = new Date();
            
            switch (dateFilter) {
                case 'today':
                    matchesDate = billDate.toDateString() === now.toDateString();
                    break;
                case 'week':
                    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                    matchesDate = billDate >= weekAgo;
                    break;
                case 'month':
                    matchesDate = billDate.getMonth() === now.getMonth() && 
                                billDate.getFullYear() === now.getFullYear();
                    break;
            }
        }
        
        return matchesSearch && matchesPayment && matchesDate;
    });
    
    renderBillsList(filteredBills);
}

// 导出账单
function exportBills() {
    const csvContent = "data:text/csv;charset=utf-8," + 
        "订单号,车辆名称,车辆类型,支付方式,金额,支付时间\n" +
        bills.map(bill => 
            `${bill.id},${bill.vehicleName},${bill.vehicleType},${bill.paymentMethod === 'wechat' ? '微信支付' : '支付宝'},${bill.amount},"${bill.date} ${bill.time}"`
        ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `账单导出_${new Date().toLocaleDateString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showNotification('账单导出成功！');
}

// 初始化账单管理
function initializeBillsManagement() {
    loadBills();
    updateBillsStats();
    renderBillsList();
    
    // 绑定筛选事件
    document.getElementById('billSearch').addEventListener('input', filterBills);
    document.getElementById('billPaymentFilter').addEventListener('change', filterBills);
    document.getElementById('billDateFilter').addEventListener('change', filterBills);
    
    // 绑定导出事件
    document.getElementById('exportBills').addEventListener('click', exportBills);
}

// 初始化支付二维码上传功能
function initializePaymentQRUpload() {
    // 微信二维码上传
    const wechatQRInput = document.getElementById('wechatQR');
    const wechatQRPreview = document.getElementById('wechatQRPreview');
    const wechatQRImg = document.getElementById('wechatQRImg');
    const removeWechatQRBtn = document.getElementById('removeWechatQR');
    
    // 支付宝二维码上传
    const alipayQRInput = document.getElementById('alipayQR');
    const alipayQRPreview = document.getElementById('alipayQRPreview');
    const alipayQRImg = document.getElementById('alipayQRImg');
    const removeAlipayQRBtn = document.getElementById('removeAlipayQR');
    
    // 微信二维码上传事件
    wechatQRInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                paymentQRCodes.wechat = e.target.result;
                wechatQRImg.src = e.target.result;
                wechatQRPreview.classList.remove('hidden');
                savePaymentQRCodes();
            };
            reader.readAsDataURL(file);
        }
    });
    
    // 支付宝二维码上传事件
    alipayQRInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                paymentQRCodes.alipay = e.target.result;
                alipayQRImg.src = e.target.result;
                alipayQRPreview.classList.remove('hidden');
                savePaymentQRCodes();
            };
            reader.readAsDataURL(file);
        }
    });
    
    // 移除微信二维码
    removeWechatQRBtn.addEventListener('click', function() {
        paymentQRCodes.wechat = null;
        wechatQRInput.value = '';
        wechatQRPreview.classList.add('hidden');
        wechatQRImg.src = '';
        savePaymentQRCodes();
    });
    
    // 移除支付宝二维码
    removeAlipayQRBtn.addEventListener('click', function() {
        paymentQRCodes.alipay = null;
        alipayQRInput.value = '';
        alipayQRPreview.classList.add('hidden');
        alipayQRImg.src = '';
        savePaymentQRCodes();
    });
}

// 保存支付二维码到本地存储
function savePaymentQRCodes() {
    localStorage.setItem('paymentQRCodes', JSON.stringify(paymentQRCodes));
    saveDataToGitHub(); // 同时保存到GitHub
}

// 加载支付二维码
function loadPaymentQRCodes() {
    const saved = localStorage.getItem('paymentQRCodes');
    if (saved) {
        paymentQRCodes = JSON.parse(saved);
        
        // 显示微信二维码
        if (paymentQRCodes.wechat) {
            document.getElementById('wechatQRImg').src = paymentQRCodes.wechat;
            document.getElementById('wechatQRPreview').classList.remove('hidden');
        }
        
        // 显示支付宝二维码
        if (paymentQRCodes.alipay) {
            document.getElementById('alipayQRImg').src = paymentQRCodes.alipay;
            document.getElementById('alipayQRPreview').classList.remove('hidden');
        }
    }
}

// 显示支付二维码弹窗
function showPaymentQR(method, vehicle = null) {
    const qrCode = paymentQRCodes[method];
    if (!qrCode) {
        alert('管理员还未上传' + (method === 'wechat' ? '微信' : '支付宝') + '收款码，请联系管理员！');
        return;
    }
    
    // 创建弹窗
    const modal = document.createElement('div');
    modal.className = 'qr-modal';
    modal.innerHTML = `
        <div class="qr-modal-content">
            <button class="qr-modal-close">&times;</button>
            <h3>${method === 'wechat' ? '微信支付' : '支付宝'}</h3>
            <img src="${qrCode}" alt="${method === 'wechat' ? '微信' : '支付宝'}收款码">
            <p>请使用${method === 'wechat' ? '微信' : '支付宝'}扫描二维码完成支付</p>
            ${vehicle ? `
                <div class="payment-info">
                    <p><strong>车辆:</strong> ${vehicle.name}</p>
                    <p><strong>金额:</strong> ${vehicle.price}</p>
                </div>
                <button class="simulate-payment-btn" onclick="simulatePaymentSuccess('${method}', '${vehicle.id}')">模拟支付成功</button>
            ` : ''}
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // 显示弹窗
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
    
    // 关闭弹窗事件
    const closeBtn = modal.querySelector('.qr-modal-close');
    const closeModal = () => {
        modal.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(modal);
        }, 300);
    };
    
    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
}

// 模拟支付成功（用于测试）
function simulatePaymentSuccess(paymentMethod, vehicleId) {
    const vehicle = vehiclesData.find(v => v.id == vehicleId);
    if (vehicle) {
        recordPayment(vehicle, paymentMethod, vehicle.price);
        
        // 关闭支付弹窗
        const modal = document.querySelector('.qr-modal');
        if (modal) {
            modal.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(modal);
            }, 300);
        }
        
        // 关闭车辆详情
        closeVehicleDetail();
    }
}

// 支付方式选择
document.addEventListener('click', function(e) {
    if (e.target.closest('.payment-method')) {
        const paymentMethod = e.target.closest('.payment-method');
        const method = paymentMethod.dataset.method;
        
        if (method === 'wechat' || method === 'alipay') {
            // 获取当前车辆信息
            const vehicleName = document.getElementById('detailVehicleName')?.textContent;
            const vehicle = vehiclesData.find(v => v.name === vehicleName);
            showPaymentQR(method, vehicle);
        }
        
        // 移除其他选中状态
        document.querySelectorAll('.payment-method').forEach(pm => {
            pm.classList.remove('selected');
        });
        
        // 添加选中状态
        paymentMethod.classList.add('selected');
        selectedPaymentMethod = method;
    }
});



// 联系卖家按钮点击事件
document.addEventListener('click', function(e) {
    if (e.target.id === 'contactSellerBtn') {
        const vehicleName = document.getElementById('detailVehicleName').textContent;
        showNotification(`正在为您联系 ${vehicleName} 的卖家...`);
        
        // 这里可以添加联系卖家的逻辑，比如打开QQ或微信
        setTimeout(() => {
            showNotification('已为您打开联系方式！');
        }, 1500);
    }
});

// 显示车辆详情
function showVehicleDetail(vehicle) {
    // 创建模态框
    const modal = document.createElement('div');
    modal.className = 'vehicle-detail-modal';
    modal.id = 'vehicleDetailModal';
    
    const iconClass = vehicle.type === 'motorcycle' ? 'motorcycle' : 
                     vehicle.type === 'offroad' ? 'truck' : 'car';
    
    const imageContent = vehicle.image ? 
        `<img src="${vehicle.image}" alt="${vehicle.name}">` :
        `<div class="vehicle-placeholder">
            <i class="fas fa-${iconClass}"></i>
        </div>`;
    
    modal.innerHTML = `
        <div class="vehicle-detail-content">
            <div class="vehicle-detail-header">
                <h2><i class="fas fa-car"></i> 车辆详情</h2>
                <button class="detail-close-btn" onclick="closeVehicleDetail()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="vehicle-detail-body">
                <div class="vehicle-detail-image">
                    ${imageContent}
                </div>
                
                <h2 id="detailVehicleName" style="text-align: center; color: #ffd23f; font-family: 'Orbitron', monospace; margin-bottom: 30px;">
                    ${vehicle.name}
                </h2>
                
                <div class="vehicle-detail-info">
                    <div class="detail-section">
                        <h3><i class="fas fa-cogs"></i> 技术规格</h3>
                        <div class="detail-specs">
                            <div class="detail-spec">
                                <span class="detail-spec-label"><i class="fas fa-tachometer-alt"></i> 最高速度</span>
                                <span class="detail-spec-value">${vehicle.speed}</span>
                            </div>
                            <div class="detail-spec">
                                <span class="detail-spec-label"><i class="fas fa-bolt"></i> 马力</span>
                                <span class="detail-spec-value">${vehicle.power}</span>
                            </div>
                            <div class="detail-spec">
                                <span class="detail-spec-label"><i class="fas fa-battery-full"></i> 引擎类型</span>
                                <span class="detail-spec-value">${vehicle.engine}</span>
                            </div>
                            <div class="detail-spec">
                                <span class="detail-spec-label"><i class="fas fa-tag"></i> 车辆类型</span>
                                <span class="detail-spec-value">${vehicle.badge}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="detail-section">
                        <h3><i class="fas fa-info-circle"></i> 其他信息</h3>
                        <div class="detail-specs">
                            <div class="detail-spec">
                                <span class="detail-spec-label"><i class="fas fa-handshake"></i> 赞助商</span>
                                <span class="detail-spec-value">${vehicle.sponsor}</span>
                            </div>
                            <div class="detail-spec">
                                <span class="detail-spec-label"><i class="fas fa-calendar"></i> 添加时间</span>
                                <span class="detail-spec-value">${new Date(vehicle.id).toLocaleDateString()}</span>
                            </div>
                            <div class="detail-spec">
                                <span class="detail-spec-label"><i class="fas fa-star"></i> 车辆ID</span>
                                <span class="detail-spec-value">#${vehicle.id}</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="detail-price" id="detailPrice">
                    <i class="fas fa-dollar-sign"></i> ${vehicle.price}
                </div>
                
                <!-- 支付功能 -->
                <div class="payment-section">
                    <h4>支付方式</h4>
                    <div class="payment-methods">
                        <div class="payment-method" data-method="wechat">
                            <i class="fab fa-weixin"></i>
                            <span>微信支付</span>
                        </div>
                        <div class="payment-method" data-method="alipay">
                            <i class="fab fa-alipay"></i>
                            <span>支付宝</span>
                        </div>
                    </div>
                    <div class="payment-buttons">
                        <button class="contact-seller-btn" id="contactSellerBtn">联系卖家</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // 显示模态框
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
    
    // 重置支付状态
    selectedPaymentMethod = null;
    
    // 点击背景关闭
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeVehicleDetail();
        }
    });
    
    // ESC键关闭
    document.addEventListener('keydown', handleEscKey);
}



// 增强的车辆详情显示功能
function showVehicleDetailEnhanced(vehicle) {
    // 创建模态框
    const modal = document.createElement('div');
    modal.className = 'vehicle-detail-modal';
    modal.id = 'vehicleDetailModal';
    
    const iconClass = vehicle.type === 'motorcycle' ? 'motorcycle' : 
                     vehicle.type === 'offroad' ? 'truck' : 'car';
    
    const imageContent = vehicle.image ? 
        `<img src="${vehicle.image}" alt="${vehicle.name}">` :
        `<div class="vehicle-placeholder">
            <i class="fas fa-${iconClass}"></i>
        </div>`;
    
    modal.innerHTML = `
        <div class="vehicle-detail-content">
            <div class="vehicle-detail-header">
                <h2><i class="fas fa-car"></i> 车辆详情</h2>
                <button class="detail-close-btn" onclick="closeVehicleDetail()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="vehicle-detail-body">
                <div class="vehicle-detail-image">
                    ${imageContent}
                </div>
                
                <h2 id="detailVehicleName" style="text-align: center; color: #ffd23f; font-family: 'Orbitron', monospace; margin-bottom: 30px;">
                    ${vehicle.name}
                </h2>
                
                <div class="vehicle-detail-info">
                    <div class="detail-section">
                        <h3><i class="fas fa-cogs"></i> 技术规格</h3>
                        <div class="detail-specs">
                            <div class="detail-spec">
                                <span class="detail-spec-label"><i class="fas fa-tachometer-alt"></i> 最高速度</span>
                                <span class="detail-spec-value">${vehicle.speed}</span>
                            </div>
                            <div class="detail-spec">
                                <span class="detail-spec-label"><i class="fas fa-bolt"></i> 马力</span>
                                <span class="detail-spec-value">${vehicle.power}</span>
                            </div>
                            <div class="detail-spec">
                                <span class="detail-spec-label"><i class="fas fa-battery-full"></i> 引擎类型</span>
                                <span class="detail-spec-value">${vehicle.engine}</span>
                            </div>
                            <div class="detail-spec">
                                <span class="detail-spec-label"><i class="fas fa-tag"></i> 车辆类型</span>
                                <span class="detail-spec-value">${vehicle.badge}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="detail-section">
                        <h3><i class="fas fa-info-circle"></i> 其他信息</h3>
                        <div class="detail-specs">
                            <div class="detail-spec">
                                <span class="detail-spec-label"><i class="fas fa-handshake"></i> 赞助商</span>
                                <span class="detail-spec-value">${vehicle.sponsor}</span>
                            </div>
                            <div class="detail-spec">
                                <span class="detail-spec-label"><i class="fas fa-calendar"></i> 添加时间</span>
                                <span class="detail-spec-value">${new Date(vehicle.id).toLocaleDateString()}</span>
                            </div>
                            <div class="detail-spec">
                                <span class="detail-spec-label"><i class="fas fa-star"></i> 车辆ID</span>
                                <span class="detail-spec-value">#${vehicle.id}</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="detail-price" id="detailPrice">
                    <i class="fas fa-dollar-sign"></i> ${vehicle.price}
                </div>
                
                <!-- 支付功能 -->
                <div class="payment-section">
                    <h4>支付方式</h4>
                    <div class="payment-methods">
                        <div class="payment-method" data-method="wechat">
                            <i class="fab fa-weixin"></i>
                            <span>微信支付</span>
                        </div>
                        <div class="payment-method" data-method="alipay">
                            <i class="fab fa-alipay"></i>
                            <span>支付宝</span>
                        </div>
                    </div>
                    <div class="payment-buttons">
                        <button class="contact-seller-btn" id="contactSellerBtn">联系卖家</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // 显示模态框
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
    
    // 重置支付状态
    selectedPaymentMethod = null;
    
    // 点击背景关闭
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeVehicleDetail();
        }
    });
    
    // ESC键关闭
    document.addEventListener('keydown', handleEscKey);
}

// 重新定义showVehicleDetail函数
window.showVehicleDetail = showVehicleDetailEnhanced;
