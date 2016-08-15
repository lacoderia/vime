<?php

require(dirname(__FILE__) . '/openpay/Openpay.php');

function json_response_internal($message = null, $code = 200)
{
    // clear the old headers
    header_remove();
    // set the actual code
    http_response_code($code);
    // set the header to make sure cache is forced
    header("Cache-Control: no-transform,public,max-age=300,s-maxage=900");
    // treat this as json
    header('Content-Type: application/json');
    $status = array(
        200 => '200 OK',
        400 => '400 Bad Request',
        422 => 'Unprocessable Entity',
        500 => '500 Internal Server Error'
        );
    // ok, validation error, or failure
    header('Status: '.$status[$code]);
    // return the encoded json
    return json_encode(array(
        'status' => $code < 300, // success or not?
        'message' => $message
    ));
}


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

try{
  $charge = $openpay->charges->create($chargeData);
  echo str_replace("\u0000*\u0000", "", json_response_internal((array)$charge, 200));
}catch (Exception $e){
  echo str_replace("\u0000*\u0000", "", json_response_internal($e->getMessage(), 500) );
}

?>
