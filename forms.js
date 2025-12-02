// Forms.js - Contact Form and Newsletter Handling

document.addEventListener('DOMContentLoaded', function() {
    // Contact Form Handler
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = {
                name: document.getElementById('contact-name').value,
                email: document.getElementById('contact-email').value,
                phone: document.getElementById('contact-phone').value || '',
                company: document.getElementById('contact-company').value || '',
                subject: document.getElementById('contact-subject').value,
                message: document.getElementById('contact-message').value,
                timestamp: new Date().toISOString()
            };
            
            // Store in localStorage (in production, send to backend)
            const contactMessages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
            contactMessages.push(formData);
            localStorage.setItem('contactMessages', JSON.stringify(contactMessages));
            
            // Show success message
            alert('Thank you for your message! We will get back to you within 24 hours.');
            
            // Reset form
            contactForm.reset();
            
            // In production, uncomment this to send to backend:
            /*
            fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })
            .then(response => response.json())
            .then(data => {
                alert('Thank you for your message! We will get back to you within 24 hours.');
                contactForm.reset();
            })
            .catch(error => {
                console.error('Error:', error);
                alert('There was an error sending your message. Please try again or contact us directly at support@harringtoncapital.net');
            });
            */
        });
    }
    
    // Newsletter Form Handler
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('newsletter-email').value;
            
            // Store in localStorage (in production, send to backend)
            const newsletterSubscribers = JSON.parse(localStorage.getItem('newsletterSubscribers') || '[]');
            
            // Check if already subscribed
            if (newsletterSubscribers.includes(email)) {
                alert('You are already subscribed to our newsletter!');
                return;
            }
            
            newsletterSubscribers.push(email);
            localStorage.setItem('newsletterSubscribers', JSON.stringify(newsletterSubscribers));
            
            // Show success message
            alert('Thank you for subscribing! You will receive our monthly insights and updates.');
            
            // Reset form
            newsletterForm.reset();
            
            // In production, uncomment this to send to backend:
            /*
            fetch('/api/newsletter/subscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    email: email,
                    timestamp: new Date().toISOString()
                })
            })
            .then(response => response.json())
            .then(data => {
                // Redirect to confirmation page
                window.location.href = 'newsletter-confirmed.html';
            })
            .catch(error => {
                console.error('Error:', error);
                alert('There was an error subscribing. Please try again.');
            });
            */
        });
    }
    
    // Form validation helpers
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    function validatePhone(phone) {
        const re = /^[\d\s\-\+\(\)]+$/;
        return phone === '' || re.test(phone);
    }
    
    // Real-time validation for email fields
    const emailInputs = document.querySelectorAll('input[type="email"]');
    emailInputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.value && !validateEmail(this.value)) {
                this.style.borderColor = '#ef4444';
                if (!this.nextElementSibling || !this.nextElementSibling.classList.contains('error-hint')) {
                    const errorHint = document.createElement('span');
                    errorHint.className = 'error-hint';
                    errorHint.style.color = '#ef4444';
                    errorHint.style.fontSize = '12px';
                    errorHint.style.marginTop = '4px';
                    errorHint.style.display = 'block';
                    errorHint.textContent = 'Please enter a valid email address';
                    this.parentNode.appendChild(errorHint);
                }
            } else {
                this.style.borderColor = '';
                const errorHint = this.nextElementSibling;
                if (errorHint && errorHint.classList.contains('error-hint')) {
                    errorHint.remove();
                }
            }
        });
    });
    
    // Real-time validation for phone fields
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.value && !validatePhone(this.value)) {
                this.style.borderColor = '#ef4444';
                if (!this.nextElementSibling || !this.nextElementSibling.classList.contains('error-hint')) {
                    const errorHint = document.createElement('span');
                    errorHint.className = 'error-hint';
                    errorHint.style.color = '#ef4444';
                    errorHint.style.fontSize = '12px';
                    errorHint.style.marginTop = '4px';
                    errorHint.style.display = 'block';
                    errorHint.textContent = 'Please enter a valid phone number';
                    this.parentNode.appendChild(errorHint);
                }
            } else {
                this.style.borderColor = '';
                const errorHint = this.nextElementSibling;
                if (errorHint && errorHint.classList.contains('error-hint')) {
                    errorHint.remove();
                }
            }
        });
    });
});
