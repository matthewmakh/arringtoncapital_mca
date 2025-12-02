// Forms.js - Contact Form and Newsletter Form Handlers

// Contact Form Handler
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = {
                name: document.getElementById('contact-name').value,
                email: document.getElementById('contact-email').value,
                phone: document.getElementById('contact-phone').value,
                company: document.getElementById('contact-company').value,
                subject: document.getElementById('contact-subject').value,
                message: document.getElementById('contact-message').value,
                timestamp: new Date().toISOString()
            };
            
            try {
                // Send to backend
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });
                
                if (response.ok) {
                    alert('Thank you! Your message has been sent successfully. We will respond within 1-2 business days.');
                    contactForm.reset();
                } else {
                    throw new Error('Failed to send message');
                }
            } catch (error) {
                console.error('Contact form error:', error);
                alert('There was an error sending your message. Please try again or email us directly at support@harringtoncapital.net');
            }
        });
    }
    
    // Newsletter Form Handler
    const newsletterForm = document.getElementById('newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const email = document.getElementById('newsletter-email').value;
            
            try {
                const response = await fetch('/api/newsletter/subscribe', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ 
                        email: email,
                        subscribed_at: new Date().toISOString()
                    })
                });
                
                if (response.ok) {
                    alert('Thank you for subscribing! Check your email for confirmation.');
                    newsletterForm.reset();
                    // Optional: Redirect to confirmation page
                    // window.location.href = '/newsletter-confirmed.html';
                } else {
                    throw new Error('Failed to subscribe');
                }
            } catch (error) {
                console.error('Newsletter subscription error:', error);
                alert('There was an error subscribing to our newsletter. Please try again later.');
            }
        });
    }
});
