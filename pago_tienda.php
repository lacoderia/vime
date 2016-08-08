<table>
<?php 


    foreach ($_POST as $key => $value) {
        echo "<tr>";
        echo "<td>";
        echo $key;
        echo "</td>";
        echo "<td>";
        echo $value;
        echo "</td>";
        echo "</tr>";
    }


?>
</table>

<?
    
require(dirname(__FILE__) . '/openpay/Openpay.php');

echo "<h2>Test de Tienda</h2>";

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
?>

<table>
<?php print_r ($charge)?>
</table>
