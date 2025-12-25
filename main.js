// js/main.js - Main JavaScript Functions

class PortfolioApp {
    constructor() {
        this.init();
        this.setupEventListeners();
        this.createParticles();
        this.initScrollAnimations();
    }

    init() {
        // Initialize loading screen
        this.hideLoadingScreen();

        // Initialize navbar scroll effect
        this.handleNavbarScroll();

        // Initialize mobile menu
        this.initMobileMenu();

        // Initialize scroll indicator
        this.initScrollIndicator();

        // Initialize counter animations
        this.initCounterAnimation();

        // Initialize typing animation
        this.initTypingAnimation();

        // Initialize parallax effects
        this.initParallax();
    }

    setupEventListeners() {
        // Scroll events
        window.addEventListener('scroll', this.throttle(this.onScroll.bind(this), 16));

        // Resize events
        window.addEventListener('resize', this.debounce(this.onResize.bind(this), 250));

        // Mouse move events for parallax
        document.addEventListener('mousemove', this.throttle(this.onMouseMove.bind(this), 16));

        // Click events for ripple effects
        document.addEventListener('click', this.handleRippleEffect.bind(this));

        // Keyboard navigation
        document.addEventListener('keydown', this.handleKeyNavigation.bind(this));

        // Page visibility change
        document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
    }

    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
                setTimeout(() => {
                    loadingScreen.remove();
                }, 500);
            }, );
        }
    }

    handleNavbarScroll() {
        const navbar = document.getElementById('navbar');
        let lastScrollY = window.scrollY;

        const updateNavbar = () => {
            const scrollY = window.scrollY;

            if (scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }

            // Hide/show navbar on scroll
            if (scrollY > lastScrollY && scrollY > 200) {
                navbar.style.transform = 'translateY(-100%)';
            } else {
                navbar.style.transform = 'translateY(0)';
            }

            lastScrollY = scrollY;
        };

        this.onScroll = updateNavbar;
    }

    initMobileMenu() {
        const mobileToggle = document.getElementById('mobileToggle');
        const navLinks = document.getElementById('navLinks');
        const navLinksItems = navLinks.querySelectorAll('.nav-link');

        if (!mobileToggle || !navLinks) return;

        mobileToggle.addEventListener('click', () => {
            const isActive = navLinks.classList.contains('active');

            navLinks.classList.toggle('active');
            mobileToggle.classList.toggle('active');

            // Toggle body scroll
            document.body.style.overflow = isActive ? 'auto' : 'hidden';

            // Animate nav links
            if (!isActive) {
                navLinksItems.forEach((link, index) => {
                    link.style.opacity = '0';
                    link.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        link.style.transition = 'all 0.3s ease';
                        link.style.opacity = '1';
                        link.style.transform = 'translateY(0)';
                    }, index * 100);
                });
            }
        });

        // Close menu when clicking nav links
        navLinksItems.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                mobileToggle.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                mobileToggle.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    }

    initScrollIndicator() {
        const scrollIndicator = document.querySelector('.scroll-indicator');
        if (!scrollIndicator) return;

        const handleScrollIndicator = () => {
            const scrollY = window.scrollY;
            const windowHeight = window.innerHeight;

            if (scrollY > windowHeight * 0.3) {
                scrollIndicator.classList.add('hidden');
            } else {
                scrollIndicator.classList.remove('hidden');
            }
        };

        window.addEventListener('scroll', this.throttle(handleScrollIndicator, 16));
    }

    createParticles() {
        const particlesContainer = document.getElementById('particles');
        if (!particlesContainer) return;

        const particleCount = this.isMobile() ? 30 : 50;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 6 + 's';
            particle.style.animationDuration = (Math.random() * 3 + 3) + 's';

            // Random sizes for variety
            const size = Math.random() * 3 + 1;
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';

            particlesContainer.appendChild(particle);
        }
    }

    initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    const delay = element.dataset.delay || 0;

                    setTimeout(() => {
                        element.classList.add('visible');

                        // Trigger counter animation for stats
                        if (element.classList.contains('stats-section')) {
                            this.animateCounters();
                        }
                    }, parseInt(delay));

                    observer.unobserve(element);
                }
            });
        }, observerOptions);

        // Observe all fade-in elements
        document.querySelectorAll('.fade-in').forEach(el => {
            observer.observe(el);
        });
    }

    initCounterAnimation() {
        this.countersAnimated = false;
    }

    animateCounters() {
        if (this.countersAnimated) return;
        this.countersAnimated = true;

        const counters = document.querySelectorAll('.stat-number');

        counters.forEach(counter => {
            const target = parseInt(counter.dataset.target);
            const increment = target / 50;
            let current = 0;

            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    counter.textContent = target + '+';
                    clearInterval(timer);
                } else {
                    counter.textContent = Math.ceil(current) + '+';
                }
            }, 40);
        });
    }

    initTypingAnimation() {
        const nameElement = document.querySelector('.name');
        if (!nameElement) return;

        // Store original text
        const originalText = nameElement.textContent.trim();
        nameElement.textContent = '';

        let i = 0;
        const typeSpeed = 100;

        const typeWriter = () => {
            if (i < originalText.length) {
               const char = originalText.charAt(i);
            nameElement.textContent += char;
            i++;
            // If it's a space, don't wait
            setTimeout(typeWriter, char === ' ' ? 0 : typeSpeed);
        }
        };

        // Start typing animation after initial delay
        setTimeout(typeWriter, 50);
    }

    initParallax() {
        const shapes = document.querySelectorAll('.shape');
        const profileImage = document.querySelector('.profile-image-container');

        this.parallaxElements = { shapes, profileImage };
    }

    onMouseMove(e) {
        if (this.isMobile()) return;

        const { clientX: mouseX, clientY: mouseY } = e;
        const { innerWidth: windowWidth, innerHeight: windowHeight } = window;

        const xPercent = (mouseX / windowWidth - 0.5) * 2;
        const yPercent = (mouseY / windowHeight - 0.5) * 2;

        // Move floating shapes
        this.parallaxElements.shapes.forEach((shape, index) => {
            const speed = (index + 1) * 0.5;
            const x = xPercent * speed * 20;
            const y = yPercent * speed * 20;

            shape.style.transform = `translate(${x}px, ${y}px)`;
        });

        // Subtle movement for profile image
        if (this.parallaxElements.profileImage) {
            const x = xPercent * 10;
            const y = yPercent * 10;
            this.parallaxElements.profileImage.style.transform = `translate(${x}px, ${y}px)`;
        }
    }

    handleRippleEffect(e) {
        const target = e.target.closest('.btn, .contact-btn, .social-link, .stat-card');
        if (!target) return;

        const rect = target.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';

        // Ensure target has relative positioning
        const originalPosition = target.style.position;
        target.style.position = 'relative';
        target.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
            target.style.position = originalPosition;
        }, 600);
    }

    handleKeyNavigation(e) {
        // Handle keyboard navigation for accessibility
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    }

    handleVisibilityChange() {
        // Pause animations when page is not visible
        const particles = document.querySelectorAll('.particle');
        const shapes = document.querySelectorAll('.shape');

        if (document.hidden) {
            particles.forEach(p => p.style.animationPlayState = 'paused');
            shapes.forEach(s => s.style.animationPlayState = 'paused');
        } else {
            particles.forEach(p => p.style.animationPlayState = 'running');
            shapes.forEach(s => s.style.animationPlayState = 'running');
        }
    }

    onResize() {
        // Handle resize events
        if (this.isMobile()) {
            // Reduce particles on mobile
            const particles = document.querySelectorAll('.particle');
            particles.forEach((particle, index) => {
                if (index > 20) {
                    particle.style.display = 'none';
                } else {
                    particle.style.display = 'block';
                }
            });
        }
    }

    // Utility functions
    isMobile() {
        return window.innerWidth <= 768;
    }

    throttle(func, limit) {
        let inThrottle;
        return function () {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    debounce(func, wait, immediate) {
        let timeout;
        return function () {
            const context = this;
            const args = arguments;
            const later = function () {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }

    // Smooth scrolling for anchor links
    initSmoothScrolling() {
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
    }

    // Form validation (for future use)
    validateForm(form) {
        const inputs = form.querySelectorAll('input[required], textarea[required]');
        let isValid = true;

        inputs.forEach(input => {
            const value = input.value.trim();
            const errorElement = input.nextElementSibling;

            if (!value) {
                input.classList.add('error');
                if (errorElement && errorElement.classList.contains('error-message')) {
                    errorElement.textContent = 'This field is required';
                }
                isValid = false;
            } else if (input.type === 'email' && !this.isValidEmail(value)) {
                input.classList.add('error');
                if (errorElement && errorElement.classList.contains('error-message')) {
                    errorElement.textContent = 'Please enter a valid email';
                }
                isValid = false;
            } else {
                input.classList.remove('error');
                if (errorElement && errorElement.classList.contains('error-message')) {
                    errorElement.textContent = '';
                }
            }
        });

        return isValid;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Performance monitoring
    measurePerformance() {
        if ('performance' in window) {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log('Page load time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
            console.log('DOM content loaded:', perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart, 'ms');
        }
    }

    // Initialize service worker (for future PWA features)
    initServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('SW registered: ', registration);
                })
                .catch(registrationError => {
                    console.log('SW registration failed: ', registrationError);
                });
        }
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new PortfolioApp();

    // Add to global scope for debugging
    window.portfolioApp = app;

    // Performance monitoring in development
    if (window.location.hostname === 'localhost') {
        app.measurePerformance();
    }
});

// Hide loading screen after page load (contact page only)
window.addEventListener('load', function () {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        loadingScreen.classList.add('hidden');
        setTimeout(() => {
            loadingScreen.remove();
        }, 5000);
    }
});

// Smart "Email Me Directly" button behavior
document.addEventListener('DOMContentLoaded', function () {
    var emailBtn = document.querySelector('.cta-secondary');
    if (!emailBtn) return;

    var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    if (isMobile) {
        emailBtn.setAttribute('href', 'mailto:sanwal7887535@gmail.com');
        emailBtn.removeAttribute('target');
    } else {
        emailBtn.setAttribute('href', 'https://mail.google.com/mail/?view=cm&to=sanwal7887535@gmail.com');
        emailBtn.setAttribute('target', '_blank');
        emailBtn.setAttribute('rel', 'noopener');
    }
});

// Handle page unload
window.addEventListener('beforeunload', () => {
    // Clean up any running animations or timers
    const particles = document.querySelectorAll('.particle');
    particles.forEach(particle => {
        particle.style.animationPlayState = 'paused';
    });
});

// Global error handler
window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
    // In production, you might want to send this to an error tracking service
});

// Handle offline/online states
window.addEventListener('online', () => {
    console.log('Back online');
    // Re-enable network-dependent features
});

window.addEventListener('offline', () => {
    console.log('Gone offline');
    // Disable network-dependent features
});

// Mobile Navigation - FIXED JavaScript
document.addEventListener('DOMContentLoaded', function () {
    const mobileToggle = document.getElementById('mobileToggle');
    const navLinks = document.getElementById('navLinks');
    const navLinksItems = navLinks.querySelectorAll('.nav-link, .contact-btn');

    // Create mobile overlay if it doesn't exist
    let mobileOverlay = document.getElementById('mobileOverlay');
    if (!mobileOverlay) {
        mobileOverlay = document.createElement('div');
        mobileOverlay.id = 'mobileOverlay';
        mobileOverlay.className = 'mobile-overlay';
        document.body.appendChild(mobileOverlay);
    }

    if (!mobileToggle || !navLinks) return;

    // Toggle mobile menu function
    function toggleMobileMenu() {
        const isActive = navLinks.classList.contains('active');

        if (isActive) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    }

    // Open mobile menu
    function openMobileMenu() {
        navLinks.classList.add('active');
        mobileToggle.classList.add('active');
        mobileOverlay.classList.add('active');
        document.body.classList.add('menu-open');

        // Update aria attributes for accessibility
        mobileToggle.setAttribute('aria-expanded', 'true');
    }

    // Close mobile menu
    function closeMobileMenu() {
        navLinks.classList.remove('active');
        mobileToggle.classList.remove('active');
        mobileOverlay.classList.remove('active');
        document.body.classList.remove('menu-open');

        // Update aria attributes for accessibility
        mobileToggle.setAttribute('aria-expanded', 'false');
    }

    // Event Listeners
    mobileToggle.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        toggleMobileMenu();
    });

    // Close menu when clicking overlay
    mobileOverlay.addEventListener('click', closeMobileMenu);

    // Close menu when clicking nav links
    navLinksItems.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    // Close menu on escape key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && navLinks.classList.contains('active')) {
            closeMobileMenu();
        }
    });

    // Close menu on window resize if switching to desktop
    window.addEventListener('resize', function () {
        if (window.innerWidth > 1023 && navLinks.classList.contains('active')) {
            closeMobileMenu();
        }
    });
});

// Navbar scroll effect (if you want it)
window.addEventListener('scroll', function () {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile Navigation - Toggle Menu

document.addEventListener('DOMContentLoaded', function () {
    const mobileToggle = document.getElementById('mobileToggle');
    const navLinks = document.getElementById('navLinks');
    const body = document.body;

    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
            body.classList.toggle('menu-open');
        });

        // Optional: Close menu when a link is clicked
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileToggle.classList.remove('active');
                navLinks.classList.remove('active');
                body.classList.remove('menu-open');
            });
        });
    }
});

window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    if (loader) {
        loader.classList.add('hide');
        setTimeout(() => {
            loader.style.display = 'none';
        },10); // Adjust this value for your desired loading time (ms)
    }
});
