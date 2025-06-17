<?php
session_start();
// Enable CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PATCH, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Handle preflight requests (for CORS)
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Start the session (for authentification)
require_once 'database.php';
require_once './api/controllers/Getcontroller.php';
require_once './api/controllers/PatchController.php';
require_once './api/controllers/PostController.php';
require_once './api/controllers/DeleteController.php';
// echo "Server running\n";

$databaseConnector = new DatabaseConnector();

$databaseConnector->connect();

$connection = $databaseConnector->getConnection();
if($connection){
    $request_uri = parse_url($_SERVER['REQUEST_URI'],PHP_URL_PATH);
    $request_method = $_SERVER['REQUEST_METHOD'];
    // echo $request_method;
    if (preg_match('#^/api/#', $request_uri)) {
        // Handle API requests as before
        // Simple routing method 
        switch($request_method){
            case 'GET':
                echo handleGetRequest($request_uri);
                break;
            case 'POST':
                handlePostRequest($request_uri);
                break;
            case 'PATCH':
                handlePatchRequest($request_uri);
                break;
            case 'DELETE':
                handleDeleteRequest($request_uri);
                break;
            default :
                http_response_code(405);
                echo json_encode(["error"=>"Method not allowed"]);
        }
    } else {
        // Serve the built index.html for all other routes
        readfile(__DIR__ . '/index.html');
        exit();
    }

    
   
}else{
    echo "Error Connection to database";
    return json_encode([
        'success'=> false,
        'message'=> "Error connecting to database"
    ],500); 
}