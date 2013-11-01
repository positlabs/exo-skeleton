<?php

// this is just for serving files with the correct content-type

// router.php
$path = pathinfo($_SERVER["SCRIPT_FILENAME"]);
if ($path["extension"] == "json") {
    header("Content-Type: application/json");
    readfile($_SERVER["SCRIPT_FILENAME"]);
}
else {
    return FALSE;
}
?>