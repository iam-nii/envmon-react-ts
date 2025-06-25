<?php
// require_once './../api/helperFunctions.php';
require_once __DIR__ . '/../api/helperFunctions.php';
class SaveToDatabase{
    private $connection;
    private $deviceID;
    private $reqInterval;
    private $parameters;
    private $paramTechRegMap = [];
    private $data = [];

    public function __construct($connection, $deviceID, $data = null){
        if($connection){
            try{
                $this->connection = $connection;
                $this->deviceID = $deviceID;
                $this->data = $data;
                $query = $connection->prepare("SELECT reqInterval FROM devices WHERE device_id = :deviceID");
                $query->execute(['deviceID' => $deviceID]);
                $response = $query->fetch(PDO::FETCH_ASSOC);

                $this->reqInterval = $response['reqInterval'];
                // echo "\nReqInterval: " . $this->reqInterval;
            }catch(\Throwable $th){
                echo "\nError getting reqInterval" . $th->getMessage();
                return jsonResponse(
                    statusCode:500,
                    data:"Error getting reqInterval",
                    message:$th->getMessage()
                );   
            }
        }
    }

    private function generateValues(){
        // $deviceID = $_GET['devID'];
        // $TVOC = $_GET['TVOC'];
        // $CO2 = $_GET['CO2'];
        // $LUX = $_GET['L'];
        // $TEMPERATURE = $_GET['T'];
        // $HUMIDITY = $_GET['H'];
        // $PRESSURE = $_GET['P'];
    
        // Generate values within observed ranges with small variations
        $TVOC = rand(25, 60); // Observed range: 28-58
        $CO2 = rand(490, 550); // Observed range: 499-544
        $LUX = rand(108, 119); // Observed range: 108-119
        $TEMPERATURE = rand(21,22); // Constant in the sample data
        $HUMIDITY = rand(42,43); // Constant in the sample data
        $PRESSURE = 764; // Constant in the sample data
        
        return [
            'devID' => $this->deviceID,
            'TVOC' => $TVOC,
            'CO2' => $CO2,
            'L' => $LUX,
            'T' => $TEMPERATURE,
            'H' => $HUMIDITY,
            'P' => $PRESSURE,
            'timestamp' => date('Y.m.d H:i:s',strtotime("+3 hours")) // Current timestamp
        ];
    }

    public function startSensorDataCollection() {
        // echo "\nStarting sensor data collection";
        // Validate interval
        if ($this->reqInterval <= 0) {
            return jsonResponse(
                statusCode: 400,
                data: "Invalid request interval",
                message: "Request interval must be greater than 0"
            );
        }
        $query = $this->connection->prepare("SELECT param_id, parameter_alias FROM parameters");
        $query->execute();
        $this->parameters = $query->fetchAll(PDO::FETCH_ASSOC); // [ ["param_id" => 1, "parameter_alias" => "T"], ... ]
        // echo "\nParameters: " . json_encode($this->parameters); 
        // Create a link between the aliases and the techRegID
        
        // Get the techRegID for each param
        foreach($this->parameters as $param){
            try {
                $paramID = $param['param_id'];
                $paramAlias = $param['parameter_alias'];

                $query = $this->connection->prepare("SELECT techReg_id FROM techregs WHERE param_id = :param_id AND device_id = :device_id  ");
                $query->execute(['param_id' => $paramID, 'device_id' => $this->deviceID]);
                $techReg_id = $query->fetchAll(PDO::FETCH_COLUMN);

                //Directly get the techReg_id
                $this->paramTechRegMap[$paramAlias] = $techReg_id;
                

                
            } catch (\Throwable $th) {
                // echo "Error getting techRegID for paramID: " . $th->getMessage();
                $this->paramTechRegMap[$paramAlias] = [];
                return jsonResponse(
                    statusCode:500,
                    data:"Error getting techRegID for paramID",
                    message:$th->getMessage()
                );
            }
        }
        // echo "\nParamTechRegMap: " . json_encode($this->paramTechRegMap);
                
        $query = $this->connection->prepare("SELECT batch_num FROM logs ORDER BY batch_num DESC LIMIT 1");
        $query->execute();
        $result = $query->fetch(PDO::FETCH_ASSOC);
    
        $last_batch_num = $result['batch_num'] ?? 0; // Return null if no logs exist

        try {
            // Generate sensor values
            // echo "\nGenerating sensor values";
            $sensorData = $this->generateValues();
            // $stmt = $connection->prepare("SELECT");
            // print_r($sensorData);
            // print_r($this->paramTechRegMap);
            
            // Prepare SQL insert statement
            // INSERT INTO `logs`(`log_id`, `logValue`, `mdt`, `techRegID`) VALUES ('[value-1]','[value-2]','[value-3]','[value-4]')
            foreach($this->paramTechRegMap as $paramAlias => $techReg_ids){
                if(count($techReg_ids) > 0){
                $stmt = $this->connection->prepare("INSERT INTO `logs`(`batch_num`, `logValue`, `mdt`, `techReg_id`) VALUES (:batch_num, :logValue, :mdt, :techReg_id)");
                $stmt->execute([
                    'batch_num' => $last_batch_num + 1,
                    'logValue' => $sensorData[$paramAlias],
                    'mdt' => $sensorData['timestamp'],
                    'techReg_id' => $techReg_ids[0]
                    ]);
                }
                
            }
            $mydate = date('Y.m.d',strtotime("+3 hours"));
            $mydatetime = date('Y.m.d H:i:s',strtotime("+3 hours"));
            $sensorData['batch_num'] = $last_batch_num + 1;
            // Log success (optional)
            // error_log("Data stored successfully for device {$this->deviceID} at {$sensorData['timestamp']}");
            // file_put_contents('log_'.$mydate.'.txt',http_build_query($sensorData).' '.$mydatetime.PHP_EOL,FILE_APPEND);
            // echo "\nData stored successfully for device {$this->deviceID} at {$sensorData['timestamp']}";
            $this->pruneLogs();
            return jsonResponse(
                statusCode:200,
                data:$sensorData,
                message:"Data stored successfully"
            );
        } catch (\Throwable $th) {
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
        sleep($this->reqInterval);
        // Infinite loop to continuously collect data
        // $count = 100;
        // while ($count > 0) {
        //     $count -= $count;

        //     // Get the last log id
           
        // }
    }
    
    private function pruneLogs(){
        // After inserting logs in your app:
        try {
            $stmt = $this->connection->prepare("SELECT COUNT(*) as count FROM logs");
            $stmt->execute();
            $rowCount = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if($rowCount['count'] >= 1000){
                $temp = $rowCount['count'] - 1000;  
                $temp = (int)$temp;
                $stmt = $this->connection->prepare("DELETE FROM logs ORDER BY mdt ASC LIMIT 10");
                $stmt->execute();
                // echo "\nTemp: " . $temp;
            }
        } catch (\Throwable $th) {
            echo "\nError getting rowCount: " . $th->getMessage();
        }    
    }
}