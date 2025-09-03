document.addEventListener('DOMContentLoaded', () => {
    // --- Mobile Menu Toggle ---
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            // Show/hide the navigation menu
            navLinks.classList.toggle('active');
            // Animate the hamburger icon to an "X"
            menuToggle.classList.toggle('is-active');
        });
    }

    // --- Close menu when a link is clicked (for single-page navigation) ---
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                menuToggle.classList.remove('is-active');
            }
        });
    });

    // --- Refactored Card Generation ---

    /**
     * Creates an HTML card element for a tour or gallery item.
     * @param {object} item - The data object for the card (e.g., from virtualToursData).
     * @returns {HTMLElement} The generated card element.
     */
    function createTourCard(item) {
        // Create a wrapper to hold the card's place in the flex layout, preventing reflow on maximize.
        const placeholder = document.createElement('div');
        placeholder.className = 'card-placeholder';

        const card = document.createElement('div');
        card.className = 'iframe-tour-card';

        // Set the inner HTML of the actual card.
        card.innerHTML = `
                <div class="card-text-content">
                    <h3>${item.title}</h3>
                </div>
                <div class="card-iframe-wrapper">
                    <iframe
                        data-src="${item.iframeSrc}"
                        src=""
                        title="${item.title}"
                        allowfullscreen=""
                        loading="lazy"
                        referrerpolicy="no-referrer-when-downgrade"
                        allow="accelerometer; gyroscope">
                    </iframe>
                </div>
            <button class="card-maximize-btn" aria-label="Maximize view" title="Maximize">
                <span class="material-icons">fullscreen</span>
            </button>
            `;

        // Append the card to the placeholder and return the placeholder.
        placeholder.appendChild(card);
        return placeholder;
    }

    /**
     * Populates a grid container with cards generated from a data array.
     * @param {HTMLElement} gridElement - The container element to append cards to.
     * @param {Array} data - The array of data objects.
     */
    function populateGrid(gridElement, data) {
        if (gridElement && typeof data !== 'undefined' && data.length > 0) {
            data.forEach(item => {
                const cardWrapper = createTourCard(item);
                gridElement.appendChild(cardWrapper);
            });
        }
    }

    // --- Dynamically Load All Tour/Gallery Cards ---
    populateGrid(document.getElementById('virtual-tours-grid'), typeof virtualToursData !== 'undefined' ? virtualToursData : []);
    populateGrid(document.getElementById('streetview-grid'), typeof streetViewData !== 'undefined' ? streetViewData : []);
    populateGrid(document.getElementById('photos360-grid'), typeof images360Data !== 'undefined' ? images360Data : []);
    populateGrid(document.getElementById('videos360-grid'), typeof videos360Data !== 'undefined' ? videos360Data : []);

    // --- Virtual Tour Scroller Logic ---
    const tourContainer = document.getElementById('virtual-tours-grid');
    const prevTourBtn = document.getElementById('prev-tour-btn');
    const nextTourBtn = document.getElementById('next-tour-btn');

    // Check if all elements for the scroller exist
    if (tourContainer && prevTourBtn && nextTourBtn) {
        // Function to calculate the scroll amount based on the first card's width and the gap
        const getScrollAmount = () => {
            const firstCard = tourContainer.querySelector('.card-placeholder');
            if (firstCard) {
                const containerStyles = window.getComputedStyle(tourContainer);
                // Get the gap value from CSS, with a fallback of 24px
                const gap = parseFloat(containerStyles.gap) || 24;
                return firstCard.offsetWidth + gap;
            }
            return 364; // Default fallback (340px card + 24px gap)
        };

        nextTourBtn.addEventListener('click', () => {
            const scrollAmount = getScrollAmount();
            tourContainer.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        });

        prevTourBtn.addEventListener('click', () => {
            const scrollAmount = getScrollAmount();
            tourContainer.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        });
    }

    // --- Street View Scroller Logic (Gallery Page) ---
    const streetViewContainer = document.getElementById('streetview-grid');
    const prevStreetBtn = document.getElementById('prev-street-btn');
    const nextStreetBtn = document.getElementById('next-street-btn');

    // Check if all elements for this scroller exist
    if (streetViewContainer && prevStreetBtn && nextStreetBtn) {
        // Function to calculate how much to scroll
        const getScrollAmount = () => {
            // Find the first card to measure its width
            const firstCard = streetViewContainer.querySelector('.card-placeholder');
            if (firstCard) {
                const containerStyles = window.getComputedStyle(streetViewContainer);
                // The gap for .card-grid is 40px, but we'll use 24px for a flex scroller
                const gap = parseFloat(containerStyles.gap) || 24;
                return firstCard.offsetWidth + gap;
            }
            return 364; // Default fallback (340px card width + 24px gap)
        };

        nextStreetBtn.addEventListener('click', () => {
            streetViewContainer.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
        });

        prevStreetBtn.addEventListener('click', () => {
            streetViewContainer.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
        });
    }

    // --- 360 Photos Scroller Logic (Gallery Page) ---
    const photos360Container = document.getElementById('photos360-grid');
    const prevPhotos360Btn = document.getElementById('prev-photos360-btn');
    const nextPhotos360Btn = document.getElementById('next-photos360-btn');

    // Check if all elements for this scroller exist
    if (photos360Container && prevPhotos360Btn && nextPhotos360Btn) {
        // Function to calculate how much to scroll
        const getScrollAmount = () => {
            // Find the first card to measure its width
            const firstCard = photos360Container.querySelector('.card-placeholder');
            if (firstCard) {
                const containerStyles = window.getComputedStyle(photos360Container);
                // The gap for .card-grid is 40px, but we'll use 24px for a flex scroller
                const gap = parseFloat(containerStyles.gap) || 24;
                return firstCard.offsetWidth + gap;
            }
            return 364; // Default fallback (340px card width + 24px gap)
        };

        nextPhotos360Btn.addEventListener('click', () => {
            photos360Container.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
        });

        prevPhotos360Btn.addEventListener('click', () => {
            photos360Container.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
        });
    }

    // --- Video 360 Scroller Logic ---
    const videos360Container = document.getElementById('videos360-grid');
    const prevVideos360Btn = document.getElementById('prev-videos360-btn');
    const nextVideos360Btn = document.getElementById('next-videos360-btn');

    // Check if all elements for the scroller exist
    if (videos360Container && prevVideos360Btn && nextVideos360Btn) {
        // Function to calculate the scroll amount based on the first card's width and the gap
        const getScrollAmount = () => {
            const firstCard = videos360Container.querySelector('.card-placeholder');
            if (firstCard) {
                const containerStyles = window.getComputedStyle(videos360Container);
                // Get the gap value from CSS, with a fallback of 24px
                const gap = parseFloat(containerStyles.gap) || 24;
                return firstCard.offsetWidth + gap;
            }
            return 364; // Default fallback (340px card + 24px gap)
        };

        nextVideos360Btn.addEventListener('click', () => {
            const scrollAmount = getScrollAmount();
            videos360Container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        });

        prevVideos360Btn.addEventListener('click', () => {
            const scrollAmount = getScrollAmount();
            videos360Container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        });
    }

    // --- Panorama Slider Logic ---
    const panoramaContainer = document.getElementById('panorama-container');
    const sliderWrapper = document.querySelector('.panorama-slider-wrapper');
    const nextBtn = document.querySelector('.next-btn');
    const prevBtn = document.querySelector('.prev-btn');

    // Check if all required elements and the 'panoramas' data exist
    if (panoramaContainer && sliderWrapper && nextBtn && prevBtn && typeof panoramas !== 'undefined' && panoramas.length > 0) {
        let currentIndex = 0;
        let autoScrollInterval;
        const totalSlides = panoramas.length;

        // 1. Create panorama slides without loading the iframes
        panoramas.forEach((p, index) => {
            const slide = document.createElement('div');
            slide.className = 'panorama-slide';
            slide.style.width = `${100 / totalSlides}%`;
            // Use data-src to store the URL and leave src empty initially
            slide.innerHTML = `<iframe data-src="${p.iframeSrc}" src="" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allow="accelerometer; gyroscope"></iframe>`;
            sliderWrapper.appendChild(slide);
        });

        // Set the wrapper width to contain all slides side-by-side
        sliderWrapper.style.width = `${totalSlides * 100}%`; // e.g., 3 slides = 300% width

        // 2. Function to update the slider position and manage iframe loading
        function updateSlider() {
            const percentage = currentIndex * (100 / totalSlides);
            sliderWrapper.style.transform = `translateX(-${percentage}%)`;

            // Load the current slide's iframe and unload the others
            const allIframes = sliderWrapper.querySelectorAll('iframe');
            allIframes.forEach((iframe, index) => {
                if (index === currentIndex || index === ((currentIndex - 1 + totalSlides) % totalSlides) || index === currentIndex + 1 ) {
                    // Load the current slide's iframe if it's not already loaded
                    if (iframe.dataset.src && !iframe.getAttribute('src')) {
                        iframe.setAttribute('src', iframe.dataset.src);
                    }
                } 
                // else {
                //     // Unload all other iframes to free up resources
                //     iframe.setAttribute('src', '');
                // }
            });
        }

        // 3. Functions to handle slide changes
        function nextSlide() {
            currentIndex = (currentIndex + 1) % totalSlides;
            updateSlider();
        }

        function prevSlide() {
            currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
            updateSlider();
        }

        // 4. Auto-scroll functionality
        function startAutoScroll() {
            // Set an interval to call nextSlide every 5 seconds (5000 milliseconds)
            autoScrollInterval = setInterval(nextSlide, 5000);
        }

        function stopAutoScroll() {
            clearInterval(autoScrollInterval);
        }

        // 5. Event Listeners
        nextBtn.addEventListener('click', () => {
            stopAutoScroll();
            nextSlide();
        });

        prevBtn.addEventListener('click', () => {
            stopAutoScroll();
            prevSlide();
        });

        // Stop auto-scroll on any user interaction with the container
        panoramaContainer.addEventListener('mouseenter', stopAutoScroll, { once: true });
        panoramaContainer.addEventListener('touchstart', stopAutoScroll, { once: true });

        // Start the show!
        updateSlider(); // Initial load of the first slide
        // startAutoScroll(); // Auto-scrolling is currently disabled
    }

    // --- FAQ Accordion Logic ---
    const faqItems = document.querySelectorAll('.faq-item');

    if (faqItems.length > 0) {
        faqItems.forEach(item => {
            const questionButton = item.querySelector('.faq-question');
            
            questionButton.addEventListener('click', () => {
                // First, check if another item is already active and close it
                const currentlyActiveItem = document.querySelector('.faq-item.active');
                if (currentlyActiveItem && currentlyActiveItem !== item) {
                    currentlyActiveItem.classList.remove('active');
                    currentlyActiveItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
                }

                // Now, toggle the clicked item
                item.classList.toggle('active');
                questionButton.setAttribute('aria-expanded', item.classList.contains('active'));
            });
        });
    }

    // --- Scroll to Top Button Logic ---
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');

    if (scrollToTopBtn) {
        // Show or hide the button based on scroll position
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) { // Show button after scrolling 300px
                scrollToTopBtn.classList.add('show');
            } else {
                scrollToTopBtn.classList.remove('show');
            }
        });

        // Scroll to the top when the button is clicked
        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // --- No Internet Popup Logic ---
    const noInternetPopup = document.createElement('div');
    noInternetPopup.id = 'no-internet-popup';
    noInternetPopup.textContent = 'No internet connection.';
    document.body.appendChild(noInternetPopup);

    function updateOnlineStatus() {
        if (navigator.onLine) {
            noInternetPopup.classList.remove('show');
        } else {
            noInternetPopup.classList.add('show');
        }
    }

    // Check initial status and then listen for changes
    window.addEventListener('load', updateOnlineStatus);
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    // --- Dynamically Update Copyright Year ---
    const copyrightYearSpan = document.getElementById('copyright-year');
    if (copyrightYearSpan) {
        copyrightYearSpan.textContent = new Date().getFullYear();
    }

    // --- Lazy Load iFrames in Scrollers using Intersection Observer ---
    // This prevents all iframes from loading at once, fixing the WebGL context limit error.
    const lazyLoadObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            const card = entry.target.querySelector('.iframe-tour-card');
            if (!card) return;

            const iframe = card.querySelector('iframe');
            if (!iframe) return;

            // Do not unload an iframe if its card is currently maximized
            if (card.classList.contains('maximized')) {
                return;
            }

            if (entry.isIntersecting) {
                // Card is in view: load the iframe if it's not already loaded.
                if (iframe.dataset.src && !iframe.getAttribute('src')) {
                    iframe.setAttribute('src', iframe.dataset.src);
                }
            } else {
                // Card is out of view: unload the iframe to free up resources.
                if (iframe.getAttribute('src')) {
                    iframe.setAttribute('src', '');
                }
            }
        });
    }, { rootMargin: '0px 0px 200px 0px' }); // Pre-load cards 200px before they enter the viewport

    const placeholders = document.querySelectorAll('.card-placeholder');
    if (placeholders.length > 0) {
        placeholders.forEach(placeholder => {
            lazyLoadObserver.observe(placeholder);
        });
    }

    // --- Fullscreen Modal Logic for Tour Cards ---
    document.body.addEventListener('click', (event) => {
        const maximizeBtn = event.target.closest('.card-maximize-btn');

        if (maximizeBtn) {
            const card = maximizeBtn.closest('.iframe-tour-card');
            // Prevent clicks while the card is in the process of minimizing
            if (!card || card.classList.contains('minimizing')) return;

            const icon = maximizeBtn.querySelector('.material-icons');
            // Find the grid container by looking for the closest '.card-grid' ancestor.
            const gridContainer = card.closest('.card-grid');
            const isMaximized = card.classList.contains('maximized');

            if (isMaximized) {
                // --- START MINIMIZING ---
                // Add class to trigger the fade-out animation
                card.classList.add('minimizing');

                // Listen for the animation to finish
                card.addEventListener('animationend', () => {
                    // --- FINISH MINIMIZING ---
                    // Clean up all modal-related classes
                    card.classList.remove('maximized');
                    card.classList.remove('minimizing');
                    document.body.classList.remove('modal-open');

                    // Restore the button to its "maximize" state
                    icon.textContent = 'fullscreen';
                    maximizeBtn.setAttribute('aria-label', 'Maximize view');
                    maximizeBtn.setAttribute('title', 'Maximize');

                    // Restore the saved scroll position of the carousel
                    if (gridContainer && gridContainer.dataset.scrollPosition) {
                        gridContainer.scrollTo({
                            left: parseFloat(gridContainer.dataset.scrollPosition),
                            behavior: 'auto'
                        });
                    }
                }, { once: true }); // The listener removes itself after running once
            } else {
                // --- MAXIMIZING ---
                document.body.classList.add('modal-open');
                card.classList.add('maximized');

                icon.textContent = 'fullscreen_exit';
                maximizeBtn.setAttribute('aria-label', 'Minimize view');
                maximizeBtn.setAttribute('title', 'Minimize');

                if (gridContainer) {
                    gridContainer.dataset.scrollPosition = gridContainer.scrollLeft;
                }
            }
        }
    });

    // Add listener for 'Escape' key to close the modal
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && document.body.classList.contains('modal-open')) {
            // Find the active modal and simulate a click on its button to close it
            document.querySelector('.iframe-tour-card.maximized .card-maximize-btn')?.click();
        }
    });
});