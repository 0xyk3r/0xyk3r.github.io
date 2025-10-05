// ==================== 滚动动画观察器 ====================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            
            // 技能进度条动画
            if (entry.target.classList.contains('skill-card')) {
                const progressBar = entry.target.querySelector('.skill-progress');
                if (progressBar) {
                    const targetWidth = progressBar.dataset.progress;
                    setTimeout(() => {
                        progressBar.style.width = `${targetWidth}%`;
                    }, 200);
                }
            }
            
            // 数字计数动画
            if (entry.target.classList.contains('about-text')) {
                animateNumbers();
            }
        }
    });
}, observerOptions);

// 观察所有需要动画的元素
document.addEventListener('DOMContentLoaded', () => {
    // 观察区块标题
    document.querySelectorAll('.section-title').forEach(el => observer.observe(el));
    
    // 观察关于我区块
    document.querySelectorAll('.about-text, .about-visual').forEach(el => observer.observe(el));
    
    // 观察技能卡片
    document.querySelectorAll('.skill-card').forEach((el, index) => {
        el.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(el);
    });
    
    // 观察项目卡片
    document.querySelectorAll('.project-card').forEach((el, index) => {
        el.style.transitionDelay = `${index * 0.15}s`;
        observer.observe(el);
    });
});

// ==================== 数字递增动画 ====================
function animateNumbers() {
    const stats = document.querySelectorAll('.stat-number');
    
    stats.forEach(stat => {
        const target = parseInt(stat.dataset.target);
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                stat.textContent = target + '+';
                clearInterval(timer);
            } else {
                stat.textContent = Math.floor(current);
            }
        }, 16);
    });
}

// ==================== 导航栏滚动效果 ====================
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // 添加背景模糊效果
    if (currentScroll > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ==================== 平滑滚动和视差效果 ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ==================== 视差滚动效果 ====================
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    
    // Hero 区域视差
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        const heroOffset = scrolled * 0.5;
        heroContent.style.transform = `translateY(${heroOffset}px)`;
        heroContent.style.opacity = 1 - (scrolled / 700);
    }
    
    // 浮动代码视差
    const floatingCode = document.querySelector('.floating-code');
    if (floatingCode) {
        floatingCode.style.transform = `translateY(${-50 + scrolled * 0.3}%)`;
    }
    
    // 背景渐变视差
    const sections = document.querySelectorAll('section');
    sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        const scrollPercent = (window.innerHeight - rect.top) / window.innerHeight;
        
        if (scrollPercent > 0 && scrollPercent < 1) {
            const scale = 1 + (scrollPercent * 0.05);
            section.style.transform = `scale(${scale})`;
        }
    });
});

// ==================== 技能卡片悬停效果 ====================
const skillCards = document.querySelectorAll('.skill-card');

skillCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
    
    // 3D 倾斜效果
    card.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        this.style.transform = `translateY(-10px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) rotateX(0) rotateY(0)';
    });
});

// ==================== 项目卡片交互 ====================
const projectCards = document.querySelectorAll('.project-card');

projectCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        const placeholder = this.querySelector('.project-placeholder');
        if (placeholder) {
            placeholder.style.transform = 'scale(1.2) rotate(10deg)';
        }
    });
    
    card.addEventListener('mouseleave', function() {
        const placeholder = this.querySelector('.project-placeholder');
        if (placeholder) {
            placeholder.style.transform = 'scale(1) rotate(0deg)';
        }
    });
});

// ==================== 鼠标跟随效果 ====================
const cursor = document.createElement('div');
cursor.classList.add('custom-cursor');
document.body.appendChild(cursor);

const cursorStyle = document.createElement('style');
cursorStyle.textContent = `
    .custom-cursor {
        width: 20px;
        height: 20px;
        border: 2px solid rgba(102, 126, 234, 0.5);
        border-radius: 50%;
        position: fixed;
        pointer-events: none;
        z-index: 9999;
        transition: all 0.1s ease;
        transform: translate(-50%, -50%);
        display: none;
    }
    
    @media (min-width: 1024px) {
        .custom-cursor {
            display: block;
        }
    }
    
    .custom-cursor.active {
        transform: translate(-50%, -50%) scale(1.5);
        background: rgba(102, 126, 234, 0.2);
    }
`;
document.head.appendChild(cursorStyle);

document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
});

document.querySelectorAll('a, button, .skill-card, .project-card').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('active'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('active'));
});

// ==================== 联动滚动动画 ====================
class SmoothScroll {
    constructor() {
        this.current = 0;
        this.target = 0;
        this.ease = 0.075;
        this.init();
    }
    
    init() {
        document.body.style.height = `${document.documentElement.scrollHeight}px`;
        this.smoothScroll();
    }
    
    smoothScroll() {
        this.target = window.scrollY;
        this.current += (this.target - this.current) * this.ease;
        this.current = parseFloat(this.current.toFixed(2));
        
        // 应用滚动效果到不同元素
        this.applyScrollEffects();
        
        requestAnimationFrame(() => this.smoothScroll());
    }
    
    applyScrollEffects() {
        // Hero 区域的渐隐效果
        const hero = document.querySelector('.hero-section');
        if (hero) {
            const heroOpacity = 1 - (this.current / window.innerHeight);
            hero.style.opacity = Math.max(0, heroOpacity);
        }
        
        // 区块的缩放和渐入效果
        document.querySelectorAll('section').forEach((section) => {
            const rect = section.getBoundingClientRect();
            const scrollPercent = (window.innerHeight - rect.top) / window.innerHeight;
            
            if (scrollPercent > 0 && scrollPercent < 1) {
                section.style.opacity = Math.min(1, scrollPercent * 1.5);
            }
        });
    }
}

// 启用平滑滚动（可选，在某些浏览器可能影响性能）
// new SmoothScroll();

// ==================== 页面加载动画 ====================
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // 添加加载完成的样式
    const loadStyle = document.createElement('style');
    loadStyle.textContent = `
        body {
            opacity: 0;
            transition: opacity 0.5s ease;
        }
        
        body.loaded {
            opacity: 1;
        }
    `;
    document.head.appendChild(loadStyle);
});

// ==================== 响应式菜单（移动端） ====================
const createMobileMenu = () => {
    const nav = document.querySelector('.navbar');
    const menu = document.querySelector('.nav-menu');
    
    // 创建汉堡菜单按钮
    const menuButton = document.createElement('button');
    menuButton.classList.add('mobile-menu-button');
    menuButton.innerHTML = `
        <span></span>
        <span></span>
        <span></span>
    `;
    
    const menuStyle = document.createElement('style');
    menuStyle.textContent = `
        .mobile-menu-button {
            display: none;
            flex-direction: column;
            gap: 6px;
            background: transparent;
            border: none;
            cursor: pointer;
            padding: 8px;
        }
        
        .mobile-menu-button span {
            width: 25px;
            height: 2px;
            background: var(--color-text-primary);
            transition: all 0.3s ease;
        }
        
        @media (max-width: 640px) {
            .mobile-menu-button {
                display: flex;
            }
            
            .nav-menu {
                display: none;
                position: fixed;
                top: 70px;
                left: 0;
                right: 0;
                background: rgba(26, 26, 26, 0.98);
                flex-direction: column;
                padding: 2rem;
                backdrop-filter: blur(20px);
            }
            
            .nav-menu.active {
                display: flex;
            }
        }
    `;
    document.head.appendChild(menuStyle);
    
    nav.querySelector('.nav-container').appendChild(menuButton);
    
    menuButton.addEventListener('click', () => {
        menu.classList.toggle('active');
        menuButton.classList.toggle('active');
    });
};

createMobileMenu();

// ==================== 性能优化：节流函数 ====================
function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 优化滚动事件
window.addEventListener('scroll', throttle(() => {
    // 滚动事件处理
}, 50));

console.log('🚀 Portfolio loaded successfully by 0xyk3r');
