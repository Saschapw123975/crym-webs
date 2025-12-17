
class AdvancedAnimationSystem {
    constructor() {
        this.animations = [];
        this.floatingElements = [];
        this.mouseTrail = [];
        this.explosions = [];
        this.morphingShapes = [];
        this.parallaxLayers = [];
        this.magneticElements = [];
        this.init();
    }

    init() {
        this.setupCanvas();
        this.initFloatingElements();
        this.initMouseTrail();
        this.initParallaxBackground();
        this.initMagneticEffect();
        this.initMorphingShapes();
        this.initTextAnimations();
        this.initButtonAnimations();
        this.initFormAnimations();
        this.startMainLoop();
    }

    setupCanvas() {
        
        const canvasContainer = document.createElement('div');
        canvasContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
        `;
        
        
        this.bgCanvas = document.createElement('canvas');
        this.bgCanvas.style.cssText = 'position: absolute; width: 100%; height: 100%;';
        this.bgCtx = this.bgCanvas.getContext('2d');
        
        
        this.fgCanvas = document.createElement('canvas');
        this.fgCanvas.style.cssText = 'position: absolute; width: 100%; height: 100%;';
        this.fgCtx = this.fgCanvas.getContext('2d');
        
        canvasContainer.appendChild(this.bgCanvas);
        canvasContainer.appendChild(this.fgCanvas);
        document.body.appendChild(canvasContainer);
        
        this.resizeCanvases();
        window.addEventListener('resize', () => this.resizeCanvases());
    }

    resizeCanvases() {
        [this.bgCanvas, this.fgCanvas].forEach(canvas => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
    }

    
    initFloatingElements() {
        const count = 15;
        for (let i = 0; i < count; i++) {
            this.floatingElements.push({
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                z: Math.random() * 1000,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                vz: (Math.random() - 0.5) * 2,
                size: Math.random() * 30 + 10,
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.05,
                type: ['cube', 'sphere', 'pyramid'][Math.floor(Math.random() * 3)],
                color: `hsl(${Math.random() * 60 + 200}, 70%, 50%)`
            });
        }
    }

    
    initMouseTrail() {
        let particleIndex = 0;
        document.addEventListener('mousemove', (e) => {
            
            const baseSize = 2 + (particleIndex % 5) * 0.5; 
            
            this.mouseTrail.push({
                x: e.clientX,
                y: e.clientY,
                size: baseSize,
                life: 1,
                vx: (Math.random() - 0.5) * 1,
                vy: (Math.random() - 0.5) * 1,
                color: `hsl(200, 100%, ${50 + Math.random() * 20}%)`, 
                index: particleIndex
            });
            
            particleIndex++;
            
            
            if (this.mouseTrail.length > 30) {
                this.mouseTrail.shift();
            }
        });
    }

    
    initParallaxBackground() {
        for (let i = 0; i < 5; i++) {
            this.parallaxLayers.push({
                shapes: [],
                speed: (i + 1) * 0.2,
                opacity: 0.1 + (i * 0.05)
            });
            
            
            for (let j = 0; j < 20; j++) {
                this.parallaxLayers[i].shapes.push({
                    x: Math.random() * window.innerWidth,
                    y: Math.random() * window.innerHeight,
                    size: Math.random() * 100 + 50,
                    rotation: Math.random() * Math.PI * 2
                });
            }
        }
    }

    
    initMagneticEffect() {
        document.querySelectorAll('.btn, .field, .card').forEach(element => {
            element.addEventListener('mouseenter', (e) => {
                this.magneticElements.push({
                    element: element,
                    originalTransform: element.style.transform,
                    active: true
                });
            });
            
            element.addEventListener('mouseleave', (e) => {
                const index = this.magneticElements.findIndex(m => m.element === element);
                if (index > -1) {
                    element.style.transform = this.magneticElements[index].originalTransform;
                    this.magneticElements.splice(index, 1);
                }
            });
        });
        
        document.addEventListener('mousemove', (e) => {
            this.magneticElements.forEach(magnetic => {
                if (magnetic.active) {
                    const rect = magnetic.element.getBoundingClientRect();
                    const centerX = rect.left + rect.width / 2;
                    const centerY = rect.top + rect.height / 2;
                    const distX = (e.clientX - centerX) * 0.1;
                    const distY = (e.clientY - centerY) * 0.1;
                    
                    magnetic.element.style.transform = `translate(${distX}px, ${distY}px) scale(1.05)`;
                }
            });
        });
    }


    
    initMorphingShapes() {
        const shapeCount = 3;
        for (let i = 0; i < shapeCount; i++) {
            this.morphingShapes.push({
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                vertices: this.generatePolygon(6 + Math.floor(Math.random() * 4)),
                targetVertices: this.generatePolygon(6 + Math.floor(Math.random() * 4)),
                morphProgress: 0,
                color: `hsla(${Math.random() * 360}, 70%, 50%, 0.1)`,
                rotation: 0,
                scale: Math.random() * 100 + 50
            });
        }
    }

    generatePolygon(sides) {
        const vertices = [];
        const angleStep = (Math.PI * 2) / sides;
        
        for (let i = 0; i < sides; i++) {
            const angle = i * angleStep;
            const radius = 1 + Math.random() * 0.3;
            vertices.push({
                x: Math.cos(angle) * radius,
                y: Math.sin(angle) * radius
            });
        }
        
        return vertices;
    }

    
    initTextAnimations() {
        
        document.querySelectorAll('h1, h2').forEach(heading => {
            heading.style.position = 'relative';
            heading.addEventListener('mouseenter', () => {
                this.applyGlitchEffect(heading);
            });
        });
        
        
        document.querySelectorAll('p').forEach(paragraph => {
            const text = paragraph.innerText;
            paragraph.innerHTML = '';
            
            text.split('').forEach((char, index) => {
                const span = document.createElement('span');
                span.innerText = char === ' ' ? '\u00A0' : char;
                span.style.cssText = `
                    display: inline-block;
                    animation: wave 2s ease-in-out ${index * 0.02}s infinite;
                `;
                paragraph.appendChild(span);
            });
        });
    }

    applyGlitchEffect(element) {
        const glitchLayers = 3;
        const originalText = element.innerText;
        
        for (let i = 0; i < glitchLayers; i++) {
            const glitch = document.createElement('div');
            glitch.innerText = originalText;
            glitch.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                color: ${['#001f3f', '#003366', '#004080'][i]};
                opacity: 0.8;
                mix-blend-mode: screen;
                animation: glitch-${i} 0.3s ease-in-out infinite;
                pointer-events: none;
            `;
            element.appendChild(glitch);
            
            setTimeout(() => glitch.remove(), 500);
        }
    }

    
    initButtonAnimations() {
        document.querySelectorAll('button, .btn').forEach(button => {
            
            button.addEventListener('click', (e) => {
                const rect = button.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                this.createExplosion(e.clientX, e.clientY);
                this.createRippleExplosion(button, x, y);
            });
            
            
            button.addEventListener('mouseenter', () => {
                button.style.animation = 'liquid 0.5s ease-in-out';
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.animation = '';
            });
        });
    }

    createExplosion(x, y) {
        const particleCount = 20;
        for (let i = 0; i < particleCount; i++) {
            const angle = (Math.PI * 2 * i) / particleCount;
            const velocity = Math.random() * 5 + 2;
            
            this.explosions.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * velocity,
                vy: Math.sin(angle) * velocity,
                size: Math.random() * 8 + 2,
                life: 1,
                color: `hsl(${Math.random() * 60 + 30}, 100%, 50%)`
            });
        }
    }

    createRippleExplosion(element, x, y) {
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: absolute;
            left: ${x}px;
            top: ${y}px;
            width: 0;
            height: 0;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(255,255,255,0.8), transparent);
            transform: translate(-50%, -50%);
            pointer-events: none;
            animation: ripple-explosion 1s ease-out;
        `;
        
        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 1000);
    }

    
    initFormAnimations() {
        document.querySelectorAll('input, textarea').forEach(field => {
            
            field.addEventListener('focus', () => {
                field.style.animation = 'electric-border 0.5s ease-in-out infinite';
                this.createFieldAura(field);
            });
            
            field.addEventListener('blur', () => {
                field.style.animation = '';
            });
            
            
            field.addEventListener('input', () => {
                this.createTypingEffect(field);
            });
        });
    }

    createFieldAura(field) {
        const aura = document.createElement('div');
        aura.style.cssText = `
            position: absolute;
            top: ${field.offsetTop - 10}px;
            left: ${field.offsetLeft - 10}px;
            width: ${field.offsetWidth + 20}px;
            height: ${field.offsetHeight + 20}px;
            border-radius: 10px;
            background: radial-gradient(ellipse at center, transparent 30%, rgba(61, 115, 255, 0.3) 100%);
            pointer-events: none;
            animation: pulse-aura 2s ease-in-out infinite;
            z-index: -1;
        `;
        
        field.parentElement.appendChild(aura);
        field.addEventListener('blur', () => aura.remove(), { once: true });
    }

    createTypingEffect(field) {
        const char = document.createElement('div');
        char.innerText = String.fromCharCode(65 + Math.floor(Math.random() * 26));
        char.style.cssText = `
            position: absolute;
            left: ${field.offsetLeft + field.offsetWidth - 20}px;
            top: ${field.offsetTop}px;
            color: rgba(61, 115, 255, 0.8);
            font-size: 14px;
            pointer-events: none;
            animation: float-up 1s ease-out forwards;
        `;
        
        field.parentElement.appendChild(char);
        setTimeout(() => char.remove(), 1000);
    }

    
    startMainLoop() {
        const animate = () => {
            
            this.bgCtx.clearRect(0, 0, this.bgCanvas.width, this.bgCanvas.height);
            this.fgCtx.clearRect(0, 0, this.fgCanvas.width, this.fgCanvas.height);
            
            
            this.updateFloatingElements();
            this.updateMouseTrail();
            this.updateParallaxLayers();
            this.updateMorphingShapes();
            this.updateExplosions();
            
            requestAnimationFrame(animate);
        };
        
        requestAnimationFrame(animate);
    }

    updateFloatingElements() {
        this.floatingElements.forEach(element => {
            
            element.x += element.vx;
            element.y += element.vy;
            element.z += element.vz;
            element.rotation += element.rotationSpeed;
            
            
            if (element.x < 0 || element.x > window.innerWidth) element.vx *= -1;
            if (element.y < 0 || element.y > window.innerHeight) element.vy *= -1;
            if (element.z < 0 || element.z > 1000) element.vz *= -1;
            
            
            const scale = 1000 / (1000 + element.z);
            const size = element.size * scale;
            const x = element.x * scale + (window.innerWidth * (1 - scale)) / 2;
            const y = element.y * scale + (window.innerHeight * (1 - scale)) / 2;
            
            this.bgCtx.save();
            this.bgCtx.translate(x, y);
            this.bgCtx.rotate(element.rotation);
            this.bgCtx.globalAlpha = scale * 0.3;
            
            if (element.type === 'cube') {
                this.drawCube(this.bgCtx, size, element.color);
            } else if (element.type === 'sphere') {
                this.drawSphere(this.bgCtx, size, element.color);
            } else {
                this.drawPyramid(this.bgCtx, size, element.color);
            }
            
            this.bgCtx.restore();
        });
    }

    drawCube(ctx, size, color) {
        ctx.fillStyle = color;
        ctx.fillRect(-size/2, -size/2, size, size);
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.strokeRect(-size/2, -size/2, size, size);
    }

    drawSphere(ctx, size, color) {
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size);
        gradient.addColorStop(0, color);
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(0, 0, size, 0, Math.PI * 2);
        ctx.fill();
    }

    drawPyramid(ctx, size, color) {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(0, -size);
        ctx.lineTo(-size, size);
        ctx.lineTo(size, size);
        ctx.closePath();
        ctx.fill();
    }

    updateMouseTrail() {
        this.mouseTrail.forEach((particle, index) => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life -= 0.02;
            particle.size *= 0.98;
            
            if (particle.life > 0) {
                this.fgCtx.globalAlpha = particle.life;
                this.fgCtx.fillStyle = particle.color;
                this.fgCtx.beginPath();
                this.fgCtx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                this.fgCtx.fill();
            }
        });
        
        this.mouseTrail = this.mouseTrail.filter(p => p.life > 0);
    }

    updateParallaxLayers() {
        this.parallaxLayers.forEach(layer => {
            layer.shapes.forEach(shape => {
                shape.x -= layer.speed;
                if (shape.x < -shape.size) {
                    shape.x = window.innerWidth + shape.size;
                }
                
                this.bgCtx.globalAlpha = layer.opacity;
                this.bgCtx.fillStyle = 'rgba(61, 115, 255, 0.1)';
                this.bgCtx.save();
                this.bgCtx.translate(shape.x, shape.y);
                this.bgCtx.rotate(shape.rotation);
                this.bgCtx.fillRect(-shape.size/2, -shape.size/2, shape.size, shape.size);
                this.bgCtx.restore();
            });
        });
    }


    updateMorphingShapes() {
        this.morphingShapes.forEach(shape => {
            shape.morphProgress += 0.01;
            shape.rotation += 0.005;
            
            if (shape.morphProgress >= 1) {
                shape.vertices = shape.targetVertices;
                shape.targetVertices = this.generatePolygon(6 + Math.floor(Math.random() * 4));
                shape.morphProgress = 0;
            }
            
            this.bgCtx.save();
            this.bgCtx.translate(shape.x, shape.y);
            this.bgCtx.rotate(shape.rotation);
            this.bgCtx.scale(shape.scale, shape.scale);
            
            this.bgCtx.fillStyle = shape.color;
            this.bgCtx.beginPath();
            
            shape.vertices.forEach((vertex, index) => {
                const targetVertex = shape.targetVertices[index] || shape.targetVertices[0];
                const x = vertex.x + (targetVertex.x - vertex.x) * shape.morphProgress;
                const y = vertex.y + (targetVertex.y - vertex.y) * shape.morphProgress;
                
                if (index === 0) {
                    this.bgCtx.moveTo(x, y);
                } else {
                    this.bgCtx.lineTo(x, y);
                }
            });
            
            this.bgCtx.closePath();
            this.bgCtx.fill();
            this.bgCtx.restore();
        });
    }

    updateExplosions() {
        this.explosions.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.vy += 0.2; 
            particle.life -= 0.02;
            particle.size *= 0.98;
            
            if (particle.life > 0) {
                this.fgCtx.globalAlpha = particle.life;
                this.fgCtx.fillStyle = particle.color;
                this.fgCtx.beginPath();
                this.fgCtx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                this.fgCtx.fill();
            }
        });
        
        this.explosions = this.explosions.filter(p => p.life > 0);
    }
}


const animationStyles = `
@keyframes wave {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-5px); }
}

@keyframes glitch-0 {
    0%, 100% { transform: translate(0); }
    20% { transform: translate(-2px, 2px); }
    40% { transform: translate(-2px, -2px); }
    60% { transform: translate(2px, 2px); }
    80% { transform: translate(2px, -2px); }
}

@keyframes glitch-1 {
    0%, 100% { transform: translate(0); }
    20% { transform: translate(2px, -2px); }
    40% { transform: translate(2px, 2px); }
    60% { transform: translate(-2px, -2px); }
    80% { transform: translate(-2px, 2px); }
}

@keyframes glitch-2 {
    0%, 100% { transform: translate(0); }
    20% { transform: translate(-2px, -2px); }
    40% { transform: translate(2px, -2px); }
    60% { transform: translate(-2px, 2px); }
    80% { transform: translate(2px, 2px); }
}

@keyframes liquid {
    0% { transform: scale(1) rotate(0deg); }
    25% { transform: scale(1.05) rotate(1deg); }
    50% { transform: scale(1) rotate(-1deg); }
    75% { transform: scale(1.05) rotate(1deg); }
    100% { transform: scale(1) rotate(0deg); }
}

@keyframes ripple-explosion {
    0% {
        width: 0;
        height: 0;
        opacity: 1;
    }
    100% {
        width: 400px;
        height: 400px;
        opacity: 0;
    }
}

@keyframes electric-border {
    0% { box-shadow: 0 0 5px rgba(61, 115, 255, 0.5); }
    50% { box-shadow: 0 0 20px rgba(61, 115, 255, 1), 0 0 40px rgba(61, 115, 255, 0.5); }
    100% { box-shadow: 0 0 5px rgba(61, 115, 255, 0.5); }
}

@keyframes pulse-aura {
    0%, 100% { transform: scale(1); opacity: 0.5; }
    50% { transform: scale(1.1); opacity: 0.8; }
}

@keyframes float-up {
    0% {
        transform: translateY(0) scale(1);
        opacity: 1;
    }
    100% {
        transform: translateY(-30px) scale(0);
        opacity: 0;
    }
}
`;


const styleElement = document.createElement('style');
styleElement.textContent = animationStyles;
document.head.appendChild(styleElement);


let advancedAnimations;
document.addEventListener('DOMContentLoaded', () => {
    advancedAnimations = new AdvancedAnimationSystem();
});


window.AdvancedAnimationSystem = AdvancedAnimationSystem;
