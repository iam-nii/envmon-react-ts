<?php
function getRooms(){
    global $connection;
    try {
        $query = "SELECT * FROM rooms";
        $stmt = $connection->prepare($query);
        $stmt->execute();
        $rooms = $stmt->fetchAll(PDO::FETCH_ASSOC);
        if(empty($rooms)){
            return jsonResponse(statusCode:204,data:[],message:"No rooms found");
        }
        return jsonResponse(statusCode:200,data:$rooms,message:"Rooms succfully fetched");
    } catch (\Throwable $th) {
        //throw $th;
        return jsonResponse(
            statusCode:500,
            data:"Error fetching rooms from database",
            message:$th->getMessage()
        );
    }

}

function getParameters(){

}

function getDevices(){
    global $connection;
    try {
        $query = "SELECT * FROM devices";
        $stmt = $connection->prepare($query);
        $stmt->execute();
        $devices = $stmt->fetchAll(PDO::FETCH_ASSOC);
        if(empty($devices)){
            return jsonResponse(statusCode:204,data:[],message:"No devices found");
        }else{
            return jsonResponse(statusCode:200,data:$devices,message:"Devices successfully fetched");
        }
    }catch(\Throwable $th){
        return jsonResponse(
            statusCode:500,
            data:"Error fetching devices from database",
            message:$th->getMessage()
        );
    }
}