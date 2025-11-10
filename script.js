// Background Network Animation
(function() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.className = 'network-canvas';
    canvas.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 0;
        pointer-events: none;
        opacity: 0.3;
    `;
    
    const bgAnimation = document.querySelector('.bg-animation');
    if (bgAnimation) {
        bgAnimation.appendChild(canvas);
        
        let width = window.innerWidth;
        let height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
        
        const nodes = [];
        const nodeCount = 25;
        
        // Create nodes
        for (let i = 0; i < nodeCount; i++) {
            nodes.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 2 + 1
            });
        }
        
        function drawNetwork() {
            ctx.clearRect(0, 0, width, height);
            
            // Update node positions
            nodes.forEach(node => {
                node.x += node.vx;
                node.y += node.vy;
                
                // Bounce off edges
                if (node.x < 0 || node.x > width) node.vx *= -1;
                if (node.y < 0 || node.y > height) node.vy *= -1;
                
                node.x = Math.max(0, Math.min(width, node.x));
                node.y = Math.max(0, Math.min(height, node.y));
            });
            
            // Draw connections
            for (let i = 0; i < nodes.length; i++) {
                for (let j = i + 1; j < nodes.length; j++) {
                    const dx = nodes[i].x - nodes[j].x;
                    const dy = nodes[i].y - nodes[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < 150) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(59, 130, 246, ${1 - distance / 150})`;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(nodes[i].x, nodes[i].y);
                        ctx.lineTo(nodes[j].x, nodes[j].y);
                        ctx.stroke();
                    }
                }
            }
            
            // Draw nodes
            nodes.forEach(node => {
                ctx.beginPath();
                ctx.fillStyle = 'rgba(59, 130, 246, 0.6)';
                ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
                ctx.fill();
            });
            
            requestAnimationFrame(drawNetwork);
        }
        
        function handleResize() {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        }
        
        window.addEventListener('resize', handleResize);
        drawNetwork();
    }
})();

// Custom Cursor Animation
(function() {
    // Only enable on non-touch devices
    if (window.matchMedia('(pointer: fine)').matches) {
        const cursor = document.getElementById('cursor');
        const cursorTrail = document.getElementById('cursorTrail');
        
        let mouseX = 0;
        let mouseY = 0;
        let cursorX = 0;
        let cursorY = 0;
        let trailX = 0;
        let trailY = 0;
        
        // Smooth cursor movement using requestAnimationFrame
        function updateCursor() {
            // Main cursor with slight lag for smooth effect
            cursorX += (mouseX - cursorX) * 0.15;
            cursorY += (mouseY - cursorY) * 0.15;
            
            // Trail with more lag for trailing effect
            trailX += (mouseX - trailX) * 0.08;
            trailY += (mouseY - trailY) * 0.08;
            
            cursor.style.left = cursorX + 'px';
            cursor.style.top = cursorY + 'px';
            
            cursorTrail.style.left = trailX + 'px';
            cursorTrail.style.top = trailY + 'px';
            
            requestAnimationFrame(updateCursor);
        }
        
        // Track mouse movement
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            // Activate trail
            cursorTrail.classList.add('active');
        });
        
        // Detect interactive elements
        const interactiveElements = document.querySelectorAll(
            'a, button, .btn, .nav-link, .project-card, .contact-item, input, textarea, select, [role="button"]'
        );
        
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('hover');
                cursorTrail.classList.add('hover');
            });
            
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('hover');
                cursorTrail.classList.remove('hover');
            });
        });
        
        // Click animation
        document.addEventListener('mousedown', () => {
            cursor.classList.add('click');
        });
        
        document.addEventListener('mouseup', () => {
            cursor.classList.remove('click');
        });
        
        // Hide cursor when leaving window
        document.addEventListener('mouseleave', () => {
            cursor.style.opacity = '0';
            cursorTrail.style.opacity = '0';
        });
        
        document.addEventListener('mouseenter', () => {
            cursor.style.opacity = '1';
            cursorTrail.style.opacity = '1';
        });
        
        // Start the animation loop
        updateCursor();
        
        // Create multiple trail particles for enhanced effect
        const trailParticles = [];
        const particleCount = 5;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'cursor-trail-particle';
            particle.style.cssText = `
                position: fixed;
                width: 4px;
                height: 4px;
                border-radius: 50%;
                background: radial-gradient(circle, var(--secondary-color) 0%, transparent 70%);
                box-shadow: 0 0 10px var(--secondary-color);
                pointer-events: none;
                z-index: 9997;
                opacity: 0;
                transform: translate(-50%, -50%);
                transition: opacity 0.3s ease-out, transform 0.3s ease-out;
            `;
            document.body.appendChild(particle);
            trailParticles.push({
                element: particle,
                x: 0,
                y: 0,
                targetX: 0,
                targetY: 0,
                delay: i * 0.05
            });
        }
        
        // Update trail particles
        let particleMouseX = 0;
        let particleMouseY = 0;
        
        document.addEventListener('mousemove', (e) => {
            particleMouseX = e.clientX;
            particleMouseY = e.clientY;
            
            trailParticles.forEach((particle, index) => {
                setTimeout(() => {
                    particle.targetX = particleMouseX;
                    particle.targetY = particleMouseY;
                    particle.element.style.opacity = '0.5';
                    
                    // Fade out effect
                    setTimeout(() => {
                        particle.element.style.opacity = '0';
                    }, 200);
                }, index * 15);
            });
        });
        
        function updateParticles() {
            trailParticles.forEach((particle, index) => {
                particle.x += (particle.targetX - particle.x) * (0.1 + index * 0.02);
                particle.y += (particle.targetY - particle.y) * (0.1 + index * 0.02);
                
                particle.element.style.left = particle.x + 'px';
                particle.element.style.top = particle.y + 'px';
            });
            
            requestAnimationFrame(updateParticles);
        }
        
        updateParticles();
    }
})();

// Logo click to scroll to top
const navLogo = document.querySelector('.nav-logo');
if (navLogo) {
    navLogo.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar scroll effect
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
    }
    
    lastScroll = currentScroll;
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
const animateElements = document.querySelectorAll('.timeline-item, .project-card, .skills-category, .achievement-card');
animateElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Add active state to navigation links based on scroll position
const sections = document.querySelectorAll('.section, #hero');
const navLinksArray = Array.from(navLinks);

window.addEventListener('scroll', () => {
    let current = '';
    const scrollPosition = window.pageYOffset + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });

    navLinksArray.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Typing effect for hero subtitle (optional enhancement)
const heroSubtitle = document.querySelector('.hero-subtitle');
if (heroSubtitle) {
    const text = heroSubtitle.textContent;
    heroSubtitle.textContent = '';
    let i = 0;
    
    function typeWriter() {
        if (i < text.length) {
            heroSubtitle.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 50);
        }
    }
    
    // Start typing effect after a short delay
    setTimeout(typeWriter, 800);
}

// Add parallax effect to hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        hero.style.opacity = 1 - scrolled / 500;
    }
});

// Prevent default behavior for contact links
document.querySelectorAll('.contact-item').forEach(item => {
    item.addEventListener('click', (e) => {
        if (!item.href || item.href === '#') {
            e.preventDefault();
        }
    });
});
