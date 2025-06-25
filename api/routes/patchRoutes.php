<?php

function updateUser($id,$data){
    global $connection;
    try{

        if(isset($data['uPassword'])){
            $uPassword = password_hash($data['uPassword'], PASSWORD_DEFAULT);
            $query = "UPDATE `users` SET `userName`= :userName,
            `uPassword`= :uPassword,`uEmail`= :uEmail,`uPhone`= :uPhone,`uRole`= :uRole,`uPosition`= :uPosition,
            `updated_at`= :updated_at WHERE user_id = :id";
            $stmt = $connection->prepare($query);
            $stmt->execute([
                'id'=>$id,
                'userName' => $data['userName'],
                'uPassword' => $uPassword,
                'uEmail' => $data['uEmail'],
                'uPhone' => $data['uPhone'],
                'uRole' => $data['uRole'],
                'uPosition' => $data['uPosition'],
                'updated_at' => date('Y-m-d H:i:s'),
            ]);
        }else{
            $query = "UPDATE `users` SET `userName`= :userName,`uEmail`= :uEmail,`uPhone`= :uPhone,`uRole`= :uRole,`uPosition`= :uPosition,
            `updated_at`= :updated_at WHERE user_id = :id";
            $stmt = $connection->prepare($query);
            $stmt->execute([
                'id'=>$id,
                'userName' => $data['userName'],
                'uEmail' => $data['uEmail'],
                'uPhone' => $data['uPhone'],
                'uRole' => $data['uRole'],
                'uPosition' => $data['uPosition'],
                'updated_at' => date('Y-m-d H:i:s'),
            ]);

        }
       
       return jsonResponse(
            statusCode:201,
            data:[
                'user_id'=>$id,
                'userName'=>$data['userName'],
                // 'uPassword'=>$data['uPassword'],
                'uEmail'=>$data['uEmail'],
                'uPhone'=>$data['uPhone'],
                'uPosition'=>$data['uPosition'],
                'uRole'=>$data['uRole'],
            ],
            message:"User updated successfully"
        );



    }catch(\Throwable $th){
        return jsonResponse(
            statusCode:500,
            data:"Error updating user",
            message:$th->getMessage()
        );
    }

}

function updateRoom($id,$data){
    global $connection;
    try{
       $query = "UPDATE `rooms` SET `room_id`=:id,`roomNumber`=:roomNumber,
       `frPerson`=:frPerson,`location`=:location,`area`=:area,
       `height`=:height,`width`=:width,`length`=:length WHERE room_id = :id";
       $stmt = $connection->prepare($query);
       $stmt->execute([
        'id'=>$id,
        'roomNumber'=>$data['roomNumber'],
        'frPerson'=>$data['frPerson'],
        'location'=>$data['location'],
        'height'=>$data['height'],
        'width'=>$data['width'],
        'length'=>$data['length'],
        'area'=>$data['area'],
       ]);
       return jsonResponse(
            statusCode:201,
            data:[
                'room_id'=>$id,
                'roomNumber'=>$data['roomNumber'],
                'frPerson'=>$data['frPerson'],
                'location'=>$data['location'],
                'height'=>$data['height'],
                'width'=>$data['width'],
                'length'=>$data['length'],
                'area'=>$data['area'],
            ],
            message:"Room updated successfully"
        );



    }catch(\Throwable $th){
        return jsonResponse(
            statusCode:500,
            data:"Error updating user",
            message:$th->getMessage()
        );
    }

}

function updateDevice($id,$data){
    global $connection;
    try{
        $query = "UPDATE `devices` SET `deviceName`=:deviceName, `device_id`=:device_id,
        `zoneNum`=:zoneNum,`reqInterval`=:reqInterval,`status`=:status,`room_id`=:room_id WHERE device_id = :old_device_id";
        $stmt = $connection->prepare($query);
        $stmt->execute([
            // 'id'=>$id,
            'device_id'=>$data['device_id'],
            'deviceName'=>$data['deviceName'],
            'zoneNum'=>$data['zoneNum'],
            'reqInterval'=>$data['reqInterval'],
            'status'=>$data['status'],
            'room_id'=>$data['room_id'],
            'old_device_id'=>$data['old_device_id'],
        ]);
        
        $data['device_id'] = $id;
        return jsonResponse(
            statusCode:201,
            data:$data,
            message:"Device updated successfully"
        );
    }
    catch(PDOException $e){
        return jsonResponse(
            statusCode:500,
            data:"Error updating device",
            message:$e->getMessage()
        );
    }
}

function updateParameter($id){
    global $connection;
    try{
        $data['param_id'] = $id;
        $data['parameter_name'] = $_GET['parameter_name'];
        $data['unitOfMeasure'] = $_GET['unitOfMeasure'];
        $data['pminValue'] = $_GET['pminValue'];
        $data['pmaxValue'] = $_GET['pmaxValue'];
        $query = "UPDATE `parameters` SET `parameter_name`=:parameter_name, `unitOfMeasure`=:unitOfMeasure, `pminValue`=:pminValue, `pmaxValue`=:pmaxValue WHERE `param_id`=:param_id";
        $stmt = $connection->prepare($query);
        $stmt->execute([
            'param_id' => $id,
            'parameter_name' => $data['parameter_name'],
            'unitOfMeasure' => $data['unitOfMeasure'],
            'pminValue' => $data['pminValue'],
            'pmaxValue' => $data['pmaxValue']
        ]); 
        
        return jsonResponse(
            statusCode:200,
            data:$data,
            message:"Parameter updated successfully"
        );
    }catch(\Throwable $th){
        return jsonResponse(
            statusCode:500,
            data:"Error updating parameter in database",
            message:$th->getMessage()
        );
    }
}

function updateRegulation($id){
    global $connection;
    try{
        //UPDATE `techregs` SET `techReg_id`='[value-1]',`param_id`='[value-2]',`maxValue`='[value-3]',`minValue`='[value-4]',`user_id`='[value-5]',`device_id`='[value-6]',`sendMsg`='[value-7]' WHERE 1
        $data['techReg_id'] = $_GET['techReg_id'];
        $data['param_id'] = $_GET['param_id'];
        $data['maxValue'] = $_GET['maxValue'];
        $data['minValue'] = $_GET['minValue'];
        $data['device_id'] = $_GET['device_id'];
        $data['sendMsg'] = $_GET['sendMsg'];

        $query = "UPDATE `techregs` SET `param_id`=:param_id, `maxValue`=:maxValue, `minValue`=:minValue, `sendMsg`=:sendMsg WHERE `techReg_id`=:techReg_id";
        $stmt = $connection->prepare($query);
        $stmt->execute([
            'techReg_id' => $data['techReg_id'],
            'param_id' => $data['param_id'],
            'maxValue' => $data['maxValue'],
            'minValue' => $data['minValue'],
            'sendMsg' => $data['sendMsg']
        ]);
        return jsonResponse(
            statusCode:200,
            data:$data,
            message:"Regulation updated successfully"
        );
    }catch(\Throwable $th){
        return jsonResponse(
            statusCode:500,
            data:"Error updating regulation in database",
            message:$th->getMessage()
        );
    }

}
