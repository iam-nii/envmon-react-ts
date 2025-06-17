<?php
require_once __DIR__ . '/postRoutes.php';
require_once __DIR__ . '/patchRoutes.php';
require_once __DIR__ . '/deleteRoutes.php';
// require_once __DIR__ . '/../../fpdf/fpdf.php';


//Rooms Routes Handler
function getRoomsRoutesHandler($method,$id,$query){
    // echo $method;
    switch($method){
        case 'GET':{
            if($query == 'getRooms'){
                return getRooms();
            }if($query == 'getRoomParameters'){
                return getRoomParameters();
            }
            else{
                return jsonResponse(statusCode:404,data:"Invalid query",message:"Invalid query");
            }
            break;
        }
        case 'POST':{
            $data = json_decode(file_get_contents('php://input'),true);
            return AddRoom($data);
            break;
        }
        case 'DELETE':{
            if(isset($id)){
                return deleteRoom($id);
            }else{
                return jsonResponse(
                    statusCode:404,
                    data:"Id null",
                    message:"No ID was passed to the deleteRoom function"
                );
            }
            break;
        }
        case 'PATCH':{
            if(isset($id)){
                $data = [
                    'roomNumber' => $_GET['roomNumber'],
                    'frPerson' => $_GET['frPerson'],
                    'location' => $_GET['location'],
                    'height' => $_GET['height'],
                    'width' => $_GET['width'],
                    'length' => $_GET['length'],
                    'area' => $_GET['area'],
                ];
                return updateRoom($id,$data);
            }else{
                return jsonResponse(
                    statusCode:404,
                    data:"Id null",
                    message:"No ID was passed to the updateRoom function"
                );
            }
            break;
        }
        default:{
            return jsonResponse(
            statusCode:405,
            data: $method,
            message:"The method you are trying to use is not allowed"
        );
        }
    }
}
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
        return jsonResponse(
            statusCode:200,
            data:$rooms,
            message:"Rooms successfully fetched"
        );
    } catch (\Throwable $th) {
        //throw $th;
        return jsonResponse(
            statusCode:500,
            data:"Error fetching rooms from database",
            message:$th->getMessage()
        );
    }

}


//Users Routes Handler
function getUsersRoutesHandler($method,$id){
    switch($method){
        case 'GET':{
            return getUsers();
            break;
        }
        case 'POST':{
            // return addUser();
            break;
        }
        case 'PATCH':{
            if(isset($id)){
                $data = [
                    'userName' => $_GET['userName'],
                    'uEmail' => $_GET['uEmail'],
                    'uPassword' => $_GET['uPassword'],
                    'uPhone' => $_GET['uPhone'],
                    'uRole' => $_GET['uRole'],
                    'uPosition' => $_GET['uPosition'],
                ];
                return updateUser($id,$data);
            }else{
                return jsonResponse(
                    statusCode:404,
                    data:"Id null",
                    message:"No ID was passed to the updateUser function"
                );
            }
            break;
        }
        case 'DELETE':{
            if(isset($id)){
                return deleteUser($id);
            }else{
                return jsonResponse(
                    statusCode:404,
                    data:"Id null",
                    message:"No ID was passed to the deleteUser function"
                );
            }
            break;
        }
        default:{
        // echo $method;
            return jsonResponse(
                statusCode:405,
                data: $method,
                message:"The User method you are trying to use is not allowed"
            );
        }
        
    }
}
function getUsers(){
    global $connection;
    try {
        $query = "SELECT * FROM users";
        $stmt = $connection->prepare($query);
        $stmt->execute();
        $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
        if(empty($users)){
            return jsonResponse(statusCode:204,data:[],message:"No users found");
        }
        return jsonResponse(
            statusCode:200,
            data:$users,
            message:"Users successfully fetched"
        );
    } catch (\Throwable $th) {
        //throw $th;
        return jsonResponse(
            statusCode:500,
            data:"Error fetching users from database",
            message:$th->getMessage()
        );
    }
}

//Parameters Routes Handler
function getParametersRoutesHandler($method,$query,$id){
    switch($method){
        case 'GET':{
            return getParameters();
            break;
        }
        case 'POST':{
            return AddParameter();
            break;
        }
        case 'PATCH':{
            if(isset($id)){
                return updateParameter($id);
            }else{
                return jsonResponse(
                    statusCode:404,
                    data:"Id null",
                    message:"No ID was passed to the updateParameter function"
                );
            }
            break;
        }
        case 'DELETE':{
            if(isset($id)){
                return deleteParameter($id);
            }else{
                return jsonResponse(
                    statusCode:404,
                    data:"Id null",
                    message:"No ID was passed to the deleteParameter function"
                );
            }
            break;
        }
        default:{
            return jsonResponse(
                statusCode:405,
                data: $method,
                message:"The method you are trying to use is not allowed"
            );
        }
    }
}
function getParameters(){
    global $connection;
    try {
        $query = "SELECT * FROM parameters";
        $stmt = $connection->prepare($query);
        $stmt->execute();
        $parameters = $stmt->fetchAll(PDO::FETCH_ASSOC);
        if(empty($parameters)){
            return jsonResponse(statusCode:204,data:[],message:"No parameters found");
        }
        return jsonResponse(
            statusCode:200,
            data:$parameters,
            message:"Parameters successfully fetched"
        );
    }catch(\Throwable $th){
        return jsonResponse(
            statusCode:500,
            data:"Error fetching parameters from database",
            message:$th->getMessage()
        );
    }
}




//Devices Routes Handler
function getDevicesRoutesHandler($method,$id,$query){
    switch($method){
        case 'GET':{
            if($query == 'getDevices'){
            return getDevices();
            }
            if($query == 'getInterval'){
                return getInterval($id);
            }
            break;
        }
        case 'POST':{
            // Change made here
            $data = json_decode(file_get_contents('php://input'),true);
            return AddDevice($data);
            break;
        }
        case 'PATCH':{
            if(isset($id)){
                $data = [
                    'old_device_id' =>$_GET['old_device_id'],
                    'device_id' => $_GET['device_id'],
                    'deviceName' => $_GET['deviceName'],
                    'zoneNum' => $_GET['zoneNum'],
                    'reqInterval' => $_GET['reqInterval'],
                    'status' => $_GET['status'],
                    'room_id' => $_GET['room_id'],
                ];
                return updateDevice($id,$data);
            }else{
                return jsonResponse(
                    statusCode:404,
                    data:"Id null",
                    message:"No ID was passed to the updateDevice function"
                );
            }
            break;
        }
        case 'DELETE':{
            if(isset($id)){
                return deleteDevice($id);
            }else{
                return jsonResponse(
                    statusCode:404,
                    data:"Id null",
                    message:"No ID was passed to the deleteDevice function"
                );
            }
            break;
        }
        default:{
            return jsonResponse(
                statusCode:405,
                data: $method,
                message:"The method you are trying to use is not allowed"
            );
        }
    }
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
function getInterval($id){
    global $connection;
    try{
        $query = "SELECT reqInterval FROM devices WHERE device_id = :device_id";
        $stmt = $connection->prepare($query);
        $stmt->execute(['device_id' => $id]);
        $interval = $stmt->fetch(PDO::FETCH_ASSOC);
        return jsonResponse(
            statusCode:200,
            data:$interval,
            message:"Interval successfully fetched"
        );
    }catch(\Throwable $th){
        return jsonResponse(
            statusCode:500,
            data:"Error fetching interval from database",
            message:$th->getMessage()
        );
    }
}




// Regulations Routes Handlers
function getSettingsRoutesHandler($method,$query,$id){
    switch($method){
        case 'GET':{
            if($query == 'parameters'){
                // return getDeviceParameters($id);
                // return "Get Device Parameters";
                return getDevParams($id);
            }
            elseif($query == 'settings'){
                return getReqgulations($id);
            }
            elseif($query == 'maxmin'){
                return getMaxMin($id);
            }
            else{
                return jsonResponse(
                    statusCode:404,
                    data:"Invalid query",
                    message:"Invalid query"
                );
            }
            break;
        }
        case 'POST':{
            return AddRegulation();
            break;
        }
        case 'PATCH':{
            return updateRegulation($id);
        }
        case 'DELETE':{
            return deleteRegulation($id);
        }
        default:{
            return jsonResponse(
                statusCode:405,
                data: $method,
                message:"The method you are trying to use is not allowed"
            );
        }
    }
}
function getReqgulations($id){
    global $connection;
    try{
        $query = "SELECT * FROM techregs WHERE device_id = :device_id";
        $stmt = $connection->prepare($query);
        $stmt->execute(['device_id' => $id]);
        $settings = $stmt->fetchAll(PDO::FETCH_ASSOC);
        return jsonResponse(statusCode:200,data:$settings,message:"Settings successfully fetched");
    }catch(\Throwable $th){
        return jsonResponse(statusCode:500,data:"Error fetching settings from database",message:$th->getMessage());
    }
    
}
function getMaxMin($id){
    global $connection;
    try{
        $query = "SELECT `minValue`,`maxValue`,techReg_id, device_id FROM `techregs` WHERE `techReg_id` = :techReg_id";
        $stmt = $connection->prepare($query);
        $stmt->execute(['techReg_id' => $id]);
        $settings = $stmt->fetchAll(PDO::FETCH_ASSOC);
        return jsonResponse(statusCode:200,data:$settings,message:"Settings successfully fetched");
    }catch(\Throwable $th){
        return jsonResponse(statusCode:500,data:"Error fetching settings from database",message:$th->getMessage());
    }
}
// Get the parameters for a device
function getDevParams($device_id){
    global $connection;
    // return $device_id;
    try{
        $query = "SELECT 
        p.param_id, 
        p.parameter_name,
        p.parameter_alias,
        p.unitOfMeasure,
        t.techReg_id,
        t.minValue as min,
        t.maxValue as max
    FROM parameters p
    JOIN techregs t ON p.param_id = t.param_id
    WHERE t.device_id = :device_id";
    // $query = "SELECT * FROM techregs WHERE device_id = :device_id";
    // $query = "SELECT * FROM parameters WHERE param_id IN (SELECT param_id FROM techregs WHERE device_id = :device_id)";
    $stmt = $connection->prepare($query);
    $stmt->execute(['device_id' => $device_id]);
    $params = $stmt->fetchAll(PDO::FETCH_ASSOC);
    return jsonResponse(statusCode:200, data:$params, message:'Device parameters successfully fetched');
    }catch(\Throwable $th){
        return jsonResponse(statusCode:500,data:"Error fetching device parameters from database",message:$th->getMessage());
    }
}
function getDeviceParameters($device_id){
    global $connection;
    try {
        $query = "SELECT param_id,techReg_id FROM techregs WHERE device_id = :device_id";
        $stmt = $connection->prepare($query);
        $stmt->execute(['device_id' => $device_id]);
        $settings = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $count = count($settings);
        $device_params = [];
        foreach($settings as $setting){
            $query = "SELECT param_id, parameter_name,parameter_alias,unitOfMeasure FROM parameters WHERE param_id = :param_id";
            $stmt = $connection->prepare($query);
            $stmt->execute(['param_id' => $setting['param_id']]);
            $param = $stmt->fetch(PDO::FETCH_ASSOC);
            $param['techReg_id'] = $setting['techReg_id'];
            array_push($device_params, $param);
        }


        if(empty($settings)){
            return jsonResponse(statusCode:204,data:[],message:"No settings found");
        }
        return jsonResponse(
            statusCode:200,
            data:$device_params,
            message:"Device parameters successfully fetched"
        );

    }catch(\Throwable $th){
        return jsonResponse(
            statusCode:500,
            data:"Error fetching settings from database",
            message:$th->getMessage()
        );
    }
}




// Logs Routes Handler
function getLogsRoutesHandler($method,$query,$id){
    switch($method){
        case 'GET':{
            if($query == 'getFilteredLogs'){
                $limit = $_GET['limit'];
                $device_id = $_GET['id'];
                return getFilteredLogs($limit,$device_id);
            }
            elseif($query == 'getLastLog'){
                $device_id = $_GET['id'];
                // return $device_id;
                return getLastLog($device_id);
            }
            else{
                return getLogs($id,$query);
            }
        }
        default:{
            return jsonResponse(
                statusCode:405,
                data:$method,
                message:"The method you are trying to use is not allowed"
            );
        }
    }
}
function getFilteredLogs($limit,$device_id){
    global $connection;
    try {
        $query = "SELECT 
            logs.log_id,
            logs.logValue,
            logs.mdt,
            logs.batch_num,
            -- devices.device_id,
            -- techregs.techReg_id,
            techregs.maxValue as max,
            techregs.minValue as min,
            parameters.parameter_name,
            parameters.parameter_alias,
            parameters.unitOfMeasure
        FROM logs 
        JOIN techregs ON logs.techReg_id = techregs.techReg_id
        JOIN parameters ON techregs.param_id = parameters.param_id
        JOIN devices ON techregs.device_id = devices.device_id
        JOIN rooms ON devices.room_id = rooms.room_id
        WHERE devices.device_id = ?
        ORDER BY logs.mdt DESC
        LIMIT ?";
        $stmt = $connection->prepare($query);
        $stmt->bindParam(1, $device_id, PDO::PARAM_INT);
        $stmt->bindParam(2, $limit, PDO::PARAM_INT);
        $stmt->execute();
        $logs = $stmt->fetchAll(PDO::FETCH_ASSOC);
        return jsonResponse(
            statusCode:200,
            data:$logs,
            message:"Logs successfully fetched"
        );
    } catch (\Throwable $th) {
        return jsonResponse(
            statusCode:500,
            data:"Error fetching logs for device $device_id from database",
            message:$th->getMessage()
        );
    }
}
function getLastLog($device_id){
    global $connection;
    if(isset($device_id)){

    try {
        // Get the last batch number
        $query = "SELECT 
            -- logs.log_id,
            -- logs.logValue,
            -- logs.mdt,
            logs.batch_num
            -- devices.device_id,
            -- techregs.techReg_id,
            -- techregs.maxValue as max,
            -- techregs.minValue as min,
            -- parameters.parameter_name,
            -- parameters.parameter_alias,
            -- parameters.unitOfMeasure
        FROM logs 
        JOIN techregs ON logs.techReg_id = techregs.techReg_id
        -- JOIN parameters ON techregs.param_id = parameters.param_id
        JOIN devices ON techregs.device_id = devices.device_id
        -- JOIN rooms ON devices.room_id = rooms.room_id
        WHERE devices.device_id = ?
        ORDER BY logs.mdt DESC
        LIMIT 1";
        $stmt = $connection->prepare($query);
        $stmt->bindParam(1, $device_id, PDO::PARAM_INT);
        $stmt->execute();
        // extract the batch_num from the result
        $last_batch_num = $stmt->fetch(PDO::FETCH_ASSOC);
        $last_batch_num = $last_batch_num['batch_num'];
        // return $last_batch_num;
        // return jsonResponse(statusCode:200,data:$last_batch_num,message:"Last batch number successfully fetched");

        $query = "SELECT 
            logs.log_id,
            logs.logValue,
            logs.mdt,
            logs.batch_num,
            parameters.pminValue as pmin,
            parameters.pmaxValue as pmax,
            -- devices.device_id,
            -- techregs.techReg_id,
            techregs.maxValue as max,
            techregs.minValue as min,
            parameters.parameter_name,
            parameters.parameter_alias,
            parameters.unitOfMeasure
        FROM logs 
        JOIN techregs ON logs.techReg_id = techregs.techReg_id
        JOIN parameters ON techregs.param_id = parameters.param_id
        JOIN devices ON techregs.device_id = devices.device_id
        JOIN rooms ON devices.room_id = rooms.room_id
        WHERE logs.batch_num = ?
        ORDER BY logs.mdt DESC";
        $stmt = $connection->prepare($query);
        $stmt->bindParam(1, $last_batch_num, PDO::PARAM_INT);
        $stmt->execute();
        $logs = $stmt->fetchAll(PDO::FETCH_ASSOC);
        return jsonResponse(
            statusCode:200,
            data:$logs,
            message:"Logs successfully fetched"
        );
    } catch (\Throwable $th) {
        return jsonResponse(
            statusCode:500,
            data:"Error fetching logs for device $device_id from database",
            message:$th->getMessage()
        );
    }
    }else{
        return jsonResponse(
            statusCode:404,
            data:"Device ID is required",
            message:"Device ID is required"
        );
    }

}


function getLogs($techReg_id,$limit){
    global $connection;
    if($limit == "all"){
        try{
            $query = "SELECT * FROM logs WHERE techReg_id = :techReg_id ORDER BY batch_num DESC";
            $stmt = $connection->prepare($query);
            $stmt->bindParam(':techReg_id', $techReg_id, PDO::PARAM_INT);
            $stmt->execute();
            $logs = $stmt->fetchAll(PDO::FETCH_ASSOC);
            return jsonResponse(
                statusCode:200,
                data:$logs,
                message:"Logs successfully fetched"
            );
        }catch(\Throwable $th){
            return jsonResponse(
                statusCode:500,
                data:"Error fetching logs from database",
                message:$th->getMessage()
            );
        }
    }else{
        try{
            $query = "SELECT * FROM logs WHERE techReg_id = :techReg_id ORDER BY batch_num DESC LIMIT :limit";
            $stmt = $connection->prepare($query);
            $stmt->bindParam(':techReg_id', $techReg_id, PDO::PARAM_INT);
            $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
            $stmt->execute();
            $logs = $stmt->fetchAll(PDO::FETCH_ASSOC);
            return jsonResponse(
                statusCode:200,
                data:$logs,
                message:"Logs successfully fetched"
            );
        }catch(\Throwable $th){
            return jsonResponse(
                statusCode:500,
                data:"Error fetching logs from database",
                message:$th->getMessage()
            );
        }
    }
   
    
}





function getLastMDt(){
    global $connection;
    try{
        $query = "SELECT mdt FROM logs ORDER BY mdt DESC LIMIT 1";
        $stmt = $connection->prepare($query);
        $stmt->execute();
        $last_mdt = $stmt->fetch(PDO::FETCH_ASSOC);
        return jsonResponse(statusCode:200,data:$last_mdt,message:"Last mdt successfully fetched");
    }catch(\Throwable $th){
        return jsonResponse(statusCode:500,data:"Error fetching last mdt from database",message:$th->getMessage());
    }
}

//Reports Routes Handler
function getReportsRoutesHandler($method,$query,$data){
    switch($method){
        case 'GET':{
            
            if($query == 'getAllReports'){
                return getAllReports();
            }
            if($query == 'getSettings'){
                return getSettings();
            }
            if($query == 'setSettings'){
                return setSettings($data);
            }
            if($query == 'getFilteredReports'){
                if(isset($_GET['minDate']) && isset($_GET['maxDate'])){
                    $minDate = $_GET['minDate'];
                    $maxDate = $_GET['maxDate'];
                    // return $maxDate;
                    return getFilteredReports($minDate,$maxDate);
                }
                
                
            }
            else{
                return jsonResponse(statusCode:404,data:"Invalid query",message:"Invalid query");
            }
        }
        case 'POST':{
            // if($query == 'sendMail'){
            //     return sendMail();
            // }
            if($query == 'setSettings'){
                return setSettings($data);
            }
            // if($query == 'generateReport'){
            //     return generateReport($data);
            // }
            else{
                return jsonResponse(statusCode:404,data:"Invalid query",message:"Invalid query");
            }
        }
    }
}
function sendMail(){
    try{
        $mailTo = $_GET['mailTo'];
        $mailSubject = $_GET['mailSubject'];
        $message = $_GET['message'];
        $headers = "From: " .$_GET['mailFrom'];
        $data = [
        'mailTo' => $mailTo,
        'mailSubject' => $mailSubject,
        'message' => $message,
        'headers' => $headers
        ];
        
        // $content = http_build_query($_GET) . ' ' . $mydatetime . PHP_EOL;
        // file_put_contents('warning_'.$mydate.'.txt',http_build_query($_GET).' '.$mydatetime.PHP_EOL,FILE_APPEND);
        // file_put_contents('warning_'.$mydate.'.txt', "\xEF\xBB\xBF" . $content, FILE_APPEND);

        // mail($mailTo,$mailSubject,$message,$headers);
        return jsonResponse(statusCode:200,data:$data,message:"Mail sent successfully");
    }catch(\Throwable $th){
        return jsonResponse(statusCode:500,data:"Error sending mail",message:$th->getMessage());
    }
    
    
}
function getRoomParameters(){
    global $connection;
    try{
        $query = "SELECT
        r.room_id,
        r.roomNumber,
        d.device_id,
        d.zoneNum,
        tr.maxValue as max,
        tr.minValue as min,
        p.param_id,
        p.parameter_name,
        p.parameter_alias,  
        p.unitOfMeasure
        FROM rooms r
        JOIN devices d ON d.room_id = r.room_id
        JOIN techregs tr ON tr.device_id = d.device_id
        JOIN parameters p ON p.param_id = tr.param_id
        ORDER BY r.room_id, d.device_id, p.param_id;";
        $stmt = $connection->prepare($query);
        $stmt->execute();
        $parameters = $stmt->fetchAll(PDO::FETCH_ASSOC);
        return jsonResponse(
            statusCode:200,
            data:$parameters,
            message:"Room parameters successfully fetched");
    }catch(\Throwable $th){
        return jsonResponse(
            statusCode:500,
            data:"Error fetching room parameters from database",
            message:$th->getMessage());
    }
}
function getAllReports(){
    global $connection; 
    try{
        $query = "SELECT 
        rooms.roomNumber,
        logs.log_id,
        logs.logValue,
        logs.mdt,
        -- devices.deviceName,
        -- techregs.techReg_id,
        -- techregs.device_id,
        -- techregs.param_id,
        -- techregs.maxValue as max,
        -- techregs.minValue as min,
        parameters.parameter_name
        -- parameters.parameter_alias,
        -- parameters.unitOfMeasure
        FROM logs JOIN techregs ON logs.techReg_id = techregs.techReg_id
        JOIN parameters ON techregs.param_id = parameters.param_id
        JOIN devices ON techregs.device_id = devices.device_id
        JOIN rooms ON devices.room_id = rooms.room_id
        WHERE logs.logValue < techregs.minValue OR logs.logValue > techregs.maxValue
        ORDER BY logs.mdt DESC ";
        $stmt = $connection->prepare($query);
        $stmt->execute();
        $reports = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        return jsonResponse(statusCode:200,data:$reports,message:"Reports fetched successfully");


    }catch(\Throwable $th){
        return jsonResponse(statusCode:500,data:"Error fetching reports",message:$th->getMessage());
    }
}
function getFilteredReports($minDate,$maxDate){
    global $connection; 
    try{
        $query = "SELECT 
        rooms.roomNumber,
        logs.log_id,
        logs.logValue,
        logs.mdt,
        -- devices.deviceName,
        -- techregs.techReg_id,
        -- techregs.device_id,
        -- techregs.param_id,
        techregs.maxValue as max,
        techregs.minValue as min,
        parameters.parameter_name,
        parameters.pminValue as pmin,
        parameters.pmaxValue as pmax
        -- parameters.parameter_alias,
        -- parameters.unitOfMeasure
        FROM logs JOIN techregs ON logs.techReg_id = techregs.techReg_id
        JOIN parameters ON techregs.param_id = parameters.param_id
        JOIN devices ON techregs.device_id = devices.device_id
        JOIN rooms ON devices.room_id = rooms.room_id
        WHERE (logs.logValue < techregs.minValue OR logs.logValue > techregs.maxValue)
  AND (logs.logValue >= parameters.pminValue AND logs.logValue <= parameters.pmaxValue)
        AND logs.mdt >= :minDate AND logs.mdt <= :maxDate
        ORDER BY logs.mdt DESC ";
        $stmt = $connection->prepare($query);
        $stmt->execute([
            'minDate'=>$minDate,
            'maxDate' =>$maxDate,
        ]);
        $reports = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        return jsonResponse(statusCode:200,data:$reports,message:"Reports fetched successfully");


    }catch(\Throwable $th){
        return jsonResponse(statusCode:500,data:"Error fetching reports",message:$th->getMessage());
    }
}
function getSettings(){
    try{
        $settings = file_get_contents(__DIR__ . '/../reports/settings.json');
        $settings = json_decode($settings,true);
        return jsonResponse(statusCode:200,data:$settings,message:"Settings fetched successfully");
    }catch(\Throwable $th){
        return jsonResponse(statusCode:500,data:"Error fetching settings",message:$th->getMessage());
    }
}


