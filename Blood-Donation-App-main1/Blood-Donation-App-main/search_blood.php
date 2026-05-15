<?php
header('Content-Type: application/json');

require 'config.php';

$blood_group = $_GET['blood_group'] ?? '';
$pincode = $_GET['pincode'] ?? '';
$units = $_GET['units'] ?? 1;

if (empty($blood_group) || empty($pincode) || empty($units)) {
    echo json_encode(['error' => 'Missing required parameters']);
    exit;
}

try {
    $conn = getDBConnection();

    $query = "SELECT donors.name, donors.contact_phone, donors.location, blood_inventory.blood_group, blood_inventory.units 
              FROM blood_inventory
              JOIN donors ON blood_inventory.donor_id = donors.id
              WHERE blood_inventory.blood_group = ? AND blood_inventory.pincode = ? AND blood_inventory.units >= ?";

    $stmt = $conn->prepare($query);

    if (!$stmt) {
        throw new Exception('SQL Prepare failed: ' . $conn->error);
    }

    $stmt->bind_param("ssi", $blood_group, $pincode, $units);
    $stmt->execute();
    $result = $stmt->get_result();

    $data = [];
    while ($row = $result->fetch_assoc()) {
        $data[] = [
            'donor_name' => $row['name'],
            'contact' => $row['contact_phone'],
            'location' => $row['location'],
            'blood_group' => $row['blood_group'],
            'available_units' => $row['units']
        ];
    }

    if (empty($data)) {
        echo json_encode(['error' => 'No results found']);
    } else {
        echo json_encode($data);
    }

    $stmt->close();
    $conn->close();
} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>
