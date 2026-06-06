/*
   MOSIQATI — ULTIMATE EDITION JavaScript
   World-Class Interactive Features
*/

// ═══════════════════════════════════════
// APP INIT
// ═══════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
    initLoader();
    initCursor();
    initParticles();
    initNavigation();
    initScrollReveal();
    initStoreFilters();
    initGiftQuiz();
    initCountdownTimer();
    initScratchCard();
    initContactForm();
    initLoginModal();
    initHeroBg();
    initCartButtons();
});

// ═══════════════════════════════════════
// 1. LOADING SCREEN
// ═══════════════════════════════════════
function initLoader() {
    const loader = document.getElementById('loader');
    if (!loader) return;
    // Hide loader after 2.8 seconds
    setTimeout(() => {
        loader.classList.add('hidden');
        // Trigger hero bg parallax loaded state
        const heroBg = document.querySelector('.hero-bg');
        if (heroBg) heroBg.classList.add('loaded');
    }, 2800);
}

// ═══════════════════════════════════════
// 2. CUSTOM CURSOR
// ═══════════════════════════════════════
function initCursor() {
    const dot  = document.getElementById('cursorDot');
    const ring = document.getElementById('cursorRing');
    if (!dot || !ring) return;

    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        dot.style.left = mouseX + 'px';
        dot.style.top  = mouseY + 'px';
    });

    // Smooth ring follow with lag
    function animateRing() {
        ringX += (mouseX - ringX) * 0.12;
        ringY += (mouseY - ringY) * 0.12;
        ring.style.left = ringX + 'px';
        ring.style.top  = ringY + 'px';
        requestAnimationFrame(animateRing);
    }
    animateRing();

    // Hover state on interactive elements
    const hoverEls = document.querySelectorAll('a, button, .card, .product-card, .category-card, .filter-chip, .wizard-opt, .social-btn, .btn, .btn-cart');
    hoverEls.forEach(el => {
        el.addEventListener('mouseenter', () => { dot.classList.add('hovering'); ring.classList.add('hovering'); });
        el.addEventListener('mouseleave', () => { dot.classList.remove('hovering'); ring.classList.remove('hovering'); });
    });
}

// ═══════════════════════════════════════
// 3. PARTICLE CANVAS — FLOATING MUSIC NOTES & STARS
// ═══════════════════════════════════════
function initParticles() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    function resize() {
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const musicSymbols = ['♪', '♫', '♬', '♩', '🎵', '🎶'];
    const particles = [];

    class Particle {
        constructor() { this.reset(true); }
        reset(initial = false) {
            this.x = Math.random() * canvas.width;
            this.y = initial ? Math.random() * canvas.height : canvas.height + 20;
            this.size = Math.random() * 14 + 8;
            this.speed = Math.random() * 0.5 + 0.15;
            this.opacity = 0;
            this.maxOpacity = Math.random() * 0.35 + 0.1;
            this.angle = Math.random() * 360;
            this.rotSpeed = (Math.random() - 0.5) * 0.8;
            this.symbol = musicSymbols[Math.floor(Math.random() * musicSymbols.length)];
            const colors = ['#d4af37', '#00e5ff', '#7b2fff', '#ffffff'];
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.drift = (Math.random() - 0.5) * 0.3;
        }
        update() {
            this.y -= this.speed;
            this.x += this.drift;
            this.angle += this.rotSpeed;
            if (this.y < canvas.height * 0.7) {
                this.opacity = Math.min(this.opacity + 0.006, this.maxOpacity);
            }
            if (this.y < canvas.height * 0.2) {
                this.opacity -= 0.005;
            }
        }
        draw() {
            ctx.save();
            ctx.globalAlpha = Math.max(0, this.opacity);
            ctx.translate(this.x, this.y);
            ctx.rotate((this.angle * Math.PI) / 180);
            ctx.font = `${this.size}px serif`;
            ctx.fillStyle = this.color;
            ctx.fillText(this.symbol, 0, 0);
            ctx.restore();
        }
        isDead() { return this.y < -20 || this.opacity <= 0; }
    }

    // Spawn initial particles
    for (let i = 0; i < 35; i++) particles.push(new Particle());

    function loop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = particles.length - 1; i >= 0; i--) {
            particles[i].update();
            particles[i].draw();
            if (particles[i].isDead()) {
                particles.splice(i, 1);
                particles.push(new Particle());
            }
        }
        requestAnimationFrame(loop);
    }
    loop();
}

// ═══════════════════════════════════════
// 4. NAVIGATION — HAMBURGER & MOBILE DRAWER
// ═══════════════════════════════════════
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu   = document.querySelector('.nav-menu');
    if (!hamburger || !navMenu) return;

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('open');
        navMenu.classList.toggle('open');
        document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('open');
            navMenu.classList.remove('open');
            document.body.style.overflow = '';
        });
    });

    // Close on backdrop click
    document.addEventListener('click', (e) => {
        if (navMenu.classList.contains('open') && !navMenu.contains(e.target) && !hamburger.contains(e.target)) {
            hamburger.classList.remove('open');
            navMenu.classList.remove('open');
            document.body.style.overflow = '';
        }
    });
}

// ═══════════════════════════════════════
// 5. SCROLL REVEAL (Intersection Observer)
// ═══════════════════════════════════════
function initScrollReveal() {
    const els = document.querySelectorAll('.reveal');
    if (!els.length) return;

    const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    els.forEach(el => obs.observe(el));
}

// ═══════════════════════════════════════
// 6. STORE PRODUCT FILTER
// ═══════════════════════════════════════
function initStoreFilters() {
    const chips = document.querySelectorAll('.filter-chip');
    const cards = document.querySelectorAll('.product-card');
    if (!chips.length) return;

    chips.forEach(chip => {
        chip.addEventListener('click', () => {
            chips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            const filter = chip.dataset.filter;

            cards.forEach(card => {
                const show = filter === 'all' || card.dataset.category === filter;
                card.style.transition = 'opacity 0.3s, transform 0.3s';
                if (show) {
                    card.style.display = 'flex';
                    requestAnimationFrame(() => {
                        card.style.opacity = '1';
                        card.style.transform = '';
                    });
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.95)';
                    setTimeout(() => { card.style.display = 'none'; }, 300);
                }
            });
        });
    });
}

// ═══════════════════════════════════════
// 7. GIFT WIZARD
// ═══════════════════════════════════════
function initGiftQuiz() {
    const wizard = document.getElementById('gift-wizard');
    if (!wizard) return;

    const quizData = [
        {
            question: "لمن تريد شراء هذه الهدية الموسيقية؟",
            options: [
                { text: "🎓  مبتدئ يبدأ رحلته الموسيقية", next: 1 },
                { text: "🎸  عازف متمرس أو محترف", next: 2 }
            ]
        },
        {
            question: "ما نوع الآلة التي يفضلها؟",
            options: [
                { text: "🪕  آلات وترية (عود، جيتار، قانون)",
                  recommendation: "🎯 ريشة عود احترافية مع علبة حماية فاخرة وجهاز دوزان رقمي ذكي — مجموعة مثالية لمن يبدأ رحلته مع العود." },
                { text: "🥁  آلات إيقاعية أو كيبورد",
                  recommendation: "🎯 حامل نوتات موسيقية معدني مع سماعات استوديو مغلقة عازلة للصوت — الأساس المثالي للإيقاع والأداء." }
            ]
        },
        {
            question: "ما مجال اهتمامه الموسيقي الرئيسي؟",
            options: [
                { text: "🎤  الأداء الحي على المسرح",
                  recommendation: "🎯 قسيمة شراء بلاتينية بقيمة 100 د.أ — الخيار الأمثل الذي يمنحه حرية اقتناء ما يحتاجه بنفسه من متجر موسيقاتي." },
                { text: "🎛️  تسجيل الموسيقى وهندسة الصوت",
                  recommendation: "🎯 حزمة أسلاك توصيل XLR مطلية بالذهب مع عازل صوتي للميكروفون — جودة استوديو احترافية لمن يصنع الأصوات." }
            ]
        }
    ];

    let currentStep = 0;
    const questionEl  = wizard.querySelector('#wizard-question-text');
    const optsEl      = wizard.querySelector('#wizard-opts-container');

    function renderStep(stepIndex) {
        const step = quizData[stepIndex];

        // Fade transition
        optsEl.style.opacity = '0';
        optsEl.style.transform = 'translateY(10px)';

        // Update step dots
        wizard.querySelectorAll('.step-dot').forEach((dot, i) => {
            dot.classList.toggle('active', i <= stepIndex);
        });
        wizard.querySelectorAll('.step-connector').forEach((con, i) => {
            con.classList.toggle('done', i < stepIndex);
        });

        setTimeout(() => {
            questionEl.textContent = step.question;
            optsEl.innerHTML = '';
            step.options.forEach(opt => {
                const btn = document.createElement('button');
                btn.className = 'wizard-opt';
                btn.innerHTML = `<span>${opt.text}</span><i class="fa-solid fa-arrow-left wizard-opt-icon"></i>`;
                btn.addEventListener('click', () => {
                    if (opt.recommendation) {
                        showRecommendation(opt.recommendation);
                    } else {
                        currentStep = opt.next;
                        renderStep(currentStep);
                    }
                });
                optsEl.appendChild(btn);
            });

            requestAnimationFrame(() => {
                optsEl.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                optsEl.style.opacity = '1';
                optsEl.style.transform = 'translateY(0)';
            });
        }, 200);
    }

    function showRecommendation(text) {
        wizard.querySelectorAll('.step-dot').forEach(d => d.classList.add('active'));
        wizard.querySelectorAll('.step-connector').forEach(c => c.classList.add('done'));

        optsEl.style.opacity = '0';
        setTimeout(() => {
            questionEl.textContent = '✨ توصيتنا الذكية لك:';
            optsEl.innerHTML = `
                <div style="text-align:center;padding:20px 0">
                    <div style="background:rgba(0,229,255,0.07);border:1px solid rgba(0,229,255,0.25);border-radius:16px;padding:22px;margin-bottom:22px;line-height:1.8;font-size:1.05rem;">${text}</div>
                    <button class="btn btn-outline-gold" id="wizard-restart" style="font-family:var(--font-ar)">ابدأ مجدداً <i class="fa-solid fa-rotate-right"></i></button>
                </div>
            `;
            optsEl.style.opacity = '1';
            optsEl.style.transform = 'translateY(0)';
            document.getElementById('wizard-restart').addEventListener('click', () => {
                currentStep = 0;
                renderStep(0);
            });
        }, 200);
    }

    renderStep(0);
}

// ═══════════════════════════════════════
// 8. COUNTDOWN TIMER
// ═══════════════════════════════════════
function initCountdownTimer() {
    const daysEl    = document.getElementById('days');
    const hoursEl   = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');
    if (!daysEl) return;

    const target = new Date();
    target.setDate(target.getDate() + 14);

    let prevSec = -1;

    function tick() {
        const now  = Date.now();
        const diff = target.getTime() - now;
        if (diff <= 0) { daysEl.textContent = hoursEl.textContent = minutesEl.textContent = secondsEl.textContent = '00'; return; }

        const d = Math.floor(diff / 86400000);
        const h = Math.floor((diff % 86400000) / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        const s = Math.floor((diff % 60000) / 1000);

        daysEl.textContent    = String(d).padStart(2, '0');
        hoursEl.textContent   = String(h).padStart(2, '0');
        minutesEl.textContent = String(m).padStart(2, '0');

        // Animate seconds flip
        if (s !== prevSec) {
            prevSec = s;
            secondsEl.textContent = String(s).padStart(2, '0');
            secondsEl.style.animation = 'none';
            requestAnimationFrame(() => {
                secondsEl.style.animation = 'fadeInUp 0.3s ease';
            });
        }
    }
    tick();
    setInterval(tick, 1000);
}

// ═══════════════════════════════════════
// 9. SCRATCH CARD
// ═══════════════════════════════════════
function initScratchCard() {
    const card = document.querySelector('.scratch-card');
    if (!card) return;
    card.addEventListener('click', () => {
        if (!card.classList.contains('revealed')) {
            card.classList.add('revealed');
            showToast('🎉 تهانينا! تم كشف الخصم السري', 'gold');
        }
    });
}

// ═══════════════════════════════════════
// 10. CONTACT FORM VALIDATION
// ═══════════════════════════════════════
function initContactForm() {
    const form  = document.getElementById('contact-form');
    const modal = document.getElementById('success-modal');
    const closeBtn = document.getElementById('close-modal-btn');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        clearErrors();
        let valid = true;

        const name    = document.getElementById('name');
        const email   = document.getElementById('email');
        const phone   = document.getElementById('phone');
        const message = document.getElementById('message');

        if (!name || name.value.trim().length < 3) {
            showFieldError('err-name', 'الرجاء إدخال الاسم الكامل (3 أحرف على الأقل)');
            valid = false;
        }
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
            showFieldError('err-email', 'الرجاء إدخال بريد إلكتروني صحيح');
            valid = false;
        }
        if (!phone || !/^(079|078|077)\d{7}$/.test(phone.value)) {
            showFieldError('err-phone', 'الرجاء إدخال رقم أردني صحيح (079/078/077 + 7 أرقام)');
            valid = false;
        }
        if (!message || message.value.trim().length < 10) {
            showFieldError('err-message', 'الرجاء كتابة رسالتك بوضوح (10 أحرف على الأقل)');
            valid = false;
        }

        if (valid && modal) {
            modal.classList.add('active');
            form.reset();
        }
    });

    if (closeBtn && modal) {
        closeBtn.addEventListener('click', () => modal.classList.remove('active'));
        modal.addEventListener('click', e => { if (e.target === modal) modal.classList.remove('active'); });
    }
}

function showFieldError(id, msg) {
    const el = document.getElementById(id);
    if (el) { el.textContent = msg; el.style.display = 'block'; }
}
function clearErrors() {
    document.querySelectorAll('.err-msg').forEach(e => { e.style.display = 'none'; e.textContent = ''; });
}

// ═══════════════════════════════════════
// 11. LOGIN MODAL
// ═══════════════════════════════════════
function initLoginModal() {
    const openBtns  = document.querySelectorAll('[data-open-login]');
    const loginModal = document.getElementById('login-modal-overlay');
    const closeBtns  = document.querySelectorAll('[data-close-modal]');
    const tabs        = document.querySelectorAll('.login-tab');
    const loginPanel  = document.getElementById('login-panel');
    const registerPanel = document.getElementById('register-panel');

    if (!loginModal) return;

    openBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            loginModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    closeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            loginModal.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    loginModal.addEventListener('click', e => {
        if (e.target === loginModal) {
            loginModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Tabs (login vs register)
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const target = tab.dataset.tab;
            if (loginPanel)    loginPanel.style.display    = target === 'login' ? 'block' : 'none';
            if (registerPanel) registerPanel.style.display = target === 'register' ? 'block' : 'none';
        });
    });

    // Handle login form submit (demo)
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', e => {
            e.preventDefault();
            const btn = loginForm.querySelector('.btn-login-submit');
            btn.textContent = '⏳ جاري تسجيل الدخول...';
            btn.disabled = true;
            setTimeout(() => {
                loginModal.classList.remove('active');
                document.body.style.overflow = '';
                btn.textContent = 'تسجيل الدخول';
                btn.disabled = false;
                showToast('🎵 أهلاً بك في موسيقاتي!', 'gold');
            }, 1800);
        });
    }

    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', e => {
            e.preventDefault();
            const btn = registerForm.querySelector('.btn-login-submit');
            btn.textContent = '⏳ جاري إنشاء الحساب...';
            btn.disabled = true;
            setTimeout(() => {
                loginModal.classList.remove('active');
                document.body.style.overflow = '';
                btn.textContent = 'إنشاء حساب';
                btn.disabled = false;
                showToast('✅ تم إنشاء حسابك بنجاح!', 'cyan');
            }, 1800);
        });
    }
}

// ═══════════════════════════════════════
// 12. HERO PARALLAX BG
// ═══════════════════════════════════════
function initHeroBg() {
    const heroBg = document.querySelector('.hero-bg');
    if (!heroBg) return;
    heroBg.classList.add('loaded');
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        heroBg.style.transform = `translateY(${scrolled * 0.25}px)`;
    }, { passive: true });
}

// ═══════════════════════════════════════
// 13. ADD TO CART ANIMATION
// ═══════════════════════════════════════
function initCartButtons() {
    document.querySelectorAll('.btn-cart').forEach(btn => {
        btn.addEventListener('click', () => {
            btn.innerHTML = '<i class="fa-solid fa-check"></i>';
            btn.style.background = 'var(--gold)';
            btn.style.color = '#000';
            btn.style.borderColor = 'var(--gold)';
            setTimeout(() => {
                btn.innerHTML = '<i class="fa-solid fa-cart-shopping"></i>';
                btn.style.background = '';
                btn.style.color = '';
                btn.style.borderColor = '';
            }, 1500);
            showToast('🛒 تمت الإضافة إلى السلة', 'gold');
        });
    });
}

// ═══════════════════════════════════════
// 14. TOAST NOTIFICATION
// ═══════════════════════════════════════
function showToast(message, type = 'gold') {
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    const icon  = type === 'gold' ? '✨' : '💎';
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `<span class="toast-icon">${icon}</span><span class="toast-text">${message}</span>`;
    container.appendChild(toast);

    requestAnimationFrame(() => {
        requestAnimationFrame(() => toast.classList.add('show'));
    });

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}
