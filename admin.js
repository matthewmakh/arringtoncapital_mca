// Admin Portal JavaScript

// Admin credentials
const ADMIN_EMAIL = 'support@harringtoncapital.net';
const ADMIN_PASSWORD = 'Harry268$';

// Initialize admin portal
document.addEventListener('DOMContentLoaded', function() {
    // Check if admin is logged in
    const isAdminLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
    if (isAdminLoggedIn) {
        showAdminPortal();
    }

    // Admin login handler
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;

            // Check for admin login
            if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
                e.preventDefault();
                localStorage.setItem('adminLoggedIn', 'true');
                localStorage.setItem('adminEmail', email);
                showAdminPortal();
                // Close login overlay
                const loginOverlay = document.getElementById('login-overlay');
                if (loginOverlay) {
                    loginOverlay.style.display = 'none';
                    document.body.style.overflow = '';
                }
                // Hide main content
                document.getElementById('main-header').style.display = 'none';
                document.querySelectorAll('section').forEach(section => {
                    if (!section.id || section.id !== 'admin-portal') {
                        section.style.display = 'none';
                    }
                });
                document.querySelector('footer').style.display = 'none';
                return;
            }
        });
    }

    // Show admin login tab
    const showAdminLogin = document.getElementById('show-admin-login');
    if (showAdminLogin) {
        showAdminLogin.addEventListener('click', function() {
            const adminTab = document.querySelector('[data-tab="admin"]');
            if (adminTab) {
                adminTab.style.display = 'block';
                adminTab.click();
            }
        });
    }

    // Admin logout
    const adminLogoutBtn = document.getElementById('admin-logout-btn');
    if (adminLogoutBtn) {
        adminLogoutBtn.addEventListener('click', function() {
            localStorage.removeItem('adminLoggedIn');
            localStorage.removeItem('adminEmail');
            location.reload();
        });
    }

    // Load merchants
    loadMerchants();
    loadApplications();

    // Add merchant button
    const addMerchantBtn = document.getElementById('add-merchant-btn');
    if (addMerchantBtn) {
        addMerchantBtn.addEventListener('click', function() {
            document.getElementById('add-merchant-modal').style.display = 'flex';
        });
    }

    // Close merchant modal
    const closeMerchantModal = document.getElementById('close-merchant-modal');
    const cancelMerchantBtn = document.getElementById('cancel-merchant-btn');
    if (closeMerchantModal) {
        closeMerchantModal.addEventListener('click', closeMerchantModalFunc);
    }
    if (cancelMerchantBtn) {
        cancelMerchantBtn.addEventListener('click', closeMerchantModalFunc);
    }

    function closeMerchantModalFunc() {
        document.getElementById('add-merchant-modal').style.display = 'none';
        document.getElementById('add-merchant-form').reset();
    }

    // Add merchant form
    const addMerchantForm = document.getElementById('add-merchant-form');
    if (addMerchantForm) {
        addMerchantForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const merchantData = {
                id: 'MERCHANT-' + Date.now(),
                email: document.getElementById('merchant-email').value,
                company: document.getElementById('merchant-company').value,
                name: document.getElementById('merchant-name').value,
                approvedAmount: parseFloat(document.getElementById('merchant-approved-amount').value),
                password: document.getElementById('merchant-password').value,
                status: document.getElementById('merchant-status').value,
                createdAt: new Date().toISOString(),
                balance: 0,
                creditLimit: parseFloat(document.getElementById('merchant-approved-amount').value)
            };

            // Save merchant
            const merchants = getMerchants();
            merchants.push(merchantData);
            localStorage.setItem('merchants', JSON.stringify(merchants));

            // Create merchant credentials
            const credentials = {
                email: merchantData.email,
                password: merchantData.password,
                merchantId: merchantData.id
            };
            const allCredentials = getCredentials();
            allCredentials.push(credentials);
            localStorage.setItem('merchantCredentials', JSON.stringify(allCredentials));

            loadMerchants();
            closeMerchantModalFunc();
            alert('Merchant created successfully!');
        });
    }

    // Admin tabs
    const adminTabs = document.querySelectorAll('.admin-tabs .tab-btn');
    adminTabs.forEach(btn => {
        btn.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            adminTabs.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            const tabContents = document.querySelectorAll('#admin-portal .tab-content');
            tabContents.forEach(content => content.classList.remove('active'));
            document.getElementById(targetTab + '-tab').classList.add('active');
        });
    });
});

function showAdminPortal() {
    const adminPortal = document.getElementById('admin-portal');
    if (adminPortal) {
        adminPortal.style.display = 'block';
        const adminEmail = localStorage.getItem('adminEmail');
        if (adminEmail) {
            const adminEmailDisplay = document.getElementById('admin-email-display');
            if (adminEmailDisplay) {
                adminEmailDisplay.textContent = adminEmail;
            }
        }
    }
}

function getMerchants() {
    const merchants = localStorage.getItem('merchants');
    return merchants ? JSON.parse(merchants) : [];
}

function getCredentials() {
    const credentials = localStorage.getItem('merchantCredentials');
    return credentials ? JSON.parse(credentials) : [];
}

function loadMerchants() {
    const merchants = getMerchants();
    const merchantsList = document.getElementById('merchants-list');
    if (!merchantsList) return;

    if (merchants.length === 0) {
        merchantsList.innerHTML = '<div class="empty-state">No merchants found. Add your first merchant to get started.</div>';
        return;
    }

    merchantsList.innerHTML = merchants.map(merchant => `
        <div class="merchant-card">
            <div class="merchant-header">
                <div>
                    <h4>${merchant.company}</h4>
                    <p class="merchant-email">${merchant.email}</p>
                </div>
                <span class="merchant-status status-${merchant.status}">${merchant.status}</span>
            </div>
            <div class="merchant-details">
                <div class="merchant-detail-item">
                    <span class="detail-label">Contact:</span>
                    <span class="detail-value">${merchant.name}</span>
                </div>
                <div class="merchant-detail-item">
                    <span class="detail-label">Credit Limit:</span>
                    <span class="detail-value">$${merchant.approvedAmount.toLocaleString()}</span>
                </div>
                <div class="merchant-detail-item">
                    <span class="detail-label">Current Balance:</span>
                    <span class="detail-value">$${(merchant.balance || 0).toLocaleString()}</span>
                </div>
                <div class="merchant-detail-item">
                    <span class="detail-label">Available Credit:</span>
                    <span class="detail-value">$${(merchant.approvedAmount - (merchant.balance || 0)).toLocaleString()}</span>
                </div>
            </div>
            <div class="merchant-actions">
                <button class="btn-secondary btn-small" onclick="editMerchant('${merchant.id}')">Edit</button>
                <button class="btn-primary btn-small" onclick="viewMerchant('${merchant.id}')">View Details</button>
            </div>
        </div>
    `).join('');
}

function loadApplications() {
    // Load submitted applications from localStorage
    const applications = JSON.parse(localStorage.getItem('applications') || '[]');
    const applicationsList = document.getElementById('applications-list');
    if (!applicationsList) return;

    if (applications.length === 0) {
        applicationsList.innerHTML = '<div class="empty-state">No pending applications.</div>';
        return;
    }

    applicationsList.innerHTML = applications.map((app, index) => `
        <div class="application-card">
            <div class="application-header">
                <h4>${app.businessName || 'Application #' + (index + 1)}</h4>
                <span class="application-status">Pending Review</span>
            </div>
            <div class="application-details">
                <p><strong>Contact:</strong> ${app.ownerName || 'N/A'}</p>
                <p><strong>Email:</strong> ${app.ownerEmail || 'N/A'}</p>
                <p><strong>Requested Amount:</strong> $${(app.creditRequest || 0).toLocaleString()}</p>
            </div>
            <div class="application-actions">
                <button class="btn-primary btn-small" onclick="approveApplication(${index})">Approve</button>
                <button class="btn-secondary btn-small" onclick="viewApplication(${index})">Review</button>
            </div>
        </div>
    `).join('');
}

function editMerchant(merchantId) {
    const merchants = getMerchants();
    const merchant = merchants.find(m => m.id === merchantId);
    if (!merchant) return;

    // Populate edit form
    document.getElementById('edit-merchant-id').value = merchant.id;
    document.getElementById('edit-merchant-email').value = merchant.email;
    document.getElementById('edit-merchant-company').value = merchant.company;
    document.getElementById('edit-merchant-name').value = merchant.name;
    document.getElementById('edit-merchant-approved-amount').value = merchant.approvedAmount;
    document.getElementById('edit-merchant-status').value = merchant.status;

    document.getElementById('edit-merchant-modal').style.display = 'flex';
}

function viewMerchant(merchantId) {
    alert('Merchant details view - to be implemented');
}

function approveApplication(index) {
    const applications = JSON.parse(localStorage.getItem('applications') || '[]');
    const app = applications[index];
    if (!app) return;

    // Create merchant from application
    const merchantData = {
        id: 'MERCHANT-' + Date.now(),
        email: app.ownerEmail,
        company: app.businessName,
        name: app.ownerName,
        approvedAmount: app.creditRequest,
        password: 'TempPass123!',
        status: 'pending',
        createdAt: new Date().toISOString(),
        balance: 0,
        creditLimit: app.creditRequest
    };

    const merchants = getMerchants();
    merchants.push(merchantData);
    localStorage.setItem('merchants', JSON.stringify(merchants));

    // Create credentials
    const credentials = getCredentials();
    credentials.push({
        email: merchantData.email,
        password: merchantData.password,
        merchantId: merchantData.id
    });
    localStorage.setItem('merchantCredentials', JSON.stringify(credentials));

    // Remove from applications
    applications.splice(index, 1);
    localStorage.setItem('applications', JSON.stringify(applications));

    loadMerchants();
    loadApplications();
    alert('Application approved! Merchant account created.');
}

// Close edit modal
document.addEventListener('DOMContentLoaded', function() {
    const closeEditModal = document.getElementById('close-edit-merchant-modal');
    const cancelEditBtn = document.getElementById('cancel-edit-merchant-btn');
    
    if (closeEditModal) {
        closeEditModal.addEventListener('click', () => {
            document.getElementById('edit-merchant-modal').style.display = 'none';
        });
    }
    if (cancelEditBtn) {
        cancelEditBtn.addEventListener('click', () => {
            document.getElementById('edit-merchant-modal').style.display = 'none';
        });
    }

    // Update merchant form
    const editMerchantForm = document.getElementById('edit-merchant-form');
    if (editMerchantForm) {
        editMerchantForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const merchants = getMerchants();
            const merchantId = document.getElementById('edit-merchant-id').value;
            const merchantIndex = merchants.findIndex(m => m.id === merchantId);
            
            if (merchantIndex !== -1) {
                merchants[merchantIndex].email = document.getElementById('edit-merchant-email').value;
                merchants[merchantIndex].company = document.getElementById('edit-merchant-company').value;
                merchants[merchantIndex].name = document.getElementById('edit-merchant-name').value;
                merchants[merchantIndex].approvedAmount = parseFloat(document.getElementById('edit-merchant-approved-amount').value);
                merchants[merchantIndex].creditLimit = parseFloat(document.getElementById('edit-merchant-approved-amount').value);
                merchants[merchantIndex].status = document.getElementById('edit-merchant-status').value;

                localStorage.setItem('merchants', JSON.stringify(merchants));
                loadMerchants();
                document.getElementById('edit-merchant-modal').style.display = 'none';
                alert('Merchant updated successfully!');
            }
        });
    }
});

