document.addEventListener('DOMContentLoaded', () => {
    // --- Mobile Menu Toggle ---
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenu) {
        mobileMenu.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileMenu.classList.toggle('toggle');
        });
    }

    // --- Smooth Scrolling for Navigation ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                // Close mobile menu if open
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    mobileMenu.classList.remove('toggle');
                }

                window.scrollTo({
                    top: targetElement.offsetTop - 70, // Adjust for fixed header
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- Scroll Handling (Back to Top & Scroll Indicator) ---
    const backToTopBtn = document.getElementById('back-to-top');
    const scrollIndicator = document.querySelector('.scroll-indicator');

    window.addEventListener('scroll', () => {
        // Back to Top button visibility
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }

        // Scroll indicator visibility
        if (scrollIndicator) {
            if (window.pageYOffset > 50) {
                scrollIndicator.style.opacity = '0';
                scrollIndicator.style.pointerEvents = 'none';
            } else {
                scrollIndicator.style.opacity = '1';
                scrollIndicator.style.pointerEvents = 'auto';
            }
        }
    });

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // --- Contact Form Submission ---
    const contactForm = document.getElementById('contact-form');

    if (contactForm) {
        const membershipCheckbox = document.getElementById('membership-interest');
        const queryTextarea = document.getElementById('query');
        const membershipText = `Dear NUA Managing Committee,\nI am an owner in Utopia Layout and would like to express my interest in becoming a member of NUA. I value fairness, transparency, open communication, and cost optimization, and I believe in contributing to the community with these principles.\nKindly share the membership form and details of the process. I will complete the form and provide the required documents promptly.`;

        if (membershipCheckbox && queryTextarea) {
            membershipCheckbox.addEventListener('change', () => {
                if (membershipCheckbox.checked) {
                    queryTextarea.value = membershipText;
                } else {
                    if (queryTextarea.value.trim() === membershipText.trim()) {
                        queryTextarea.value = '';
                    }
                }
            });
        }

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // In a real scenario, you might send data to a server here.
            // For now, we redirect to a dummy Google Form as requested.
            const dummyGoogleFormUrl = 'https://forms.gle/dummy-contact-form'; // Replace with actual link later

            console.log('Form submitted. Redirecting to Google Form...');

            // Optional: Show a success message before redirecting
            const btn = contactForm.querySelector('button');
            const originalText = btn.textContent;
            btn.textContent = 'Redirecting...';
            btn.disabled = true;

            setTimeout(() => {
                window.location.href = dummyGoogleFormUrl;
            }, 1000);
        });
    }

    // --- Theme Toggle ---
    const themeToggle = document.getElementById('theme-toggle');
    const themeToggleMobile = document.getElementById('theme-toggle-mobile');
    const body = document.body;
    const header = document.getElementById('main-header');

    // Default to moonlit if no theme is saved
    const savedTheme = localStorage.getItem('theme') || 'moonlit';

    if (savedTheme === 'moonlit') {
        body.classList.add('moonlit-theme');
    } else {
        body.classList.remove('moonlit-theme');
    }

    function updateThemeIcons(isMoonlit) {
        const icon = isMoonlit ? '🌙' : '☀️';
        if (themeToggle) themeToggle.textContent = icon;
        if (themeToggleMobile) themeToggleMobile.textContent = icon;
    }

    function updateHeaderStyle() {
        if (!header) return;
        const isMoonlit = body.classList.contains('moonlit-theme');
        if (window.scrollY > 50) {
            header.style.padding = '5px 0';
            header.style.background = isMoonlit
                ? 'rgba(10, 31, 8, 0.98)'
                : 'rgba(255, 255, 255, 0.98)';
        } else {
            header.style.padding = '10px 0';
            header.style.background = isMoonlit
                ? 'rgba(10, 31, 8, 0.95)'
                : 'rgba(255, 255, 255, 0.95)';
        }
    }

    function toggleTheme() {
        body.classList.toggle('moonlit-theme');
        const isMoonlit = body.classList.contains('moonlit-theme');
        localStorage.setItem('theme', isMoonlit ? 'moonlit' : 'sunny');
        updateThemeIcons(isMoonlit);
        updateHeaderStyle();
    }

    if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
    if (themeToggleMobile) themeToggleMobile.addEventListener('click', toggleTheme);

    // Initial state
    updateThemeIcons(body.classList.contains('moonlit-theme'));
    updateHeaderStyle();

    // --- Sound Toggle ---
    const soundToggle = document.getElementById('sound-toggle');
    const soundToggleMobile = document.getElementById('sound-toggle-mobile');
    const ambientSound = document.getElementById('ambient-sound');
    let isPlaying = false;

    if (ambientSound) {
        ambientSound.volume = 1.0; // Increased volume
        let playTimeout;
        let pauseTimeout;

        function updateSoundIcons(playing) {
            const icon = playing ? '🔊' : '🔇';
            if (soundToggle) soundToggle.textContent = icon;
            if (soundToggleMobile) soundToggleMobile.textContent = icon;
        }

        function playIntermittent() {
            if (!isPlaying) return;

            ambientSound.play()
                .then(() => {
                    const playDuration = 5000 + Math.random() * 3000;
                    pauseTimeout = setTimeout(() => {
                        if (isPlaying) {
                            ambientSound.pause();
                            const silenceDuration = 10000 + Math.random() * 5000;
                            playTimeout = setTimeout(playIntermittent, silenceDuration);
                        }
                    }, playDuration);
                })
                .catch(err => {
                    console.log("Audio play failed:", err);
                    playTimeout = setTimeout(playIntermittent, 5000);
                });
        }

        function stopIntermittent() {
            isPlaying = false;
            clearTimeout(playTimeout);
            clearTimeout(pauseTimeout);
            ambientSound.pause();
            ambientSound.currentTime = 0;
            updateSoundIcons(false);
        }

        function toggleSound() {
            if (!isPlaying) {
                isPlaying = true;
                updateSoundIcons(true);
                ambientSound.load(); // Ensure it's loaded
                playIntermittent();
            } else {
                stopIntermittent();
            }
        }

        if (soundToggle) soundToggle.addEventListener('click', toggleSound);
        if (soundToggleMobile) soundToggleMobile.addEventListener('click', toggleSound);
    }

    // Update Header on Scroll
    window.addEventListener('scroll', updateHeaderStyle);

    // Initial header style
    updateHeaderStyle();

    // --- Intersection Observer for Animations ---
    const animatedElements = document.querySelectorAll('.section, .animate-slide-up');
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const elementObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => {
        elementObserver.observe(el);
    });
});
