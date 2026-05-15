document.getElementById('urgent-request-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const bloodGroup = document.getElementById('blood-group').value;
    const units = document.getElementById('units').value;
    const pincode = document.getElementById('pincode').value;
    
    window.location.href = `urgent_results.html?blood_group=${encodeURIComponent(bloodGroup)}&units=${encodeURIComponent(units)}&pincode=${encodeURIComponent(pincode)}`;
});
