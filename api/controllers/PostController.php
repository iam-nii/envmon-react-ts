<?php
require_once __DIR__ . '/../routes/postRoutes.php';

function handlePostRequest($uri) : string {
    $data = json_decode(file_get_contents('php://input'),true);
    
    switch($uri){
        case '/pdn1/api/rooms/':
            return AddRoom($data);
        case '/pdn1/api/devices/':
            return AddDevice($data);

        default:
            return json_encode([
                    'status'=> 500,
                    'message'=>'Unhandled patch request',
                ]);
        
    }
}