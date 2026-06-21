/* ============================================================
   NEXUS — Product Detail Pages
   Main JavaScript
   ============================================================ */

(function () {
    'use strict';

    var navbar = document.getElementById('navbar');
    var themeToggle = document.getElementById('themeToggle');
    var hamburger = document.getElementById('hamburger');
    var mobileMenu = document.getElementById('mobileMenu');
    var mobileOverlay = document.getElementById('mobileOverlay');
    var mobilePanel = document.getElementById('mobilePanel');
    var mobileLinks = document.querySelectorAll('.mobile-nav-link');
    var scrollElements = document.querySelectorAll('[data-scroll-animation]');
    var allAnchors = document.querySelectorAll('a[href^="#"]');

    // Navbar Scroll Effect
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

    // Theme Toggle
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
        setTheme(current === 'dark' ? 'light' : 'dark');
    }

    setTheme(getPreferredTheme());
    themeToggle.addEventListener('click', toggleTheme);

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
        if (!localStorage.getItem('nexus-theme')) {
            setTheme(e.matches ? 'dark' : 'light');
        }
    });

    // Mobile Menu
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
        mobileMenu.classList.contains('open') ? closeMobileMenu() : openMobileMenu();
    });

    mobileOverlay.addEventListener('click', closeMobileMenu);
    mobileLinks.forEach(function (link) {
        link.addEventListener('click', closeMobileMenu);
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && mobileMenu.classList.contains('open')) closeMobileMenu();
    });

    // Smooth Scroll
    allAnchors.forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var href = this.getAttribute('href');
            if (href === '#') return;
            var target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                var navHeight = navbar.offsetHeight;
                var targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
                window.scrollTo({ top: targetPosition, behavior: 'smooth' });
            }
        });
    });

    // Scroll Animations
    function initScrollAnimations() {
        if (!('IntersectionObserver' in window)) {
            scrollElements.forEach(function (el) { el.classList.add('animated'); });
            return;
        }
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
        scrollElements.forEach(function (el) { observer.observe(el); });
    }
    initScrollAnimations();

    // Battery fill animation on scroll
    var batteryFill = document.querySelector('.battery-fill');
    if (batteryFill) {
        var batteryObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    var width = batteryFill.style.width;
                    batteryFill.style.width = '0%';
                    setTimeout(function () {
                        batteryFill.style.width = width;
                    }, 200);
                    batteryObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        batteryObserver.observe(batteryFill.parentElement.parentElement);
    }

    // Color dots interaction
    var colorDots = document.querySelectorAll('.product-hero-colors .color-dot');
    colorDots.forEach(function (dot) {
        dot.addEventListener('click', function (e) {
            e.preventDefault();
            colorDots.forEach(function (d) { d.classList.remove('active'); });
            this.classList.add('active');
        });
        dot.style.cursor = 'pointer';
    });

})();
