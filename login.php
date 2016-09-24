<?php
session_start();
require_once 'db.php';
$c = db_conn();


$response = array();
if(isset($_POST['register'])) {
    $register = json_decode($_POST['register']);
    $s = $c->prepare("INSERT INTO users (login, password, accessLevel, userData) " .
        " VALUES (?, ?, 10, ?)");
    $s->bind_param("sss",$register->email,md5($register->password),json_encode(array("name"=>$register->username)));
    $s->execute();
    $s->close();
    $response["result"]="success";
}


if(isset($_POST['getAccount'])) {
    if(isset($_SESSION['hash']) && isset($_SESSION['user'])) {
        $user = $_SESSION['user'];
        $hash = $_SESSION['hash'];
        $q = $c->query("SELECT login, userData FROM users WHERE login = '$user' AND hash = '$hash'");
        if($q->num_rows==1) {
            $result = $q->fetch_object();
            $result->userData = json_decode($result->userData);
            echo json_encode($result);
        } else {
            echo json_encode(array("result"=>"error"));
        }

    }
    return;
}

if(isset($_POST['update'])) {
    $data = json_decode($_POST['update']);

    $s = $c->prepare('UPDATE users SET userData = JSON_SET(userData, "$.city", ?, "$.street", ?, "$.home", ? , "$.flat", ?, "$.fio", ?, "$.tel", ?) WHERE login = ? AND hash = ?');
    $s->bind_param("ssssssss",
        $data->userData->city,
        $data->userData->street,
        $data->userData->home,
        $data->userData->flat,
        $data->userData->fio,
        $data->userData->tel,
        $_SESSION['user'],
        $_SESSION['hash']);
    $s->execute();

    if(isset($data->passw)) {
        $newpass = md5($data->passw);

        $c->query("UPDATE users SET password = '$newpass' WHERE login = '". $_SESSION['user'] . "' AND hash = '".$_SESSION['hash']. "'");
        $c->commit();
    }
    if(isset($data->email)) {
        $c->query("UPDATE users SET login = '".$data->email."' WHERE login = '". $_SESSION['user'] . "' AND hash = '".$_SESSION['hash']. "'");
        $c->commit();
        $_SESSION['user'] = $data->email;
    }

    echo json_encode(array("result"=>"success"));
    return;
}

if(isset($_POST['usercheck'])) {
    $q = $c->query("SELECT * FROM users WHERE login = '" . $_POST['usercheck'] . "'");
    echo ($q->num_rows > 0);
    return;
}
if(isset($_POST['login'])) {
	$login = json_decode($_POST['login'],true);
	$response['trace']['postdata'] = $login;
	if(checkUser($login)) {
	    session_regenerate_id(true);
		$response['trace'][] = "user_checked";
		$hash = md5(generateCode(10));
		//$response['hash'] = $hash;
		$_SESSION['hash'] = $hash;
		$_SESSION['user'] = $login["user"];
		updateHash($login, $hash);
	} else {
		$response['error'][]="user not found or bad password";		
	}	
} else {
	$response['error'][]="error login data";
}
if(isset($_POST['logout'])) {
	session_unset();
	session_destroy();
}
echo json_encode($response);
return;

function updateHash($login, $hash) {
	global $c;
	$user = $login["user"];
	$q = $c->query("update users set hash='$hash' where login='$user'");
}
function checkUser($login) {
	global $c;
	$user = $login["user"];
	$password = md5($login["password"]);
	$q = $c->query("select * from users where login = '$user' and password = '$password'");
	return $q->num_rows > 0;
}

function generateCode($length=6) {
	$chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHI JKLMNOPRQSTUVWXYZ0123456789";
	$code = "";
	$clen = strlen($chars) - 1;
	while (strlen($code) < $length) {
		$code .= $chars[mt_rand(0,$clen)];
	}
	return $code;
}