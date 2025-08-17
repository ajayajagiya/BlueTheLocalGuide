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
            card.className = 'card'; // Use the same class as our future CSS

            // Set the inner HTML of the card using a template literal for clarity.
            // This structure matches the one we will style with CSS.
            card.innerHTML = `
                <div class="card-iframe-container">
                    <iframe 
                        src="${tour.iframeSrc}" 
                        allowfullscreen="" 
                        loading="lazy" 
                        referrerpolicy="no-referrer-when-downgrade">
                    </iframe>
                </div>
                <div class="card-content">
                    <h3>${tour.title}</h3>
                </div>
            `;

            // Append the newly created card to the grid container in the HTML
            tourGrid.appendChild(card);
        });
    }
});