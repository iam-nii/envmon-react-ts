<?php
require_once __DIR__ . '/../routes/patchRoutes.php';

function handlePatchRequest($uri):string{
    // Access the 'id' parameter from the URL
    $id = null;
    if (isset($_GET['id'])) {
        $id = $_GET['id'];
    }
    $data = json_decode(file_get_contents('php://input'),true);

    switch ($uri) {
        case '/pdn1/api/users/':
            if ($id) {
                return editUser($id,$data); // Use double quotes for string interpolation
            } else {
                return json_encode([
                    'status' => 400,
                    'message' => 'User ID is required',
                ]);
            }
        case '/pdn1/api/rooms/':
            if($id){
                return editRoom($id,$data);
            }else{
                return json_encode([
                    'status' => 400,
                    'message' => 'Room ID is required',
                ]);
            }

        default:
            return json_encode([
                    'status'=> 500,
                    'message'=>'Unhandled patch request',
                ]);


    }

}