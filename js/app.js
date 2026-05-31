/* 
   MOSIQATI (موسيقاتي) - Application Logic JS
   Created for Pearson BTEC Level 2 - Unit 7: Website Development
   Controls interactive behaviors, filters, form validation, and animations.
*/

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initStoreFilters();
    initGiftQuiz();
    initCountdownTimer();
    initScratchCard();
    initContactForm();
});

/* 1. Mobile Navigation Menu Toggle */
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
}

/* 2. Store Products Filter Logic */
function initStoreFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');

    if (filterButtons.length > 0 && productCards.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Set active button style
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                const filterValue = button.getAttribute('data-filter');

                productCards.forEach(card => {
                    if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                        card.style.display = 'flex';
                        // Add fade-in transition
                        card.style.opacity = '0';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 50);
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }
}

/* 3. Gifts Wizard / Recommendation Logic */
function initGiftQuiz() {
    const wizardBox = document.getElementById('gift-wizard');
    if (!wizardBox) return;

    const quizData = [
        {
            question: "لمن تشتري الهدية؟",
            options: [
                { text: "مبتدئ يبدأ رحلته الموسيقية", next: 1 },
                { text: "عازف متمرس أو محترف", next: 2 }
            ]
        },
        {
            question: "ما نوع الآلة المفضلة لديه؟",
            options: [
                { text: "آلات وترية (مثل العود أو الجيتار)", recommendation: "ريشة عود احترافية مع علبة حماية فاخرة وجهاز دوزان رقمي." },
                { text: "آلات إيقاعية أو كيبورد", recommendation: "حامل نوتات موسيقية معدني قابل للطي مع سماعات استوديو مغلقة." }
            ]
        },
        {
            question: "ما هو مجال اهتمامه الموسيقي الرئيسي؟",
            options: [
                { text: "العزف الحي والأداء على المسرح", recommendation: "قسيمة شراء بلاتينية بقيمة 100 د.أ تمكنه من اختيار إكسسواراته بنفسه." },
                { text: "تسجيل الموسيقى وهندسة الصوت", recommendation: "حزمة أسلاك توصيل احترافية مطلية بالذهب مع عازل صوتي للميكروفون." }
            ]
        }
    ];

    let currentStep = 0;
    let stepHistory = [];

    function renderStep(stepIndex) {
        const stepData = quizData[stepIndex];
        const stepNodes = document.querySelectorAll('.step-node');
        
        // Update indicator nodes
        stepNodes.forEach((node, idx) => {
            if (idx <= stepIndex) {
                node.classList.add('active');
            } else {
                node.classList.remove('active');
            }
        });

        const questionEl = wizardBox.querySelector('.wizard-question');
        const optionsEl = wizardBox.querySelector('.wizard-options');

        questionEl.textContent = stepData.question;
        optionsEl.innerHTML = '';

        stepData.options.forEach(option => {
            const btn = document.createElement('div');
            btn.className = 'wizard-option';
            btn.textContent = option.text;
            btn.addEventListener('click', () => {
                if (option.recommendation) {
                    showRecommendation(option.recommendation);
                } else if (option.next !== undefined) {
                    stepHistory.push(currentStep);
                    currentStep = option.next;
                    renderStep(currentStep);
                }
            });
            optionsEl.appendChild(btn);
        });
    }

    function showRecommendation(recText) {
        const questionEl = wizardBox.querySelector('.wizard-question');
        const optionsEl = wizardBox.querySelector('.wizard-options');
        
        // Finalize steps styling
        document.querySelectorAll('.step-node').forEach(node => node.classList.add('active'));

        questionEl.textContent = "توصيتنا المثالية لك:";
        optionsEl.innerHTML = `
            <div style="text-align: center; padding: 20px 0;">
                <p style="font-size: 1.15rem; line-height: 1.8; margin-bottom: 25px; color: #00e5ff;">${recText}</p>
                <button class="btn btn-primary" id="restart-wizard">ابدأ من جديد</button>
            </div>
        `;

        document.getElementById('restart-wizard').addEventListener('click', () => {
            currentStep = 0;
            stepHistory = [];
            renderStep(currentStep);
        });
    }

    renderStep(currentStep);
}

/* 4. Countdown Timer for Special Offers */
function initCountdownTimer() {
    const timerDays = document.getElementById('days');
    const timerHours = document.getElementById('hours');
    const timerMinutes = document.getElementById('minutes');
    const timerSeconds = document.getElementById('seconds');

    if (timerDays && timerHours && timerMinutes && timerSeconds) {
        // Set target date: 15 days from now
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + 14);

        function updateTimer() {
            const now = new Date().getTime();
            const distance = targetDate.getTime() - now;

            if (distance < 0) {
                clearInterval(interval);
                document.querySelector('.countdown-container h2').textContent = "انتهى العرض الخاص!";
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            // Pad values with leading zeros
            timerDays.textContent = String(days).padStart(2, '0');
            timerHours.textContent = String(hours).padStart(2, '0');
            timerMinutes.textContent = String(minutes).padStart(2, '0');
            timerSeconds.textContent = String(seconds).padStart(2, '0');
        }

        updateTimer(); // run once immediately
        const interval = setInterval(updateTimer, 1000);
    }
}

/* 5. Scratch/Click Reveal Discount Code */
function initScratchCard() {
    const scratchCard = document.querySelector('.scratch-card');
    if (scratchCard) {
        scratchCard.addEventListener('click', () => {
            if (!scratchCard.classList.contains('revealed')) {
                scratchCard.classList.add('revealed');
                // Optional: play an acoustic note sound if desired, or simple alert trigger
            }
        });
    }
}

/* 6. Form Validation & Popup Confirmation */
function initContactForm() {
    const form = document.getElementById('contact-form');
    const modal = document.getElementById('success-modal');
    const closeModalBtn = document.getElementById('close-modal');

    if (form && modal) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            let isValid = true;

            // Simple validation rules
            const name = document.getElementById('name');
            const email = document.getElementById('email');
            const phone = document.getElementById('phone');
            const message = document.getElementById('message');

            // Reset error messages
            document.querySelectorAll('.validation-msg').forEach(msg => msg.style.display = 'none');

            if (name && name.value.trim().length < 3) {
                showError(name, 'الرجاء إدخال الاسم كاملاً (3 أحرف على الأقل)');
                isValid = false;
            }

            if (email && !validateEmail(email.value)) {
                showError(email, 'الرجاء إدخال بريد إلكتروني صحيح');
                isValid = false;
            }

            if (phone && !validatePhone(phone.value)) {
                showError(phone, 'الرجاء إدخال رقم هاتف أردني صحيح (مثال: 079xxxxxxx)');
                isValid = false;
            }

            if (message && message.value.trim().length < 10) {
                showError(message, 'الرجاء كتابة رسالتك بوضوح (10 أحرف على الأقل)');
                isValid = false;
            }

            if (isValid) {
                // Display user form values on terminal log or show success modal
                console.log(`Contact Inquiry Submitted: Name: ${name.value}, Email: ${email.value}`);
                
                // Show Custom modal
                modal.classList.add('active');
                
                // Reset form
                form.reset();
            }
        });

        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', () => {
                modal.classList.remove('active');
            });
        }

        // Close modal when clicking outer backdrop
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    }
}

function showError(inputEl, errorText) {
    const group = inputEl.closest('.form-group');
    if (group) {
        const errorEl = group.querySelector('.validation-msg');
        if (errorEl) {
            errorEl.textContent = errorText;
            errorEl.style.display = 'block';
        }
    }
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

function validatePhone(phone) {
    // Validates Jordanian mobile numbers format: e.g. 079, 078, 077 followed by 7 digits
    const re = /^(079|078|077)\d{7}$/;
    return re.test(phone);
}
