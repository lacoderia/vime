<?php

require(dirname(__FILE__) . '/openpay/Openpay.php');

if (!function_exists('http_response_code'))
{
    function http_response_code($newcode = NULL)
    {
        static $code = 200;
        if($newcode !== NULL)
        {
            header('X-PHP-Response-Code: '.$newcode, true, $newcode);
            if(!headers_sent())
                $code = $newcode;
        }
        return $code;
    }
}

function json_response_internal($message = null, $code = 200) {
    header_remove();

    http_response_code($code);

    header("Cache-Control: no-transform,public,max-age=300,s-maxage=900");

    header('Content-Type: application/json');
    $status = array(
        200 => '200 OK',
        420 => '420 El monto no puede exceder los $5000.00',
        500 => '500 Internal Server Error'
    );

    header('Status: '.$status[$code]);

    return json_encode(array(
        'status' => $code,
        'message' => $message
    ));
}

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

if($chargeData['amount'] > 5000) {
    echo str_replace("\u0000*\u0000", "", json_response_internal('La cantidad a cobrar no puede ser mayor a $5000', 420) );

} else {
    try{
        $charge = $openpay->charges->create($chargeData);
        echo str_replace("\u0000*\u0000", "", json_response_internal((array)$charge));
    }catch (Exception $e){
        echo str_replace("\u0000*\u0000", "", json_response_internal($e->getMessage(), 500) );
    }
}

?>
