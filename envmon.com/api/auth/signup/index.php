<?php
echo "SignUp\n";
require_once './../auth.php';
require_once './../../helperFunctions.php';

if(checkConnection()){
    $request_uri = parse_url($_SERVER['REQUEST_URI'],PHP_URL_PATH);
    $request_method = $_SERVER['REQUEST_METHOD'];

    echo $request_method;
    echo $request_uri;
    // Simple routing method 
    if($request_method == "POST"){
        $data = json_decode(file_get_contents('php://input'),true);
        echo json_encode($data);
        // $response =  signUp($data);
        // return $response;

    }else{
        echo "\nsignup/index.php";
        http_response_code(405);
        echo json_encode(["error"=>"Method not allowed"]);
    }
    // switch($request_method){
    //     // GET method probably not needed for authentification
    //     // case 'GET':
    //     //     if(isset($_GET['endpoint'])){
    //     //         $endpoint = $_GET['endpoint'];
    //     //         echo $endpoint;
    //     //     }else{
    //     //         echo "\nInvalid endpoint";
    //     //     }
    //     //     break;
    //     case 'POST':
    //         echo $request_method;
    //         echo "\n";
    //         echo $_GET['endpoint'];
    //         if(isset($_GET['endpoint'])){
    //             $endpoint = $_GET['endpoint'];
    //             switch($endpoint){
    //                 case 'signup':
    //                     echo $endpoint;
    //                     return $endpoint;
    //                     // $data = json_decode(file_get_contents('php://input'),true);
    //                     // $response =  signUp($data);
    //                     // return $response;
    //                     break;
    //                 case 'signin':
    //                     echo $endpoint;
    //                     return $endpoint;
    //                     // $data = json_decode(file_get_contents('php://input'),true);
    //                     // $response = signIn($data);
    //                     // echo $response;
    //                     // return $response;
    //                     break;
    //                 default:
    //                     return jsonResponse(statusCode:404,data:"Endpoint not found",message:"Invalid route");
    //                     break;

    //             }
    //         }else{
    //             echo "\nInvalid endpoint";
    //             return "unknown endpoint";  
    //         }
    //         break;
    //     default:
        

    // }
}