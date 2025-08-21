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

    // --- Dynamically Load Virtual Tour Cards ---
    const tourGrid = document.getElementById('virtual-tours-grid');

    // Check if the grid container and the data from VirtualToursData.js exist.
    // The 'virtualTours' variable is available globally because VirtualToursData.js is loaded before this script.
    if (tourGrid && typeof virtualTours !== 'undefined') {
        // Loop through each tour object in the virtualTours array
        virtualTours.forEach(tour => {
            // Create a new div element for the card
            const card = document.createElement('div');
            card.className = 'virtual-tour-card'; // Use the specific class for tour cards

            // Set the inner HTML of the card using a template literal for clarity.
            // The title is now placed above the iframe.
            card.innerHTML = `
                <div class="card-text-content">
                    <h3>${tour.title}</h3>
                </div>
                <div class="card-iframe-wrapper">
                    <iframe
                        src="${tour.iframeSrc}"
                        title="${tour.title}"
                        allowfullscreen=""
                        loading="lazy"
                        referrerpolicy="no-referrer-when-downgrade"
                        allow="accelerometer; gyroscope">
                    </iframe>
                </div>
            `;
            // Append the newly created card to the grid container in the HTML
            tourGrid.appendChild(card);
        });
    }

    // --- Virtual Tour Scroller Logic ---
    const tourContainer = document.getElementById('virtual-tours-grid');
    const prevTourBtn = document.getElementById('prev-tour-btn');
    const nextTourBtn = document.getElementById('next-tour-btn');

    // Check if all elements for the scroller exist
    if (tourContainer && prevTourBtn && nextTourBtn) {
        // Function to calculate the scroll amount based on the first card's width and the gap
        const getScrollAmount = () => {
            const firstCard = tourContainer.querySelector('.virtual-tour-card');
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

        // 1. Load panoramas into the slider
        panoramas.forEach(p => {
            const slide = document.createElement('div');
            slide.className = 'panorama-slide';
            // Set the width of each slide to be the correct fraction of the wrapper
            slide.style.width = `${100 / totalSlides}%`;
            slide.innerHTML = `<iframe src="${p.iframeSrc}" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allow="accelerometer; gyroscope"></iframe>`;
            sliderWrapper.appendChild(slide);
        });

        // Set the wrapper width to contain all slides side-by-side
        sliderWrapper.style.width = `${totalSlides * 100}%`; // e.g., 3 slides = 300% width

        // 2. Function to update the slider position
        function updateSlider() {
            // Each slide takes up 100% / totalSlides of the wrapper's width
            const percentage = currentIndex * (100 / totalSlides);
            sliderWrapper.style.transform = `translateX(-${percentage}%)`;
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
        startAutoScroll();
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
});