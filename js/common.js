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
                <span class="material-icons">
                    <img src="./assets/svg/fullscreen.svg" alt="image">
                </span>
            </button>
            `;

    // Append the card to the placeholder and return the placeholder.
    placeholder.appendChild(card);
    return placeholder;
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



    // Check initial status and then listen for changes
    window.addEventListener('load', updateOnlineStatus);
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);


    // --- Dynamically Update Copyright Year ---
    const copyrightYearSpan = document.getElementById('copyright-year');
    if (copyrightYearSpan) {
        copyrightYearSpan.textContent = new Date().getFullYear();
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

    // --- Fullscreen Modal Logic for Tour Cards ---
    document.body.addEventListener('click', (event) => {
        const maximizeBtn = event.target.closest('.card-maximize-btn');

        if (maximizeBtn) {
            const card = maximizeBtn.closest('.iframe-tour-card');
            // Prevent clicks while the card is in the process of minimizing
            if (!card || card.classList.contains('minimizing')) return;

            const icon = maximizeBtn.querySelector('.material-icons');
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
                    icon.innerHTML = '<img src="./assets/svg/fullscreen.svg" height="90%" width="90%" alt="image">';
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
            }
            else {
                // --- MAXIMIZING ---
                document.body.classList.add('modal-open');
                card.classList.add('maximized');

                icon.innerHTML = '<img src="./assets/svg/fullscreen_exit.svg" height="90%" width="90%" alt="image">';
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