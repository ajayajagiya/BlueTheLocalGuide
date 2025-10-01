document.addEventListener('DOMContentLoaded', () => {
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
});