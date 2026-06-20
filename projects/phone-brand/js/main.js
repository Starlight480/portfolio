/* ============================================================
   NEXUS — Phone Brand Homepage
   Main JavaScript
   ============================================================ */

(function () {
    'use strict';

    // ============================================================
    // DOM References
    // ============================================================

    var navbar = document.getElementById('navbar');
    var themeToggle = document.getElementById('themeToggle');
    var hamburger = document.getElementById('hamburger');
    var mobileMenu = document.getElementById('mobileMenu');
    var mobileOverlay = document.getElementById('mobileOverlay');
    var mobilePanel = document.getElementById('mobilePanel');
    var mobileLinks = document.querySelectorAll('.mobile-nav-link');
    var scrollElements = document.querySelectorAll('[data-scroll-animation]');
    var productCards = document.querySelectorAll('.product-card');
    var colorDots = document.querySelectorAll('.color-dot');
    var pickerDots = document.querySelectorAll('.picker-dot');
    var selectedColorName = document.getElementById('selectedColorName');
    var phonePicker = document.querySelector('.phone-picker');
    var allAnchors = document.querySelectorAll('a[href^="#"]');

    // ============================================================
    // Navbar Scroll Effect
    // ============================================================

    function handleNavScroll() {
        if (window.scrollY > 20) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    // Throttled scroll handler
    var scrollTicking = false;
    function onScroll() {
        if (!scrollTicking) {
            requestAnimationFrame(function () {
                handleNavScroll();
                scrollTicking = false;
            });
            scrollTicking = true;
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });

    // ============================================================
    // Theme Toggle
    // ============================================================

    function getPreferredTheme() {
        var stored = localStorage.getItem('nexus-theme');
        if (stored) return stored;
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        document.documentElement.setAttribute('data-theme-transitioning', '');
        localStorage.setItem('nexus-theme', theme);
        // Remove transitioning class after animation completes
        setTimeout(function () {
            document.documentElement.removeAttribute('data-theme-transitioning');
        }, 400);
    }

    function toggleTheme() {
        var current = document.documentElement.getAttribute('data-theme');
        var next = current === 'dark' ? 'light' : 'dark';
        setTheme(next);
    }

    // Initialize theme
    setTheme(getPreferredTheme());

    themeToggle.addEventListener('click', toggleTheme);

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
        if (!localStorage.getItem('nexus-theme')) {
            setTheme(e.matches ? 'dark' : 'light');
        }
    });

    // ============================================================
    // Mobile Menu
    // ============================================================

    function openMobileMenu() {
        mobileMenu.classList.add('open');
        hamburger.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeMobileMenu() {
        mobileMenu.classList.remove('open');
        hamburger.classList.remove('active');
        document.body.style.overflow = '';
    }

    hamburger.addEventListener('click', function () {
        if (mobileMenu.classList.contains('open')) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    });

    mobileOverlay.addEventListener('click', closeMobileMenu);

    mobileLinks.forEach(function (link) {
        link.addEventListener('click', closeMobileMenu);
    });

    // Close on escape key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
            closeMobileMenu();
        }
    });

    // ============================================================
    // Smooth Scroll for Anchor Links
    // ============================================================

    allAnchors.forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var href = this.getAttribute('href');
            if (href === '#') return;

            var target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                var navHeight = navbar.offsetHeight;
                var targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ============================================================
    // Scroll-Triggered Animations (Intersection Observer)
    // ============================================================

    function initScrollAnimations() {
        if (!('IntersectionObserver' in window)) {
            // Fallback: show all elements immediately
            scrollElements.forEach(function (el) {
                el.classList.add('animated');
            });
            return;
        }

        var observer = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animated');
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            }
        );

        scrollElements.forEach(function (el) {
            observer.observe(el);
        });
    }

    initScrollAnimations();

    // ============================================================
    // Parallax Effect on Feature Blocks
    // ============================================================

    function initParallax() {
        var featureBlocks = document.querySelectorAll('.feature-block');
        if (!featureBlocks.length) return;

        var observer = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        var block = entry.target;
                        var visual = block.querySelector('.feature-visual');
                        if (visual) {
                            var rect = block.getBoundingClientRect();
                            var progress = (rect.top / window.innerHeight) * 0.5;
                            visual.style.transform = 'translateY(' + (progress * -20) + 'px)';
                        }
                    }
                });
            },
            { threshold: 0 }
        );

        featureBlocks.forEach(function (block) {
            observer.observe(block);
        });
    }

    initParallax();

    // ============================================================
    // Product Card Color Selector
    // ============================================================

    productCards.forEach(function (card) {
        var dots = card.querySelectorAll('.color-dot');
        var phone = card.querySelector('.phone');

        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                var color = this.getAttribute('data-color');
                if (!color || !phone) return;

                // Update active state
                dots.forEach(function (d) { d.classList.remove('active'); });
                this.classList.add('active');

                // Update phone color
                phone.setAttribute('data-color', color);
            });

            // Keyboard accessibility
            dot.addEventListener('keydown', function (e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.click();
                }
            });

            // Make dot focusable
            dot.setAttribute('tabindex', '0');
            dot.setAttribute('role', 'button');
            dot.setAttribute('aria-label', 'Select color: ' + dot.getAttribute('data-color'));
        });
    });

    // ============================================================
    // Color Picker (Specs Section)
    // ============================================================

    var colorNames = {
        midnight: 'Midnight',
        silver: 'Silver',
        gold: 'Gold',
        blue: 'Pacific Blue'
    };

    pickerDots.forEach(function (dot) {
        dot.addEventListener('click', function () {
            var color = this.getAttribute('data-color');
            if (!color || !phonePicker) return;

            // Update active state
            pickerDots.forEach(function (d) { d.classList.remove('active'); });
            this.classList.add('active');

            // Update phone color
            phonePicker.setAttribute('data-color', color);

            // Update label
            if (selectedColorName && colorNames[color]) {
                selectedColorName.textContent = colorNames[color];
            }
        });

        // Keyboard accessibility
        dot.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });

        dot.setAttribute('tabindex', '0');
        dot.setAttribute('role', 'button');
        dot.setAttribute('aria-label', 'Select color: ' + colorNames[dot.getAttribute('data-color')]);
    });

    // ============================================================
    // Phone Tilt Effect on Mouse Move (Hero)
    // ============================================================

    var heroPhone = document.querySelector('.phone-hero');
    if (heroPhone && window.matchMedia('(min-width: 768px)').matches) {
        var heroSection = document.querySelector('.hero');
        heroSection.addEventListener('mousemove', function (e) {
            var rect = heroSection.getBoundingClientRect();
            var centerX = rect.left + rect.width / 2;
            var centerY = rect.top + rect.height / 2;
            var rotateX = ((e.clientY - centerY) / (rect.height / 2)) * -3;
            var rotateY = ((e.clientX - centerX) / (rect.width / 2)) * 3;
            heroPhone.style.transform = 'rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) scale(1.02)';
        });

        heroSection.addEventListener('mouseleave', function () {
            heroPhone.style.transform = '';
        });
    }

    // ============================================================
    // CTA Button Ripple Effect
    // ============================================================

    var ctaBtn = document.querySelector('.cta .btn-primary');
    if (ctaBtn) {
        // Add ripple animation keyframes
        var styleSheet = document.createElement('style');
        styleSheet.textContent = '@keyframes ripple-effect { to { transform: scale(4); opacity: 0; } }';
        document.head.appendChild(styleSheet);

        ctaBtn.addEventListener('click', function (e) {
            var rect = this.getBoundingClientRect();
            var ripple = document.createElement('span');
            var size = Math.max(rect.width, rect.height);
            ripple.style.position = 'absolute';
            ripple.style.borderRadius = '50%';
            ripple.style.background = 'rgba(255,255,255,0.3)';
            ripple.style.transform = 'scale(0)';
            ripple.style.animation = 'ripple-effect 0.6s linear';
            ripple.style.pointerEvents = 'none';
            ripple.style.width = size + 'px';
            ripple.style.height = size + 'px';
            ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
            ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            setTimeout(function () { ripple.remove(); }, 600);
        });
    }

})();
