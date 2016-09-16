<?php
require_once "../db.php";
$conn = db_conn();
        ob_start();
        var_dump($file);
        $contents = ob_get_contents();
        ob_end_clean();
        error_log($contents);
$output_dir = "../img/products/" . $_POST['productId'];
if(!is_dir($output_dir)) {
    mkdir($output_dir,0777,true);
}

$query = $conn->query("select * from products where id = " . $_POST['productId'] );
if($query->num_rows != 1) {
	echo json_encode(array(
			'result'=>'error',
			'message'=>'product not found'
	));
	die();
}
$conn->close();
$result = array();
if(is_array($_FILES['file']['tmp_name'])) {
    foreach ($_FILES['file']['tmp_name'] as $key => $file) {


        $foto_name = md5( microtime() . $_POST['productId'] . rand() . $file );

        if($_FILES['file']['error'][$key] == UPLOAD_ERR_OK) {
            move_uploaded_file($file, $output_dir . "/" . $foto_name);
            $result[] = array(
                'result'=>'success',
                'image'=>$foto_name
            );

        } else {
            $message = '';
            if($_FILES['file'][error][$key]==1) $message = "Превышен допустимый размер файла $fileName ! " . ini_get('upload_max_filesize');
            echo json_encode(array(
                'result'=>'error',
                'message'=>$message
            ));
            return;
        }
    }
    echo json_encode($result);
} else {
    echo json_encode(array(
        'result'=>'error',
        'message'=>'file upload error #1'
    ));
    die();
}








