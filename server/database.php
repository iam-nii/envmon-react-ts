<?php

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
    public function __construct($host="localhost", $username="root", $password="root", $database="monitoring"){
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
            echo "Connecting to database...";
            $this->connection = new PDO("mysql:host=$this->host;dbname=$this->database",$this->username,$this->password);
            // echo "Connected to database successfully.";
            return "Database connected seccessfully";
        } catch (PDOException $exception) {
            die("Connection failed: " . $exception->getMessage());
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