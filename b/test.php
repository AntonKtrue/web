<?php
$basedir = "../img/products/1/";
$dir = scandir($basedir);
foreach($dir as $val) {
echo (mime_content_type($basedir . $val)."\n");
}

?>