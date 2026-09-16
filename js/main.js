/**
 * LADHA - Main JavaScript
 * 
 * Features:
 * 1. Smooth scroll with header offset
 * 2. Scroll animations (IntersectionObserver)
 * 3. Animated counters
 * 4. Mobile menu toggle
 * 5. Navbar scroll effect
 * 6. Active nav highlighting
 * 7. Product card hover enhancement for touch devices
 * 8. Parallax effect for hero subtitle
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- Configuration & Selectors ---
    const config = {
        headerOffset: 70,
        scrollThreshold: 50,
        parallaxSpeed: 0.3
    };

    const dom = {
        header: document.querySelector('.header'),
        menuToggle: document.querySelector('#menu-toggle'),
        mobileMenu: document.querySelector('#mobile-menu'),
        navLinks: document.querySelectorAll('a[href^="#"]'),
        animatedElements: document.querySelectorAll('[data-animate]'),
        staggerParents: document.querySelectorAll('[data-animate-stagger]'),
        counters: document.querySelectorAll('.counter'),
        sections: document.querySelectorAll('section[id]'),
        heroSub: document.querySelector('.hero-sub'),
        productCards: document.querySelectorAll('.product-card')
    };

    // --- Utility Functions ---
    
    // Easing function: easeOutQuart
    const easeOutQuart = x => 1 - Math.pow(1 - x, 4);

    // Debounce function
    const debounce = (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    };

    // --- 1. Smooth Scroll ---
    dom.navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                
                // Close mobile menu if open
                if (dom.mobileMenu && dom.mobileMenu.classList.contains('active')) {
                    closeMobileMenu();
                }

                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - config.headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- 2. Scroll Animations (Intersection Observer) ---
    const animationObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                target.classList.add('visible');
                observer.unobserve(target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    });

    dom.animatedElements.forEach(el => {
        // Handle staggering if the element is a direct child of a stagger parent
        const parent = el.closest('[data-animate-stagger]');
        if (parent) {
            // Find index of element among its siblings
            const children = Array.from(parent.children).filter(child => child.hasAttribute('data-animate'));
            const index = children.indexOf(el);
            if (index > -1) {
                el.style.transitionDelay = `${index * 100}ms`;
            }
        }
        animationObserver.observe(el);
    });

    // --- 3. Animated Counters ---
    const animateCounter = (counter) => {
        const target = parseFloat(counter.getAttribute('data-target'));
        const suffix = counter.getAttribute('data-suffix') || '';
        const duration = 2000;
        let startTimestamp = null;
        
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const currentVal = target * easeOutQuart(progress);
            
            // Format number (integer or 1 decimal if target has decimals)
            const isFloat = target % 1 !== 0;
            const formattedVal = isFloat ? currentVal.toFixed(1) : Math.floor(currentVal);
            
            counter.textContent = formattedVal + suffix;
            
            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                counter.textContent = target + suffix;
            }
        };
        
        window.requestAnimationFrame(step);
    };

    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5
    });

    dom.counters.forEach(counter => {
        counter.textContent = '0' + (counter.getAttribute('data-suffix') || '');
        counterObserver.observe(counter);
    });

    // --- 4. Mobile Menu ---
    const closeMobileMenu = () => {
        if (dom.mobileMenu) dom.mobileMenu.classList.remove('active');
        if (dom.menuToggle) dom.menuToggle.classList.remove('active');
        document.body.style.overflow = '';
    };

    const toggleMobileMenu = () => {
        if (!dom.mobileMenu || !dom.menuToggle) return;
        
        const isActive = dom.mobileMenu.classList.contains('active');
        if (isActive) {
            closeMobileMenu();
        } else {
            dom.mobileMenu.classList.add('active');
            dom.menuToggle.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    };

    if (dom.menuToggle) {
        dom.menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMobileMenu();
        });
    }

    // Close mobile menu on outside click
    document.addEventListener('click', (e) => {
        if (dom.mobileMenu && dom.mobileMenu.classList.contains('active')) {
            if (!dom.mobileMenu.contains(e.target) && !dom.menuToggle.contains(e.target)) {
                closeMobileMenu();
            }
        }
    });

    // --- 5 & 8. Navbar Scroll Effect & Parallax ---
    let lastScrollY = window.scrollY;
    let ticking = false;

    const onScroll = () => {
        lastScrollY = window.scrollY;
        
        if (!ticking) {
            window.requestAnimationFrame(() => {
                handleScrollEffects();
                ticking = false;
            });
            ticking = true;
        }
    };

    const handleScrollEffects = () => {
        // Navbar Effect
        if (dom.header) {
            if (lastScrollY > config.scrollThreshold) {
                dom.header.classList.add('scrolled');
            } else {
                dom.header.classList.remove('scrolled');
            }
        }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    
    // Initial call to set state on load
    handleScrollEffects();

    // --- 6. Active Nav Highlighting ---
    const navObserverOptions = {
        threshold: 0.3,
        rootMargin: '-20% 0px -60% 0px'
    };

    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                // Remove active class from all links
                document.querySelectorAll('.header a[href^="#"]').forEach(link => {
                    link.classList.remove('active');
                });
                
                // Add active class to corresponding link
                const activeLink = document.querySelector(`.header a[href="#${id}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }, navObserverOptions);

    dom.sections.forEach(section => {
        navObserver.observe(section);
    });

    // --- 7. Product Card Touch Hover Enhancement ---
    // On touch devices, first tap shows hover state (if implemented via CSS pseudo-class),
    // second tap navigates. We can simulate a "touched" class for explicit CSS targeting.
    
    const isTouchDevice = () => {
        return (('ontouchstart' in window) ||
           (navigator.maxTouchPoints > 0) ||
           (navigator.msMaxTouchPoints > 0));
    };

    if (isTouchDevice() && dom.productCards.length > 0) {
        dom.productCards.forEach(card => {
            card.addEventListener('click', function(e) {
                if (!this.classList.contains('touch-active')) {
                    // Prevent navigation on first tap
                    e.preventDefault();
                    
                    // Remove touch-active from siblings
                    dom.productCards.forEach(c => c.classList.remove('touch-active'));
                    
                    // Add to this card
                    this.classList.add('touch-active');
                }
                // If it already has touch-active, the default action (navigation) will proceed
            });
        });

        // Click outside removes touch-active
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.product-card')) {
                dom.productCards.forEach(c => c.classList.remove('touch-active'));
            }
        });
    }

    // --- Live Nairobi EAT Clock ---
    const updateNairobiClock = () => {
        const clockEls = document.querySelectorAll('.live-nairobi-clock');
        if (clockEls.length === 0) return;
        
        const now = new Date();
        const utcHours = now.getUTCHours();
        const eatHours = (utcHours + 3) % 24;
        const eatMinutes = String(now.getUTCMinutes()).padStart(2, '0');
        const eatSeconds = String(now.getUTCSeconds()).padStart(2, '0');
        const formattedHours = String(eatHours).padStart(2, '0');
        
        const timeStr = `NAIROBI ${formattedHours}:${eatMinutes}:${eatSeconds} EAT`;
        clockEls.forEach(el => {
            el.textContent = timeStr;
        });
    };

    updateNairobiClock();
    setInterval(updateNairobiClock, 1000);

    // --- Live Drop Countdown Ticker (Atelier Runway Feature) ---
    const initCountdown = () => {
        const countdownEls = document.querySelectorAll('.countdown-digits');
        if (countdownEls.length === 0) return;

        // Seed fixed drop target or 2 days, 14 hours, 35 minutes ahead
        const storageKey = 'ladha_next_drop_target';
        let dropTarget = localStorage.getItem(storageKey);
        if (!dropTarget || isNaN(dropTarget) || parseInt(dropTarget) < Date.now()) {
            dropTarget = Date.now() + (2 * 24 * 3600 + 14 * 3600 + 35 * 60) * 1000;
            localStorage.setItem(storageKey, dropTarget);
        } else {
            dropTarget = parseInt(dropTarget);
        }

        const updateTimer = () => {
            const now = Date.now();
            let diff = Math.max(0, dropTarget - now);
            if (diff === 0) {
                // Reset for next drop cycle
                dropTarget = Date.now() + (3 * 24 * 3600) * 1000;
                localStorage.setItem(storageKey, dropTarget);
                diff = dropTarget - now;
            }

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((diff / 1000 / 60) % 60);
            const seconds = Math.floor((diff / 1000) % 60);

            const pad = (n) => String(n).padStart(2, '0');
            const formatted = `${pad(days)}D ${pad(hours)}H ${pad(minutes)}M ${pad(seconds)}S`;

            countdownEls.forEach(el => {
                el.textContent = formatted;
            });
        };

        updateTimer();
        setInterval(updateTimer, 1000);
    };
    initCountdown();

    // --- Interactive Quick View Drawer System ---
    let currentQuickViewUnit = 'in'; // 'in' or 'cm'
    let currentQuickViewProduct = null;

    const injectQuickViewDrawer = () => {
        if (document.getElementById('ladha-quickview-drawer')) return;

        const drawerHTML = `
            <div class="quick-view-backdrop" id="ladha-quickview-backdrop"></div>
            <aside class="quick-view-drawer" id="ladha-quickview-drawer" aria-label="Garment Quick Inspection">
                <div class="quick-view-header">
                    <div class="quick-view-header-title">
                        <span class="section-stamp-num">ARCHIVE SPEC</span>
                        <span id="quickview-header-code">PIECE SPEC</span>
                    </div>
                    <button class="quick-view-close-btn" id="quickview-close-btn" aria-label="Close Quick View">&times;</button>
                </div>
                <div class="quick-view-body" id="quickview-body">
                    <!-- Populated dynamically by JS -->
                </div>
                <div class="quick-view-footer" id="quickview-footer">
                    <button class="btn btn-accent btn-block" id="quickview-add-bag-btn">
                        ADD TO BAG &rarr;
                    </button>
                    <a href="#" class="btn btn-outline btn-block" id="quickview-full-specs-btn" style="text-align: center;">
                        VIEW FULL GARMENT ARCHIVE STORY &rarr;
                    </a>
                </div>
            </aside>
        `;

        const wrapper = document.createElement('div');
        wrapper.id = 'ladha-quickview-root';
        wrapper.innerHTML = drawerHTML;
        document.body.appendChild(wrapper);

        // Bind close buttons
        document.getElementById('quickview-close-btn').addEventListener('click', closeQuickView);
        document.getElementById('ladha-quickview-backdrop').addEventListener('click', closeQuickView);

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeQuickView();
        });
    };

    const renderQuickViewMeasurements = (product, unit) => {
        const measurements = (unit === 'cm' && product.measurementsCm) ? product.measurementsCm : (product.measurementsIn || product.measurements);
        if (!measurements) return '<p class="quick-view-tag">Standard Vintage Fit</p>';

        let rows = '';
        for (const [key, value] of Object.entries(measurements)) {
            const label = key.replace(/([A-Z])/g, ' $1').toUpperCase();
            rows += `
                <tr>
                    <td style="color: var(--text-muted); padding: 0.5rem 0; width: 50%;">${label}</td>
                    <td style="color: var(--text-primary); font-weight: 700; text-align: right; padding: 0.5rem 0;">${value}</td>
                </tr>
            `;
        }

        return `
            <table style="width: 100%; border-collapse: collapse; font-family: var(--font-mono); font-size: 11px;">
                ${rows}
            </table>
        `;
    };

    const openQuickView = (productId) => {
        injectQuickViewDrawer();
        if (typeof LADHA_PRODUCTS === 'undefined') return;

        const product = LADHA_PRODUCTS.find(p => p.id === productId) || LADHA_PRODUCTS[0];
        currentQuickViewProduct = product;

        const headerCode = document.getElementById('quickview-header-code');
        const bodyContainer = document.getElementById('quickview-body');
        const addBtn = document.getElementById('quickview-add-bag-btn');
        const fullSpecsBtn = document.getElementById('quickview-full-specs-btn');

        if (headerCode) headerCode.textContent = `${product.category} // ${product.id.toUpperCase()}`;
        if (fullSpecsBtn) fullSpecsBtn.href = `product.html?id=${product.id}`;

        if (bodyContainer) {
            bodyContainer.innerHTML = `
                <div class="quick-view-gallery viewfinder-wrap">
                    <div class="viewfinder-corners"></div>
                    <div class="vintage-hangtag">
                        <span class="hangtag-eyelet"></span>
                        <span>1-OF-1 ARCHIVE</span>
                    </div>
                    ${(product.image && (product.image.endsWith('.mp4') || product.image.endsWith('.webm') || product.image.endsWith('.mov') || product.image.includes('video/mp4'))) ?
                        `<video src="${product.image}" autoplay loop muted playsinline style="width: 100%; height: 100%; object-fit: cover; display: block;"></video>` :
                        `<img src="${product.image}" alt="${product.name}">`}
                </div>

                <div class="quick-view-meta-top">
                    <span class="quick-view-tag">${product.category} • ${product.size}</span>
                    <div class="card-live-indicator" style="margin-top:0;">
                        <span class="card-live-dot"></span>
                        <span>1-OF-1 AVAILABLE</span>
                    </div>
                </div>

                <h2 class="quick-view-name">${product.name}</h2>

                <div class="quick-view-price-row">
                    <span class="quick-view-price">KES ${product.price.toLocaleString()}</span>
                    <span style="font-family: var(--font-mono); font-size: 10px; color: var(--text-muted);">NAIROBI TAX INCL.</span>
                </div>

                <div class="quick-view-condition">
                    <div class="quick-view-condition-header">
                        <span style="font-family: var(--font-mono); font-size: 10px; color: var(--text-muted); letter-spacing: 0.08em;">CONDITION RATING</span>
                        <span style="font-family: var(--font-mono); font-size: 10px; font-weight: 800; background: var(--accent); color: #0a0a0a; padding: 2px 7px;">${product.condition}</span>
                    </div>
                    <p style="font-size: 0.85rem; color: #555550; line-height: 1.4;">${product.conditionNote}</p>
                </div>

                <p class="quick-view-desc">${product.description}</p>

                <!-- Interactive Garment Measurement Inspector -->
                <div class="measurement-inspector">
                    <div class="measurement-inspector-header">
                        <span style="font-family: var(--font-mono); font-size: 10px; font-weight: 800; letter-spacing: 0.1em; color: var(--text-primary);">FLAT GARMENT SPECS</span>
                        <div class="unit-toggle" id="quickview-unit-toggle">
                            <button class="unit-btn ${currentQuickViewUnit === 'in' ? 'active' : ''}" data-unit="in">INCHES</button>
                            <button class="unit-btn ${currentQuickViewUnit === 'cm' ? 'active' : ''}" data-unit="cm">CM</button>
                        </div>
                    </div>

                    <div class="measurement-diagram-box">
                        <svg class="measurement-diagram-icon" viewBox="0 0 24 24" fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M20.38 3.46 16 2a8 8 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/>
                        </svg>
                        <span>Precision flat measurements taken from seam to seam.</span>
                    </div>

                    <div id="quickview-measurements-container">
                        ${renderQuickViewMeasurements(product, currentQuickViewUnit)}
                    </div>
                </div>

                <div style="border-top: 1px solid var(--border); padding-top: 1rem; font-family: var(--font-mono); font-size: 10px; color: var(--text-muted); display: flex; flex-direction: column; gap: 0.4rem;">
                    <div>FABRIC: <strong style="color: var(--text-primary);">${product.fabric}</strong></div>
                    <div>PROVENANCE: <strong style="color: var(--text-primary);">${product.provenance}</strong></div>
                </div>
            `;

            // Bind Unit Toggle inside Quick View
            const unitToggle = document.getElementById('quickview-unit-toggle');
            if (unitToggle) {
                unitToggle.querySelectorAll('.unit-btn').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        e.preventDefault();
                        const unit = btn.getAttribute('data-unit');
                        currentQuickViewUnit = unit;
                        unitToggle.querySelectorAll('.unit-btn').forEach(b => b.classList.remove('active'));
                        btn.classList.add('active');

                        const measContainer = document.getElementById('quickview-measurements-container');
                        if (measContainer) {
                            measContainer.innerHTML = renderQuickViewMeasurements(currentQuickViewProduct, unit);
                        }
                    });
                });
            }
        }

        // Add to Bag handler
        if (addBtn) {
            addBtn.onclick = () => {
                if (window.LadhaCart) {
                    LadhaCart.add(product);
                    closeQuickView();
                }
            };
        }

        // Open drawer
        const drawer = document.getElementById('ladha-quickview-drawer');
        const backdrop = document.getElementById('ladha-quickview-backdrop');
        if (drawer && backdrop) {
            drawer.classList.add('open');
            backdrop.classList.add('open');
            document.body.style.overflow = 'hidden';
        }
    };

    const closeQuickView = () => {
        const drawer = document.getElementById('ladha-quickview-drawer');
        const backdrop = document.getElementById('ladha-quickview-backdrop');
        if (drawer && backdrop) {
            drawer.classList.remove('open');
            backdrop.classList.remove('open');
            document.body.style.overflow = '';
        }
    };

    window.LadhaQuickView = {
        open: openQuickView,
        close: closeQuickView
    };

    // Global delegation for Quick View & Quick Add buttons
    document.addEventListener('click', (e) => {
        const quickViewBtn = e.target.closest('.btn-quick-view') || e.target.closest('[data-quick-view]');
        if (quickViewBtn) {
            e.preventDefault();
            e.stopPropagation();
            const productId = quickViewBtn.getAttribute('data-product-id') || quickViewBtn.getAttribute('data-quick-view');
            if (productId) openQuickView(productId);
            return;
        }

        const quickAddBtn = e.target.closest('.btn-quick-add');
        if (quickAddBtn) {
            e.preventDefault();
            e.stopPropagation();
            const productId = quickAddBtn.getAttribute('data-product-id');
            if (productId && window.LadhaCart) {
                LadhaCart.add(productId);
            }
            return;
        }
    });


    // --- Storefront Hydration (Syncs with Store Manager CRM & LadhaDB) ---
    const hydrateStorefront = () => {
        if (typeof LadhaDB === 'undefined') return;

        const products = LadhaDB.getProducts();
        const lookbook = LadhaDB.getLookbook();
        const feed = LadhaDB.getFeed();
        const settings = LadhaDB.getSettings();

        // 1. Update Top Ticker notices & countdown if settings changed
        if (settings) {
            const noticeEls = document.querySelectorAll('.announcement-note');
            if (noticeEls.length > 0 && settings.tickerNotice1) {
                noticeEls.forEach(el => {
                    el.innerHTML = `
                        <span>${settings.tickerNotice1}</span>
                        <span>•</span>
                        <span>${settings.tickerNotice2 || 'NAIROBI SAME-DAY DISPATCH'}</span>
                    `;
                });
            }

            const barEl = document.querySelector('.announcement-bar');
            if (barEl) {
                barEl.style.display = settings.tickerVisible !== false ? 'flex' : 'none';
            }
        }

        const isVideoAsset = (url) => {
            if (!url) return false;
            const lower = url.toLowerCase();
            return lower.endsWith('.mp4') || lower.endsWith('.webm') || lower.endsWith('.mov') || lower.includes('video/mp4');
        };

        const renderMediaTag = (src, alt = '', className = '') => {
            if (isVideoAsset(src)) {
                return `<video src="${src}" class="${className}" autoplay loop muted playsinline style="width:100%; height:100%; object-fit:cover; display:block;"></video>`;
            }
            return `<img src="${src}" alt="${alt}" class="${className}" loading="lazy" style="width:100%; height:100%; object-fit:cover; display:block;">`;
        };

        // 2. Hydrate Home Drops Product Grid
        const dropsGrid = document.querySelector('#drops .product-grid');
        if (dropsGrid && products && products.length > 0) {
            dropsGrid.innerHTML = products.map((item) => `
                <div class="product-card visible" data-animate>
                    <div class="product-img viewfinder-wrap">
                        <div class="viewfinder-corners"></div>
                        <div class="vintage-hangtag">
                            <span class="hangtag-eyelet"></span>
                            <span>${item.inStock ? '1-OF-1' : 'SOLD'}</span>
                        </div>
                        <a href="product.html?id=${item.id}" style="display:block; width:100%; height:100%;">
                            ${renderMediaTag(item.image, item.name)}
                        </a>
                        <div class="card-quick-actions">
                            <button class="btn-quick-view" data-product-id="${item.id}">QUICK VIEW</button>
                            <button class="btn-quick-add" data-product-id="${item.id}" ${!item.inStock ? 'disabled style="opacity:0.5; cursor:not-allowed;"' : ''}>
                                ${item.inStock ? '+ BAG' : 'CLAIMED'}
                            </button>
                        </div>
                    </div>
                    <div class="product-info">
                        <div style="display: flex; justify-content: space-between; align-items: baseline;">
                            <span class="product-tag">${item.category} • ${item.size}</span>
                            <span style="font-family: var(--font-mono); font-size: 8px; color: var(--text-muted);">${item.id.toUpperCase()}</span>
                        </div>
                        <h3 class="product-name"><a href="product.html?id=${item.id}">${item.name}</a></h3>
                        <div class="card-live-indicator">
                            <span class="card-live-dot" style="background: ${item.inStock ? '#72a300' : '#888'};"></span>
                            <span>${item.inStock ? '1-OF-1 IN STOCK' : 'SOLD OUT / ARCHIVED'}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; align-items: baseline; margin-top: 0.5rem;">
                            <span class="product-price">KES ${item.price.toLocaleString()}</span>
                            <a href="product.html?id=${item.id}" style="font-family: var(--font-mono); font-size: 10px; font-weight: 700; color: var(--text-muted);">SPECS &rarr;</a>
                        </div>
                    </div>
                </div>
            `).join('');
        }

        // 3. Hydrate Lookbook Grid
        const lookbookGrid = document.querySelector('#lookbook .lookbook-grid');
        if (lookbookGrid && lookbook && lookbook.length > 0) {
            lookbookGrid.innerHTML = lookbook.map(look => `
                <div class="lookbook-item visible ${look.isTall ? 'tall' : ''}" data-animate>
                    <div class="lookbook-img viewfinder-wrap">
                        <div class="viewfinder-corners"></div>
                        ${renderMediaTag(look.image, look.title)}
                    </div>
                    <p class="lookbook-caption">${look.caption}</p>
                </div>
            `).join('');
        }

        // 4. Hydrate Feed Grid
        const feedGrid = document.querySelector('#feed .feed-grid');
        if (feedGrid && feed && feed.length > 0) {
            feedGrid.innerHTML = feed.map(feedItem => `
                <div class="feed-item visible" data-animate onclick="window.open('${feedItem.url}', '_blank')">
                    ${renderMediaTag(feedItem.image, feedItem.caption)}
                </div>
            `).join('');
        }

        // 5. Synchronize Hero Garment Terminal with Live DB
        if (typeof updateHeroPieceUI === 'function') {
            updateHeroPieceUI(activeHeroIdx);
        }

        // Ensure newly injected items are observed and marked visible
        if (typeof animationObserver !== 'undefined') {
            document.querySelectorAll('#drops [data-animate], #lookbook [data-animate], #feed [data-animate]').forEach((el, idx) => {
                el.classList.add('visible');
                el.style.transitionDelay = `${(idx % 6) * 60}ms`;
                animationObserver.observe(el);
            });
        }
    };

    // --- Hero Garment Terminal Switcher (Editorial Kinetic Primitives) ---
    let activeHeroIdx = 0;
    const heroPiecesConfig = [
        {
            id: 'product-1',
            code: 'REF: LADHA-P01',
            name: 'Vintage Nike Colorblock Windbreaker',
            category: 'VINTAGE STREETWEAR',
            image: 'assets/products/product-1.jpg',
            price: 3500,
            grade: 'GRADE A+ (9.5/10)',
            size: 'SIZE L • PIT-TO-PIT 24"',
            loc: 'LOC: GIKOMBA // NBO',
            hangtag: '1-OF-1 ARCHIVE',
            inStock: true
        },
        {
            id: 'product-4',
            code: 'REF: LADHA-P04',
            name: "90s Levi's 501 Raw Selvedge",
            category: 'AUTHENTIC DENIM',
            image: 'assets/products/product-4.jpg',
            price: 4200,
            grade: 'GRADE A+ (9.8/10)',
            size: 'WAIST 32 • INSEAM 31"',
            loc: 'LOC: TOI MARKET // NBO',
            hangtag: 'SELVEDGE 1-OF-1',
            inStock: true
        },
        {
            id: 'product-5',
            code: 'REF: LADHA-P05',
            name: 'Carhartt Double-Knee Work Pants',
            category: 'RUGGED WORKWEAR',
            image: 'assets/products/product-5.jpg',
            price: 3000,
            grade: 'HEAVYWEAR (9.2/10)',
            size: 'WAIST 34 • INSEAM 32"',
            loc: 'LOC: NGARA YARD // NBO',
            hangtag: 'DOUBLE-KNEE 1-OF-1',
            inStock: true
        }
    ];

    const updateHeroPieceUI = (idx) => {
        const piece = heroPiecesConfig[idx];
        if (!piece) return;

        // Check if DB has newer values
        let livePiece = piece;
        if (typeof LadhaDB !== 'undefined' && typeof LadhaDB.getProductById === 'function') {
            const dbItem = LadhaDB.getProductById(piece.id);
            if (dbItem) {
                livePiece = {
                    ...piece,
                    name: dbItem.name || piece.name,
                    price: dbItem.price || piece.price,
                    image: dbItem.image || piece.image,
                    category: dbItem.category || piece.category,
                    inStock: dbItem.inStock !== false
                };
            }
        }

        const imgEl = document.querySelector('#hero-piece-img');
        const linkEl = document.querySelector('#hero-piece-link');
        const codeEl = document.querySelector('#hero-piece-code');
        const hangtagTextEl = document.querySelector('#hero-piece-hangtag .hangtag-text');
        const catEl = document.querySelector('#hero-piece-cat');
        const titleEl = document.querySelector('#hero-piece-title');
        const gradeEl = document.querySelector('#hero-piece-grade');
        const sizeEl = document.querySelector('#hero-piece-size');
        const priceEl = document.querySelector('#hero-piece-price');
        const ctaEl = document.querySelector('#hero-piece-cta');
        const stockEl = document.querySelector('#hero-piece-stock');
        const coordEl = document.querySelector('.hud-coord');
        const quickViewBtn = document.querySelector('#hero-quick-view-btn');
        const quickAddBtn = document.querySelector('#hero-quick-add-btn');

        if (imgEl) {
            imgEl.style.opacity = '0.3';
            setTimeout(() => {
                imgEl.src = livePiece.image;
                imgEl.alt = livePiece.name;
                imgEl.style.opacity = '1';
            }, 120);
        }

        if (linkEl) linkEl.href = `product.html?id=${livePiece.id}`;
        if (codeEl) codeEl.textContent = livePiece.code;
        if (hangtagTextEl) hangtagTextEl.textContent = livePiece.hangtag;
        if (catEl) catEl.textContent = livePiece.category;
        if (titleEl) {
            titleEl.textContent = livePiece.name;
            titleEl.href = `product.html?id=${livePiece.id}`;
        }
        if (gradeEl) gradeEl.textContent = livePiece.grade;
        if (sizeEl) sizeEl.textContent = livePiece.size;
        if (priceEl) priceEl.textContent = `KES ${livePiece.price.toLocaleString()}`;
        if (ctaEl) ctaEl.href = `product.html?id=${livePiece.id}`;
        if (coordEl) coordEl.textContent = livePiece.loc;

        if (stockEl) {
            stockEl.innerHTML = `
                <span class="card-live-dot" style="background: ${livePiece.inStock ? '#72a300' : '#888'};"></span>
                <span>${livePiece.inStock ? '1-OF-1 IN STOCK' : 'SOLD OUT / ARCHIVED'}</span>
            `;
        }

        if (quickViewBtn) quickViewBtn.setAttribute('data-product-id', livePiece.id);
        if (quickAddBtn) {
            quickAddBtn.setAttribute('data-product-id', livePiece.id);
            if (livePiece.inStock) {
                quickAddBtn.removeAttribute('disabled');
                quickAddBtn.textContent = '+ BAG';
                quickAddBtn.style.opacity = '1';
                quickAddBtn.style.cursor = 'pointer';
            } else {
                quickAddBtn.setAttribute('disabled', 'true');
                quickAddBtn.textContent = 'CLAIMED';
                quickAddBtn.style.opacity = '0.5';
                quickAddBtn.style.cursor = 'not-allowed';
            }
        }
    };

    const initHeroSwitcher = () => {
        const tabs = document.querySelectorAll('.hero-switch-tab');
        if (!tabs || tabs.length === 0) return;

        tabs.forEach((tab, idx) => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => {
                    t.classList.remove('active');
                    t.setAttribute('aria-selected', 'false');
                });
                tab.classList.add('active');
                tab.setAttribute('aria-selected', 'true');
                activeHeroIdx = idx;
                updateHeroPieceUI(activeHeroIdx);
            });
        });

        // Initialize UI with active piece
        updateHeroPieceUI(activeHeroIdx);
    };

    initHeroSwitcher();
    hydrateStorefront();
    window.addEventListener('ladha-db-updated', hydrateStorefront);

    // --- Discrete Manager CRM Access Gate ---
    // 1. Keyboard Shortcut: Ctrl + Shift + A (or Cmd + Shift + A)
    window.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
            e.preventDefault();
            window.location.href = 'admin.html';
        }
    });

    // 2. Secret 3-tap gesture on the footer copyright line
    const copyrightEl = document.querySelector('.footer-col p');
    if (copyrightEl && copyrightEl.textContent.includes('LADHA')) {
        let tapCount = 0;
        let tapTimeout = null;
        copyrightEl.style.cursor = 'default';
        copyrightEl.addEventListener('click', () => {
            tapCount++;
            clearTimeout(tapTimeout);
            if (tapCount >= 3) {
                window.location.href = 'admin.html';
            }
            tapTimeout = setTimeout(() => { tapCount = 0; }, 900);
        });
    }
});
