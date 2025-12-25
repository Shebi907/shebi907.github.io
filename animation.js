class AnimationController {
    constructor() {
        this.observers = new Map();
        this.animatedElements = new Set();
        this.init();
    }

    init() {
        this.setupIntersectionObserver();
        this.setupScrollAnimations();
        this.initTextAnimations();
        this.initParallaxAnimations();
    }

    setupIntersectionObserver() {
        const observerOptions = {
            threshold: [0, 0.1, 0.5],
            rootMargin: '0px 0px -10% 0px'
        };

        this.mainObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const element = entry.target;
                const animationType = element.dataset.animation || 'fadeInUp';
                const delay = parseInt(element.dataset.delay) || 0;

                if (entry.isIntersecting && !this.animatedElements.has(element)) {
                    setTimeout(() => {
                        this.animateElement(element, animationType);
                        this.animatedElements.add(element);
                    }, delay);
                }
            });
        }, observerOptions);

        // Observe all elements with animation classes
        this.observeAnimationElements();
    }

    observeAnimationElements() {
        const animationSelectors = [
            '.fade-in',
            '.scroll-reveal',
            '.stagger-animation',
            '[data-animation]'
        ];

        animationSelectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                this.mainObserver.observe(el);
            });
        });
    }

    animateElement(element, animationType) {
        // Add this for fade-in with delay
        const delay = element.getAttribute('data-delay') || 0;
        element.style.transitionDelay = `${delay}ms`;
        element.classList.add('visible');

        switch (animationType) {
            case 'fadeInUp':
                this.fadeInUp(element);
                break;
            case 'fadeInDown':
                this.fadeInDown(element);
                break;
            case 'fadeInLeft':
                this.fadeInLeft(element);
                break;
            case 'fadeInRight':
                this.fadeInRight(element);
                break;
            case 'scaleIn':
                this.scaleIn(element);
                break;
            case 'slideInUp':
                this.slideInUp(element);
                break;
            case 'elastic':
                this.elastic(element);
                break;
            case 'bounce':
                this.bounce(element);
                break;
            case 'flipIn':
                this.flipIn(element);
                break;
            default:
                this.fadeInUp(element);
        }
    }

    fadeInUp(element) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        
        requestAnimationFrame(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        });
    }

    fadeInDown(element) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(-30px)';
        element.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        
        requestAnimationFrame(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        });
    }

    fadeInLeft(element) {
        element.style.opacity = '0';
        element.style.transform = 'translateX(-30px)';
        element.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        
        requestAnimationFrame(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateX(0)';
        });
    }

    fadeInRight(element) {
        element.style.opacity = '0';
        element.style.transform = 'translateX(30px)';
        element.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        
        requestAnimationFrame(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateX(0)';
        });
    }

    scaleIn(element) {
        element.style.opacity = '0';
        element.style.transform = 'scale(0.8)';
        element.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        
        requestAnimationFrame(() => {
            element.style.opacity = '1';
            element.style.transform = 'scale(1)';
        });
    }

    slideInUp(element) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(50px)';
        element.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        
        requestAnimationFrame(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        });
    }

    elastic(element) {
        element.style.opacity = '0';
        element.style.transform = 'scale(0)';
        element.style.transition = 'none';
        
        requestAnimationFrame(() => {
            element.style.opacity = '1';
            element.style.animation = 'elastic 1s ease forwards';
        });
    }

    bounce(element) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(100px)';
        element.style.transition = 'none';
        
        requestAnimationFrame(() => {
            element.style.opacity = '1';
            element.style.animation = 'bounce 1s ease forwards';
        });
    }

    flipIn(element) {
        element.style.opacity = '0';
        element.style.transform = 'rotateY(90deg)';
        element.style.transition = 'all 0.8s ease';
        
        requestAnimationFrame(() => {
            element.style.opacity = '1';
            element.style.transform = 'rotateY(0deg)';
        });
    }

    setupScrollAnimations() {
        let ticking = false;

        const scrollHandler = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.updateScrollAnimations();
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', scrollHandler, { passive: true });
    }

    updateScrollAnimations() {
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;

        // Parallax elements
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        parallaxElements.forEach(el => {
            const speed = parseFloat(el.dataset.parallax) || 0.5;
            const yPos = -(scrollY * speed);
            el.style.transform = `translateY(${yPos}px)`;
        });

        // Progress bar animation
        const progressBars = document.querySelectorAll('.progress-bar');
        progressBars.forEach(bar => {
            const rect = bar.getBoundingClientRect();
            if (rect.top < windowHeight && rect.bottom > 0) {
                const progress = bar.dataset.progress || '0';
                bar.style.width = progress + '%';
            }
        });
    }

    initTextAnimations() {
        this.initTypewriterEffect();
        this.initCounterAnimation();
        this.initTextRevealAnimation();
    }

    initTypewriterEffect() {
        const typewriterElements = document.querySelectorAll('[data-typewriter]');
        
        typewriterElements.forEach(element => {
            const text = element.textContent;
            const speed = parseInt(element.dataset.typewriterSpeed) || 100;
            const delay = parseInt(element.dataset.typewriterDelay) || 0;
            
            element.textContent = '';
            element.style.borderRight = '2px solid var(--primary-color)';
            
            setTimeout(() => {
                this.typeText(element, text, speed);
            }, delay);
        });
    }

    typeText(element, text, speed) {
        let i = 0;
        const timer = setInterval(() => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(timer);
                // Remove cursor after typing
                setTimeout(() => {
                    element.style.borderRight = 'none';
                }, 500);
            }
        }, speed);
    }

    initCounterAnimation() {
        const counterElements = document.querySelectorAll('[data-counter]');
        
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counterElements.forEach(el => counterObserver.observe(el));
    }

    animateCounter(element) {
        const target = parseInt(element.dataset.counter);
        const duration = parseInt(element.dataset.counterDuration) || 2000;
        const increment = target / (duration / 16); // 60fps
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target + (element.dataset.counterSuffix || '');
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current) + (element.dataset.counterSuffix || '');
            }
        }, 16);
    }

    initTextRevealAnimation() {
        const textRevealElements = document.querySelectorAll('[data-text-reveal]');
        
        textRevealElements.forEach(element => {
            const text = element.textContent;
            element.innerHTML = '';
            
            // Split text into spans
            text.split('').forEach((char, index) => {
                const span = document.createElement('span');
                span.textContent = char === ' ' ? '\u00A0' : char;
                span.style.opacity = '0';
                span.style.transform = 'translateY(20px)';
                span.style.transition = `all 0.3s ease ${index * 0.05}s`;
                element.appendChild(span);
            });
        });

        const textRevealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const spans = entry.target.querySelectorAll('span');
                    spans.forEach(span => {
                        span.style.opacity = '1';
                        span.style.transform = 'translateY(0)';
                    });
                    textRevealObserver.unobserve(entry.target);
                }
            });
        });

        textRevealElements.forEach(el => textRevealObserver.observe(el));
    }

    initParallaxAnimations() {
        let ticking = false;

        const mouseMoveHandler = (e) => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.updateParallaxElements(e);
                    ticking = false;
                });
                ticking = true;
            }
        };

        document.addEventListener('mousemove', mouseMoveHandler, { passive: true });
    }

    updateParallaxElements(e) {
        const { clientX: mouseX, clientY: mouseY } = e;
        const { innerWidth: windowWidth, innerHeight: windowHeight } = window;
        
        const xPercent = (mouseX / windowWidth - 0.5) * 2;
        const yPercent = (mouseY / windowHeight - 0.5) * 2;

        // Mouse parallax elements
        const mouseParallaxElements = document.querySelectorAll('[data-mouse-parallax]');
        mouseParallaxElements.forEach(el => {
            const speed = parseFloat(el.dataset.mouseParallax) || 1;
            const x = xPercent * speed * 40;
            const y = yPercent * speed * 40;
            
            el.style.transform = `translate(${x}px, ${y}px)`;
        });
    }

    // Stagger animation for multiple elements
    staggerAnimation(elements, animationType = 'fadeInUp', staggerDelay = 10) {
        elements.forEach((element, index) => {
            setTimeout(() => {
                this.animateElement(element, animationType);
            }, index * staggerDelay);
        });
    }

    // Page transition animations
    pageTransitionIn(callback) {
        const overlay = document.createElement('div');
        overlay.className = 'page-transition-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: var(--bg-primary);
            z-index: 9999;
            transform: translateX(-100%);
            transition: transform 0.2s ease;
        `;
        
        document.body.appendChild(overlay);
        
        requestAnimationFrame(() => {
            overlay.style.transform = 'translateX(0)';
            setTimeout(() => {
                if (callback) callback();
                setTimeout(() => {
                    overlay.style.transform = 'translateX(100%)';
                    setTimeout(() => {
                        overlay.remove();
                    }, 500);
                }, 100);
            }, 500);
        });
    }

    // Utility methods
    addAnimation(element, animationType, delay = 0) {
        setTimeout(() => {
            this.animateElement(element, animationType);
        }, delay);
    }

    removeAnimation(element) {
        element.style.animation = '';
        element.style.transition = '';
        element.style.transform = '';
        element.style.opacity = '';
    }

    pauseAnimations() {
        const animatedElements = document.querySelectorAll('[style*="animation"]');
        animatedElements.forEach(el => {
            el.style.animationPlayState = 'paused';
        });
    }

    resumeAnimations() {
        const animatedElements = document.querySelectorAll('[style*="animation"]');
        animatedElements.forEach(el => {
            el.style.animationPlayState = 'running';
        });
    }

    // Cleanup method
    destroy() {
        this.mainObserver.disconnect();
        this.observers.forEach(observer => observer.disconnect());
        this.observers.clear();
        this.animatedElements.clear();
    }
}

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.fade-in').forEach(el => {
        const delay = el.getAttribute('data-delay') || 0;
        el.style.animationDelay = `${delay}ms`;
        el.classList.add('animated');
    });
});

// Improved 3D falling stones background animation
const canvas = document.getElementById('falling-stones-bg');
const ctx = canvas.getContext('2d');
let stones = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function randomStoneColor() {
    // Subtle blue/cyan/white for rain effect
    const colors = [
        'rgba(24,224,255,0.7)', // bright cyan
        'rgba(80,120,255,0.5)', // soft blue
        'rgba(255,255,255,0.3)' // white
    ];
    return colors[Math.floor(Math.random() * colors.length)];
}

function createStone() {
    return {
        x: Math.random() * canvas.width,
        y: -10,
        r: Math.random() * 2 + 1.5, // much smaller radius for rain
        length: Math.random() * 1 + 5, // raindrop length
        speed: Math.random() * 4 + 3, // faster for rain
        color: randomStoneColor(),
        angle: Math.PI / 12 * (Math.random() - 0.5) // slight tilt
    };
}

function drawStones() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stones.forEach(stone => {
        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = stone.color;
        ctx.lineWidth = stone.r;
        ctx.globalAlpha = 0.8;
        ctx.translate(stone.x, stone.y);
        ctx.rotate(stone.angle);
        ctx.moveTo(0, 0);
        ctx.lineTo(0, stone.length);
        ctx.stroke();
        ctx.closePath();
        ctx.restore();
    });
}

function updateStones() {
    stones.forEach(stone => {
        stone.y += stone.speed;
    });
    stones = stones.filter(stone => stone.y < canvas.height + stone.length);
    while (stones.length < 120) { // more drops for rain effect
        stones.push(createStone());
    }
}

function animate() {
    updateStones();
    drawStones();
    requestAnimationFrame(animate);
}
animate();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AnimationController;
}
