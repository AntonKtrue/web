<?php
/**
 * Created by PhpStorm.
 * User: Anton
 * Date: 22.09.2016
 * Time: 8:41
 */

session_start();
$out = array();
require_once ('dbw.php');


if(isset($_SESSION['user']) && isset($_SESSION['hash'])) {
    $user = $_SESSION['user'];
    $hash = $_SESSION['hash'];
} else {
    $user = session_id();
    $hash = null;
}

$open_cart = open_cart($user, $hash);
if(isset($_POST['addProd'])) {
    $prod = json_decode($_POST['addProd']);
    add_product($prod);
    $log = array(
        "category"=>"cart",
        "details"=>array(
            "session"=>session_id(),
            "user"=>$user==session_id() ? "guest" : $user,
            "operation"=>array(
                "action"=>"add_product",
                "product"=>$prod->id,
                "variant"=> isset($product->variant) ? $product->variant : "S",
                "cart"=>isset($_SESSION['cart']) ? "PHP_SESSION_CART" : $_SESSION['order']
            )
        )
    );
    systemlog($log);
} else if (isset($_POST['close'])) {
    $close = json_decode($_POST['close']);
    close_cart($close);

} else if (isset($_POST['update'])) {
    $update = json_decode($_POST['update']);
    update_product($update);
}
$open_cart = open_cart($user, $hash);


echo json_encode($open_cart);