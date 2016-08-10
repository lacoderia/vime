<?php

require(dirname(__FILE__) . '/openpay/Openpay.php');

$openpay = Openpay::getInstance('mlttma1g0lusxgmm9kst', 'sk_43f66f9243264b61a2cb5bcdc172cca1');

$customer = array(
     'name' => $_POST["name"],
     'last_name' => $_POST["last_name"],
     'phone_number' => $_POST["phone_number"],
     'email' => $_POST["email"]);


$chargeData = array(
    'method' => 'card',
    'source_id' => $_POST["token_id"],
    'amount' => (float)$_POST["amount"],
    'description' => $_POST["description"],
    'currency' => 'MXN',    
    //'use_card_points' => $_POST["use_card_points"], // Opcional, si estamos usando puntos
    'device_session_id' => $_POST["deviceIdHiddenFieldName"],
    'customer' => $customer);

$charge = $openpay->charges->create($chargeData);

echo str_replace("\u0000*\u0000", "", json_encode((array)$charge));
?>
