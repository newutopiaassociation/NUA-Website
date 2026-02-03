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
        if (backToTopBtn) {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
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
            // Standard form submission to Google Forms
            const btn = contactForm.querySelector('button');
            btn.textContent = 'Submitting...';
            btn.style.opacity = '0.7';
            btn.disabled = true;
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

    // --- PDF Viewer Logic ---
    const pdfUrl = 'assets/nua-byelaws.pdf';
    let pdfDoc = null;
    let pageNum = 1;
    let pageRendering = false;
    let pageNumPending = null;
    let scale = 1.2;
    const canvas = document.getElementById('pdf-render-canvas');
    const ctx = canvas ? canvas.getContext('2d') : null;

    // Elements
    const pageNumDisplay = document.getElementById('page-num');
    const pageCountDisplay = document.getElementById('page-count');
    const pageNumTop = document.getElementById('page-num-top');
    const pageJumpInput = document.getElementById('page-jump');
    const zoomPercentDisplay = document.getElementById('zoom-percent');
    const thumbnailList = document.getElementById('thumbnail-list');
    const searchResults = document.getElementById('search-results');
    const tabThumbnails = document.getElementById('tab-thumbnails');
    const tabSearch = document.getElementById('tab-search');

    // Advanced Search State
    let allMatches = [];
    let currentMatchIndex = -1;
    let isSearching = false;

    function renderPage(num) {
        if (!pdfDoc || !canvas) return;
        pageRendering = true;

        // Using promise to fetch the page
        pdfDoc.getPage(num).then(page => {
            const viewport = page.getViewport({ scale: scale });
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            // Render PDF page into canvas context
            const renderContext = {
                canvasContext: ctx,
                viewport: viewport
            };
            const renderTask = page.render(renderContext);

            // Wait for rendering to finish
            renderTask.promise.then(() => {
                pageRendering = false;

                // Render Text Layer for Highlights
                renderTextLayer(page, viewport);

                if (pageNumPending !== null) {
                    renderPage(pageNumPending);
                    pageNumPending = null;
                }
                updateThumbnailActiveState(num);
            });
        });

        // Update page counters
        pageNumDisplay.textContent = num;
        if (pageNumTop) pageNumTop.textContent = `Page ${num} of ${pdfDoc.numPages}`;
        if (pageJumpInput) pageJumpInput.value = num;
    }

    function queueRenderPage(num) {
        if (pageRendering) {
            pageNumPending = num;
        } else {
            renderPage(num);
        }
    }

    function onPrevPage() {
        if (pageNum <= 1) return;
        pageNum--;
        queueRenderPage(pageNum);
    }

    function onNextPage() {
        if (!pdfDoc || pageNum >= pdfDoc.numPages) return;
        pageNum++;
        queueRenderPage(pageNum);
    }

    function onZoomOut() {
        if (scale <= 0.5) return;
        scale -= 0.2;
        updateZoom();
    }

    function onZoomIn() {
        if (scale >= 3.0) return;
        scale += 0.2;
        updateZoom();
    }

    function updateZoom() {
        if (zoomPercentDisplay) zoomPercentDisplay.textContent = `${Math.round(scale * 100)}%`;
        renderPage(pageNum);
    }

    function generateThumbnails() {
        if (!pdfDoc || !thumbnailList) return;
        thumbnailList.innerHTML = '';

        for (let i = 1; i <= pdfDoc.numPages; i++) {
            const thumbItem = document.createElement('div');
            thumbItem.className = 'thumbnail-item';
            thumbItem.dataset.page = i;
            thumbItem.innerHTML = `<canvas id="thumb-${i}"></canvas><div class="page-label">${i}</div>`;
            thumbnailList.appendChild(thumbItem);

            pdfDoc.getPage(i).then(page => {
                const thumbCanvas = document.getElementById(`thumb-${i}`);
                if (!thumbCanvas) return;
                const thumbCtx = thumbCanvas.getContext('2d');
                const viewport = page.getViewport({ scale: 0.36 }); // Reduced by 10% from 0.4
                thumbCanvas.height = viewport.height;
                thumbCanvas.width = viewport.width;

                page.render({
                    canvasContext: thumbCtx,
                    viewport: viewport
                });
            });

            thumbItem.addEventListener('click', () => {
                pageNum = i;
                queueRenderPage(pageNum);
            });
        }
        updateThumbnailActiveState(pageNum);
    }

    function updateThumbnailActiveState(num) {
        if (!thumbnailList) return;
        const items = thumbnailList.querySelectorAll('.thumbnail-item');
        items.forEach(item => {
            if (parseInt(item.dataset.page) === num) {
                item.classList.add('active');
                item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            } else {
                item.classList.remove('active');
            }
        });
    }

    // Advanced Search Logic
    async function searchPdf(query) {
        if (!pdfDoc || !query || isSearching) return;
        isSearching = true;
        query = query.toLowerCase();

        const searchBtn = document.getElementById('pdf-search-btn');
        const originalText = searchBtn ? searchBtn.textContent : '🔍';
        if (searchBtn) searchBtn.textContent = '⏳';

        allMatches = [];
        currentMatchIndex = -1;
        if (searchResults) searchResults.innerHTML = '<div class="searching">Searching entire document...</div>';

        // Show search tab
        tabSearch?.click();

        try {
            for (let i = 1; i <= pdfDoc.numPages; i++) {
                const page = await pdfDoc.getPage(i);
                const textContent = await page.getTextContent();
                const textItems = textContent.items.map(item => item.str);
                const fullText = textItems.join(' ');

                let lastIdx = 0;
                while (true) {
                    const idx = fullText.toLowerCase().indexOf(query, lastIdx);
                    if (idx === -1) break;

                    // Create snippet
                    const start = Math.max(0, idx - 40);
                    const end = Math.min(fullText.length, idx + query.length + 40);
                    let snippet = fullText.substring(start, end);

                    // Highlight query in snippet
                    const queryRegex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
                    snippet = (start > 0 ? '...' : '') + snippet.replace(queryRegex, '<mark>$1</mark>') + (end < fullText.length ? '...' : '');

                    allMatches.push({
                        page: i,
                        index: idx,
                        snippet: snippet
                    });

                    lastIdx = idx + query.length;
                }
            }

            displaySearchResults();

            if (allMatches.length > 0) {
                currentMatchIndex = 0;
                jumpToMatch(currentMatchIndex);
            } else {
                if (searchResults) searchResults.innerHTML = '<div class="no-results">No matches found.</div>';
                alert('No matches found for: ' + query);
            }
        } catch (err) {
            console.error('Search error:', err);
        } finally {
            isSearching = false;
            if (searchBtn) searchBtn.textContent = originalText;
        }
    }

    function displaySearchResults() {
        if (!searchResults) return;
        searchResults.innerHTML = '';

        allMatches.forEach((match, idx) => {
            const item = document.createElement('div');
            item.className = 'search-result-item';
            item.innerHTML = `
                <div class="result-page">Page ${match.page}</div>
                <div class="result-text">${match.snippet}</div>
            `;
            item.onclick = () => {
                currentMatchIndex = idx;
                jumpToMatch(idx);
            };
            searchResults.appendChild(item);
        });
    }

    function jumpToMatch(index) {
        if (index < 0 || index >= allMatches.length) return;
        const match = allMatches[index];

        // Mark active in sidebar
        const items = searchResults?.querySelectorAll('.search-result-item');
        items?.forEach((item, i) => {
            if (i === index) {
                item.classList.add('active');
                item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            } else {
                item.classList.remove('active');
            }
        });

        if (pageNum !== match.page) {
            pageNum = match.page;
            queueRenderPage(pageNum);
        } else {
            // Already on page, trigger highlight
            const textLayerDiv = document.querySelector('.textLayer');
            if (textLayerDiv) applyHighlights(textLayerDiv);
        }
    }

    async function renderTextLayer(page, viewport) {
        const canvasWrapper = document.getElementById('pdf-canvas-wrapper');
        if (!canvasWrapper) return;

        // Remove old text layer
        let textLayerDiv = canvasWrapper.querySelector('.textLayer');
        if (textLayerDiv) textLayerDiv.remove();

        textLayerDiv = document.createElement('div');
        textLayerDiv.className = 'textLayer';
        canvasWrapper.appendChild(textLayerDiv);

        const textContent = await page.getTextContent();
        const pdfjsLib = window.pdfjsLib;

        // Use the standard renderTextLayer from PDF.js
        await pdfjsLib.renderTextLayer({
            textContent: textContent,
            container: textLayerDiv,
            viewport: viewport,
            textDivs: []
        }).promise;

        applyHighlights(textLayerDiv);
    }

    function applyHighlights(container) {
        const query = document.getElementById('pdf-search-input')?.value.toLowerCase();
        if (!query) return;

        const spans = container.querySelectorAll('span');
        const queryRegex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');

        spans.forEach(span => {
            const text = span.textContent.toLowerCase();
            if (text.includes(query)) {
                span.innerHTML = span.textContent.replace(queryRegex, '<mark class="highlight">$1</mark>');
            }
        });
    }

    function onNextMatch() {
        if (allMatches.length === 0) return;
        currentMatchIndex = (currentMatchIndex + 1) % allMatches.length;
        jumpToMatch(currentMatchIndex);
    }

    function onPrevMatch() {
        if (allMatches.length === 0) return;
        currentMatchIndex = (currentMatchIndex - 1 + allMatches.length) % allMatches.length;
        jumpToMatch(currentMatchIndex);
    }

    // Security: Disable Right Click and common keys
    const viewerSection = document.getElementById('byelaws');
    if (viewerSection) {
        viewerSection.addEventListener('contextmenu', e => e.preventDefault());

        // Prevent key combos for Print/Save/Copy
        window.addEventListener('keydown', e => {
            if ((e.ctrlKey || e.metaKey) && (e.key === 'p' || e.key === 's' || e.key === 'c' || e.key === 'u')) {
                // If the user is in the byelaws section, block it
                const rect = viewerSection.getBoundingClientRect();
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    e.preventDefault();
                    // alert('Printing and downloading is restricted for this document.');
                }
            }
        });
    }

    // Initialize PDF.js
    if (window.pdfjsLib && canvas) {
        const pdfjsLib = window.pdfjsLib;
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

        pdfjsLib.getDocument(pdfUrl).promise.then(pdfDoc_ => {
            pdfDoc = pdfDoc_;
            if (pageCountDisplay) pageCountDisplay.textContent = pdfDoc.numPages;

            // Initial render
            renderPage(pageNum);
            generateThumbnails();
        }).catch(err => {
            console.error('Error loading PDF:', err);
            if (canvas) {
                ctx.font = '20px Outfit';
                ctx.fillStyle = '#2D5A27';
                ctx.textAlign = 'center';
                ctx.fillText('Please ensure assets/nua-byelaws.pdf exists.', canvas.width / 2 || 300, 100);
            }
        });

        // Event Listeners
        // Sidebar Tabs
        tabThumbnails?.addEventListener('click', () => {
            tabThumbnails.classList.add('active');
            tabSearch?.classList.remove('active');
            thumbnailList?.classList.remove('hidden');
            searchResults?.classList.add('hidden');
        });

        tabSearch?.addEventListener('click', () => {
            tabSearch.classList.add('active');
            tabThumbnails?.classList.remove('active');
            searchResults?.classList.remove('hidden');
            thumbnailList?.classList.add('hidden');
        });

        document.getElementById('search-prev')?.addEventListener('click', onPrevMatch);
        document.getElementById('search-next')?.addEventListener('click', onNextMatch);

        document.getElementById('prev-page')?.addEventListener('click', onPrevPage);
        document.getElementById('next-page')?.addEventListener('click', onNextPage);
        document.getElementById('zoom-in')?.addEventListener('click', onZoomIn);
        document.getElementById('zoom-out')?.addEventListener('click', onZoomOut);

        pageJumpInput?.addEventListener('change', (e) => {
            const val = parseInt(e.target.value);
            if (val >= 1 && val <= pdfDoc.numPages) {
                pageNum = val;
                queueRenderPage(pageNum);
            } else {
                e.target.value = pageNum; // Reset to current if invalid
            }
        });

        pageJumpInput?.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') {
                const val = parseInt(e.target.value);
                if (val >= 1 && val <= pdfDoc.numPages) {
                    pageNum = val;
                    queueRenderPage(pageNum);
                }
            }
        });

        // Search Events
        const searchInput = document.getElementById('pdf-search-input');
        const searchBtn = document.getElementById('pdf-search-btn');

        searchBtn?.addEventListener('click', () => {
            searchPdf(searchInput.value);
        });

        searchInput?.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') {
                searchPdf(searchInput.value);
            }
        });
    }
});
