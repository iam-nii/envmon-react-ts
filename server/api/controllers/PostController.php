<?php
require_once './api/auth.php';
// require_once '../helperFunctions.php';
function handlePostRequest($uri) : string {
    switch($uri){
        case '/signup':

            $data = json_decode(file_get_contents('php://input'),true);
            $response =  signUp($data);
            return $response;
            break;
        case '/signin':
            $data = json_decode(file_get_contents('php://input'),true);
            $response = signIn($data);
            echo $response;
            return $response;
            break;
        default:
            return jsonResponse(statusCode:404,data:"Endpoint not found",message:"Invalid route");
            break;
        
    }
}