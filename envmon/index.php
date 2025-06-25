<?php
// echo "Saving data to database";
require __DIR__ . '/../database.php';
require __DIR__ . '/../api/controllers/GetController.php';
require __DIR__ . '/../api/controllers/PatchController.php';
require __DIR__ . '/../api/controllers/PostController.php';
require __DIR__ . '/../api/controllers/DeleteController.php';
global $connection;

if(checkConnection()){
    $request_uri = parse_url($_SERVER['REQUEST_URI'],PHP_URL_PATH);
    $request_method = $_SERVER['REQUEST_METHOD'];

    if($request_method == "GET"){
        echo handleGetRequest($request_uri);
    }else if($request_method == "POST"){
        echo handlePostRequest($request_uri);
    }
    else{
        http_response_code(405);
        echo json_encode(["error"=>"Method not allowed"]);
    }
}
