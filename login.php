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

if(isset($_POST['usercheck'])) {
    $q = $c->query("SELECT * FROM users WHERE login = '" . $_POST['usercheck'] . "'");
    echo ($q->num_rows > 0);
    return;
}
if(isset($_POST['login'])) {
	$login = json_decode($_POST['login'],true);
	$response['trace']['postdata'] = $login;
	if(checkUser($login)) {	
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