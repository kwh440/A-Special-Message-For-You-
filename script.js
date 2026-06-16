document.addEventListener('DOMContentLoaded', () => {
    // Register Plugins
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

    // Loader
    const loader = document.getElementById('loader');
    window.addEventListener('load', () => {
        gsap.to(loader, {
            opacity: 0,
            duration: 1,
            ease: 'power2.inOut',
            onComplete: () => {
                loader.style.display = 'none';
                initAnimations();
            }
        });
    });

    // Auto Scroll Interaction
    const scrollPill = document.getElementById('scroll-pill');
    if (scrollPill) {
        scrollPill.addEventListener('click', () => {
            gsap.to(window, {
                scrollTo: "#intro-scroll",
                duration: 2,
                ease: "power2.inOut"
            });
        });
    }

    // Particle System
    const canvas = document.getElementById('canvas-particles');
    const ctx = canvas.getContext('2d');
    let particles = [];

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', resize);
    resize();

    class Particle {
        constructor() {
            this.init();
        }

        init() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 3 + 1;
            this.speedX = Math.random() * 0.5 - 0.25;
            this.speedY = Math.random() * 0.5 - 0.25;
            this.opacity = Math.random() * 0.5;
            this.color = '#ff8fb1';
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x > canvas.width || this.x < 0) this.speedX *= -1;
            if (this.y > canvas.height || this.y < 0) this.speedY *= -1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.globalAlpha = this.opacity;
            ctx.fill();
        }
    }

    for (let i = 0; i < 50; i++) {
        particles.push(new Particle());
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animateParticles);
    }
    animateParticles();

    // GSAP Animations
    function initAnimations() {
        // Text reveal for Hero
        gsap.from('.reveal-text', {
            y: 100,
            opacity: 0,
            duration: 1.5,
            ease: 'power4.out',
            delay: 0.5
        });

        // Pinned Scrollytelling Section
        const scrollLines = gsap.utils.toArray('.scroll-line');
        if (scrollLines.length > 0) {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: '#intro-scroll',
                    start: 'top top',
                    end: '+=4000', // Keep pinned for 4000px
                    pin: true,
                    scrub: 1
                }
            });

            scrollLines.forEach((line) => {
                tl.fromTo(line, 
                    { opacity: 0, y: 30 }, 
                    { opacity: 1, y: 0, duration: 1, ease: "power2.out" }
                )
                .to(line, 
                    { opacity: 0, y: -30, duration: 1, ease: "power2.in" },
                    "+=0.5"
                );
            });
        }

        // Story Cards Reveal
        gsap.utils.toArray('.glass-card').forEach(card => {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                },
                y: 100,
                opacity: 0,
                duration: 1.2,
                ease: 'power3.out'
            });
        });

        // Poem lines reveal
        gsap.utils.toArray('.poem-line').forEach((line, i) => {
            gsap.to(line, {
                scrollTrigger: {
                    trigger: line,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse'
                },
                opacity: 1,
                y: 0,
                duration: 1,
                delay: i * 0.1,
                ease: 'power2.out'
            });
        });

        // CTA Reveal
        gsap.from('.cta-content', {
            scrollTrigger: {
                trigger: '.cta-section',
                start: 'top 60%'
            },
            scale: 0.9,
            opacity: 0,
            duration: 1.5,
            ease: 'elastic.out(1, 0.5)'
        });
    }

    // Interaction for "The Big Question"
    const noBtn = document.getElementById('no-btn');
    const yesBtn = document.getElementById('yes-btn');
    const celebration = document.getElementById('celebration');

    // Make "No" button run away (playfully)
    const moveNoBtn = () => {
        const x = Math.random() * (window.innerWidth - noBtn.offsetWidth);
        const y = Math.random() * (window.innerHeight - noBtn.offsetHeight);
        
        gsap.to(noBtn, {
            x: x - noBtn.offsetLeft - (noBtn.offsetWidth / 2),
            y: y - noBtn.offsetTop - (noBtn.offsetHeight / 2),
            duration: 0.3,
            ease: 'power2.out'
        });
    };

    noBtn.addEventListener('mouseover', moveNoBtn);
    noBtn.addEventListener('click', (e) => {
        e.preventDefault();
        moveNoBtn();
    });
    noBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        moveNoBtn();
    });

    // Celebration on "Yes"
    yesBtn.addEventListener('click', () => {
        celebration.classList.add('active');
        createHearts();
    });

    function createHearts() {
        for (let i = 0; i < 50; i++) {
            const heart = document.createElement('div');
            heart.innerHTML = '❤️';
            heart.style.position = 'fixed';
            heart.style.left = Math.random() * 100 + 'vw';
            heart.style.top = '100vh';
            heart.style.fontSize = Math.random() * 20 + 20 + 'px';
            heart.style.zIndex = '1001';
            heart.style.pointerEvents = 'none';
            document.body.appendChild(heart);

            gsap.to(heart, {
                y: '-120vh',
                x: (Math.random() - 0.5) * 200,
                rotation: Math.random() * 360,
                duration: Math.random() * 2 + 3,
                ease: 'power1.out',
                onComplete: () => heart.remove()
            });
        }
    }
});
