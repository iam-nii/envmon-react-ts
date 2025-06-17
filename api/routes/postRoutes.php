<?php
require_once __DIR__ . '/../helperFunctions.php';

function AddRoom($data){
    global $connection;
    try {
        $stmt = $connection->prepare("INSERT INTO rooms (roomNumber, frPerson, location, height, width, length, area) VALUES (:roomNumber, :frPerson, :location, :height, :width, :length, :area)");
        $stmt->execute([
            'roomNumber'=>$data['roomNumber'],
            'frPerson'=>$data['frPerson'],
            'location'=>$data['location'],
            'height'=>$data['height'],
            'width'=>$data['width'],
            'length'=>$data['length'],
            'area'=>$data['area'],
        ]);
        // Get the last inserted roomID
        $roomID = $connection->lastInsertId();

        // Add roomID to the $data array
        $data['room_id'] = $roomID;
        return jsonResponse(
            statusCode:201,
            data: $data,
            message:'Room added successfully'
        );
    } catch (\Throwable $th) {
        //throw $th;
        return jsonResponse(
            statusCode:500,
            data:"Error inseting room",
            message:$th->getMessage()
        );
    }
}

function AddDevice($data){
    global $connection;
    try {
        $stmt = $connection->prepare("INSERT INTO `devices`(`device_id`, `deviceName`, `zoneNum`,`reqInterval`, `status`, `room_id`) VALUES (:device_id, :deviceName, :zoneNum, :reqInterval, :status, :room_id)");
        $stmt->execute([
            'device_id'=>$data['device_id'],
            'deviceName'=>$data['deviceName'],
            'zoneNum'=>$data['zoneNum'],
            'reqInterval'=>$data['reqInterval'],
            'status'=>$data['status'],
            'room_id'=>$data['room_id'] ?? null,            
        ]);
        return jsonResponse(
            statusCode:201,
            data: $data,
            message:'Device added successfully'
        );
    } catch (\Throwable $th) {
        //throw $th;
        return jsonResponse(
            statusCode:500,
            data:"Error inseting device",
            message:$th->getMessage()
        );
    }
}
function AddParameter(){
    global $connection;
    try{
        $data['parameter_name'] = trim($_GET['parameter_name']);
        $data['unitOfMeasure'] = trim($_GET['unitOfMeasure']);
        $data['pminValue'] = trim($_GET['pminValue']);
        $data['pmaxValue'] = trim($_GET['pmaxValue']);
        $data['parameter_alias'] = trim($_GET['parameter_alias']);

        //Get the highest id from the parameters table
        $query = "SELECT MAX(param_id) FROM parameters";
        $stmt = $connection->prepare($query);
        $stmt->execute();
        $highest_id = $stmt->fetch(PDO::FETCH_ASSOC);
        $data['param_id'] = $highest_id['MAX(param_id)'] + 1;
        $query = "INSERT INTO `parameters`(`param_id`, `parameter_name`, `unitOfMeasure`, `pminValue`, `pmaxValue`, `parameter_alias`) VALUES (:param_id, :parameter_name, :unitOfMeasure, :pminValue, :pmaxValue, :parameter_alias)";
        $stmt = $connection->prepare($query);
        $stmt->execute([
            'param_id' => $data['param_id'],
            'parameter_name' => $data['parameter_name'],
            'unitOfMeasure' => $data['unitOfMeasure'],
            'pminValue' => $data['pminValue'],
            'pmaxValue' => $data['pmaxValue'],
            'parameter_alias' => $data['parameter_alias']
        ]);
        //$data['param_id'] = $connection->lastInsertId();
        return jsonResponse(
            statusCode:200,
            data:$data,
            message:"Parameter added successfully"
        );
    }catch(\Throwable $th){
        return jsonResponse(
            statusCode:500,
            data:"Error adding parameter to database",
            message:$th->getMessage()
        );
    }
}

function AddRegulation(){
    global $connection;
    try{
        $data['param_id'] = $_GET['param_id'];
        $data['maxValue'] = $_GET['maxValue'];
        $data['minValue'] = $_GET['minValue'];
        $data['user_id'] = $_GET['user_id'];
        $data['device_id'] = $_GET['device_id'];
        $data['sendMsg'] = $_GET['send_msg'];
        
        //Get the highest id from the techregs table
        $query = "SELECT MAX(techreg_id) FROM techregs";
        $stmt = $connection->prepare($query);
        $stmt->execute();
        $highest_id = $stmt->fetch(PDO::FETCH_ASSOC);
        $data['techreg_id'] = $highest_id['MAX(techreg_id)'] + 1;
        $query = "INSERT INTO `techregs`(`techreg_id`, `device_id`, `param_id`, `maxValue`, `minValue`, `user_id`, `sendMsg`) VALUES (:techreg_id, :device_id, :param_id, :maxValue, :minValue, :user_id, :sendMsg)";
        $stmt = $connection->prepare($query);
        $stmt->execute([
            'techreg_id' => $data['techreg_id'],
            'device_id' => $data['device_id'],
            'param_id' => $data['param_id'],
            'maxValue' => $data['maxValue'],
            'minValue' => $data['minValue'],
            'user_id' => $data['user_id'],
            'sendMsg' => $data['sendMsg']
        ]);
        return jsonResponse(
            statusCode:200,
            data:$data,
            message:"Regulation added successfully"
        );
    }catch(\Throwable $th){
        return jsonResponse(
            statusCode:500,
            data:"Error adding regulation to database",
            message:$th->getMessage()
        );
    }
}

function setSettings($data){
    try{
        $data = json_decode($data,true);
        file_put_contents(__DIR__ . '/../reports/settings.json',json_encode($data));
        return jsonResponse(statusCode:200,data:$data,message:"Settings set successfully");
    }catch(\Throwable $th){
        return jsonResponse(statusCode:500,data:"Error setting settings",message:$th->getMessage());
    }
}