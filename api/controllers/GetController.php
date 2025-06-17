<?php
// session_start();
require_once __DIR__ . '/../routes/getRoutes.php';
require_once __DIR__ . '/../helperFunctions.php';
require_once __DIR__ . '/../../envmon/srv.php';

function handleGetRequest($uri): string{
    
    $method = null;
    $id = null;
    $query = null;
    $data = null;
    if(isset($_GET['method'])){
        $method = $_GET['method'];
    }
    if(isset($_GET['id'])){
        $id = $_GET['id'];
    }
    if(isset($_GET['query'])){
        $query = $_GET['query'];
    }
    if(isset($_GET['data'])){
        $data = $_GET['data'];
    }
    switch($uri){
        case 'test':
            echo "Welcome to the API";
            return "\nTest";

        case '/pdn1/api/users/':
            return getUsersRoutesHandler($method,$id);
        case "/pdn1/api/rooms/":
            return getRoomsRoutesHandler($method,$id,$query);
        case "/pdn1/api/devices/":
            return getDevicesRoutesHandler($method,$id,$query);
        case "/pdn1/envmon/":
            if(isset($_GET['devID'])){
                $id = $_GET['devID'];
            }
            if(isset($_GET['query']) && $_GET['query'] == "lastMdt"){
                return getLastMDt();
            }
            
            // "http://localhost/pdn1/envmon/?id=2gE8gn37DP282V1"
            // return saveFromSensors();  
            // return saveToDatabase($id); 
            return GetData($id); 

        case "/pdn1/api/parameters/":
            return getParametersRoutesHandler($method,$query,$id);
        case "/pdn1/api/settings/":
            return getSettingsRoutesHandler($method,$query,$id);
        case "/pdn1/api/logs/":
            return getLogsRoutesHandler($method,$query,$id);
            
            
        case '/pdn1/api/user':
            if(!isset($_SESSION['user'])){
                echo jsonResponse(
                    statusCode:401,
                    data:"Unauthorized",
                    message:"You are not authorized to access this resource"
                );
                exit;
            }
            header('Content-Type: application/json, charset=utf-8');
            // Change made here
            return json_encode($_SESSION['user']);
            break;
         
        
            
        case "/pdn1/api/reports/":
            return getReportsRoutesHandler($method,$query,$data);
       
            
        
        default:
            return json_encode([
                'status'=> 404,
                'message'=>'Endpoint not found',
            ]);
    }
}
