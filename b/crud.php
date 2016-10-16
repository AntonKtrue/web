<?php
session_start();
if(!isset($_SESSION["admin"])) die();
require_once("dbw.php");


//validate quey
$data;
if(isset($_POST['data'])) {
	$data = json_decode($_POST['data']);
	if(!isset($data->target) ||
			!isset($data->operation))
	{
		echo json_encode(array("result"=>"query invalid"));
		die(0);
	}
} else {
	echo json_encode(array("result"=>"no query"));
	die(0);
}


	switch($data->target) {
		case "category":
			switch($data->operation) {
				case 'create': 
					create_category($data->name);
					echo json_encode(array("result"=>"success"));
					break;
				case 'update': 
					update_category($data->id, $data->newname);
					echo json_encode(array("result"=>"success"));
					break;
				case 'delete': 
					delete_category($data->id);
					echo json_encode(array("result"=>"success"));
					break;
			}
			break;
		case "product":
			switch ($data->operation) {
				case 'create':
					$lastId = create_product($data->name, $data->category);
					echo json_encode(array("result"=>"success","productId"=>$lastId));
					break;
				case 'update':
					update_product($data->id,
                        $data->name,
                        $data->description,
                        $data->currentCost,
                        $data->actionCost,
                        $data->badge,
                        $data->promo);
                    echo json_encode(array("result"=>"success"));
                    break;
				case 'delete':
					delete_product($data->id);
                    echo json_encode(array("result"=>"success"));
					break;
			}

        case "fotos":
            switch ($data->operation) {
                case "remove":
                    if(remove_foto($data->id, $data->image)) {
                        echo json_encode(array("result"=>"success"));
                    } else {
                        echo json_encode(array("result"=>"error"));
                    }
                    break;
            }
            break;
        case "vars":
            switch ($data->operation) {
                case "create":
                    $key = create_var($data->name, $data->id);
                    echo json_encode(array("result"=>"success","key"=>"$key"));

                    break;
                case "delete":
                    delete_var($data->key, $data->id);
                    echo json_encode(array("result"=>"success"));
            }
            break;
        case "users":
            switch ($data->operation) {
                case "remove":
                    delete_user($data->id); //Каскадное удаление??? со всеми заказами? или пометку об удалении с возможностью восстановления?
                    echo json_encode(array("result"=>"success"));
                    break;

            }
            break;
        case "order":
            switch ($data->operation) {
                case "update":
                    switch ($data->field) {
                        case "status":
                            update_order_status($data->id, $data->value);
                            echo json_encode(array("result"=>"success"));
                            break;
                    }
                    break;
                case "delete_product":
                    $order = delete_product_in_order($data->id, $data->product, $data->variant);
                    echo json_encode(array("result"=>"success", "order"=>$order));
                    break;
                case "remove":
                    remove_order($data->id);
                    echo json_encode(array("result"=>"success"));
                    break;
            }
            break;
	}
