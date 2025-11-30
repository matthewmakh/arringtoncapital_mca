// Main Application JavaScript

// Header scroll effect
window.addEventListener('scroll', function() {
    const header = document.getElementById('main-header');
    if (header) {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
});

// Login Overlay Functions
document.addEventListener('DOMContentLoaded', function() {
    const loginOverlay = document.getElementById('login-overlay');
    const loginHeaderBtn = document.getElementById('login-header-btn');
    const clientLoginLink = document.getElementById('client-login-link');
    const portalLink = document.getElementById('portal-link');
    const promptLoginBtn = document.getElementById('prompt-login-btn');
    const closeLoginOverlay = document.getElementById('close-login-overlay');

    function openLoginOverlay() {
        if (loginOverlay) {
            loginOverlay.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    }

    function closeLoginOverlayFunc() {
        if (loginOverlay) {
            loginOverlay.style.display = 'none';
            document.body.style.overflow = '';
        }
    }

    // Open login overlay
    if (loginHeaderBtn) {
        loginHeaderBtn.addEventListener('click', openLoginOverlay);
    }
    if (clientLoginLink) {
        clientLoginLink.addEventListener('click', function(e) {
            e.preventDefault();
            openLoginOverlay();
        });
    }
    if (portalLink) {
        portalLink.addEventListener('click', function(e) {
            e.preventDefault();
            openLoginOverlay();
        });
    }
    if (promptLoginBtn) {
        promptLoginBtn.addEventListener('click', openLoginOverlay);
    }

    // Close login overlay
    if (closeLoginOverlay) {
        closeLoginOverlay.addEventListener('click', closeLoginOverlayFunc);
    }

    // Close on overlay background click
    if (loginOverlay) {
        loginOverlay.addEventListener('click', function(e) {
            if (e.target === loginOverlay) {
                closeLoginOverlayFunc();
            }
        });
    }

    // Login tabs
    const loginTabBtns = document.querySelectorAll('.login-tab-btn');
    loginTabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tab = this.getAttribute('data-tab');
            
            // Update button states
            loginTabBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            // Update content visibility
            const tabContents = document.querySelectorAll('.login-tab-content');
            tabContents.forEach(content => {
                content.classList.remove('active');
            });
            
            const targetTab = document.getElementById(tab + '-tab');
            if (targetTab) {
                targetTab.classList.add('active');
            }
        });
    });

    // Login form submission
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;

            const errorMsg = document.getElementById('login-error');
            if (errorMsg) errorMsg.style.display = 'none';

            try {
                const result = await window.API.auth.login(email, password);
                
                // Close overlay
                closeLoginOverlayFunc();
                
                // Update UI
                updateLoginState();
                
                // Show portal or admin portal based on role
                if (result.user.role === 'admin') {
                    // Admin will be handled by admin.js
                    location.reload();
                } else {
                    showPortalContent();
                }
            } catch (error) {
                if (errorMsg) {
                    errorMsg.textContent = error.message || 'Invalid email or password. Please try again.';
                    errorMsg.style.display = 'block';
                }
            }
        });
    }

    // Forgot password form
    const forgotForm = document.getElementById('forgot-password-form');
    if (forgotForm) {
        forgotForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const successMsg = document.getElementById('forgot-success');
            if (successMsg) {
                successMsg.style.display = 'block';
            }
        });
    }

    // Show forgot tab
    const showForgotTab = document.getElementById('show-forgot-tab');
    if (showForgotTab) {
        showForgotTab.addEventListener('click', function() {
            const forgotBtn = document.querySelector('[data-tab="forgot"]');
            if (forgotBtn) {
                forgotBtn.click();
            }
        });
    }

    // Back to login buttons
    const backToLoginButtons = document.querySelectorAll('[id^="back-to-login"]');
    backToLoginButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const loginBtn = document.querySelector('[data-tab="login"]');
            if (loginBtn) {
                loginBtn.click();
            }
        });
    });

    // Access request form
    const accessRequestForm = document.getElementById('access-request-form');
    if (accessRequestForm) {
        accessRequestForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const successMsg = document.getElementById('access-success');
            const errorMsg = document.getElementById('access-error');
            
            if (successMsg) {
                const requestId = 'REQ-' + Date.now().toString().slice(-8);
                document.getElementById('access-request-id').textContent = requestId;
                successMsg.style.display = 'block';
                if (errorMsg) errorMsg.style.display = 'none';
                this.reset();
            }
        });
    }

    // Update login state on page load
    function updateLoginState() {
        const isLoggedIn = localStorage.getItem('loggedIn') === 'true';
        const userEmail = localStorage.getItem('userEmail');
        
        if (isLoggedIn) {
            // Hide login button, show logout
            if (loginHeaderBtn) loginHeaderBtn.style.display = 'none';
            const logoutBtn = document.getElementById('logout-btn');
            if (logoutBtn) logoutBtn.style.display = 'block';
            
            // Update portal user info
            const userEmailDisplay = document.getElementById('user-email-display');
            if (userEmailDisplay) {
                userEmailDisplay.textContent = userEmail;
            }
        }
    }

    // Logout functionality
    const logoutBtns = document.querySelectorAll('[id*="logout"]');
    logoutBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            localStorage.removeItem('loggedIn');
            localStorage.removeItem('userEmail');
            
            // Update UI
            if (loginHeaderBtn) loginHeaderBtn.style.display = 'block';
            logoutBtns.forEach(b => b.style.display = 'none');
            
            // Hide portal content
            hidePortalContent();
            
            // Clear portal user info
            const userEmailDisplay = document.getElementById('user-email-display');
            if (userEmailDisplay) {
                userEmailDisplay.textContent = '';
            }
        });
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href !== '#portal') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // Initialize
    updateLoginState();
    
    // Show portal content if logged in
    function showPortalContent() {
        const portalLoginPrompt = document.getElementById('portal-login-prompt');
        const portalContent = document.getElementById('portal-content');
        const portalUserInfo = document.getElementById('portal-user-info');
        
        if (portalLoginPrompt) portalLoginPrompt.style.display = 'none';
        if (portalContent) portalContent.style.display = 'block';
        if (portalUserInfo) portalUserInfo.style.display = 'block';
        
        updateLoginState();
    }

    function hidePortalContent() {
        const portalLoginPrompt = document.getElementById('portal-login-prompt');
        const portalContent = document.getElementById('portal-content');
        const portalUserInfo = document.getElementById('portal-user-info');
        
        if (portalLoginPrompt) portalLoginPrompt.style.display = 'block';
        if (portalContent) portalContent.style.display = 'none';
        if (portalUserInfo) portalUserInfo.style.display = 'none';
    }

    // Check if should show portal content on load
    if (localStorage.getItem('loggedIn') === 'true') {
        // Check if we're on portal section
        if (window.location.hash === '#portal') {
            showPortalContent();
        }
    }

    // Portal link handler
    if (portalLink) {
        portalLink.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Scroll to portal section
            const portalSection = document.getElementById('portal');
            if (portalSection) {
                portalSection.scrollIntoView({ behavior: 'smooth' });
                
                // If not logged in, show login
                if (localStorage.getItem('loggedIn') !== 'true') {
                    setTimeout(() => {
                        openLoginOverlay();
                    }, 500);
                } else {
                    setTimeout(() => {
                        showPortalContent();
                    }, 500);
                }
            }
        });
    }
});

