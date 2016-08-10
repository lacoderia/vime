<?
    
require(dirname(__FILE__) . '/openpay/Openpay.php');

$openpay = Openpay::getInstance('mlttma1g0lusxgmm9kst', 'sk_43f66f9243264b61a2cb5bcdc172cca1');

$customer = array(
     'name' => $_POST["name"],
     'last_name' => $_POST["last_name"],
     'phone_number' => $_POST["phone_number"],
     'email' => $_POST["email"]);

$chargeData = array(
    'method' => 'store',
    'amount' => (float)$_POST["amount"],
    'description' => 'Cargo en tienda',
    'customer' => $customer);

$charge = $openpay->charges->create($chargeData);

echo str_replace("\u0000*\u0000", "", json_encode((array)$charge));
?>
