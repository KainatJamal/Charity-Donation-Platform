<?php
// Include the PHPMailer autoload file
require 'vendor/autoload.php';  // Ensure you've installed PHPMailer using Composer

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Set up CORS headers to allow AJAX requests from any origin
header("Access-Control-Allow-Origin: *"); 
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Handle OPTIONS request for preflight checks
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Fetch POST data
$data = json_decode(file_get_contents('php://input'), true);

// Validate the required fields
if (!isset($data['email']) || !isset($data['query'])) {
    http_response_code(400);
    echo json_encode(['message' => 'Email and query are required.']);
    exit;
}

$userEmail = $data['email'];
$userQuery = $data['query'];

// Initialize PHPMailer
$mail = new PHPMailer(true);

try {
    // Server settings
    $mail->isSMTP();  // Send using SMTP
    $mail->Host = 'smtp.gmail.com';  // Gmail SMTP server
    $mail->SMTPAuth = true;  // Enable SMTP authentication
    $mail->Username = 'kainat.jamal2@gmail.com';  // Your Gmail email
    $mail->Password = 'aetn oohs mpeg snfv';  // App Password (use generated app password for Gmail)
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;  // StartTLS encryption
    $mail->Port = 587;  // SMTP port for TLS

    // Recipients
    $mail->setFrom($userEmail, 'Query from User');  // Use the user's email as the sender
    $mail->addAddress('aidcircle3@gmail.com', 'Aid Circle');  // The organization email to receive queries

    // Content
    $mail->isHTML(true);  
    $mail->Subject = 'New Query from ' . $userEmail;
    $mail->Body    = '<p><strong>Email:</strong> ' . $userEmail . '</p><p><strong>Query:</strong><br>' . nl2br($userQuery) . '</p>';
    $mail->AltBody = "Email: $userEmail\nQuery:\n$userQuery";  // Plain text body for email clients that don't support HTML

    // Send the email
    $mail->send();
    echo json_encode(['message' => 'Your query has been sent successfully!']);
} catch (Exception $e) {
    // Error handling: output the error
    http_response_code(500);
    echo json_encode(['message' => 'Message could not be sent. Mailer Error: ' . $mail->ErrorInfo]);
}
?>