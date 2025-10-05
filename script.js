// ==================== Swiper 整屏滚动初始化 ====================
let swiperInstance;
let projectsSwiper;

document.addEventListener('DOMContentLoaded', () => {
    // 初始化主 Swiper
    swiperInstance = new Swiper('.swiper-container', {
        direction: 'vertical',
        slidesPerView: 1,
        spaceBetween: 0,
        mousewheel: {
            releaseOnEdges: true,
            sensitivity: 1,
            thresholdDelta: 50,
        },
        speed: 800,
        effect: 'slide',
        grabCursor: false,
        resistance: true,
        resistanceRatio: 0,
        pagination: {
            el: '#fullpage > .swiper-pagination',
            clickable: true,
            renderBullet: function (index, className) {
                return '<span class="' + className + '"></span>';
            },
        },
        keyboard: {
            enabled: true,
            onlyInViewport: true,
        },
        touchReleaseOnEdges: true,
        on: {
            init: function () {
                // 初始化时触发第一个页面的动画
                triggerSlideAnimations(0);
                // 延迟初始化项目画廊，确保DOM已完全加载
                setTimeout(() => {
                    initProjectsSwiper();
                }, 100);
            },
            slideChange: function () {
                const activeIndex = this.activeIndex;
                // 更新导航栏状态
                updateNavigation(activeIndex);
                // 触发页面动画
                triggerSlideAnimations(activeIndex);
                // 隐藏滚动提示
                hideScrollIndicator();
            },
        },
    });

    // 导航链接点击事件
    setupNavigation();

    // 初始化观察器
    setupIntersectionObserver();

    // 初始化其他交互效果
    setupInteractiveEffects();
});

// ==================== 项目画廊 Swiper 初始化 ====================
function initProjectsSwiper() {
    const projectsSwiperEl = document.querySelector('.projects-swiper');
    if (!projectsSwiperEl) {
        console.warn('Projects swiper element not found');
        return;
    }

    projectsSwiper = new Swiper('.projects-swiper', {
        slidesPerView: 1,
        spaceBetween: 30,
        centeredSlides: true,
        loop: true,
        speed: 600,
        effect: 'slide',
        grabCursor: true,
        navigation: {
            nextEl: '.projects-button-next',
            prevEl: '.projects-button-prev',
        },
        pagination: {
            el: '.projects-pagination',
            clickable: true,
            dynamicBullets: true,
        },
        breakpoints: {
            640: {
                slidesPerView: 1,
                spaceBetween: 20,
            },
            768: {
                slidesPerView: 2,
                spaceBetween: 30,
            },
            1024: {
                slidesPerView: 3,
                spaceBetween: 30,
            },
        },
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
        },
    });
}

// ==================== 导航栏设置 ====================
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const index = parseInt(link.getAttribute('data-index'));
            if (swiperInstance && index >= 0) {
                swiperInstance.slideTo(index);
            }
        });
    });
}

function updateNavigation(activeIndex) {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach((link, index) => {
        if (index === activeIndex) {
            link.style.color = 'var(--color-text-primary)';
        } else {
            link.style.color = 'var(--color-text-secondary)';
        }
    });

    // 更新导航栏背景
    const navbar = document.querySelector('.navbar');
    if (activeIndex > 0) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}

function hideScrollIndicator() {
    const indicator = document.querySelector('.scroll-indicator');
    if (indicator) {
        indicator.style.opacity = '0';
        indicator.style.visibility = 'hidden';
    }
}

// ==================== 页面切换动画 ====================
function triggerSlideAnimations(index) {
    const slides = document.querySelectorAll('.swiper-slide');
    const currentSlide = slides[index];

    if (!currentSlide) return;

    // 标题动画
    const title = currentSlide.querySelector('.section-title');
    if (title) {
        setTimeout(() => {
            title.classList.add('visible');
        }, 100);
    }

    // 关于页面动画
    if (index === 1) {
        setTimeout(() => {
            const aboutText = currentSlide.querySelector('.about-text');
            const aboutVisual = currentSlide.querySelector('.about-visual');
            if (aboutText) aboutText.classList.add('visible');
            if (aboutVisual) aboutVisual.classList.add('visible');
            animateNumbers();
        }, 300);
    }

    // 技能卡片动画
    if (index === 2) {
        const skillCards = currentSlide.querySelectorAll('.skill-card');
        skillCards.forEach((card, i) => {
            setTimeout(() => {
                card.classList.add('visible');
                const progressBar = card.querySelector('.skill-progress');
                if (progressBar) {
                    const targetWidth = progressBar.dataset.progress;
                    progressBar.style.width = `${targetWidth}%`;
                }
            }, 100 + i * 100);
        });
    }

    // 项目卡片动画
    if (index === 3) {
        const projectCards = currentSlide.querySelectorAll('.project-card');
        projectCards.forEach((card, i) => {
            setTimeout(() => {
                card.classList.add('visible');
            }, 100 + i * 150);
        });
    }
}

// ==================== 数字递增动画 ====================
let numbersAnimated = false;

function animateNumbers() {
    if (numbersAnimated) return;
    numbersAnimated = true;

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

// ==================== IntersectionObserver 观察器 ====================
function setupIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px',
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // 观察所有需要动画的元素
    document.querySelectorAll('.section-title, .skill-card, .project-card').forEach(el => {
        observer.observe(el);
    });
}

// ==================== 交互效果设置 ====================
function setupInteractiveEffects() {
    // 技能卡片3D效果
    const skillCards = document.querySelectorAll('.skill-card');
    skillCards.forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;

            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
        });
    });

    // 项目卡片悬停效果
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

    // 按钮点击效果
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            // 如果是内部链接，使用 Swiper 导航
            const href = this.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const sections = ['home', 'about', 'skills', 'projects', 'contact'];
                const index = sections.indexOf(targetId);
                if (index >= 0 && swiperInstance) {
                    swiperInstance.slideTo(index);
                }
            }
        });
    });
}

// ==================== 自定义鼠标光标 ====================
function setupCustomCursor() {
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
            transition: opacity 0.1s ease;
            transform: translate(-50%, -50%);
            display: none;
            will-change: transform;
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
}

setupCustomCursor();

// ==================== 响应式移动菜单 ====================
function createMobileMenu() {
    const nav = document.querySelector('.navbar');
    const menu = document.querySelector('.nav-menu');

    if (!nav || !menu) return;

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
            z-index: 1001;
        }
        
        .mobile-menu-button span {
            width: 25px;
            height: 2px;
            background: var(--color-text-primary);
            transition: all 0.3s ease;
        }
        
        .mobile-menu-button.active span:nth-child(1) {
            transform: rotate(45deg) translate(8px, 8px);
        }
        
        .mobile-menu-button.active span:nth-child(2) {
            opacity: 0;
        }
        
        .mobile-menu-button.active span:nth-child(3) {
            transform: rotate(-45deg) translate(7px, -7px);
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
                z-index: 1000;
            }
            
            .nav-menu.active {
                display: flex;
            }
            
            .swiper-pagination {
                display: none !important;
            }
        }
    `;
    document.head.appendChild(menuStyle);

    nav.querySelector('.nav-container').appendChild(menuButton);

    menuButton.addEventListener('click', () => {
        menu.classList.toggle('active');
        menuButton.classList.toggle('active');
    });

    // 点击菜单项后关闭菜单
    menu.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            menu.classList.remove('active');
            menuButton.classList.remove('active');
        });
    });
}

createMobileMenu();

// ==================== 页面加载动画 ====================
window.addEventListener('load', () => {
    document.body.classList.add('loaded');

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

// ==================== 性能优化 ====================
// 节流函数
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

// 防抖函数
function debounce(func, wait) {
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

// ==================== 粒子背景效果 ====================
function createParticles() {
    const particlesBg = document.getElementById('particles-bg');
    if (!particlesBg) return;

    const particleCount = 50;
    const colors = ['rgba(102, 126, 234, 0.3)', 'rgba(0, 163, 255, 0.3)', 'rgba(118, 75, 162, 0.3)'];

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';

        const size = Math.random() * 4 + 2;
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const duration = Math.random() * 20 + 10;
        const delay = Math.random() * 5;
        const color = colors[Math.floor(Math.random() * colors.length)];

        particle.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            left: ${x}%;
            top: ${y}%;
            background: ${color};
            animation: particle-float ${duration}s ${delay}s infinite ease-in-out;
        `;

        particlesBg.appendChild(particle);
    }

    // 添加粒子浮动动画
    const style = document.createElement('style');
    style.textContent = `
        @keyframes particle-float {
            0%, 100% {
                transform: translate(0, 0);
                opacity: 0;
            }
            10% {
                opacity: 1;
            }
            90% {
                opacity: 1;
            }
            25% {
                transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px);
            }
            50% {
                transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px);
            }
            75% {
                transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px);
            }
        }
    `;
    document.head.appendChild(style);
}

// ==================== 几何形状装饰 ====================
function createGeometricShapes() {
    const shapesContainer = document.getElementById('geometric-shapes');
    if (!shapesContainer) return;

    const shapes = [
        { type: 'circle', size: 80, top: '10%', left: '15%', delay: 0 },
        { type: 'square', size: 60, top: '60%', left: '80%', delay: 2 },
        { type: 'circle', size: 100, top: '70%', left: '10%', delay: 4 },
        { type: 'square', size: 50, top: '20%', right: '10%', delay: 1 },
        { type: 'triangle', top: '50%', right: '20%', delay: 3 },
        { type: 'circle', size: 70, top: '85%', left: '60%', delay: 5 }
    ];

    shapes.forEach(shape => {
        const shapeEl = document.createElement('div');
        shapeEl.className = `shape ${shape.type}`;

        let styles = `
            animation-delay: ${shape.delay}s;
        `;

        if (shape.type !== 'triangle') {
            styles += `
                width: ${shape.size}px;
                height: ${shape.size}px;
            `;
        }

        if (shape.top) styles += `top: ${shape.top};`;
        if (shape.left) styles += `left: ${shape.left};`;
        if (shape.right) styles += `right: ${shape.right};`;

        shapeEl.style.cssText = styles;
        shapesContainer.appendChild(shapeEl);
    });
}

// ==================== 代码雨效果 ====================
function createCodeRain() {
    const codeRain = document.getElementById('code-rain');
    if (!codeRain) return;

    const characters = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン{}[]<>/';
    const columns = Math.floor(window.innerWidth / 20);

    for (let i = 0; i < 20; i++) {
        const char = document.createElement('div');
        char.className = 'code-char';
        char.textContent = characters[Math.floor(Math.random() * characters.length)];

        const left = Math.random() * 100;
        const duration = Math.random() * 10 + 5;
        const delay = Math.random() * 5;

        char.style.cssText = `
            left: ${left}%;
            animation-duration: ${duration}s;
            animation-delay: ${delay}s;
        `;

        codeRain.appendChild(char);

        // 定期更换字符
        setInterval(() => {
            char.textContent = characters[Math.floor(Math.random() * characters.length)];
        }, 100);
    }
}

// ==================== 鼠标跟随光效 ====================
function setupCursorGlow() {
    const cursorGlow = document.getElementById('cursor-glow');
    if (!cursorGlow) return;

    // 直接跟随鼠标，无缓动效果
    document.addEventListener('mousemove', (e) => {
        cursorGlow.style.left = e.clientX + 'px';
        cursorGlow.style.top = e.clientY + 'px';
        cursorGlow.style.opacity = '1';
    });

    document.addEventListener('mouseleave', () => {
        cursorGlow.style.opacity = '0';
    });
}

// ==================== 滚动进度条 ====================
function setupScrollProgress() {
    const progressBar = document.getElementById('scroll-progress');
    if (!progressBar || !swiperInstance) return;

    swiperInstance.on('slideChange', function() {
        const progress = (this.activeIndex / (this.slides.length - 1)) * 100;
        progressBar.style.width = progress + '%';
    });
}

// ==================== 项目卡片鼠标跟踪光效 ====================
function setupProjectCardEffects() {
    const projectCards = document.querySelectorAll('.project-card');

    projectCards.forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;

            this.style.setProperty('--mouse-x', x + '%');
            this.style.setProperty('--mouse-y', y + '%');
        });
    });
}

// ==================== 视差滚动效果 ====================
function setupParallaxEffects() {
    const floatingElements = document.querySelectorAll('.floating-decoration, .floating-code');

    if (swiperInstance) {
        swiperInstance.on('slideChange', function() {
            const progress = this.progress;

            floatingElements.forEach((element, index) => {
                const speed = (index % 3 + 1) * 20;
                const offset = progress * speed;
                element.style.transform = `translateY(${offset}px) rotate(${offset * 0.5}deg)`;
            });
        });
    }
}

// ==================== 初始化所有视觉效果 ====================
function initVisualEffects() {
    const isMobile = window.innerWidth <= 640;
    const isTablet = window.innerWidth <= 968;

    // 仅在桌面设备上启用高性能效果
    if (!isMobile) {
        createParticles();
        createCodeRain();
        setupCursorGlow();
    }

    if (!isTablet) {
        createGeometricShapes();
    }

    // 所有设备都启用的效果
    setupScrollProgress();
    setupProjectCardEffects();
    setupParallaxEffects();
}

// 在页面加载完成后初始化
window.addEventListener('load', () => {
    setTimeout(() => {
        initVisualEffects();
    }, 500);
});

// 窗口大小改变时重新初始化
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        // 清理现有效果
        const particlesBg = document.getElementById('particles-bg');
        const geometricShapes = document.getElementById('geometric-shapes');
        const codeRain = document.getElementById('code-rain');

        if (particlesBg) particlesBg.innerHTML = '';
        if (geometricShapes) geometricShapes.innerHTML = '';
        if (codeRain) codeRain.innerHTML = '';

        // 重新初始化
        initVisualEffects();
    }, 500);
});

// ==================== 性能优化：减少动画在不可见时的开销 ====================
document.addEventListener('visibilitychange', () => {
    const particles = document.querySelectorAll('.particle');
    const shapes = document.querySelectorAll('.shape');

    if (document.hidden) {
        particles.forEach(p => p.style.animationPlayState = 'paused');
        shapes.forEach(s => s.style.animationPlayState = 'paused');
    } else {
        particles.forEach(p => p.style.animationPlayState = 'running');
        shapes.forEach(s => s.style.animationPlayState = 'running');
    }
});

// ==================== 控制台输出 ====================
console.log('%c🚀 Portfolio loaded successfully!', 'color: #667eea; font-size: 16px; font-weight: bold;');
console.log('%c✨ Powered by Swiper.js', 'color: #00a3ff; font-size: 12px;');
console.log('%c💻 Designed & Developed by 0xyk3r', 'color: #30d158; font-size: 12px;');
