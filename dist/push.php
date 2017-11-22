<?php
require_once(__DIR__.'/../lib/common.php');

$totp = $_GET['totp'];

// Check if it is all-numeric and of correct length
if (!preg_match('/^[0-9]{6}$/', $totp)) {
    $out =  [
        "error" => "Illegal input",
    ];
} else if (`oathtool -w 1 --totp deadabbabeef $totp` === NULL) {
    $out =  [
        "error" => "Incorrect code",
    ];
} else {
    `sispmctl -A3 --Aat "\`date '+%F %H:%M' -d 5min\`" --Ado off`;
    $out = relay_left(3);
}

print(json_encode($out)."\n");
