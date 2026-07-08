// API Configuration
const API_BASE_URL = 'http://localhost:5000';

// DOM Elements
const predictionForm = document.getElementById('predictionForm');
const resultSection = document.getElementById('resultSection');
const predictedPrice = document.getElementById('predictedPrice');
const inputDetails = document.getElementById('inputDetails');
const resetBtn = document.getElementById('resetBtn');
const apiStatus = document.getElementById('apiStatus');

// Check API status on load
async function checkAPIStatus() {
    try {
        const response = await fetch(`${API_BASE_URL}/health`);
        const data = await response.json();
        
        if (data.status === 'healthy' && data.models_loaded) {
            apiStatus.textContent = 'Connected ✓';
            apiStatus.style.color = '#4CAF50';
        } else {
            apiStatus.textContent = 'Models not loaded';
            apiStatus.style.color = '#FF9800';
        }
    } catch (error) {
        apiStatus.textContent = 'Disconnected ✗';
        apiStatus.style.color = '#F44336';
        console.error('API connection error:', error);
    }
}

// Format price with Indian numbering system
function formatPrice(price) {
    if (price >= 10000000) {
        return `₹${(price / 10000000).toFixed(2)} Crore`;
    } else if (price >= 100000) {
        return `₹${(price / 100000).toFixed(2)} Lakh`;
    } else {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(price);
    }
}

// Show loading animation
function showLoading() {
    if (!document.querySelector('.loading')) {
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'loading';
        loadingDiv.innerHTML = '<i class="fas fa-spinner"></i><p>Predicting price...</p>';
        predictionForm.appendChild(loadingDiv);
    }
    document.querySelector('.loading').style.display = 'block';
    resultSection.style.display = 'none';
}

// Hide loading animation
function hideLoading() {
    const loadingDiv = document.querySelector('.loading');
    if (loadingDiv) {
        loadingDiv.style.display = 'none';
    }
}

// Show error message
function showError(message) {
    hideLoading();
    
    // Remove existing error message
    const existingError = document.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
    
    predictionForm.appendChild(errorDiv);
    
    // Auto-remove error after 5 seconds
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

// Update input details display
function updateInputDetails(formData) {
    const details = {
        'Manufacturing Year': formData.year,
        'Kilometers Driven': `${formData.km_driven.toLocaleString()} km`,
        'Engine Capacity': `${formData.engine} CC`,
        'Max Power': `${formData.max_power} bhp`,
        'Seats': formData.seats,
        'Fuel Type': formData.fuel,
        'Seller Type': formData.seller_type,
        'Transmission': formData.transmission,
        'Owner Type': formData.owner
    };
    
    let detailsHTML = '';
    for (const [label, value] of Object.entries(details)) {
        detailsHTML += `
            <div class="detail-item">
                <span class="detail-label">${label}:</span>
                <span class="detail-value">${value}</span>
            </div>
        `;
    }
    
    inputDetails.innerHTML = detailsHTML;
}

// Handle form submission
predictionForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = {
        year: parseInt(document.getElementById('year').value),
        km_driven: parseInt(document.getElementById('km_driven').value),
        fuel: document.getElementById('fuel').value,
        seller_type: document.getElementById('seller_type').value,
        transmission: document.getElementById('transmission').value,
        owner: document.getElementById('owner').value,
        engine: parseInt(document.getElementById('engine').value),
        max_power: parseFloat(document.getElementById('max_power').value),
        seats: parseInt(document.getElementById('seats').value)
    };
    
    // Validate input
    if (formData.year < 1990 || formData.year > 2024) {
        showError('Please enter a valid year between 1990 and 2024');
        return;
    }
    
    if (formData.km_driven < 0 || formData.km_driven > 1000000) {
        showError('Please enter valid kilometers (0 - 1,000,000 km)');
        return;
    }
    
    // Show loading
    showLoading();
    
    try {
        // Make API request
        const response = await fetch(`${API_BASE_URL}/predict`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Update result display
            predictedPrice.textContent = formatPrice(data.predicted_price);
            updateInputDetails(formData);
            
            // Show result section with animation
            hideLoading();
            resultSection.style.display = 'block';
            
            // Scroll to result
            resultSection.scrollIntoView({ 
                behavior: 'smooth',
                block: 'nearest'
            });
            
            // Remove any existing error messages
            const errorDiv = document.querySelector('.error-message');
            if (errorDiv) {
                errorDiv.remove();
            }
        } else {
            showError(data.error || 'Prediction failed. Please try again.');
        }
    } catch (error) {
        console.error('Prediction error:', error);
        showError('Failed to connect to prediction server. Please check if the backend is running.');
    }
});

// Handle reset button
resetBtn.addEventListener('click', () => {
    predictionForm.reset();
    resultSection.style.display = 'none';
    
    // Reset to default values
    document.getElementById('year').value = 2018;
    document.getElementById('km_driven').value = 50000;
    document.getElementById('engine').value = 1200;
    document.getElementById('max_power').value = 82;
    document.getElementById('seats').value = 5;
    
    // Remove any error messages
    const errorDiv = document.querySelector('.error-message');
    if (errorDiv) {
        errorDiv.remove();
    }
});

// Add sample data buttons
function addSampleButtons() {
    const sampleContainer = document.createElement('div');
    sampleContainer.className = 'sample-buttons';
    sampleContainer.innerHTML = `
        <h4><i class="fas fa-vial"></i> Try Sample Data:</h4>
        <div class="button-group">
            <button type="button" class="sample-btn" data-sample="economy">
                <i class="fas fa-city"></i> Economy Car
            </button>
            <button type="button" class="sample-btn" data-sample="midrange">
                <i class="fas fa-car"></i> Mid-Range Car
            </button>
            <button type="button" class="sample-btn" data-sample="luxury">
                <i class="fas fa-gem"></i> Luxury Car
            </button>
        </div>
    `;
    
    predictionForm.insertBefore(sampleContainer, predictionForm.firstChild);
    
    // Add sample data
    const sampleData = {
        economy: {
            year: 2015,
            km_driven: 70000,
            engine: 800,
            max_power: 55,
            seats: 5,
            fuel: 'Petrol',
            seller_type: 'Individual',
            transmission: 'Manual',
            owner: 'First Owner'
        },
        midrange: {
            year: 2018,
            km_driven: 50000,
            engine: 1200,
            max_power: 82,
            seats: 5,
            fuel: 'Petrol',
            seller_type: 'Dealer',
            transmission: 'Manual',
            owner: 'Second Owner'
        },
        luxury: {
            year: 2020,
            km_driven: 25000,
            engine: 2000,
            max_power: 190,
            seats: 5,
            fuel: 'Diesel',
            seller_type: 'Trustmark Dealer',
            transmission: 'Automatic',
            owner: 'First Owner'
        }
    };
    
    // Add event listeners to sample buttons
    document.querySelectorAll('.sample-btn').forEach(button => {
        button.addEventListener('click', () => {
            const sampleType = button.dataset.sample;
            const data = sampleData[sampleType];
            
            // Fill form with sample data
            document.getElementById('year').value = data.year;
            document.getElementById('km_driven').value = data.km_driven;
            document.getElementById('engine').value = data.engine;
            document.getElementById('max_power').value = data.max_power;
            document.getElementById('seats').value = data.seats;
            document.getElementById('fuel').value = data.fuel;
            document.getElementById('seller_type').value = data.seller_type;
            document.getElementById('transmission').value = data.transmission;
            document.getElementById('owner').value = data.owner;
            
            // Auto-submit form
            predictionForm.dispatchEvent(new Event('submit'));
        });
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    checkAPIStatus();
    addSampleButtons();
    
    // Check API status every 30 seconds
    setInterval(checkAPIStatus, 30000);
});