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

    $open_cart = open_cart($user, $hash);
    if(isset($_POST['addProd'])) {
        $prod = json_decode($_POST['addProd']);
        add_product($open_cart, $prod);
        $open_cart = open_cart($user, $hash);
    } else if (isset($_POST['cartorder'])) {

    }
    echo json_encode($open_cart);
} else {
    echo json_encode(array("result"=>"nouser"));
}
