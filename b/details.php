<?php
/**
 * Created by PhpStorm.
 * User: Anton
 * Date: 03.09.2016
 * Time: 17:17
 */
session_start();
if(!isset($_SESSION["admin"])) die();
require_once("dbw.php");
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

