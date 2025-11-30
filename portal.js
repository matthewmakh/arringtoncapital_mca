// Portal JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Portal tabs
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');

            // Update button states
            tabBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            // Update content visibility
            tabContents.forEach(content => {
                content.classList.remove('active');
            });

            const targetContent = document.getElementById(targetTab + '-tab');
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });

    // Fund request form
    const fundRequestForm = document.getElementById('fund-request-form');
    if (fundRequestForm) {
        fundRequestForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const amount = parseFloat(document.getElementById('request-amount').value);
            const purpose = document.getElementById('request-purpose').value;
            
            // Get merchant data
            const merchantId = localStorage.getItem('merchantId');
            const merchants = JSON.parse(localStorage.getItem('merchants') || '[]');
            const merchantIndex = merchants.findIndex(m => m.id === merchantId);
            
            if (merchantIndex !== -1) {
                const merchant = merchants[merchantIndex];
                const available = merchant.approvedAmount - (merchant.balance || 0);
                
                if (amount > available) {
                    alert(`Requested amount exceeds available credit. Available: $${available.toLocaleString()}`);
                    return;
                }
                
                // Update merchant balance (simulating fund draw)
                merchants[merchantIndex].balance = (merchants[merchantIndex].balance || 0) + amount;
                localStorage.setItem('merchants', JSON.stringify(merchants));
                
                // Refresh dashboard
                initializeDashboard();
                
                alert(`Fund request submitted successfully!\nAmount: $${amount.toLocaleString()}\nPurpose: ${purpose}\n\nFunds will be processed within 24-48 hours.`);
                this.reset();
            } else {
                alert(`Fund request submitted successfully!\nAmount: $${amount.toLocaleString()}\nPurpose: ${purpose}\n\nYour request will be processed within 24-48 hours.`);
                this.reset();
            }
        });
    }

    // Download statement button
    const downloadStatementBtn = document.getElementById('download-statement-btn');
    if (downloadStatementBtn) {
        downloadStatementBtn.addEventListener('click', function() {
            alert('Statement download feature will be available after backend integration.');
        });
    }

    // Upload document button
    const uploadDocBtn = document.getElementById('upload-doc-btn');
    const documentUpload = document.getElementById('document-upload');
    if (uploadDocBtn && documentUpload) {
        uploadDocBtn.addEventListener('click', function() {
            documentUpload.click();
        });
    }

    if (documentUpload) {
        documentUpload.addEventListener('change', function() {
            const files = Array.from(this.files);
            if (files.length > 0) {
                alert(`${files.length} document(s) selected. Upload feature will be available after backend integration.`);
            }
        });
    }

    // View documents button
    const viewDocumentsBtn = document.getElementById('view-documents-btn');
    if (viewDocumentsBtn) {
        viewDocumentsBtn.addEventListener('click', function() {
            alert('Document viewer will be available after backend integration.');
        });
    }

    // Initialize dashboard data
    function initializeDashboard() {
        // Get merchant data
        const merchantId = localStorage.getItem('merchantId');
        const merchants = JSON.parse(localStorage.getItem('merchants') || '[]');
        const merchant = merchants.find(m => m.id === merchantId) || null;
        
        // Update account summary
        const rlocBalance = document.getElementById('rloc-balance');
        const availableCredit = document.getElementById('available-credit');
        const creditLimit = document.getElementById('credit-limit');
        const nextPayment = document.getElementById('next-payment');
        const paymentDate = document.getElementById('payment-date');

        if (merchant) {
            // Load merchant-specific data
            const balance = merchant.balance || 0;
            const creditLimitAmount = merchant.approvedAmount || merchant.creditLimit || 0;
            const available = creditLimitAmount - balance;
            
            if (rlocBalance) rlocBalance.textContent = '$' + balance.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
            if (availableCredit) {
                availableCredit.textContent = '$' + available.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
                availableCredit.className = 'stat-value credit-available';
            }
            if (creditLimit) creditLimit.textContent = '$' + creditLimitAmount.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
            if (nextPayment) {
                const minPayment = balance * 0.02; // 2% minimum payment
                nextPayment.textContent = '$' + minPayment.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
            }
            if (paymentDate) {
                const nextDate = new Date();
                nextDate.setMonth(nextDate.getMonth() + 1);
                paymentDate.textContent = nextDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            }
        } else {
            // Demo/default data
            if (rlocBalance) rlocBalance.textContent = '$0.00';
            if (availableCredit) {
                availableCredit.textContent = 'Calculated upon approval';
                availableCredit.className = 'stat-value';
            }
            if (creditLimit) creditLimit.textContent = 'Based on your revenue';
            if (nextPayment) nextPayment.textContent = '$0.00';
            if (paymentDate) paymentDate.textContent = 'N/A';
        }

        // Initialize payment schedule
        initializePaymentSchedule();
    }

    function initializePaymentSchedule() {
        const paymentScheduleBody = document.getElementById('payment-schedule-body');
        if (paymentScheduleBody) {
            // Clear existing rows
            paymentScheduleBody.innerHTML = '';

            // Demo: No payments scheduled yet
            const emptyRow = document.createElement('tr');
            emptyRow.innerHTML = '<td colspan="3" style="text-align: center; color: #666; padding: 32px;">No payment schedule available</td>';
            paymentScheduleBody.appendChild(emptyRow);
        }
    }

    // Messages functionality
    const newMessageBtn = document.getElementById('new-message-btn');
    const messageCompose = document.getElementById('message-compose');
    const cancelMessageBtn = document.getElementById('cancel-message-btn');
    const messageForm = document.getElementById('message-form');

    if (newMessageBtn && messageCompose) {
        newMessageBtn.addEventListener('click', function() {
            messageCompose.style.display = 'block';
        });
    }

    if (cancelMessageBtn && messageCompose) {
        cancelMessageBtn.addEventListener('click', function() {
            messageCompose.style.display = 'none';
            if (messageForm) messageForm.reset();
        });
    }

    if (messageForm) {
        messageForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const subject = document.getElementById('message-subject').value;
            const body = document.getElementById('message-body').value;

            alert('Message sent successfully! Our team will respond within 24-48 hours.');
            
            // Reset form and hide compose
            this.reset();
            if (messageCompose) messageCompose.style.display = 'none';

            // Update messages list (demo)
            updateMessagesList(subject);
        });
    }

    function updateMessagesList(subject) {
        const messagesList = document.getElementById('messages-list');
        if (messagesList) {
            const messageItem = document.createElement('div');
            messageItem.className = 'message-item';
            messageItem.style.cssText = 'padding: 16px; border: 1px solid #e0e0e0; border-radius: 4px; margin-bottom: 12px; background: white;';
            messageItem.innerHTML = `
                <h4 style="margin-bottom: 8px; color: #0A2740;">${subject}</h4>
                <p style="color: #666; font-size: 14px; margin-bottom: 4px;">Status: Sent</p>
                <p style="color: #999; font-size: 12px;">${new Date().toLocaleString()}</p>
            `;
            messagesList.appendChild(messageItem);
        }
    }

    // Initialize dashboard on load
    if (localStorage.getItem('loggedIn') === 'true') {
        initializeDashboard();
    }
});

