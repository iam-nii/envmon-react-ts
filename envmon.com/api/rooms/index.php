<?php
echo "Rooms";
require_once './../../database.php';
require_once './../controllers/GetController.php';
require_once './../controllers/PatchController.php';
require_once './../controllers/PostController.php';
require_once './../controllers/DeleteController.php';
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
if($connection){
    $request_uri = parse_url($_SERVER['REQUEST_URI'],PHP_URL_PATH);
    $request_method = $_SERVER['REQUEST_METHOD'];

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
}