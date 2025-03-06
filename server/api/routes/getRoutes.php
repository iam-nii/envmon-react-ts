<?php
require_once __DIR__ . '/../controllers/GetController.php';

function handleGetRequest($uri): string{
    switch($uri){
        case '/pdn1/':
            echo "Welcome to the API";
            return "\nTest";
        case "/users":
            return "Users";
        case "/parameters":
            $response = getParameters();
            return $response;   
        case "/pdn1/rooms":
            $response = getRooms();
            return $response;
        case "devices":
            $response = getDevices();
            return $response;
        case "parametersByRoomID/{roomID}":
            return "parametersByRoomID";
        case "/logData":
            return "logData";
        default:
            return json_encode([
                'status'=> 404,
                'message'=>'Not found',
            ]);
    }
}