<?php
require 'config.php';

if (isset($_GET['pincode'])) {
    $pincode = $_GET['pincode'];

    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);

    if ($conn->connect_error) {
        die(json_encode(["error" => "Connection failed"]));
    }

    $stmt = $conn->prepare("SELECT * FROM donation_camps WHERE pincode = ?");
    $stmt->bind_param("s", $pincode);
    $stmt->execute();
    $result = $stmt->get_result();

    $camps = [];
    while ($row = $result->fetch_assoc()) {
        $camps[] = $row;
    }

    echo json_encode($camps);

    $stmt->close();
    $conn->close();
}
?>
