

class CrymsonAnimations {
    constructor() {
        this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        this.particles = [];
        this.observers = new Map();
        this.init();
    }

    init() {
        if (this.isReducedMotion) {
            document.documentElement.style.setProperty('--animation-duration', '0.001ms');
            return;
        }

        this.setupIntersectionObserver();
        this.initializeParticles();
        this.setupScrollAnimations();
        this.setupHoverEffects();
        this.setupLoadingAnimations();
    }

    
    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        this.scrollObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                }
            });
        }, observerOptions);
    }

    
    initializeParticles() {
        this.createParticleContainer();
        this.generateBackgroundParticles();
        this.animateParticles();
    }

    createParticleContainer() {
        const container = document.createElement('div');
        container.id = 'particle-container';
        container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
            overflow: hidden;
        `;
        document.body.appendChild(container);
    }

    generateBackgroundParticles() {
        const particleCount = window.innerWidth > 768 ? 50 : 25;
        const container = document.getElementById('particle-container');

        for (let i = 0; i < particleCount; i++) {
            const particle = this.createParticle();
            container.appendChild(particle);
            this.particles.push(particle);
        }
    }

    createParticle() {
        const particle = document.createElement('div');
        const size = Math.random() * 4 + 2;
        const duration = Math.random() * 20 + 10;
        const delay = Math.random() * 5;
        
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: radial-gradient(circle, rgba(109, 216, 255, 0.8), transparent);
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: float-particle ${duration}s linear infinite;
            animation-delay: ${delay}s;
            opacity: 0;
        `;
        
        return particle;
    }

    animateParticles() {
        this.particles.forEach((particle, index) => {
            setTimeout(() => {
                particle.style.opacity = '0.6';
                this.animateParticleMovement(particle);
            }, index * 100);
        });
    }

    animateParticleMovement(particle) {
        const animate = () => {
            if (!this.isReducedMotion) {
                const currentLeft = parseFloat(particle.style.left);
                const currentTop = parseFloat(particle.style.top);
                
                const newLeft = (currentLeft + Math.random() * 2 - 1 + 100) % 100;
                const newTop = (currentTop - Math.random() * 0.5 + 100) % 100;
                
                particle.style.left = `${newLeft}%`;
                particle.style.top = `${newTop}%`;
            }
            
            requestAnimationFrame(animate);
        };
        
        requestAnimationFrame(animate);
    }

    
    setupScrollAnimations() {
        document.querySelectorAll('.shell, .form-card, .nav-item, .btn').forEach(el => {
            this.scrollObserver.observe(el);
        });
    }

    animateElement(element) {
        element.style.animation = 'none';
        element.offsetHeight; 
        element.style.animation = null;
        
        const animationType = this.getAnimationType(element);
        element.classList.add(animationType);
        
        setTimeout(() => {
            element.classList.remove(animationType);
        }, 1000);
    }

    getAnimationType(element) {
        if (element.classList.contains('shell')) return 'slide-up-fade';
        if (element.classList.contains('form-card')) return 'scale-fade';
        if (element.classList.contains('nav-item')) return 'slide-left';
        if (element.classList.contains('btn')) return 'bounce-in';
        return 'fade-in';
    }

    
    setupHoverEffects() {
        this.setupButtonHover();
        this.setupCardHover();
        this.setupInputHover();
        this.setupNavLinkHover();
    }

    setupButtonHover() {
        document.querySelectorAll('.btn, .primary').forEach(btn => {
            btn.addEventListener('mouseenter', (e) => this.handleButtonHover(e, true));
            btn.addEventListener('mouseleave', (e) => this.handleButtonHover(e, false));
        });
    }

    handleButtonHover(e, isEntering) {
        const btn = e.target;
        if (isEntering) {
            btn.style.transform = 'translateY(-2px) scale(1.02)';
            btn.style.boxShadow = '0 8px 25px rgba(61, 115, 255, 0.4)';
            this.createRippleEffect(btn);
        } else {
            btn.style.transform = 'translateY(0) scale(1)';
            btn.style.boxShadow = '';
        }
    }

    createRippleEffect(element) {
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `;
        
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = '50%';
        ripple.style.top = '50%';
        ripple.style.marginLeft = -size/2 + 'px';
        ripple.style.marginTop = -size/2 + 'px';
        
        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    }

    setupCardHover() {
        document.querySelectorAll('.form-card, .setting-item').forEach(card => {
            card.addEventListener('mouseenter', (e) => {
                e.target.style.transform = 'translateY(-4px)';
                e.target.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.15)';
            });
            
            card.addEventListener('mouseleave', (e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '';
            });
        });
    }

    setupInputHover() {
        document.querySelectorAll('.field').forEach(input => {
            input.addEventListener('focus', (e) => {
                e.target.parentElement.style.transform = 'scale(1.02)';
                this.createGlowEffect(e.target);
            });
            
            input.addEventListener('blur', (e) => {
                e.target.parentElement.style.transform = 'scale(1)';
            });
        });
    }

    createGlowEffect(element) {
        element.style.boxShadow = '0 0 20px rgba(61, 115, 255, 0.3), 0 0 40px rgba(61, 115, 255, 0.1)';
        setTimeout(() => {
            element.style.boxShadow = '';
        }, 300);
    }

    setupNavLinkHover() {
        document.querySelectorAll('.nav-item').forEach(link => {
            link.addEventListener('mouseenter', (e) => {
                this.createSlideInEffect(e.target);
            });
        });
    }

    createSlideInEffect(element) {
        const indicator = document.createElement('div');
        indicator.style.cssText = `
            position: absolute;
            left: 0;
            top: 0;
            height: 100%;
            width: 3px;
            background: linear-gradient(180deg, var(--accent), var(--accent-2));
            transform: scaleY(0);
            transform-origin: top;
            animation: slide-in-bar 0.3s ease forwards;
        `;
        
        element.style.position = 'relative';
        element.appendChild(indicator);
        
        setTimeout(() => indicator.remove(), 300);
    }

    
    setupLoadingAnimations() {
        this.createLoadingSpinner();
        this.setupProgressAnimations();
    }

    createLoadingSpinner() {
        const spinner = document.createElement('div');
        spinner.id = 'loading-spinner';
        spinner.innerHTML = `
            <div class="spinner-container">
                <div class="spinner-ring"></div>
                <div class="spinner-ring"></div>
                <div class="spinner-ring"></div>
            </div>
        `;
        
        spinner.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 10000;
            display: none;
        `;
        
        document.body.appendChild(spinner);
    }

    showLoadingSpinner() {
        const spinner = document.getElementById('loading-spinner');
        if (spinner) {
            spinner.style.display = 'block';
            spinner.style.animation = 'fade-in 0.3s ease';
        }
    }

    hideLoadingSpinner() {
        const spinner = document.getElementById('loading-spinner');
        if (spinner) {
            spinner.style.animation = 'fade-out 0.3s ease';
            setTimeout(() => {
                spinner.style.display = 'none';
            }, 300);
        }
    }

    setupProgressAnimations() {
        this.createProgressBar();
    }

    createProgressBar() {
        const progressBar = document.createElement('div');
        progressBar.id = 'progress-bar';
        progressBar.innerHTML = '<div class="progress-fill"></div>';
        
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 3px;
            background: rgba(0, 0, 0, 0.1);
            z-index: 10000;
            display: none;
        `;
        
        document.body.appendChild(progressBar);
    }

    showProgressBar() {
        const progressBar = document.getElementById('progress-bar');
        if (progressBar) {
            progressBar.style.display = 'block';
            this.animateProgress();
        }
    }

    animateProgress() {
        const progressFill = document.querySelector('#progress-bar .progress-fill');
        if (progressFill) {
            progressFill.style.animation = 'progress-fill 2s ease-in-out infinite';
        }
    }

    hideProgressBar() {
        const progressBar = document.getElementById('progress-bar');
        if (progressBar) {
            progressBar.style.display = 'none';
        }
    }

    
    pageTransition(direction = 'forward') {
        const overlay = document.createElement('div');
        overlay.className = 'page-transition-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, var(--accent), var(--accent-2));
            z-index: 9999;
            transform: ${direction === 'forward' ? 'translateX(-100%)' : 'translateX(100%)'};
            transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        `;
        
        document.body.appendChild(overlay);
        
        requestAnimationFrame(() => {
            overlay.style.transform = 'translateX(0)';
        });
        
        return new Promise(resolve => {
            setTimeout(() => {
                overlay.style.transform = direction === 'forward' ? 'translateX(100%)' : 'translateX(-100%)';
                setTimeout(() => {
                    overlay.remove();
                    resolve();
                }, 500);
            }, 200);
        });
    }

    
    setupMicroInteractions() {
        this.setupCheckboxAnimations();
        this.setupToggleAnimations();
        this.setupSelectAnimations();
    }

    setupCheckboxAnimations() {
        document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const checkmark = e.target.nextElementSibling;
                if (checkmark && checkmark.classList.contains('checkmark')) {
                    checkmark.style.animation = 'checkbox-bounce 0.3s ease';
                    setTimeout(() => {
                        checkmark.style.animation = '';
                    }, 300);
                }
            });
        });
    }

    setupToggleAnimations() {
        document.querySelectorAll('.toggle-switch').forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                const slider = toggle.querySelector('.toggle-slider');
                if (slider) {
                    slider.style.animation = 'toggle-flip 0.3s ease';
                    setTimeout(() => {
                        slider.style.animation = '';
                    }, 300);
                }
            });
        });
    }

    setupSelectAnimations() {
        document.querySelectorAll('select').forEach(select => {
            select.addEventListener('focus', (e) => {
                e.target.style.transform = 'scale(1.02)';
                e.target.style.boxShadow = '0 0 15px rgba(61, 115, 255, 0.2)';
            });
            
            select.addEventListener('blur', (e) => {
                e.target.style.transform = 'scale(1)';
                e.target.style.boxShadow = '';
            });
        });
    }

    
    debounce(func, wait) {
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

    
    optimizeAnimations() {
        if ('requestIdleCallback' in window) {
            requestIdleCallback(() => {
                this.setupScrollAnimations();
                this.setupMicroInteractions();
            });
        } else {
            setTimeout(() => {
                this.setupScrollAnimations();
                this.setupMicroInteractions();
            }, 100);
        }
    }
}


document.addEventListener('DOMContentLoaded', () => {
    window.crymsonAnimations = new CrymsonAnimations();
});


const animationCSS = `
@keyframes float-particle {
    0% {
        transform: translateY(0) rotate(0deg);
        opacity: 0;
    }
    10% {
        opacity: 0.6;
    }
    90% {
        opacity: 0.6;
    }
    100% {
        transform: translateY(-100vh) rotate(360deg);
        opacity: 0;
    }
}

@keyframes ripple {
    0% {
        transform: scale(0);
        opacity: 1;
    }
    100% {
        transform: scale(4);
        opacity: 0;
    }
}

@keyframes slide-in-bar {
    0% {
        transform: scaleY(0);
    }
    100% {
        transform: scaleY(1);
    }
}

@keyframes progress-fill {
    0% {
        width: 0%;
        left: 0%;
    }
    50% {
        width: 60%;
        left: 0%;
    }
    100% {
        width: 100%;
        left: 0%;
    }
}

@keyframes checkbox-bounce {
    0%, 100% {
        transform: scale(1);
    }
    50% {
        transform: scale(1.2);
    }
}

@keyframes toggle-flip {
    0% {
        transform: rotateY(0deg);
    }
    50% {
        transform: rotateY(90deg);
    }
    100% {
        transform: rotateY(0deg);
    }
}

@keyframes slide-up-fade {
    0% {
        opacity: 0;
        transform: translateY(30px);
    }
    100% {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes scale-fade {
    0% {
        opacity: 0;
        transform: scale(0.9);
    }
    100% {
        opacity: 1;
        transform: scale(1);
    }
}

@keyframes slide-left {
    0% {
        opacity: 0;
        transform: translateX(-20px);
    }
    100% {
        opacity: 1;
        transform: translateX(0);
    }
}

@keyframes bounce-in {
    0% {
        opacity: 0;
        transform: scale(0.3);
    }
    50% {
        opacity: 1;
        transform: scale(1.1);
    }
    100% {
        opacity: 1;
        transform: scale(1);
    }
}

.spinner-container {
    position: relative;
    width: 60px;
    height: 60px;
}

.spinner-ring {
    position: absolute;
    width: 100%;
    height: 100%;
    border: 3px solid transparent;
    border-top: 3px solid var(--accent);
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

.spinner-ring:nth-child(2) {
    border-top: 3px solid var(--accent-2);
    animation-delay: 0.2s;
    width: 80%;
    height: 80%;
    top: 10%;
    left: 10%;
}

.spinner-ring:nth-child(3) {
    border-top: 3px solid rgba(255, 255, 255, 0.8);
    animation-delay: 0.4s;
    width: 60%;
    height: 60%;
    top: 20%;
    left: 20%;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

@keyframes fade-in {
    0% { opacity: 0; }
    100% { opacity: 1; }
}

@keyframes fade-out {
    0% { opacity: 1; }
    100% { opacity: 0; }
}

@keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
    20%, 40%, 60%, 80% { transform: translateX(5px); }
}

.progress-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--accent), var(--accent-2));
    width: 0%;
}

.page-transition-overlay {
    pointer-events: none;
}

.particle {
    will-change: transform, opacity;
}
`;


const styleSheet = document.createElement('style');
styleSheet.textContent = animationCSS;
document.head.appendChild(styleSheet);
