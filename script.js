document.addEventListener('DOMContentLoaded', () => {
    // --- Reveal Animation on Scroll ---
    const reveals = document.querySelectorAll('.reveal');
    
    const revealOnScroll = () => {
        reveals.forEach(reveal => {
            const windowHeight = window.innerHeight;
            const elementTop = reveal.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < windowHeight - elementVisible) {
                reveal.classList.add('revealed');
            }
        });
    };
    
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Initial check

    // --- FAQ Functionality ---
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const faqItem = question.parentElement;
            const faqAnswer = question.nextElementSibling;
            
            // Close other FAQ items
            document.querySelectorAll('.faq-item').forEach(item => {
                if (item !== faqItem) {
                    item.classList.remove('active');
                    item.querySelector('.faq-answer').style.maxHeight = null;
                    item.querySelector('.faq-answer').style.paddingBottom = null;
                }
            });
            
            // Toggle current item
            faqItem.classList.toggle('active');
            
            if (faqItem.classList.contains('active')) {
                faqAnswer.style.maxHeight = faqAnswer.scrollHeight + "px";
                faqAnswer.style.paddingBottom = "30px";
            } else {
                faqAnswer.style.maxHeight = null;
                faqAnswer.style.paddingBottom = null;
            }
        });
    });

    // --- Animated Number Counters ---
    const statsNumbers = document.querySelectorAll('.stat-number');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const countTo = parseInt(target.getAttribute('data-target'));
                let current = 0;
                const duration = 2000; // 2 seconds
                const increment = countTo / (duration / 16); // 60fps
                
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= countTo) {
                        target.innerText = countTo;
                        clearInterval(timer);
                    } else {
                        target.innerText = Math.floor(current);
                    }
                }, 16);
                counterObserver.unobserve(target); // Only animate once
            }
        });
    }, { threshold: 0.5 });

    statsNumbers.forEach(num => counterObserver.observe(num));

    // --- Team Member Toggle (Mobile) ---
    const teamCards = document.querySelectorAll('.team-card');
    teamCards.forEach(card => {
        card.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                // Close others
                teamCards.forEach(c => {
                    if (c !== card) c.classList.remove('active');
                });
                // Toggle current
                card.classList.toggle('active');
            }
        });
    });

    // --- Strengths/Why Us Points Switcher ---
    const strengthSections = document.querySelectorAll('.strengths-section');
    
    strengthSections.forEach(section => {
        const items = section.querySelectorAll('.point-item');
        const img = section.querySelector('.strength-img');
        const infoText = section.querySelector('.strength-info-card p');
        let currentIndex = 0;
        let interval;
        const duration = 5000; // 5 seconds per point

        const updateSection = (index) => {
            // Remove active classes
            items.forEach(item => {
                item.classList.remove('active');
                item.classList.add('inactive');
                const bar = item.querySelector('.point-progress-bar');
                if (bar) bar.style.width = '0%';
            });

            // Set current active
            const activeItem = items[index];
            activeItem.classList.add('active');
            activeItem.classList.remove('inactive');
            
            // Update Visuals
            const newImg = activeItem.getAttribute('data-img');
            const newText = activeItem.getAttribute('data-text');
            
            if (img) {
                img.style.opacity = '0';
                setTimeout(() => {
                    img.src = newImg;
                    img.style.opacity = '1';
                }, 300);
            }
            if (infoText) infoText.innerText = newText;

            // Restart progress bar animation
            const progressBar = activeItem.querySelector('.point-progress-bar');
            if (progressBar) {
                progressBar.style.transition = 'none';
                progressBar.style.width = '0%';
                setTimeout(() => {
                    progressBar.style.transition = `width ${duration}ms linear`;
                    progressBar.style.width = '100%';
                }, 50);
            }
            
            currentIndex = index;
        };

        const startInterval = () => {
            clearInterval(interval);
            interval = setInterval(() => {
                let next = (currentIndex + 1) % items.length;
                updateSection(next);
            }, duration);
        };

        // Click events
        items.forEach((item, index) => {
            item.addEventListener('click', () => {
                updateSection(index);
                startInterval(); // Reset timer on click
            });
        });

        // Initialize (if section has items)
        if (items.length > 0) {
            updateSection(0);
            startInterval();
        }
    });

    // --- Floating CTA: scroll to hero form ---
    const scrollBtn = document.getElementById('scroll-down-btn');
    if (scrollBtn) {
        scrollBtn.addEventListener('click', (e) => {
            const form = document.getElementById('hero-contact-form');
            if (form) {
                form.scrollIntoView({ behavior: 'smooth', block: 'center' });
                const firstInput = form.querySelector('input, select, textarea, button');
                if (firstInput) {
                    try { firstInput.focus({ preventScroll: true }); } catch (err) { firstInput.focus(); }
                }
            }
        });
    }
});
