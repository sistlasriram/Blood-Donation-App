<?php
define("DB_HOST", "localhost");
define("DB_USER", "root");
define("DB_PASS", "");
define("DB_NAME", "blood_donation");

header('Content-Type: application/json');

try {
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);

    if ($conn->connect_error) {
        throw new Exception("Connection failed: " . $conn->connect_error);
    }

    // Collect form data
    $firstName = $_POST['firstName'];
    $lastName = $_POST['lastName'];
    $dateOfBirth = $_POST['dateOfBirth'];
    $gender = $_POST['gender'];
    $email = $_POST['email'];
    $phone = $_POST['phone'];
    $bloodType = $_POST['bloodType'];
    $previousDonor = $_POST['previousDonor'];
    $lastDonationDate = $_POST['lastDonationDate'];
    $weight = $_POST['weight'];
    $donationCenter = $_POST['donationCenter'];
    $appointmentDate = $_POST['appointmentDate'];
    $selectedTime = $_POST['selectedTime'];
    $donationType = $_POST['donationType'];
    $medications = $_POST['medications'];
    $pincode = $_POST['pincode'];
    
    // Validate pincode
    if (!preg_match("/^[0-9]{6}$/", $pincode)) {
        throw new Exception("Invalid pincode format");
    }

    $stmt = $conn->prepare("INSERT INTO appointments (first_name, last_name, date_of_birth, gender, email, phone, pincode, blood_type, previous_donor, last_donation_date, weight, donation_center, appointment_date, selected_time, donation_type, medications) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            
    $stmt->bind_param("ssssssssssdsssss", 
        $firstName,
        $lastName,
        $dateOfBirth,
        $gender,
        $email,
        $phone,
        $pincode,
        $bloodType,
        $previousDonor,
        $lastDonationDate,
        $weight,
        $donationCenter,
        $appointmentDate,
        $selectedTime,
        $donationType,
        $medications
    );

    if ($stmt->execute()) {
        echo json_encode(["status" => "success", "message" => "Appointment scheduled successfully!"]);
    } else {
        throw new Exception("Error scheduling appointment");
    }

    $stmt->close();
    $conn->close();

} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>
