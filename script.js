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

    // --- Back to Top Button ---
    const backToTopBtn = document.getElementById('back-to-top');

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
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
    const body = document.body;
    const header = document.getElementById('main-header');

    // Check for saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'moonlit') {
        body.classList.add('moonlit-theme');
        if (themeToggle) themeToggle.textContent = '🌙';
    }

    function updateHeaderStyle() {
        if (window.scrollY > 50) {
            header.style.padding = '5px 0';
            header.style.background = body.classList.contains('moonlit-theme')
                ? 'rgba(10, 31, 8, 0.98)'
                : 'rgba(255, 255, 255, 0.98)';
        } else {
            header.style.padding = '10px 0';
            header.style.background = body.classList.contains('moonlit-theme')
                ? 'rgba(10, 31, 8, 0.95)'
                : 'rgba(255, 255, 255, 0.95)';
        }
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            body.classList.toggle('moonlit-theme');
            const isMoonlit = body.classList.contains('moonlit-theme');
            localStorage.setItem('theme', isMoonlit ? 'moonlit' : 'sunny');
            themeToggle.textContent = isMoonlit ? '🌙' : '☀️';
            updateHeaderStyle();
        });
    }

    // --- Sound Toggle ---
    const soundToggle = document.getElementById('sound-toggle');
    const ambientSound = document.getElementById('ambient-sound');
    let isPlaying = false;

    if (soundToggle && ambientSound) {
        ambientSound.volume = 0.1;
        let playTimeout;
        let pauseTimeout;

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
                    // Retry after a delay if it failed (could be due to user interaction policy)
                    playTimeout = setTimeout(playIntermittent, 5000);
                });
        }

        function stopIntermittent() {
            isPlaying = false;
            clearTimeout(playTimeout);
            clearTimeout(pauseTimeout);
            ambientSound.pause();
            ambientSound.currentTime = 0; // Reset to start
        }

        soundToggle.addEventListener('click', () => {
            if (!isPlaying) {
                isPlaying = true;
                soundToggle.textContent = '🔊';
                playIntermittent();
            } else {
                stopIntermittent();
                soundToggle.textContent = '🔇';
            }
        });
    }

    // Update Header on Scroll
    window.addEventListener('scroll', updateHeaderStyle);

    // Initial header style
    updateHeaderStyle();

    // --- Lazy Loading Images (Basic Implementation) ---
    // Note: Most modern browsers support loading="lazy" in HTML.
    // This is a subtle animation for sections appearing on scroll.
    const sections = document.querySelectorAll('.section');
    const observerOptions = {
        threshold: 0.1
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });
});
