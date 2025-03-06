<?php

require __DIR__ . '/../database.php';
use \Firebase\JWT\JWT;
require __DIR__ . '/../vendor/autoload.php';

// Helper function to generate jwt token
function generateToken($user_id){
    $config = require_once './config.php';
    $secretKey = $config['jwt-secret'];

    $payload = [
        'user_id' => $user_id,
        'iat'=> time(),
        'exp' => time() + 3600 // 1 hour from now
    ];
    return JWT::encode($payload, $secretKey, 'HS256');
}

// Helper function to return a JSON response
function jsonResponse($statusCode, $data, $message){
    http_response_code($statusCode);
    header('Content-Type: application/json');

    $ResponseData = [
        'status'=>$statusCode,
        'message'=>$message,
        'data'=>$data
    ];
    // echo(json_encode($ResponseData));
    return json_encode($ResponseData);
}

function validateSignupData($data): array{
    $errors = [];
    if(empty($data['user_id'])){
        $errors['user_id'] = "User ID is required";
    }
    if(empty($data['userName'])){
        $errors['userName'] = "Username is required";
    }
    if(empty($data['uEmail'])){
        $errors['uEmail'] = "Email is required";
    }elseif(!filter_var($data['uEmail'],  FILTER_VALIDATE_EMAIL))
    if(empty($data['uPassword'])){
        $errors['uEmail'] = "Invalid email format";
    }
    if(empty($data['uPosition'])){
        $errors['uPosition'] = "Position is required";
    }
    if(empty($data["uRole"])){
        $errors['uRole'] = "Role is required";
    }
    return $errors;
}

function checkConnection(){
    global $connection;

    if(!$connection){
        try{
            $databaseConnector = new DatabaseConnector();

            $databaseConnector->connect();

            $connection = $databaseConnector->getConnection();
        }catch(PDOException $e){
            error_log("Connection failed: " . $e->getMessage());
            return jsonResponse(statusCode:500,data:"Error connecting to database",message:$e->getMessage());
        }
    }
    return $connection;
}