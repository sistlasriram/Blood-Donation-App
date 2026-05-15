function fetchResults(bloodGroup, units, pincode) {
    const url = `search_blood.php?blood_group=${encodeURIComponent(bloodGroup)}&units=${encodeURIComponent(units)}&pincode=${encodeURIComponent(pincode)}`;
    
    console.log('Fetching:', url);

    fetch(url)
        .then(response => {
            console.log('Response status:', response.status);
            return response.text().then(text => {
                console.log('Raw response:', text);
                
                try {
                    return JSON.parse(text);
                } catch (e) {
                    console.error('JSON Parse Error:', e);
                    throw new Error(`Invalid JSON response: ${text}`);
                }
            });
        })
        .then(data => {
            console.log('Parsed data:', data);
            const container = document.getElementById('results-container');

            if (!data || data.error || (Array.isArray(data) && data.length === 0)) {
                container.innerHTML = `
                    <div class="no-results">
                        <h3>No matching donors found in your area.</h3>
                        <p>We'll notify you when blood becomes available.</p>
                        <a href="index.html" class="btn btn-primary">Back to Home</a>
                    </div>
                `;
                return;
            }

            // Generate donor details
            const results = data.map(item => `
                <div class="result-card">
                    <div class="blood-type">${item.blood_group}</div>
                    <div class="details">
                        <h3>${item.donor_name}</h3>
                        <p><strong>Location:</strong> ${item.location}</p>
                        <p><strong>Blood Group:</strong> ${item.blood_group}</p>
                        <p><strong>Available Units:</strong> ${item.available_units}</p>
                        <p><strong>Contact:</strong> <a href="tel:${item.contact}">${item.contact}</a></p>
                    </div>
                </div>
            `).join('');

            container.innerHTML = results;
        })
        .catch(error => {
            console.error('Fetch error:', error);
            const container = document.getElementById('results-container');
            container.innerHTML = `
                <div class="error-message">
                    <h3>An error occurred</h3>
                    <p>${error.message}</p>
                    <a href="index.html" class="btn btn-primary">Back to Home</a>
                </div>
            `;
        });
}

// Extract query parameters and call fetchResults
const urlParams = new URLSearchParams(window.location.search);
const bloodGroup = urlParams.get('blood_group');
const units = urlParams.get('units');
const pincode = urlParams.get('pincode');

if (bloodGroup && units && pincode) {
    fetchResults(bloodGroup, units, pincode);
}
