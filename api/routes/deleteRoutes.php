<?php

function deleteRoom($id){
    global $connection;
    try {
        $query = "DELETE FROM rooms WHERE room_id = :id";
        $stmt = $connection->prepare($query);
        $stmt->execute(['id'=>$id]);
        return jsonResponse(
            statusCode:200,
            data:"Room successfully deleted",
            message:"Room successfully deleted"
        );
    } catch (\Throwable $th) {
        $message = $th->getMessage();
        $code = null;
        $status = 500;
        if ($th instanceof \PDOException && isset($th->errorInfo[1])) {
            $code = $th->errorInfo[1]; // MySQL error code, e.g., 1451
        }
        // Optionally, provide a custom message for integrity constraint violations
        if ($code === 1451) {
            $message = "В данной помещении есть устройства. Удалите их, чтобы удалить помещение.";
            $status = 409;
        }
        return jsonResponse(
            statusCode: $status,
            data: "Error deleting room from database",
            message: $message
        );
        // return jsonResponse(
        //     statusCode:500,
        //     data:"Error deleting room from database",
        //     message:$th->getMessage()
        // );
    }
}

function deleteUser($id){
    global $connection;
    try {
        $query = "DELETE FROM users WHERE user_id = :id";
        $stmt = $connection->prepare($query);
        $stmt->execute(['id'=>$id]);
        return jsonResponse(
            statusCode:200,
            data:"User successfully deleted",
            message:"User successfully deleted"
        );
    } catch (\Throwable $th) {
        return jsonResponse(
            statusCode:500,
            data:"Error deleting user from database",
            message:$th->getMessage()
        );
    }
}

function deleteDevice($id){
    global $connection;
    try {
        $query = "DELETE FROM devices WHERE device_id = :id";
        $stmt = $connection->prepare($query);
        $stmt->execute(['id'=>$id]);
        return jsonResponse(
            statusCode:200,
            data:"Device successfully deleted",
            message:"Device successfully deleted"
        );
    } catch (\Throwable $th) {
        return jsonResponse(
            statusCode:500,
            data:"Error deleting device from database",
            message:$th->getMessage()
        );
    }
}

function deleteParameter($id){
    global $connection;
    try{
        $query = "DELETE FROM `parameters` WHERE `param_id`=:param_id";
        $stmt = $connection->prepare($query);
        $stmt->execute(['param_id' => $id]);
        return jsonResponse(
            statusCode:200,
            data:$id,
            message:"Parameter deleted successfully"
        );
    }catch(\Throwable $th){
        return jsonResponse(
            statusCode:500,
            data:"Error deleting parameter from database",
            message:$th->getMessage()
        );
    }

}

function deleteRegulation($id){
    global $connection;
    try{
        $query = "DELETE FROM `techregs` WHERE `techReg_id`=:techReg_id";
        $stmt = $connection->prepare($query);
        $stmt->execute(['techReg_id' => $id]);
        return jsonResponse(statusCode:200,data:$id,message:"Regulation deleted successfully");
    }catch(\Throwable $th){
        return jsonResponse(statusCode:500,data:"Error deleting regulation from database",message:$th->getMessage());
    }
}