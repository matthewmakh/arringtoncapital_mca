// Form JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Handle form step navigation
    const nextButtons = document.querySelectorAll('.btn-next');
    const prevButtons = document.querySelectorAll('.btn-prev');

    nextButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const currentStep = this.closest('.form-step');
            const nextStepNum = this.getAttribute('data-next');
            const nextStep = document.querySelector(`.form-step[data-step="${nextStepNum}"]`);

            // Validate current step
            if (validateStep(currentStep)) {
                // Hide current step
                currentStep.classList.remove('active');
                
                // Show next step
                if (nextStep) {
                    nextStep.classList.add('active');
                    updateProgressIndicator(nextStepNum);
                }
            }
        });
    });

    prevButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const currentStep = this.closest('.form-step');
            const prevStepNum = this.getAttribute('data-prev');
            const prevStep = document.querySelector(`.form-step[data-step="${prevStepNum}"]`);

            // Hide current step
            currentStep.classList.remove('active');
            
            // Show previous step
            if (prevStep) {
                prevStep.classList.add('active');
                updateProgressIndicator(prevStepNum);
            }
        });
    });

    function validateStep(step) {
        const requiredFields = step.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.style.borderColor = '#dc3545';
                
                // Remove error styling after user starts typing
                field.addEventListener('input', function() {
                    this.style.borderColor = '';
                }, { once: true });
            } else {
                field.style.borderColor = '';
            }
        });

        if (!isValid) {
            alert('Please fill in all required fields before proceeding.');
        }

        return isValid;
    }

    function updateProgressIndicator(stepNum) {
        const progressSteps = document.querySelectorAll('.progress-step');
        progressSteps.forEach((step, index) => {
            const stepNumber = index + 1;
            if (stepNumber <= parseInt(stepNum)) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
    }

    // File upload handling
    const fileInputs = document.querySelectorAll('input[type="file"]');
    fileInputs.forEach(input => {
        input.addEventListener('change', function() {
            const files = Array.from(this.files);
            const fileListId = this.id + '-list';
            const fileList = document.getElementById(fileListId);

            if (fileList && files.length > 0) {
                fileList.innerHTML = '';
                files.forEach((file, index) => {
                    const fileItem = document.createElement('div');
                    fileItem.style.cssText = 'padding: 8px; background: #f8f9fa; border-radius: 4px; margin-bottom: 8px; font-size: 14px;';
                    fileItem.innerHTML = `
                        <span>${file.name}</span>
                        <span style="color: #666; margin-left: 8px;">(${(file.size / 1024).toFixed(2)} KB)</span>
                    `;
                    fileList.appendChild(fileItem);
                });
            }
        });
    });

    // Standalone application form submission
    const standaloneForm = document.getElementById('standalone-application-form');
    if (standaloneForm) {
        standaloneForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Validate all steps
            const allSteps = this.querySelectorAll('.form-step');
            let allValid = true;

            allSteps.forEach(step => {
                if (!validateStep(step)) {
                    allValid = false;
                }
            });

            if (!allValid) {
                alert('Please fill in all required fields in all steps.');
                return;
            }

            // Show success message
            const successMsg = document.getElementById('standalone-application-success');
            const applicationId = document.getElementById('standalone-application-id');
            
            if (successMsg) {
                const appId = 'APP-' + Date.now().toString().slice(-8);
                if (applicationId) {
                    applicationId.textContent = appId;
                }
                
                successMsg.style.display = 'block';
                this.style.display = 'none';
                
                // Scroll to success message
                successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });
    }

    // Portal application form submission
    const portalApplicationForm = document.getElementById('application-form');
    if (portalApplicationForm) {
        portalApplicationForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Validate all steps
            const allSteps = this.querySelectorAll('.form-step');
            let allValid = true;

            allSteps.forEach(step => {
                if (!validateStep(step)) {
                    allValid = false;
                }
            });

            if (!allValid) {
                alert('Please fill in all required fields in all steps.');
                return;
            }

            // Show success message
            const successMsg = document.getElementById('application-success');
            const applicationId = document.getElementById('application-id');
            
            if (successMsg) {
                const appId = 'APP-' + Date.now().toString().slice(-8);
                if (applicationId) {
                    applicationId.textContent = appId;
                }
                
                successMsg.style.display = 'block';
                this.style.display = 'none';
                
                // Scroll to success message
                successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });
    }

    // Phone number formatting
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 6) {
                value = value.slice(0, 3) + '-' + value.slice(3, 6) + '-' + value.slice(6, 10);
            } else if (value.length >= 3) {
                value = value.slice(0, 3) + '-' + value.slice(3);
            }
            e.target.value = value;
        });
    });

    // EIN formatting
    const einInputs = document.querySelectorAll('input[pattern*="EIN"], input[name="ein"]');
    einInputs.forEach(input => {
        if (input.getAttribute('pattern') && input.getAttribute('pattern').includes('-')) {
            input.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length >= 2) {
                    value = value.slice(0, 2) + '-' + value.slice(2, 9);
                }
                e.target.value = value;
            });
        }
    });
});

