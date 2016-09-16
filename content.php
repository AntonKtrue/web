<?php
/**
 * Created by PhpStorm.
 * User: Anton
 * Date: 07.09.2016
 * Time: 14:32
 */

require_once ('db.php');

$conn = db_conn();
$out = array();

if(isset($_POST['mainpromo'])) {
    $query = $conn->query("SELECT * FROM webdip.products WHERE JSON_EXTRACT(details, \"$.promo\")=\"yes\";");
    if($query->num_rows>0) {
        $ret = rand(0,$query->num_rows-1);
        $query->data_seek($ret);
        $data = $query->fetch_object();
        $exname = explode(" ",$data->name);
        $out["firstLine"] = $exname[0];
        $secondLine = "";
        for($i=1;$i<count($exname);$i++) {
            $secondLine .= $exname[$i];
        }
        $out["secondLine"] = $secondLine;
        $data->details = json_decode($data->details);
        $out["desc"] = $data->details->desc;
        echo json_encode($out);

    } else {
        echo json_encode(array("result"=>"empty"));
    }
    return;
}

if(isset($_POST['filledcategories'])) {
    $sql = "SELECT * FROM categories WHERE ((SELECT count(*) FROM products WHERE products.category = categories.id)>0);";
    $query = $conn->query($sql);
    $categories = array();
    while($category = $query->fetch_object())    {
        $categories[$category->id] = $category;
    }
    echo json_encode($categories);

}

function getProductImages($prodId) {
    $img_dir = "./img/products/" . $prodId . "/";
    if( file_exists($img_dir) )$dir = scandir($img_dir);
    $images = array();
    if(isset($dir)) {
        foreach ($dir as $file) {
            if(strpos(mime_content_type($img_dir . $file),"image")!==false) {
                $images[] = $file;
            }
        }
    }
    return $images;
}

if(isset($_POST['newprods'])) {

    $sql = "SELECT * FROM webdip.products WHERE JSON_EXTRACT(details, \"$.badge\")=\"new\" ORDER BY RAND();";
    echo getRows($sql);
}

if(isset($_POST['popprods'])) {

    $sql = "SELECT * FROM webdip.products ORDER BY CAST(JSON_EXTRACT(details, \"$.clickCounter\") AS UNSIGNED) DESC LIMIT 0,16;";
    echo getRows($sql);
}

if(isset($_POST['samecategory'])) {
    $sql = "SELECT * FROM webdip.products WHERE category = " . $_POST['samecategory'] . " ORDER BY RAND() LIMIT 0,16;";
    echo getRows($sql);
}

if(isset($_POST['category'])) {
    $sql = "SELECT * FROM webdip.products WHERE category = " . $_POST['category'] . " ORDER BY RAND();";
    echo getRows($sql);
}

function getRows($sql) {
    global $conn;

    $query = $conn->query($sql);

    if($query->num_rows>0) {
        while($data = $query->fetch_object()) {
            $data->details = json_decode($data->details);
            $data->images = getProductImages($data->id);
            $out['prods'][] = $data;

        }
    } else {
        $out["result"] = "empty";
    }

    return json_encode($out);
}
