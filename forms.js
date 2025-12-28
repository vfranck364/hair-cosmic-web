/**
 * forms.js - Handling Contact & Newsletter Submissions
 * Integration with Google Sheets via Google Apps Script
 */

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyv-d7F0Pp6vVTJygM2WZKDSUCYXX1W2BWp3VSVpQ984J8B3vj3Kpyy8yj2ALzgGDq8/exec'; // Replace with your Deployed Web App URL

document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contact-form');
    const newsletterForm = document.querySelector('.newsletter-form');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerText;

            // Collect data
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                message: document.getElementById('message').value
            };

            try {
                submitBtn.disabled = true;
                submitBtn.innerText = 'Envoi...';

                const response = await fetch(SCRIPT_URL, {
                    method: 'POST',
                    mode: 'no-cors', // Apps Script requires no-cors sometimes for simple POST
                    cache: 'no-cache',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                // Since mode is no-cors, we can't read the response body reliably
                // We assume success if no error is thrown
                alert('Message envoyé avec succès ! Nous vous recontacterons bientôt.');
                contactForm.reset();

            } catch (error) {
                console.error('Submission error:', error);
                alert('Une erreur est survenue lors de l\'envoi. Veuillez réessayer.');
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerText = originalText;
            }
        });
    }

    // Newsletter handling
    const newsletterBtn = document.querySelector('.btn-newsletter');
    const newsletterInput = document.getElementById('newsletter-email');

    if (newsletterBtn && newsletterInput) {
        newsletterBtn.addEventListener('click', async () => {
            const email = newsletterInput.value;
            if (!email || !email.includes('@')) {
                alert('Veuillez entrer un email valide.');
                return;
            }

            try {
                newsletterBtn.disabled = true;

                await fetch(SCRIPT_URL, {
                    method: 'POST',
                    mode: 'no-cors',
                    cache: 'no-cache',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: 'Newsletter Signup',
                        email: email,
                        message: 'Inscription à la newsletter'
                    })
                });

                alert('Inscription réussie !');
                newsletterInput.value = '';

            } catch (error) {
                console.error('Newsletter error:', error);
            } finally {
                newsletterBtn.disabled = false;
            }
        });
    }
});
