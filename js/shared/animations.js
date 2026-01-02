/* ===========================================
   animations.js - Animation Utilities
   Shared animation helpers
   =========================================== */

/**
 * Animate a progress bar
 * @param {HTMLElement} element 
 * @param {number} from - Start percentage
 * @param {number} to - End percentage
 * @param {number} duration - Duration in ms
 * @returns {Promise}
 */
async function animateProgress(element, from = 0, to = 100, duration = 1000) {
    if (!element) return;

    const steps = 50;
    const stepDuration = duration / steps;
    const increment = (to - from) / steps;

    let current = from;
    for (let i = 0; i < steps; i++) {
        current += increment;
        element.style.width = current + '%';
        await new Promise(r => setTimeout(r, stepDuration));
    }
    element.style.width = to + '%';
}

/**
 * Pulse animation on an element
 * @param {HTMLElement} element 
 * @param {string} color 
 * @param {number} duration 
 */
function pulseElement(element, color = '#4FD8EB', duration = 500) {
    if (!element) return;

    element.style.transition = `box-shadow ${duration / 2}ms ease`;
    element.style.boxShadow = `0 0 20px ${color}`;

    setTimeout(() => {
        element.style.boxShadow = 'none';
    }, duration / 2);
}

/**
 * Typewriter effect
 * @param {HTMLElement} element 
 * @param {string} text 
 * @param {number} speed - ms per character
 * @returns {Promise}
 */
async function typewriter(element, text, speed = 50) {
    if (!element) return;

    element.textContent = '';
    for (let i = 0; i < text.length; i++) {
        element.textContent += text[i];
        await new Promise(r => setTimeout(r, speed));
    }
}

/**
 * Fade in an element
 * @param {HTMLElement} element 
 * @param {number} duration 
 */
function fadeIn(element, duration = 300) {
    if (!element) return;

    element.style.opacity = '0';
    element.style.transition = `opacity ${duration}ms ease`;

    requestAnimationFrame(() => {
        element.style.opacity = '1';
    });
}

/**
 * Fade out an element
 * @param {HTMLElement} element 
 * @param {number} duration 
 * @returns {Promise}
 */
function fadeOut(element, duration = 300) {
    if (!element) return Promise.resolve();

    element.style.transition = `opacity ${duration}ms ease`;
    element.style.opacity = '0';

    return new Promise(resolve => {
        setTimeout(resolve, duration);
    });
}

/**
 * Highlight flash effect
 * @param {HTMLElement} element 
 * @param {string} color 
 */
function highlightFlash(element, color = '#4FD8EB') {
    if (!element) return;

    const originalBg = element.style.backgroundColor;
    element.style.transition = 'background-color 0.15s ease';
    element.style.backgroundColor = color;

    setTimeout(() => {
        element.style.backgroundColor = originalBg;
    }, 150);
}

/**
 * Shake animation for error feedback
 * @param {HTMLElement} element 
 */
function shake(element) {
    if (!element) return;

    element.style.animation = 'shake 0.5s ease';
    setTimeout(() => {
        element.style.animation = '';
    }, 500);
}

// Add shake keyframes
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
`;
document.head.appendChild(shakeStyle);

// Export for global use
window.Animations = {
    progress: animateProgress,
    pulse: pulseElement,
    typewriter,
    fadeIn,
    fadeOut,
    highlightFlash,
    shake
};
