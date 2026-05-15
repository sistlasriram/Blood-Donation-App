<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header("Content-Type: application/json");

$servername = "localhost";
$username = "root";
$password = "";
$database = "blood_donation";

$conn = new mysqli($servername, $username, $password, $database);

if ($conn->connect_error) {
    echo json_encode(["status" => "error", "message" => "Database connection failed: " . $conn->connect_error]);
    exit();
}

$patientName = $_POST['patientName'];
$patientAge = $_POST['patientAge'];
$bloodGroup = $_POST['bloodGroup'];
$urgency = $_POST['urgency'];
$hospitalName = $_POST['hospitalName'];
$location = $_POST['location'];
$contactPerson = $_POST['contactPerson'];
$contactPhone = $_POST['contactPhone'];

$sql = "INSERT INTO blood_requests (patient_name, patient_age, blood_group, urgency, hospital_name, location, contact_person, contact_phone)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

$stmt = $conn->prepare($sql);
$stmt->bind_param("sissssss", $patientName, $patientAge, $bloodGroup, $urgency, $hospitalName, $location, $contactPerson, $contactPhone);

if ($stmt->execute()) {
    echo json_encode(["status" => "success"]);
} else {
    echo json_encode(["status" => "error", "message" => "Database error: " . $conn->error]);
}

$stmt->close();
$conn->close();
?>
