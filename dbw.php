<?php
/**
 * Created by PhpStorm.
 * User: Anton
 * Date: 22.09.2016
 * Time: 8:52
 */
require_once("./db.php");
require_once('content.php');
$conn = db_conn();

function open_cart($user, $hash) {
    global $conn;
    $query = $conn->query("SELECT id FROM users WHERE login = '$user' AND hash = '$hash'");
    if($query->num_rows == 1) {
        $user_id = $query->fetch_object()->id;
        $query = $conn->query("SELECT * FROM orders WHERE user_id = $user_id AND status = 'open'");
        if($query->num_rows < 1) {
            $conn->query("INSERT INTO orders (user_id, order_date, status) VALUES ($user_id, CURRENT_TIMESTAMP ,'open')");
            $cart_id =  $conn->insert_id;
            $conn->commit();
        } else {
            $cart_id = $query->fetch_object()->id;
        }
    } else {
        return array("result"=>"user error");
    }
    $_SESSION['order'] = $cart_id;

    $query = $conn->query("select ifnull(sum(product_count),0) as productsCount , ifnull(sum(product_cost),0) as summa from order_details where order_id = $cart_id");
    $result = $query->fetch_object();
    if($result->productsCount>0) {
        $query = $conn->query("select * from order_details where order_id = $cart_id");
        while($row = $query->fetch_object()) {
            $row->images = getProductImages($row->product_id);
            $result->details[] = $row;
        }
    }
    return $result;
}

function add_product($cart, $product) {
    global $conn;
    $conn->query("INSERT INTO order_details (order_id, product_id, product_count, product_cost) " .
                 "VALUES(".$_SESSION['order'].", $product->id, 1, $product->cost)");
    $conn->commit();
}