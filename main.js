document.addEventListener("DOMContentLoaded", function() {
    // This function handles the smooth page transitions
    const setupPageTransitions = () => {
        // Select all internal links that don't open in a new tab and aren't mail/anchor links
        const internalLinks = document.querySelectorAll('a[href]:not([target="_blank"]):not([href^="#"]):not([href^="mailto:"])');

        internalLinks.forEach(link => {
            // This check prevents adding the same event listener multiple times
            if (link.dataset.transitionAdded) return;

            link.addEventListener('click', function(e) {
                const destination = this.href;

                // If the link's destination URL (without any #hash) is the same as the
                // current page's URL (without any #hash), it's a same-page link.
                // We let the browser handle it normally (for scrolling to anchors)
                // and do not run our transition animation.
                if (destination.split('#')[0] === window.location.href.split('#')[0]) {
                    return;
                }

                e.preventDefault(); // Stop the browser from navigating instantly
                document.body.classList.remove('body-visible'); // Start the fade-out

                // Wait for the fade-out animation to finish, then navigate
                setTimeout(() => {
                    window.location.href = destination;
                }, 400); // This duration must match the CSS transition duration (0.4s)
            });

            link.dataset.transitionAdded = 'true';
        });
    };

    document.body.classList.add('body-visible'); // Fade in the current page
    setupPageTransitions(); // Set up transitions for all links on the page
});