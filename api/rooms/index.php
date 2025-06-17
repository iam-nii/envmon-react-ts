<?php
// echo "Rooms";
require_once './../../database.php';
require_once './../controllers/GetController.php';
require_once './../controllers/PatchController.php';
require_once './../controllers/PostController.php';
require_once './../controllers/DeleteController.php';
global $connection;

if(checkConnection()){
    $request_uri = parse_url($_SERVER['REQUEST_URI'],PHP_URL_PATH);
    $request_method = $_SERVER['REQUEST_METHOD'];

    if($request_method == "GET"){
        echo handleGetRequest($request_uri);
    }else if($request_method == "POST"){
        echo handlePostRequest($request_uri);
    }else if($request_method == "PATCH"){
        echo handlePatchRequest($request_uri);
    }else if($request_method == "DELETE"){
        echo handleDeleteRequest($request_uri);
    }else{
        http_response_code(405);
        echo json_encode(["error"=>"Method not allowed"]);
    }
}
