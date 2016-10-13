<?php
if(!session_id()) {
    session_start();
}
if(!isset($_SESSION["admin"])) die();
require_once("../db.php");
$conn = db_conn();
$fotodir = "../img/products/";

function create_category($category_name) {
	global $conn;
	$conn->query("insert into categories(name) values(\"$category_name\")");
	$conn->commit();
}

function update_category($id, $newname) {
	global $conn;
	$conn->query("update categories set name=\"$newname\" where id=$id");
	$conn->commit();
}

function delete_category($category_id) {
	global $conn;
	$query2 = $conn->query("select count(*) as count from products where category=$category_id");
	$result = $query2->fetch_assoc();
	if($result["count"]==0) {
		$conn->query("delete from categories where id=$category_id");
		$conn->commit();
	}
	
}

function create_product($product_name, $product_category) {
	global $conn;
    error_log("ERROR");
    error_log("Error:" . $product_name . " : " . $product_category);
    $stmt = $conn->prepare("insert into products(name, category) values(?, ?)");
    $stmt->bind_param('si',$product_name, $product_category);
    $stmt->execute();
    error_log($stmt->error);

	//$conn->query("insert into products(name, category) values(\"$product_name\",$product_category)");
	$lastId =  $stmt->insert_id;
    $stmt->close();
	//$conn->commit();
	return $lastId;
}
function update_product($id, $name, $description, $currentCost, $actionCost, $badge, $promo) {
    global $conn;
    $query = $conn->query("select details from products where id = $id;");
    $obj = $query->fetch_object();
    if($obj->details == null) {
        $conn->query("update products set details = JSON_OBJECT() where id=$id;");
    }
    $stmt = $conn->prepare("update products set name = ?, details = JSON_SET(details, '$.desc', ?, '$.currentCost', ?, '$.actionCost', ?, '$.badge', ?, '$.promo', ?) where id=?");
    $stmt->bind_param('ssssssi', $name, $description, $currentCost, $actionCost, $badge, $promo, $id);
    $stmt->execute();
    $stmt->close();
    $conn->commit();
}

function delete_product($id) {
    global $conn;
    global $fotodir;
    $fotos = $fotodir .$id;
    if(is_dir($fotos)) {
        $files = array_diff(scandir($fotos), array('.','..'));
        foreach ($files as $file) {
            unlink("$fotos/$file");
        }
        rmdir($fotos);
    }
    $conn->query("delete from webdip.products where id = $id");
    $conn->commit();
}
//Details JSON operations

function remove_foto($id, $image) {
    global $fotodir;
    $foto = $fotodir .  $id . "/" . $image;
    return unlink($foto);
}

function create_var($name, $id) {
    $key = "K" . md5(microtime() . $name . $id . rand());
    global $conn;
    $query = $conn->query("select details from products where id = $id;");
    $obj = $query->fetch_object();
    if($obj->details == null) {
        $conn->query("update products set details = JSON_OBJECT() where id=$id;");
        $conn->query("update products set details = JSON_INSERT(details,'$.vars',JSON_OBJECT()) where id = $id;");
    } else {
        $obj->details = json_decode($obj->details);
    }

    if (!isset($obj->details->vars)) {
        $conn->query("update products set details = JSON_INSERT(details,'$.vars',JSON_OBJECT()) where id = $id;");
    }
    $conn->query("update products set details = JSON_INSERT(details,'$.vars.$key','$name') where id = $id;");
    $conn->commit();
    return $key;
}

function delete_var($key, $id) {
    global $conn;
    $conn->query("update products set details = JSON_REMOVE(details,'$.vars.$key') where id = $id;");
    $conn->commit();
}

function delete_user($id) {
    global $conn;
    $conn->query("delete from users where id=$id");
    $conn->commit();
}

function update_order_status($id,$status) {
    global $conn;
    $conn->query("update orders set status=$status where id=$id");
    $conn->commit();

}