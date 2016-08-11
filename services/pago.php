<?php

require(dirname(__FILE__) . '/openpay/Openpay.php');

$openpay = Openpay::getInstance('mlttma1g0lusxgmm9kst', 'sk_43f66f9243264b61a2cb5bcdc172cca1');

$postdata = file_get_contents("php://input");
$request = json_decode($postdata);
$data = $request->formData;

$customer = array(
     'name' => $data->name,
     'last_name' => $data->last_name,
     'phone_number' => $data->phone_number,
     'email' => $data->email);

if ($data->method == 'card') {
    $chargeData = array(
        'method' => $data->method,
        'source_id' => $data->source_id,
        'currency' => 'MXN',
        'device_session_id' => $data->device_session_id,
        'amount' => (float)$data->amount,
        'description' => $data->description,
        'customer' => $customer);
} else {
    $chargeData = array(
        'method' => $data->method,
        'amount' => (float)$data->amount,
        'description' => $data->description,
        'customer' => $customer);
}

$charge = $openpay->charges->create($chargeData);

echo str_replace("\u0000*\u0000", "", json_encode((array)$charge));
?>
