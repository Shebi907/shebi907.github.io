// js/navigation.js - Navigation Functions

class NavigationController {
    constructor() {
        this.currentPage = this.getCurrentPage();
        this.isNavigating = false;
        this.history = [];
        this.init();
    }

    init() {
       // this.setupNavigation();
        this.setupActiveStates();
        this.setupSmoothScrolling();
        this.setupKeyboardNavigation();
        this.setupBreadcrumbs();
    }

    getCurrentPage() {
        const path = window.location.pathname;
        const page = path.split('/').pop() || 'index.html';
        return page.replace('.html', '') || 'home';
    }

    setupNavigation() {
        // Handle all navigation links
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href]');
            if (!link) return;

            const href = link.getAttribute('href');
            
            // Handle external links
            if (href.startsWith('http') || href.startsWith('mailto') || href.startsWith('tel')) {
                return;
            }

            // Handle anchor links (same page)
            if (href.startsWith('#')) {
                e.preventDefault();
                this.scrollToSection(href.substring(1));
                return;
            }

            // Handle internal page navigation
            if (href.endsWith('.html') || this.isInternalLink(href)) {
                e.preventDefault();
                this.navigateToPage(href);
            }
        });

        // Handle browser back/forward buttons
        window.addEventListener('popstate', (e) => {
            if (e.state && e.state.page) {
                this.navigateToPage(e.state.page, false);
            }
        });

        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                // AJAX or DOM manipulation here
            });
        });
    }

    setupActiveStates() {
        const navLinks = document.querySelectorAll('.nav-link');
        const currentPage = this.currentPage;

        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            const page = href.replace('.html', '').replace('./', '');
            
            if (page === currentPage || 
                (currentPage === 'home' && (page === 'index' || page === ''))) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    async navigateToPage(href, updateHistory = true) {
        if (this.isNavigating) return;
        this.isNavigating = true;

        try {
            // Add to history
            if (updateHistory) {
                this.addToHistory(this.currentPage);
                const pageName = href.replace('.html', '').replace('./', '');
                history.pushState({ page: pageName }, '', href);
            }

            // Show loading state
            this.showNavigationLoading();

            // Fetch new page content
            const response = await fetch(href);
            if (!response.ok) {
                throw new Error(`Failed to load ${href}`);
            }

            const html = await response.text();
            const parser = new DOMParser();
            const newDoc = parser.parseFromString(html, 'text/html');

            // Extract and update content
            await this.updatePageContent(newDoc);

            // Update current page
            this.currentPage = href.replace('.html', '').replace('./', '');

            // Update active states
            this.setupActiveStates();

            // Hide loading state
            this.hideNavigationLoading();

            // Trigger page loaded event
            this.triggerPageLoadedEvent();

        } catch (error) {
            console.error('Navigation error:', error);
            this.handleNavigationError(error);
        } finally {
            this.isNavigating = false;
        }
    }

    async updatePageContent(newDoc) {
        return new Promise((resolve) => {
            // Animate out current content
            const mainContent = document.querySelector('.main-content');
            if (mainContent) {
                mainContent.style.opacity = '0';
                mainContent.style.transform = 'translateY(20px)';
            }

            setTimeout(() => {
                // Update title
                document.title = newDoc.title;

                // Update main content
                const newMainContent = newDoc.querySelector('.main-content');
                if (newMainContent && mainContent) {
                    mainContent.innerHTML = newMainContent.innerHTML;
                }

                // Update meta tags
                this.updateMetaTags(newDoc);

                // Reinitialize scripts for new content
                this.reinitializeScripts();

                // After parsing newDoc
                const newBodyClass = newDoc.body.getAttribute('class') || '';
                document.body.setAttribute('class', newBodyClass);

                // Animate in new content
                requestAnimationFrame(() => {
                    if (mainContent) {
                        mainContent.style.opacity = '1';
                        mainContent.style.transform = 'translateY(0)';
                    }
                    resolve();
                });
            }, 300);
        });
    }

    updateMetaTags(newDoc) {
        // Update meta description
        const metaDescription = newDoc.querySelector('meta[name="description"]');
        const currentMetaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription && currentMetaDescription) {
            currentMetaDescription.setAttribute('content', metaDescription.getAttribute('content'));
        }

        // Update Open Graph tags
        const ogTags = newDoc.querySelectorAll('meta[property^="og:"]');
        ogTags.forEach(newTag => {
            const property = newTag.getAttribute('property');
            const currentTag = document.querySelector(`meta[property="${property}"]`);
            if (currentTag) {
                currentTag.setAttribute('content', newTag.getAttribute('content'));
            }
        });
    }

    reinitializeScripts() {
        // Reinitialize animations for new content
        if (window.animationController) {
            window.animationController.observeAnimationElements();
        }

        // Reinitialize any other components that need to be refreshed
        if (window.portfolioApp) {
            window.portfolioApp.initScrollAnimations();
            window.portfolioApp.createParticles();
        }
    }

    setupSmoothScrolling() {
        // Smooth scrolling for anchor links
        this.scrollToSection = (sectionId) => {
            const target = document.getElementById(sectionId);
            if (!target) return;

            const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 0;
            const targetPosition = target.offsetTop - navbarHeight - 20;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });

            // Update URL hash
            history.replaceState(null, '', `#${sectionId}`);
        };
    }

    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // Alt + Arrow keys for navigation
            if (e.altKey) {
                switch (e.key) {
                    case 'ArrowLeft':
                        e.preventDefault();
                        this.navigateBack();
                        break;
                    case 'ArrowRight':
                        e.preventDefault();
                        this.navigateForward();
                        break;
                    case 'Home':
                        e.preventDefault();
                        this.navigateToPage('index.html');
                        break;
                }
            }

            // Escape key to close mobile menu
            if (e.key === 'Escape') {
                this.closeMobileMenu();
            }

            // Tab navigation enhancement
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });

        // Remove keyboard navigation class on mouse use
        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });
    }

    setupBreadcrumbs() {
        const breadcrumbContainer = document.querySelector('.breadcrumbs');
        if (!breadcrumbContainer) return;

        const breadcrumbs = this.generateBreadcrumbs();
        breadcrumbContainer.innerHTML = breadcrumbs;
    }

    generateBreadcrumbs() {
        const pathArray = window.location.pathname.split('/').filter(Boolean);
        let breadcrumbHTML = '<a href="/">Home</a>';

        let currentPath = '';
        pathArray.forEach((segment, index) => {
            currentPath += `/${segment}`;
            const isLast = index === pathArray.length - 1;
            const displayName = this.formatBreadcrumbName(segment);

            if (isLast) {
                breadcrumbHTML += ` <span class="breadcrumb-separator">></span> <span class="breadcrumb-current">${displayName}</span>`;
            } else {
                breadcrumbHTML += ` <span class="breadcrumb-separator">></span> <a href="${currentPath}">${displayName}</a>`;
            }
        });

        return breadcrumbHTML;
    }

    formatBreadcrumbName(segment) {
        return segment
            .replace('.html', '')
            .replace(/[-_]/g, ' ')
            .replace(/\b\w/g, letter => letter.toUpperCase());
    }

    showNavigationLoading() {
        const loadingIndicator = document.createElement('div');
        loadingIndicator.className = 'navigation-loading';
        loadingIndicator.innerHTML = `
            <div class="loading-spinner"></div>
            <span>Loading...</span>
        `;
        loadingIndicator.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: var(--bg-card);
            backdrop-filter: blur(10px);
            padding: 2rem;
            border-radius: 15px;
            display: flex;
            align-items: center;
            gap: 1rem;
            z-index: 9999;
            color: var(--text-primary);
        `;
        document.body.appendChild(loadingIndicator);
    }

    hideNavigationLoading() {
        const loadingIndicator = document.querySelector('.navigation-loading');
        if (loadingIndicator) {
            loadingIndicator.remove();
        }
    }

    addToHistory(page) {
        this.history.push(page);
        // Keep history to reasonable size
        if (this.history.length > 50) {
            this.history = this.history.slice(-25);
        }
    }

    navigateBack() {
        if (this.history.length > 0) {
            const previousPage = this.history.pop();
            this.navigateToPage(`${previousPage}.html`, false);
        } else {
            window.history.back();
        }
    }

    navigateForward() {
        window.history.forward();
    }

    closeMobileMenu() {
        const mobileToggle = document.querySelector('.mobile-toggle');
        const navLinks = document.querySelector('.nav-links');
        
        if (navLinks && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            mobileToggle.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }

    isInternalLink(href) {
        // Check if link is internal to the site
        const currentDomain = window.location.hostname;
        try {
            const url = new URL(href, window.location.origin);
            return url.hostname === currentDomain;
        } catch {
            // If URL parsing fails, assume it's internal
            return true;
        }
    }

    handleNavigationError(error) {
        console.error('Navigation failed:', error);
        
        // Show user-friendly error message
        const errorMessage = document.createElement('div');
        errorMessage.className = 'navigation-error';
        errorMessage.innerHTML = `
            <div class="error-content">
                <h3>Page Not Found</h3>
                <p>Sorry, the page you're looking for couldn't be loaded.</p>
                <button onclick="this.parentElement.parentElement.remove()">Close</button>
            </div>
        `;
        errorMessage.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
        `;
        document.body.appendChild(errorMessage);
    }

    triggerPageLoadedEvent() {
        const event = new CustomEvent('pageLoaded', {
            detail: { page: this.currentPage }
        });
        document.dispatchEvent(event);
    }

    // Preload pages for faster navigation
    preloadPage(href) {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = href;
        document.head.appendChild(link);
    }

    preloadAllPages() {
        const internalLinks = document.querySelectorAll('a[href$=".html"]');
        internalLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (this.isInternalLink(href)) {
                this.preloadPage(href);
            }
        });
    }

    // Initialize search functionality (if needed)
    initSearch() {
        const searchInput = document.querySelector('.search-input');
        if (!searchInput) return;

        let searchTimeout;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                this.performSearch(e.target.value);
            }, 300);
        });
    }

    performSearch(query) {
        // Implement search functionality
        console.log('Searching for:', query);
        // This would typically search through your content and show results
    }

    // Get current navigation state
    getNavigationState() {
        return {
            currentPage: this.currentPage,
            history: [...this.history],
            isNavigating: this.isNavigating
        };
    }

    // Destroy navigation controller
    destroy() {
        // Clean up event listeners and observers
        // This method would be called when the app is being destroyed
    }
}

// Initialize navigation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.navigationController = new NavigationController();
    
    // Preload pages for better UX (optional)
    setTimeout(() => {
        window.navigationController.preloadAllPages();
    }, 2000);
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Page is now hidden
        console.log('Page hidden');
    } else {
        // Page is now visible
        console.log('Page visible');
    }
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NavigationController;
}
