<?php
// session_start();
require_once './../auth.php';
require_once './../../helperFunctions.php';


if(checkConnection()){
    $request_uri = parse_url($_SERVER['REQUEST_URI'],PHP_URL_PATH);
    $request_method = $_SERVER['REQUEST_METHOD'];
    // echo $request_uri;

    
    if($request_method == "POST"){
        $data = json_decode(file_get_contents('php://input'),true);
        $response =  signIn($data);
        echo $response;
        return $response;

    }else{
        echo "\nsignin/index.php";
        http_response_code(405);
        echo json_encode(["error"=>"Method not allowed"]);
    }
}

