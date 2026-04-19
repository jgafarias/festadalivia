/**
 * Global configurations and initialization
 */

// Loading Screen
setTimeout(() => {
    const loader = document.getElementById('loading');
    if (loader) loader.style.display = 'none';
}, 3500);

document.body.classList.remove('loading');

// Scroll Behavior
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        document.body.classList.add('scrolled');
    } else {
        document.body.classList.remove('scrolled');
    }
});

// Navigation and SPA Behavior
const navToggle = document.querySelector('.nav-toggle');
const siteNav = document.querySelector('.site-nav');
const navLinks = document.querySelectorAll('.site-nav a');
const sections = document.querySelectorAll('.section');

const setActiveSection = (sectionId) => {
    if (!sectionId) return;

    let found = false;
    sections.forEach((section) => {
        const isActive = section.id === sectionId;
        section.classList.toggle('is-active', isActive);
        if (isActive) found = true;
    });

    navLinks.forEach((link) => {
        const href = link.getAttribute('href').replace('#', '');
        link.classList.toggle('is-active', href === sectionId);
    });

    if (!found && sections.length) {
        sections[0].classList.add('is-active');
    }
};

const normalizeHash = (hashValue) => hashValue.replace('#', '') || '';

// Handle Initial Load
setActiveSection(normalizeHash(window.location.hash) || 'inicio');

// Handle Navigation Clicks
navLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
        event.preventDefault();
        const targetId = normalizeHash(link.getAttribute('href'));
        setActiveSection(targetId);
        window.history.replaceState(null, '', `#${targetId}`);

        if (siteNav) siteNav.classList.remove('is-open');
        if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
    });
});

// Handle Browser Back/Forward
window.addEventListener('hashchange', () => {
    setActiveSection(normalizeHash(window.location.hash) || 'inicio');
});

// Mobile Toggle
if (navToggle && siteNav) {
    navToggle.addEventListener('click', () => {
        const isOpen = siteNav.classList.toggle('is-open');
        navToggle.setAttribute('aria-expanded', String(isOpen));
    });
}
