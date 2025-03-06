<?php

require_once __DIR__ . '/../helperFunctions.php';

function isAuthenticated(){
    return isset($_SESSION['user']);
}

function getAuthenticatedUser(){
    return $_SESSION['user'];
}

function signUp($data){
    global $connection;
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);

    // Validate the input data

    $errors = validateSignupData($data);

    if(!empty($errors)){
        return jsonResponse(400,['errors'=>$errors],"Error Validating user");
    }

    // Hash the password
    $hashedPassword = password_hash($data['uPassword'], PASSWORD_DEFAULT);

    try {
        $stmt = $connection->prepare("
        INSERT INTO users (user_id, userName, uEmail, uRole, uPosition, uPassword, remember_token, created_at, updated_at)
        VALUES (:user_id, :userName, :uEmail, :uPosition, :uRole, :uPassword, :remember_token, :created_at, :updated_at)");

        $stmt->execute([
        'user_id' => $data['user_id'],
        'userName' => $data['userName'],
        'uEmail' => $data['uEmail'],
        'uPosition' => $data['uPosition'],
        'uRole' => $data['uRole'],
        'uPassword' => $hashedPassword,
        'remember_token' => null,
        'created_at' => date('Y-m-d H:i:s'),
        'updated_at' => date('Y-m-d H:i:s'),
        ]);


        $token = generateToken($data['user_id']);
        return jsonResponse(
            statusCode:201, 
            data:[
                'user'=>[
                    'user_id'=>$data['user_id'],
                    'userName'=>$data['userName'],
                    'uEmail'=>$data['uEmail'],
                    'uPosition'=>$data['uPosition'],
                    'uRole'=>$data['uRole'],
                ],
                'token' => $token
            ],
            message:"User created successfully"
        );
    } catch (\Throwable $th) {
        echo $th->getMessage();
        return jsonResponse(
            statusCode:500,
            data: $th->getMessage(),
            message: "Internal server error"
        );
    }catch(PDOException $exception){
        echo $exception->getMessage();
        return jsonResponse(
            statusCode:500,
            data: $exception->getMessage(),
            message: "Internal server error"
        );
    }
    
}

function signIn($data){
    global $connection;

    // Get the raw input data
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);

    //Validate the input data
    if(empty($data['uEmail']) || empty($data['uPassword'])){
        return jsonResponse(
            statusCode:400,
            data: "Email and password are required",
            message: "Invalid request"
        );
    };
    try{
        //         SELECT user_id, userName, uEmail, uRole, uPosition, uPassword, remember_token, created_at, updated_at
        // FROM monitoring.users;
        // Fetch the user form the database
        $stmt = $connection->prepare(
            "SELECT * FROM users WHERE uEmail = :uEmail"
        );
        $stmt->execute([':uEmail' => $data['uEmail']]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        // Check if the user exists and the password is correct
        if (!$user || !password_verify($data['uPassword'],$user['uPassword'])){
            return jsonResponse(
                statusCode:401,
                data: "Invalid Credentials",
                message: "Unauthorized"
                );
        }

        // Generate a token
        $token = generateToken($user['user_id']);

        // Return the response
        return jsonResponse(
            statusCode:200,
            data: [
                "user"=>[
                    'user_id' => $user['user_id'],
                    'userName' => $user['userName'],
                    'uEmail' => $user['uEmail'],
                    'uRole' => $user['uRole'],
                    'uPosition' => $user['uPosition'],
                ],
                "token"=>$token
            ],
            message: "Login successful"
        );

    }catch(\Throwable $th){
        echo $th->getMessage();
        return jsonResponse(
            statusCode:500,
            data: "Error Signing In: " .$th->getMessage(),
            message: "Internal server error"
            );
    }catch(PDOException $exception){
        echo $exception->getMessage();
        return jsonResponse(
            statusCode:500,
            data: "Error Signing In: " .$exception->getMessage(),
            message: "Internal server error"
            );
    }
  
}



