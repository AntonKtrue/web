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


function close_cart($close) {
    global $conn;
    if(isset($_SESSION['order'])) {
        $stmt = $conn->prepare("UPDATE orders SET details = ?, status = 1 WHERE id = ?");
        $details = json_encode($close);
        $order_id = $_SESSION['order'];
        $stmt->bind_param("si",$details, $order_id);
        $stmt->execute();
        $stmt->close();
        unset($_SESSION['order']);
    }
}

function open_cart($user, $hash=null ) {
    global $conn;
    if($hash) {
        if(isset($_SESSION['order'])) {
            $cart_id = $_SESSION['order'];
        } else {
            $query = $conn->query("SELECT id, userData FROM users WHERE login = '$user' AND hash = '$hash'");
            if ($query->num_rows == 1) {
                $row  = $query->fetch_object();
                $row->userData = json_decode($row->userData);
                $user_id = $row->id;
                if(isset($row->userData->activeOrder) && checkOpenCart($row->userData->activeOrder)) {
                    $cart_id = $row->userData->activeOrder;
                } else {
                    $cart_id =  getOpenCart($user_id);
                }
            } else {
                return array("result" => "user error");
            }
            $_SESSION['order'] = $cart_id;
        }


        $query = $conn->query("select ifnull(sum(product_count),0) as productsCount , sum(ifnull(product_cost,0) * ifnull(product_count,0)) as summa from order_details where order_id = $cart_id");
//        $query = $conn->query("select ifnull(sum(JSON_EXTRACT(details,'$.productCount')),0) as productsCount ,
//                  sum(ifnull(JSON_EXTRACT(details,'$.product_cost'),0) * ifnull(JSON_EXTRACT(details,'$.product_count'),0))
//                  as summa from orders WHERE id = $cart_id");
        $result = $query->fetch_object();
        $result->details = new stdClass();
        if ($result->productsCount > 0) {
            $query = $conn->query("select product_id, products.name, product_count, product_cost, " .
                "(ifnull(product_count,0) * ifnull(product_cost,0)) as summa " .
                "from order_details " .
                "inner join products on products.id = order_details.product_id " .
                "where order_id = $cart_id");
            while ($row = $query->fetch_object()) {
                $row->images = getProductImages($row->product_id);
                $result->details->{$row->product_id} = $row;
            }
        }
        return $result;
    } else {
        if(isset($_SESSION["cart"])) {
            $count = 0;
            $summa = 0;
            foreach ($_SESSION["cart"]["details"] as $iterator) {
                $count += $iterator->product_count;
                $summa += $iterator->product_count * $iterator->product_cost;
                $_SESSION["cart"]["details"]->{$iterator->product_id}->summa = $iterator->product_count * $iterator->product_cost;

            }
            $_SESSION["cart"]["productsCount"] = $count;
            $_SESSION["cart"]["summa"] = $summa;
            return $_SESSION["cart"];
        } else {
            $_SESSION["cart"] = array(
                "productsCount"=> 0,
                "summa"=>0,
                "details"=> new stdClass()
            );
        }
        return $_SESSION["cart"];
    }
}

function getEmptyCart($user_id) {
    global $conn;
    $query = $conn->query("SELECT * FROM orders WHERE (SELECT count(*) FROM order_details WHERE order_details.order_id = orders.id) = 0 AND orders.user_id = $user_id;");
    if($query->num_rows>0) {
        return $query->fetch_object()->id;
    } else {
        return false;
    }
}

function createOpenCart($user_id) {
    global $conn;
    if($cart_id = getEmptyCart($user_id)) {
        return $cart_id;
    } else {
        $conn->query("INSERT INTO orders (user_id, order_date, status, details) VALUES ($user_id, CURRENT_TIMESTAMP ,0, JSON_OBJECT())");
        $cart_id = $conn->insert_id;
        $conn->commit();
        return $cart_id;
    }
}

function getOpenCart($user_id) {
    global $conn;
    $query = $conn->query("SELECT id FROM orders WHERE user_id = $user_id AND status = 0");
    if($query->num_rows>0) {
        return $query->fetch_object()->id;
    } else {
        return createOpenCart($user_id);
    }
}
function checkOpenCart($cart_id) {
    global $conn;
    $query = $conn->query("SELECT id FROM oreders WHERE id = $cart_id AND status = 0");
    return $query->num_rows==1;
}

function add_product($cart, $product) {
    global $conn;
    if(isset($_SESSION["cart"])) {
        $query = $conn->query("select products.name from products where id = ". $product->id);
        $name = $query->fetch_object()->name;
        if(!isset($_SESSION["cart"]["details"])) {
            $_SESSION["cart"]["details"] = new stdClass();
        }

        if(isset($_SESSION["cart"]["details"]->{$product->id})) {
            $_SESSION["cart"]["details"]->{$product->id}->product_count++;
        } else {
            $_SESSION["cart"]["details"]->{$product->id} = new stdClass();
            $_SESSION["cart"]["details"]->{$product->id}->product_count = 1;
            $_SESSION["cart"]["details"]->{$product->id}->product_id = $product->id;
            $_SESSION["cart"]["details"]->{$product->id}->name = $name;
            $_SESSION["cart"]["details"]->{$product->id}->product_cost = $product->cost;
            $_SESSION["cart"]["details"]->{$product->id}->images = getProductImages($product->id);

        }

    } else {
        $conn->query("INSERT INTO order_details (order_id, product_id, product_count, product_cost) " .
            "VALUES(" . $_SESSION['order'] . ", $product->id, 1, $product->cost) " .
            "ON DUPLICATE KEY UPDATE product_count = product_count + 1;");
        $conn->commit();
//        $conn->query("UPDATE orders SET details = JSON_SET('$.product', $product->id,  )");
//        $conn->commit();
    }
}

function update_product($update) {
    global $conn;
    if(isset($_SESSION["cart"])) {
        if($update->func == 'minus') {
            if($_SESSION["cart"]["details"]->{$update->id}->product_count > 1) {
                $_SESSION["cart"]["details"]->{$update->id}->product_count--;
            }
        } else if ($update->func == 'plus') {
            $_SESSION["cart"]["details"]->{$update->id}->product_count++;
        } else if ($update->func == 'delete') {
            unset($_SESSION["cart"]["details"]->{$update->id});
        }
    } else {
        if ($update->func == 'minus') {
            $sql = "UPDATE order_details SET product_count = IF(product_count = 1, 1, product_count - 1) WHERE order_id = " . $_SESSION['order'] . " AND product_id = " . $update->id;
        } else if ($update->func == 'plus') {
            $sql = "UPDATE order_details SET product_count = product_count + 1 WHERE order_id = " . $_SESSION['order'] . " AND product_id=" . $update->id;
        } else if ($update->func == 'delete') {
            $sql = "DELETE FROM order_details WHERE order_id = " . $_SESSION['order'] . " AND product_id=" . $update->id;
        }
        $conn->query($sql);
        $conn->commit();
    }

}