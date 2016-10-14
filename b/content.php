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

if(isset($_POST['orders'])) {
    $query = $conn->query("SELECT users.login, orders.id, orders.order_date, orders.status, sum(product_count) as prod_count," .
        " sum(product_cost*product_count) as summa FROM orders, order_details, users WHERE users.id = orders.user_id AND" .
        " orders.id = order_details.order_id AND orders.status > 0 GROUP BY order_id ORDER BY orders.order_date DESC;");

    while($order = $query->fetch_object()) {
        $out['orders'][] = $order;
    }
}

if(isset($_POST['order'])) {
    $order = json_decode($_POST['order']);
    $query = $conn->query("SELECT id, orders.details FROM orders WHERE id = " . $order->id);
    $out = $query->fetch_object();
    $out->details = json_decode($out->details);


    $sql = "SELECT products.name, product_id, product_count, product_cost, product_count*product_cost as summa, variant,
                          IF(variant <> 'S', (SELECT JSON_EXTRACT(details,concat('$.vars.',variant) ) 
                                              FROM webdip.products 
                                              WHERE id=product_id ) ,'S') as variantName 
                          FROM webdip.order_details 
                          inner join products on products.id = order_details.product_id
                          WHERE order_id = " . $order->id;
    $query = $conn->query($sql);
    error_log($sql);
    $out->products =array();
    while ($row = $query->fetch_object()) {
        $out->products[] = $row;
    }

}

if(isset($_POST['getUser'])) {
    $query = $conn->query("SELECT * FROM users WHERE id =" . $_POST['getUser']);
    if($query->num_rows==1) {
        $out = $query->fetch_object();
        $out->userData = json_decode($out->userData);
        $query2 = $conn->query("SELECT orders.id, orders.order_date, orders.status, sum(product_count) as prod_count," .
            " sum(product_cost*product_count) as summa FROM orders, order_details WHERE user_id=" . $_POST['getUser'] .
            " AND orders.id = order_details.order_id GROUP BY order_id ORDER BY orders.order_date DESC;");
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


