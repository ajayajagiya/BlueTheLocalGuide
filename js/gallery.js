document.addEventListener('DOMContentLoaded', () => {

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

    const placeholders = document.querySelectorAll('.card-placeholder');
    if (placeholders.length > 0) {
        placeholders.forEach(placeholder => {
            lazyLoadObserver.observe(placeholder);
        });
    }

});