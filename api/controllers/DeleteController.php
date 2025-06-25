<?php
require_once __DIR__ . '/../routes/deleteRoutes.php';
function handleDeleteRequest($uri):string{
    $id = null;
    if (isset($_GET['id'])) {
        $id = $_GET['id'];
    }
    switch($uri){
        case '/pdn1/api/rooms/':
            return deleteRoom($id);
        case '/pdn1/api/users/':
            return deleteUser($id);
        case '/pdn1/api/devices/':
            return deleteDevice($id);
        default:
            return jsonResponse(statusCode:404,data:"Resource not found",message:"Resource not found");
    }

}