<?php
if(session_status() == PHP_SESSION_NONE) {
	session_start();
}
require_once ("db.php");
$conn = db_conn();

if(isset($_POST['usermenu'])) {
	
	$usermenu = array();
	if(isset($_SESSION['hash'])) {
		$usermenu["status"]="loggedin";
		$usermenu["user"]=$_SESSION["user"];
	} else {
		$usermenu["status"]="nobody";
	}
	echo json_encode($usermenu);
}
if(isset($_POST['categories'])) {
    $query = $conn->query("select * from categories");
	$categories = array();
    while($category = $query->fetch_object())    {
        $categories[$category->id] = $category;
    }
	echo json_encode($categories);
}

if(isset($_POST['clickCounter'])) {

    $conn->query("UPDATE products SET details = JSON_SET(details, '$.clickCounter', ifnull(JSON_EXTRACT(details, '$.clickCounter'), '0') + 1 ) WHERE id=" . $_POST['productId']);

    $conn->commit();

    echo $conn->error;
}

if(isset($_POST['aboutblock'])) {
	$about = array(
			"bgimage"=>"img/start_page_about.jpg",
			"caption"=>"О магазине",
			"content"=>"Lorem ipsum dolor sit amet, consectetuer adipiscing elit. 
			Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus 
			et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, 
			ultricies nec, pellentesque eu, pretium quis, sem.<br><br>
			Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, 
			vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. 
			Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus 
			elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, 
			consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, 
			feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. 
			Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. 
			Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem 
			quam semper libero, sit amet adipiscing sem neque sed ipsum. Nam quam nunc, blandit 
			vel, luctus pulvinar, hendrerit id, lorem. Maecenas nec odio et ante tincidunt tempus. 
			Donec vitae sapien ut libero venenatis faucibus. Nullam quis ante. Etiam sit amet orci 
			eget eros faucibus tincidunt. Duis leo. Sed fringilla mauris sit amet nibh. Donec sodales 
			sagittis magna. Sed consequat, leo eget bibendum sodales, augue velit cursus nunc,"
	);
	
	echo json_encode($about);
}
if(isset($_POST['product'])) {
	$product1 = array(
			"productName"=>"Продукт " . $_POST['productId'],
			"productCost"=>"1245руб.",
			"productImage"=>"prod/snowboards/1_1.jpg"
	);
	
	echo json_encode($product1);
}
if(isset($_POST['mainpromo'])) {
	$promoaction = array(
			"firstLine"=>"название",
			"secondLine"=>"промо-товара",
			"desc"=>"Описание товара"
	);
	echo json_encode($promoaction);
}

function jsError($message) {
	$arr = array("error"=>$message);
	return json_encode($arr);
}

