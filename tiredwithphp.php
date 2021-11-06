<?php
session_start();
if (!isset($_SESSION['js'])) {
    $_SESSION['js'] = array();
}
function validationY($y)
{
    $y_min = -3;
    $y_max = 3;
    if (!isset($y))
        return false;
    $numY = str_replace(',', '.', $y);
    return is_numeric($numY) && $numY >= $y_min && $numY <= $y_max;
}
function validationXYR($x, $y, $r)
{
    return isset($x) && is_numeric($x) && isset($r) && is_numeric($r) && validationY($y);
}

function checkTriangle($x, $y, $r)
{
    return $x <= 0 && $y >= 0 && $x <= ($y + $r) / 2;
}

function checkRectangle($x, $y, $r)
{
    return $y <= 0 && $x <= 0 && $y <= $r / 2 && $x <= $r;
}
function checkCircle($x, $y, $r)
{
    return $x >= 0 && $y <= 0 && sqrt($x * $x + $y * $y) <= $r / 2;
}
function checkArea($x, $y, $r)
{
    return checkCircle($x, $y, $r) || checkTriangle($x, $y, $r) || checkRectangle($x, $y, $r);
}
if (!isset($_GET["x"])) {
    echo '{' . "\"response\":[" . implode(',', $_SESSION['js']) . ']}';
} else {
    $jsonData = "";
    $resp = '';
    $x = $_GET['x'];
    $y = $_GET['y'];
    foreach ($_GET['r'] as $r) {
        $timezoneOffset = $_GET['timezone'];
        $isValid = validationXYR($x, $y, $r);
        $currentTime = date("H:i:s", time() - $timezoneOffset * 60);
        $scriptTime = round(microtime(true) - $_SERVER['REQUEST_TIME_FLOAT'], 7);
        $response = $isValid ? 'true' : 'false';
        $result = ($isValid && checkArea($x, $y, $r)) ? 'true' : 'false';
        $jsonData = '{' .
            "\"validate\":$response," .
            "\"xval\":$x," .
            "\"yval\":$y," .
            "\"rval\":$r," .
            "\"curtime\":\"$currentTime\"," .
            "\"scripttime\":\"$scriptTime\"," .
            "\"inarea\":$result" .
            "}";
        array_push($_SESSION['js'], $jsonData);
        $resp = $resp . $jsonData . ',';
    }
    $resp = substr($resp, 0, -1);
    echo '{' . "\"response\":[" . $resp . ']}';
}
