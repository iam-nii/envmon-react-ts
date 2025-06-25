<?php
require_once __DIR__ . '/../database.php';
require_once 'SaveToDatabase.php';
//echo $_GET['apikey'];
// Connect to the database
$databaseConnector = new DatabaseConnector();
$databaseConnector->connect();
$connection = $databaseConnector->getConnection();

$mydate = date('Y-m-d',strtotime("+3 hours"));
$mydatetime = date('Y-m-d H:i:s',strtotime("+3 hours"));
$paramTechRegMap = [];
// $device_id = null;
if(isset($_GET['devID'])){
    // $device_id = $_GET['devID'];
        file_put_contents('log_'.$mydate.'.txt',http_build_query($_GET).' '.$mydatetime.PHP_EOL,FILE_APPEND);
	    saveFromSensors();
    }

//sprintf(pars, "?devID=%s&TVOC=%d&CO2=%d&L=%d&T=%d&H=%d&P=%d",devID,tvoc,co2,lux,temper,humid,pressure);
// echo "I'm Ok!";


// This function is used to save the data from the sensors to the database
function saveFromSensors(){

    global $connection;
    global $mydate;
    global $mydatetime;
    // Get the device id from the get request
    // $device_id = $_GET['id'];
    $device_id = $_GET['devID'];   
    // file_put_contents('log_'.$mydate.'.txt',$device_id.' '.$mydatetime.PHP_EOL,FILE_APPEND);

    
    // Get the device request interval
    
    try {
        $query = $connection->prepare("SELECT reqInterval FROM devices WHERE device_id = :device_id");
        $query->execute(['device_id' => $_GET['devID']]);
        // file_put_contents('log_'.$mydate.'.txt','Request interval recieved'.' '.$mydatetime.PHP_EOL,FILE_APPEND);
        $response = $query->fetch(PDO::FETCH_ASSOC);
        try {
            if($response == null){
                return jsonResponse(
                    statusCode:400,
                    data:"Device not found",
                    message:"Device not found"
                );
            }
        }catch(\Throwable $th){
            return jsonResponse(
                statusCode:500,
                data:"Error: " . $th->getMessage(),
                message:"Error: " . $th->getMessage()
            );
        file_put_contents('log_'.$mydate.'.txt','Error in getting request interval'.'.'.$th->getMessage().' '.$mydatetime.PHP_EOL,FILE_APPEND);

        }
        $reqInterval = $response['reqInterval'];

        file_put_contents('log_'.$mydate.'.txt', $reqInterval .' '.$mydatetime.PHP_EOL,FILE_APPEND);
    
        $query = $connection->prepare("SELECT * FROM techRegs WHERE device_id = :device_id");
        $query->execute(['device_id' => $device_id]);
        $response = $query->fetch(PDO::FETCH_ASSOC);
        $techReg_id = $response['techReg_id'];
        // echo jsonResponse(
        //     statusCode:200,
        //     data:$techReg_id,
        //     message:"TechReg ID retrieved successfully"
        // );
    
        // Get the last logged data
        $query = $connection->prepare("SELECT * FROM logs WHERE techReg_id = :techReg_id ORDER BY mdt DESC LIMIT 1");
        $query->execute(['techReg_id' => $techReg_id]);
        $response = $query->fetch(PDO::FETCH_ASSOC);
        $lastSavedAt = $response['mdt'];
        // return $lastLoggedData;
    
        $currentTimestamp = time() + 3 * 3600;
    
        // Convert lastSavedAt to timestamp, or 0 if null
        $lastSavedTimestamp = $lastSavedAt ? strtotime($lastSavedAt) : 0;
    
        // Check if at least reqInterval seconds have passed since last save
        if (($currentTimestamp - $lastSavedTimestamp) >= $reqInterval) {
            // Save the data to the database
    // Get the device request interval

            return saveData($device_id);
            // return jsonResponse(
            //     statusCode:200,
            //     data: $_GET,
            //     message:"Data stored successfully"
            // );
        }else{
            $timeDiff = $currentTimestamp - $lastSavedTimestamp;
            return jsonResponse(
                statusCode:200,
                data:"Data not stored $timeDiff seconds ago",
                message:"Data last logged at $lastSavedAt"
            );
        }
    } catch (\Throwable $th) {
        // add the line number to the error message
        $trace = $th->getTrace();
        $line = $trace[0]['line'];
        return jsonResponse(
            statusCode:500,
            data:"Error: " . $th->getMessage(),
            message:"Error: " . $th->getMessage()
        );
    }   
    
}
function saveData($device_id) {
    global $connection;
    global $paramTechRegMap;
    global $mydate;
    global $mydatetime;
    
    $query = $connection->prepare("SELECT param_id, parameter_alias FROM parameters");
    $query->execute();
    $parameters = $query->fetchAll(PDO::FETCH_ASSOC); // [ ["param_id" => 1, "parameter_alias" => "T"], ... ]
    // echo "\nParameters: " . json_encode($this->parameters); 
    // Create a link between the aliases and the techRegID
    
    // Get the techRegID for each param
    foreach($parameters as $param){
        try {
            $paramID = $param['param_id'];
            $paramAlias = $param['parameter_alias'];

            $query = $connection->prepare("SELECT techReg_id FROM techregs WHERE param_id = :param_id AND device_id = :device_id  ");
            $query->execute(['param_id' => $paramID, 'device_id' => $device_id]);
            $techReg_id = $query->fetchAll(PDO::FETCH_COLUMN);

            //Directly get the techReg_id
            $paramTechRegMap[$paramAlias] = $techReg_id;
            

            
        } catch (\Throwable $th) {
            // echo "Error getting techRegID for paramID: " . $th->getMessage();
            $paramTechRegMap[$paramAlias] = [];
            return jsonResponse(
                statusCode:500,
                data:"Error getting techRegID for paramID",
                message:$th->getMessage()
            );
        }
    }
    // echo "\nParamTechRegMap: " . json_encode($this->paramTechRegMap);
    
    $query = $connection->prepare("SELECT batch_num FROM logs ORDER BY batch_num DESC LIMIT 1");
    $query->execute();
    $result = $query->fetch(PDO::FETCH_ASSOC);
    
    $last_batch_num = $result['batch_num'] ?? 0; // Return null if no logs exist
    
    try {
        // Generate sensor values
        // echo "\nGenerating sensor values";
        // $sensorData = $this->generateValues();
        $sensorData = $_GET;
        $sensorData['batch_num'] = $last_batch_num + 1;
        $timestamp = date('Y.m.d H:i:s',strtotime("+3 hours"));
        $sensorData['mdt'] = $timestamp;
        // return jsonResponse(
            //     statusCode:200,
            //     data:$sensorData,
        //     message:"Data stored successfully"
        // );
        // $stmt = $connection->prepare("SELECT");
        // print_r($sensorData);
        // print_r($this->paramTechRegMap);
        
        // Prepare SQL insert statement
        // INSERT INTO `logs`(`log_id`, `logValue`, `mdt`, `techRegID`) VALUES ('[value-1]','[value-2]','[value-3]','[value-4]')
        foreach($paramTechRegMap as $paramAlias => $techReg_ids){
            if(count($techReg_ids) > 0){
                $stmt = $connection->prepare("INSERT INTO `logs`(`batch_num`, `logValue`, `mdt`, `techReg_id`) VALUES (:batch_num, :logValue, :mdt, :techReg_id)");
                $stmt->execute([
                    'batch_num' => $last_batch_num + 1,
                    'logValue' => $sensorData[$paramAlias],
                    'mdt' => $timestamp,
                    'techReg_id' => $techReg_ids[0]
                ]);
            }
            
        }
        file_put_contents('log_'.$mydate.'.txt','Data stored successfully'.' '.$mydatetime.PHP_EOL,FILE_APPEND);
        $mydate = date('Y.m.d',strtotime("+3 hours"));
        $mydatetime = date('Y.m.d H:i:s',strtotime("+3 hours"));
        $sensorData['batch_num'] = $last_batch_num + 1;
        // Log success (optional)
        // error_log("Data stored successfully for device {$this->deviceID} at {$sensorData['timestamp']}");
        // file_put_contents('log_'.$mydate.'.txt',http_build_query($sensorData).' '.$mydatetime.PHP_EOL,FILE_APPEND);
        // echo "\nData stored successfully for device {$this->deviceID} at {$sensorData['timestamp']}";
        // pruneLogs();
        file_put_contents('log_'.$mydate.'.txt','Data stored successfully'.' '.$mydatetime.PHP_EOL,FILE_APPEND);

        return jsonResponse(
            statusCode:200,
            data:$sensorData,
            message:"Data stored successfully"
        );
    } catch (\Throwable $th) {
        $trace = $th->getTrace();
        $line = $trace[0]['line'];
        file_put_contents('log_'.$mydate.'.txt','Error in storing data'.'.'.$th->getMessage().' '.$line.PHP_EOL,FILE_APPEND);

        error_log("Error storing sensor data: " . $th->getMessage());
        // echo "\nError storing sensor data: " . $th->getMessage();
        return jsonResponse(
            statusCode:500,
            data:"Error storing sensor data",
            message:$th->getMessage()
        );
        // Continue running despite errors
    }
    
    
    // Sleep for the specified interval
    // sleep($this->reqInterval);
    // Infinite loop to continuously collect data
    // $count = 100;
    // while ($count > 0) {
    //     $count -= $count;

    //     // Get the last log id
       
    // }
}


// This function simulates the saveFromSensors function
function saveToDatabase($device_id){
    global $connection;
    // Create a new SaveToDatabase object
    $saveToDatabase = new SaveToDatabase($connection,$device_id);

    // Call the saveToDatabase method
    return $saveToDatabase->startSensorDataCollection();
}
// This function is used to get the data from the database to the client
function GetData($device_id){
    global $connection;
    global $paramTechRegMap;

    // Get the last batch number from the database
    $query = $connection->prepare("SELECT batch_num, mdt FROM logs ORDER BY batch_num DESC LIMIT 1");
    $query->execute();
    $result = $query->fetch(PDO::FETCH_ASSOC);

    $last_batch_num = $result['batch_num'];  // Return null if no logs exist
    $last_mdt = $result['mdt'];
    $query = $connection->prepare("SELECT * FROM logs WHERE batch_num = :batch_num");
    $query->execute(['batch_num' => $last_batch_num]);
    $result = $query->fetchAll(PDO::FETCH_ASSOC);

    $data = [];
    

    // loop through the result and get the techReg_id
    foreach($result as $row){
        // Get the param_id from the techReg_id
        $query = $connection->prepare("SELECT param_id FROM techRegs WHERE techReg_id = :techReg_id");
        $query->execute(['techReg_id' => $row['techReg_id']]);
        $response = $query->fetch(PDO::FETCH_ASSOC);
        $param_id = $response['param_id'];

        // Get the parameter_alias from the param_id
        $query = $connection->prepare("SELECT parameter_alias FROM parameters WHERE param_id = :param_id");
        $query->execute(['param_id' => $param_id]);
        $response = $query->fetch(PDO::FETCH_ASSOC);
        $parameter_alias = $response['parameter_alias'];

        // Add the parameter_alias and logValue to the data array
        $data[$parameter_alias] = $row['logValue'];
    }
    $data['batch_num'] = $last_batch_num;
    $data['timestamp'] = $last_mdt;

    return jsonResponse(
        statusCode:200,
        data:$data,
        message:"Data retrieved successfully"
    );

}
function pruneLogs(){
    global $connection;
    // After inserting logs in your app:
    try {
        $stmt = $connection->prepare("SELECT COUNT(*) as count FROM logs ");
        $stmt->execute();
        $rowCount = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if($rowCount['count'] >= 20000){
            $temp = $rowCount['count'] - 10000;  
            $temp = (int)$temp;
            $stmt = $connection->prepare("DELETE FROM logs ORDER BY mdt ASC LIMIT 10000");
            $stmt->execute();
            // echo "\nTemp: " . $temp;
        }
    } catch (\Throwable $th) {
        echo "\nError getting rowCount: " . $th->getMessage();
    }    
}

?>