<?php
// echo "\nDatabase.php";
class DatabaseConnector{
    private $host;
    private $username;
    private $password;
    private $database;
    private $connection;

    /**
     * Constructor to initialize database credentials.
     * @param string $host
     * @param string $username
     * @param string $password
     * @param string $database
     */
    public function __construct($host="127.0.0.1", $username="root", $password="root", $database="monitoring"){
        $this->host = $host;
        $this->username = $username;
        $this->password = $password;
        $this->database = $database;
        }

    /**
     * Method to connect to the database.
     * @return string
     */
    
    public function connect(){
        try {
            // echo "Connecting to database...\n";
            $this->connection = new PDO("mysql:host=$this->host;dbname=$this->database;charset=utf8mb4",$this->username,$this->password,[
                PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4",
            ]);
            // echo "Connected to database successfully.";
            return "Database connected seccessfully";
        } catch (PDOException $exception) {
            error_log("Connection failed: " . $exception->getMessage());
            return "Connection failed" .$exception->getMessage();
        }
    }
    /**
     * Method to get the database connection object.
     * @return PDO|null
     */
    public function getConnection(){
        return $this->connection;
        }
    
}