<?php
require_once(__DIR__.'/../lib/common.php');

$totp = $_GET['totp'];

// Check if it is all-numeric and of correct length
if (!preg_match('/^[0-9]{6}$/', $totp)) {
    $out = erray("Illegal input");
} else if (`oathtool -w 1 --totp deadabbabeef $totp` === NULL) {
    $out = erray("Incorrect code");
} else {
    relay_set_timeout(3, "5min");
    $out = relay_left(3);
    $status = relay_status(3);

    if ($out === NULL || $status === NULL) {
        $out = erray("Relay control failed, try again!");
    } else if ($status === "off") {
        $out = erray("Power already down");
    }
}

jprint($out);
