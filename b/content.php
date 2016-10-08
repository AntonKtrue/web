<?php
session_start();
if(!isset($_SESSION["admin"])) die();
require_once("../db.php");
$conn = db_conn();
$out = array();
if(isset($_POST['categories'])) {
	$query = $conn->query("select * from categories");	
	while($row = $query->fetch_assoc()) {		
		$query2 = $conn->query("select count(*) as count from products where category=".$row['id']);
		$out["content"][] = array_merge($row,$query2->fetch_assoc());
	}
}

if(isset($_POST['products'])) {
	$out = array();
	if(isset($_POST['category'])) {
		$q2 = $conn->query("select name from categories where id = " . $_POST['category']);
		$row = $q2->fetch_assoc();
		$out["catname"] = $row['name'];
		$query = $conn->query("select * from products where category=" . $_POST['category']);
	} else {
		$query = $conn->query("select * from products");
	}	
	
	while($row = $query->fetch_assoc()) {
		$row["details"] = json_decode($row["details"]);
		$out["content"][] = $row;
	}
}

if(isset($_POST['users'])) {
	$query = $conn->query("select * from users");
	$out = array();
	while($row = $query->fetch_assoc()) {
		$row['userData'] = json_decode($row['userData']);
		$out['content'][] = $row;
	}
}

if(isset($_POST['product'])) {
    $img_dir = "../img/products/" . $_POST['product'] . "/";
    if( file_exists($img_dir) )$dir = scandir($img_dir);
    $images = array();
    if(isset($dir)) {
        foreach ($dir as $file) {
            if(strpos(mime_content_type($img_dir . $file),"image")!==false) {
                $images[] = $file;
            }
        }
    }


	$query = $conn->query("select * from products where id=" . $_POST['product']);
	$out = $query->fetch_object();	
	$out->details = json_decode($out->details);
    $out->fotos = $images;
}

if(isset($_POST['getUser'])) {
    $query = $conn->query("SELECT * FROM users WHERE id =" . $_POST['getUser']);
    if($query->num_rows==1) {
        $out = $query->fetch_object();
        $out->userData = json_decode($out->userData);
        $query2 = $conn->query("SELECT orders.id, orders.order_date, orders.status, sum(product_count) as prod_count," .
            " sum(product_cost*product_count) as summa FROM orders, order_details WHERE user_id=" . $_POST['getUser'] .
            " AND orders.id = order_details.order_id GROUP BY order_id;");
        $out->orders = array();
        $itogSumma = 0;
        while($order = $query2->fetch_object()) {
            $out->orders[] = $order;
            $itogSumma += $order->summa;
        }
        $out->itog = $itogSumma;
    }
}

echo json_encode($out);


// function store_ft_add($object) {
// 	global $conn;
// 	$_SESSION["ft_object"] = $object;
// 	$SQL = "select * from users where hash='" .$_SESSION['hash']."'";
// 	$q = $conn->query($SQL);
// 	$user = $q->fetch_object();
// 	$STORE_SQL = "INSERT INTO registry(number, object, user) " .
// 			"VALUES('". $object->num ."','". json_encode($object,JSON_UNESCAPED_UNICODE) ."',". $user->id .")";
// 	$q = $conn->query($STORE_SQL);
// 	return $q;
// }