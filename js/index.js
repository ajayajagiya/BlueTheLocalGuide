document.addEventListener('DOMContentLoaded', () => {

    populateGrid(document.getElementById('virtual-tours-grid'), typeof virtualToursData !== 'undefined' ? virtualToursData : []);

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
                if (index === currentIndex || index === ((currentIndex - 1 + totalSlides) % totalSlides) || index === currentIndex + 1) {
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

    // --- Dynamically Load All Tour/Gallery Cards ---

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

    const placeholders = document.querySelectorAll('.card-placeholder');
    if (placeholders.length > 0) {
        placeholders.forEach(placeholder => {
            lazyLoadObserver.observe(placeholder);
        });
    }
});