// API Client for Harrington Capital Backend

// Automatically detect if running locally or in production
const API_BASE_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:3000/api'
    : '/api'; // Use relative path in production

// Get auth token from localStorage
function getAuthToken() {
    return localStorage.getItem('authToken');
}

// Set auth token
function setAuthToken(token) {
    localStorage.setItem('authToken', token);
}

// Remove auth token
function removeAuthToken() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('merchant');
}

// API request helper
async function apiRequest(endpoint, options = {}) {
    const token = getAuthToken();
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Request failed');
        }

        return data;
    } catch (error) {
        console.error('API request error:', error);
        throw error;
    }
}

// Authentication API
const authAPI = {
    async login(email, password) {
        const data = await apiRequest('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
        
        if (data.token) {
            setAuthToken(data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            if (data.merchant) {
                localStorage.setItem('merchant', JSON.stringify(data.merchant));
            }
        }
        
        return data;
    },

    async getCurrentUser() {
        return await apiRequest('/auth/me');
    },

    async logout() {
        removeAuthToken();
        try {
            await apiRequest('/auth/logout', { method: 'POST' });
        } catch (e) {
            // Ignore errors on logout
        }
    }
};

// Merchants API
const merchantsAPI = {
    async getAll() {
        return await apiRequest('/merchants');
    },

    async getById(id) {
        return await apiRequest(`/merchants/${id}`);
    },

    async create(merchantData) {
        return await apiRequest('/merchants', {
            method: 'POST',
            body: JSON.stringify(merchantData)
        });
    },

    async update(id, merchantData) {
        return await apiRequest(`/merchants/${id}`, {
            method: 'PUT',
            body: JSON.stringify(merchantData)
        });
    },

    async getTransactions(id) {
        return await apiRequest(`/merchants/${id}/transactions`);
    },

    async requestFunds(id, amount, description) {
        return await apiRequest(`/merchants/${id}/funds`, {
            method: 'POST',
            body: JSON.stringify({ amount, description })
        });
    }
};

// Applications API
const applicationsAPI = {
    async submit(applicationData) {
        return await apiRequest('/applications', {
            method: 'POST',
            body: JSON.stringify(applicationData)
        });
    },

    async getAll() {
        return await apiRequest('/applications');
    },

    async getById(id) {
        return await apiRequest(`/applications/${id}`);
    },

    async approve(id, approvedAmount, notes) {
        return await apiRequest(`/applications/${id}/approve`, {
            method: 'POST',
            body: JSON.stringify({ approvedAmount, notes })
        });
    },

    async reject(id, notes) {
        return await apiRequest(`/applications/${id}/reject`, {
            method: 'POST',
            body: JSON.stringify({ notes })
        });
    }
};

// Files API
const filesAPI = {
    async upload(file, merchantId = null, applicationId = null) {
        const formData = new FormData();
        formData.append('file', file);
        if (merchantId) formData.append('merchantId', merchantId);
        if (applicationId) formData.append('applicationId', applicationId);

        const token = getAuthToken();
        const response = await fetch(`${API_BASE_URL}/files/upload`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Upload failed');
        }

        return await response.json();
    },

    async getAll() {
        return await apiRequest('/files');
    },

    async download(id) {
        const token = getAuthToken();
        window.location.href = `${API_BASE_URL}/files/${id}/download?token=${token}`;
    }
};

// Export API
window.API = {
    auth: authAPI,
    merchants: merchantsAPI,
    applications: applicationsAPI,
    files: filesAPI
};

