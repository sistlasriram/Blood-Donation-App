// Initialize all event listeners
document.addEventListener('DOMContentLoaded', () => {
    initSmoothScroll();
    initForms();
    initUI();
});

// Smooth scroll functionality
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            const headerOffset = 80;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        });
    });
}

// Form handling functions
const initForms = () => {
    initTimeSlotSelection();
    initFormResetHandler();
    initHealthCheckValidation();
    initAgeValidation();
    initAppointmentForm();
    initBloodRequestForm();
    initContactForm();
}

// Time slot selection handler
function initTimeSlotSelection() {
    const timeSlots = document.querySelectorAll('.time-slot');
    const selectedTimeInput = document.getElementById('selectedTime');
    
    if (!timeSlots.length || !selectedTimeInput) return;
    
    timeSlots.forEach(slot => {
        slot.addEventListener('click', function() {
            timeSlots.forEach(s => s.classList.remove('selected'));
            this.classList.add('selected');
            selectedTimeInput.value = this.getAttribute('data-time');
        });
    });
}

// Form reset functionality
function initFormResetHandler() {
    const resetBtn = document.getElementById('resetBtn');
    const appointmentForm = document.getElementById('appointmentForm');
    const timeSlots = document.querySelectorAll('.time-slot');
    const selectedTimeInput = document.getElementById('selectedTime');
    
    if (!resetBtn || !appointmentForm) return;
    
    resetBtn.addEventListener('click', function() {
        appointmentForm.reset();
        timeSlots.forEach(s => s.classList.remove('selected'));
        if (selectedTimeInput) selectedTimeInput.value = '';
    });
}

// Health check validation
function initHealthCheckValidation() {
    const healthCheckboxes = document.querySelectorAll('input[name="healthCheck"]');
    const noHealthIssuesCheckbox = document.getElementById('noHealthIssues');
    
    if (!healthCheckboxes.length || !noHealthIssuesCheckbox) return;
    
    healthCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            if (this.id === 'noHealthIssues' && this.checked) {
                healthCheckboxes.forEach(c => {
                    if (c.id !== 'noHealthIssues') c.checked = false;
                });
            } else if (this.checked && this.id !== 'noHealthIssues') {
                noHealthIssuesCheckbox.checked = false;
            }
        });
    });
}

// Age validation
function initAgeValidation() {
    const dobInput = document.getElementById('dateOfBirth');
    
    if (!dobInput) return;
    
    dobInput.addEventListener('change', function() {
        const dob = new Date(this.value);
        const today = new Date();
        let age = today.getFullYear() - dob.getFullYear();
        const monthDiff = today.getMonth() - dob.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
            age--;
        }
        
        const existingError = this.parentElement.querySelector('.error-message');
        if (existingError) existingError.remove();
        
        if (age < 18) {
            const errorMessage = document.createElement('div');
            errorMessage.className = 'error-message';
            errorMessage.textContent = 'You must be at least 18 years old to donate blood.';
            this.parentElement.appendChild(errorMessage);
        }
    });
}

// Appointment form handler
function initAppointmentForm() {
    const appointmentForm = document.getElementById('appointmentForm');
    
    if (!appointmentForm) return;
    
    appointmentForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate form
        if (!validateForm(this)) return;

        const formData = new FormData(this);
        
        fetch('submit_appointment.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                // Replace form with success message
                const container = document.querySelector('.form-container');
                container.innerHTML = generateSuccessMessage('donation');
                
                // Scroll to top
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            } else {
                alert('Error: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while submitting the form');
        });
    });
}

// Blood request form handler
function initBloodRequestForm() {
    const bloodRequestForm = document.getElementById('bloodRequestForm');
    
    if (!bloodRequestForm) return;
    
    bloodRequestForm.addEventListener('submit', function(e) {
        e.preventDefault();
        if (!validateForm(this)) return;

        const formData = new FormData(this);
        submitForm(formData, 'submit_blood_request.php', 'request');
    });
}

// Contact form handler
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        
        fetch('submit_contact.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                // Clear the form
                contactForm.reset();
                
                // Show success message in a modal
                showNotification("Thank you for contacting us! We'll reply soon.", "success");
            } else {
                showNotification("Error: " + data.message, "error");
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showNotification("An error occurred while sending the message", "error");
        });
    });
}

// UI initialization
const initUI = () => {
    initAccordion();
    const urgentRequestBtn = document.getElementById('urgent-request-btn');
    if (urgentRequestBtn) {
        urgentRequestBtn.addEventListener('click', showUrgentRequestModal);
    }
}

// Accordion functionality
function initAccordion() {
    document.querySelectorAll(".accordion-header").forEach((header) => {
        header.addEventListener("click", function() {
            const content = this.nextElementSibling;
            const parent = this.parentElement;
            const icon = this.querySelector('i');
            
            // Toggle current item
            parent.classList.toggle("active");
            
            // Update icon
            icon.classList.toggle('fa-plus');
            icon.classList.toggle('fa-minus');
            
            // Toggle content height
            if (parent.classList.contains("active")) {
                content.style.maxHeight = content.scrollHeight + "px";
            } else {
                content.style.maxHeight = "0";
            }
        });
    });
}

// Form validation helper
function validateForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        const existingError = field.parentElement.querySelector('.error-message');
        if (existingError) existingError.remove();
        
        if (!field.value.trim()) {
            isValid = false;
            showError(field, 'This field is required.');
        } else if (field.id === 'pincode' && !validatePincode(field.value)) {
            isValid = false;
            showError(field, 'Please enter a valid 6-digit pincode.');
        }
    });
    
    return isValid;
}

function showError(field, message) {
    const errorMessage = document.createElement('div');
    errorMessage.className = 'error-message';
    errorMessage.textContent = message;
    field.parentElement.appendChild(errorMessage);
}

// Add this to your existing form validation
function validatePincode(pincode) {
    const pincodeRegex = /^[0-9]{6}$/;
    return pincodeRegex.test(pincode);
}

// Generic form submission handler
function submitForm(formData, endpoint, type) {
    fetch(endpoint, {
        method: "POST",
        body: formData
    })
    .then(response => response.text()) // Get response as text first
    .then(text => {
        try {
            const data = JSON.parse(text); // Try parsing as JSON
            if (data.status === "success") {
                const container = document.querySelector('.form-container') || document.querySelector('main');
                container.innerHTML = generateSuccessMessage(type);
            } else {
                alert("Error: " + data.message);
            }
        } catch (error) {
            console.error("JSON Parse Error:", error, "\nResponse Text:", text);
            alert("A syntax error occurred. Check the console for details.");
        }
    })
    .catch(error => console.error("Fetch Error:", error, "\nPossible Issue in:", endpoint));
}

// Success message generator
function generateSuccessMessage(type) {
    const messages = {
        donation: {
            title: "✅ Appointment Scheduled!",
            message: "Your blood donation appointment has been successfully scheduled. You will receive a confirmation email shortly.",
            returnLink: "donateblood.html",
            returnText: "Schedule Another Appointment"
        },
        request: {
            title: "✅ We'll help you soon!",
            message: "Your blood request has been submitted successfully. Our team will contact you as soon as possible.",
            returnLink: "needblood.html",
            returnText: "Make Another Request"
        }
    };

    const msg = messages[type];
    return `
        <div class="success-message">
            <h2>${msg.title}</h2>
            <p>${msg.message}</p>
            <div class="btn-group">
                <a href="index.html" class="btn btn-primary">Return to Homepage</a>
                <a href="${msg.returnLink}" class="btn btn-outline">${msg.returnText}</a>
            </div>
        </div>
    `;
}

function searchCamps() {
    let pincode = document.getElementById("pincode").value;
    
    if (pincode.trim() === "") {
        alert("Please enter a valid pincode.");
        return;
    }

    fetch(`get_camps.php?pincode=${pincode}`)
        .then(response => response.json())
        .then(data => {
            let resultsDiv = document.getElementById("camp-results");
            resultsDiv.innerHTML = "";

            if (data.length === 0) {
                resultsDiv.innerHTML = "<p>No donation camps found for this pincode.</p>";
                return;
            }

            data.forEach(camp => {
                let campCard = document.createElement("div");
                campCard.className = "camp-card";
                campCard.innerHTML = `
                    <h2>${camp.camp_name}</h2>
                    <p><strong>Location:</strong> ${camp.location}</p>
                    <p><strong>Date:</strong> ${camp.date}</p>
                    <p><strong>Time:</strong> ${camp.time}</p>
                    <p><strong>Contact:</strong> ${camp.contact_person} (${camp.contact_phone})</p>
                `;
                resultsDiv.appendChild(campCard);
            });
        })
        .catch(error => console.error("Error fetching data:", error));
}

// Add this new function for urgent blood request
function showUrgentRequestModal() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>Urgent Blood Request</h2>
                <span class="close-modal">&times;</span>
            </div>
            <div class="modal-body">
                <form id="urgent-request-form">
                    <div class="form-group">
                        <label for="blood-group">Blood Group Required:</label>
                        <select id="blood-group" name="blood_group" required>
                            <option value="">Select Blood Group</option>
                            <option value="A+">A+</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B-">B-</option>
                            <option value="AB+">AB+</option>
                            <option value="AB-">AB-</option>
                            <option value="O+">O+</option>
                            <option value="O-">O-</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="units">Units Required:</label>
                        <input type="number" id="units" name="units" min="1" max="10" required>
                    </div>
                    <div class="form-group">
                        <label for="pincode">Pincode:</label>
                        <input type="text" id="pincode" name="pincode" required pattern="[0-9]{6}" maxlength="6">
                    </div>
                    <button type="submit" class="btn btn-primary">Search</button>
                </form>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    modal.style.display = 'block';

    // Close modal functionality
    const closeBtn = modal.querySelector('.close-modal');
    closeBtn.onclick = () => {
        modal.remove();
    };

    // Form submission
    const form = modal.querySelector('#urgent-request-form');
    form.onsubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        window.location.href = `urgent_results.html?blood_group=${formData.get('blood_group')}&pincode=${formData.get('pincode')}`;
    };
}

// Notification helper function
const showNotification = (message, type = 'success') => {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <p>${message}</p>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}
