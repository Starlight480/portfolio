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
    var pickerDots = document.querySelectorAll('.picker-dot');
    var selectedColorName = document.getElementById('selectedColorName');
    var pickerTint = document.getElementById('pickerTint');
    var allAnchors = document.querySelectorAll('a[href^="#"]');

    // Contact form
    var contactForm = document.getElementById('contactForm');
    var contactSubmit = document.getElementById('contactSubmit');
    var formStatus = document.getElementById('formStatus');

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
        setTimeout(function () {
            document.documentElement.removeAttribute('data-theme-transitioning');
        }, 400);
    }

    function toggleTheme() {
        var current = document.documentElement.getAttribute('data-theme');
        var next = current === 'dark' ? 'light' : 'dark';
        setTheme(next);
    }

    setTheme(getPreferredTheme());
    themeToggle.addEventListener('click', toggleTheme);

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
    // Color Picker — Tint Overlay on Phone Image
    // ============================================================

    var colorTints = {
        midnight: 'rgba(26, 26, 46, 0.35)',
        silver: 'rgba(192, 192, 192, 0.30)',
        gold: 'rgba(212, 165, 116, 0.35)',
        blue: 'rgba(74, 111, 165, 0.35)'
    };

    var colorNames = {
        midnight: 'Midnight',
        silver: 'Silver',
        gold: 'Gold',
        blue: 'Pacific Blue'
    };

    pickerDots.forEach(function (dot) {
        dot.addEventListener('click', function () {
            var color = this.getAttribute('data-color');
            if (!color) return;

            // Update active state
            pickerDots.forEach(function (d) { d.classList.remove('active'); });
            this.classList.add('active');

            // Update tint overlay
            if (pickerTint && colorTints[color]) {
                pickerTint.style.background = colorTints[color];
                pickerTint.style.opacity = '1';
            }

            // Update label
            if (selectedColorName && colorNames[color]) {
                selectedColorName.textContent = colorNames[color];
            }
        });

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

    // ============================================================
    // Contact Form — Client-Side Validation + Backend Submit
    // ============================================================

    if (contactForm) {
        // Clear errors on input
        var formInputs = contactForm.querySelectorAll('.form-input');
        formInputs.forEach(function (input) {
            input.addEventListener('input', function () {
                this.classList.remove('error');
                var errorEl = document.getElementById(this.id.replace('contact', '').toLowerCase() + 'Error');
                if (errorEl) errorEl.textContent = '';
            });
        });

        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Validate
            var name = document.getElementById('contactName').value.trim();
            var email = document.getElementById('contactEmail').value.trim();
            var message = document.getElementById('contactMessage').value.trim();
            var isValid = true;

            // Reset errors
            formInputs.forEach(function (inp) { inp.classList.remove('error'); });
            formStatus.className = 'form-status';
            formStatus.style.display = 'none';

            if (!name) {
                document.getElementById('contactName').classList.add('error');
                document.getElementById('nameError').textContent = 'Please enter your name';
                isValid = false;
            }

            if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                document.getElementById('contactEmail').classList.add('error');
                document.getElementById('emailError').textContent = 'Please enter a valid email';
                isValid = false;
            }

            if (!message) {
                document.getElementById('contactMessage').classList.add('error');
                document.getElementById('messageError').textContent = 'Please enter a message';
                isValid = false;
            }

            if (!isValid) return;

            // Show loading state
            contactSubmit.disabled = true;
            contactSubmit.querySelector('.btn-text').style.display = 'none';
            contactSubmit.querySelector('.btn-loading').style.display = 'inline';

            // Submit to backend
            fetch('https://nexus-contact-api.onrender.com/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    subject: document.getElementById('contactSubject').value,
                    message: message
                })
            })
            .then(function (response) { return response.json(); })
            .then(function (data) {
                contactSubmit.disabled = false;
                contactSubmit.querySelector('.btn-text').style.display = 'inline';
                contactSubmit.querySelector('.btn-loading').style.display = 'none';

                if (data.success) {
                    formStatus.textContent = '✓ Message sent successfully! We\'ll get back to you within 24 hours.';
                    formStatus.className = 'form-status success';
                    contactForm.reset();
                } else {
                    formStatus.textContent = '✗ ' + (data.error || 'Something went wrong. Please try again.');
                    formStatus.className = 'form-status error';
                }
            })
            .catch(function (err) {
                contactSubmit.disabled = false;
                contactSubmit.querySelector('.btn-text').style.display = 'inline';
                contactSubmit.querySelector('.btn-loading').style.display = 'none';
                formStatus.textContent = '✗ Could not connect to the server. Please try again later or email us directly.';
                formStatus.className = 'form-status error';
                console.error('Contact form error:', err);
            });
        });
    }

})();
