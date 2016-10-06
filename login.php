<?php
session_start();
require_once 'db.php';
require_once 'dbw.php';
$c = db_conn();

$response = array();
if(isset($_POST['register'])) {
    $register = json_decode($_POST['register']);
    $s = $c->prepare("INSERT INTO users (login, password, accessLevel, userData) " .
        " VALUES (?, ?, 10, ?)");
    $passhash = md5($register->password);
    $userData = json_encode(array("name"=>$register->username,"tel"=>$register->tel));
    $email = $register->email;
    $s->bind_param("sss",$email,$passhash,$userData);
    $s->execute();
    $s->close();
    $login = array("user"=>$register->email,"password"=>$register->password);
    doLogin($login);
    $response["result"]="success";
}


if(isset($_POST['getAccount'])) {
    if(isset($_SESSION['hash']) && isset($_SESSION['user'])) {
        $user = $_SESSION['user'];
        $hash = $_SESSION['hash'];
        error_log("user: " . $user . ", hash:" . $hash);
        $q = $c->query("SELECT id, login, userData FROM users WHERE login = '$user' AND hash = '$hash'");
        if($q->num_rows==1) {
            $result = $q->fetch_object();
            $result->userData = json_decode($result->userData);
            $q = $c->query("SELECT orders.id, orders.order_date, orders.status, sum(product_count) as prod_count," .
                " sum(product_cost*product_count) as summa FROM orders, order_details WHERE user_id=" . $result->id .
                " AND orders.id = order_details.order_id GROUP BY order_id;");
            $result->orders = array();
            $result->current = $_SESSION['order'];
            while($order = $q->fetch_object()) {
                $qdetails = $c->query("SELECT order_details.*, products.name FROM order_details, products WHERE order_id = " . $order->id . " AND product_id = products.id");
                $order->details = array();

                $summa = 0;
                while($qres = $qdetails->fetch_object()) {
                    $order->details[] = $qres;
                    $summa += $qres->product_cost * $qres->product_count;
                }
                $order->summa  = $summa;
                $result->orders[$order->id] = $order;
            }
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
    doLogin($login);
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
	if($q->num_rows > 0) {
	    return $q->fetch_object()->id;
    } else {
        return 0;
    }
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

function doLogin($login) {
    global $c;
    if($user_id = checkUser($login)) {
        if(isset($_SESSION["cart"]["productsCount"]) && $_SESSION["cart"]["productsCount"] > 0) {
            error_log("session product count: " . $_SESSION["cart"]["productsCount"]);
            $cart_id = createOpenCart($user_id);
            error_log("new cart id:" . $cart_id);
            $s = $c->prepare("INSERT INTO order_details VALUES (?,?,?,?)");
            foreach ($_SESSION["cart"]["details"] as $key => $value) {
                $s->bind_param("iiid",
                    $cart_id,
                    $key,
                    $value->product_count,
                    $value->product_cost);
                $s->execute();
                error_log("add prodcut: " . $key );
            }
            $s->close();
        } else {
            $q = $c->query("SELECT * FROM `orders` WHERE `user_id` = $user_id AND status = 0");
            if($q->num_rows>0) {
                $row = $q->fetch_object();
                $cart_id = $row->id;
            } else {
                $cart_id = createOpenCart($user_id);
            }

        }
        session_destroy();
        session_start();
        $response['trace'][] = "user_checked";
        $hash = md5(generateCode(10));
        //$response['hash'] = $hash;
        $_SESSION['hash'] = $hash;
        $_SESSION['user'] = $login["user"];
        $_SESSION['order'] = $cart_id;
        error_log("exit_cart_id:" . $cart_id);
        updateHash($login, $hash);
    } else {
        $response['error'][]="user not found or bad password";
    }
}