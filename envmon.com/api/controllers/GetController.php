<?php
require_once __DIR__ . '/../routes/getRoutes.php';

function handleGetRequest($uri): string{
    echo $uri;
    switch($uri){
        case '/envmon.com/':
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
