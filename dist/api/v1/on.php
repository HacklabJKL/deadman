<?php
require_once(__DIR__.'/../../../lib/common.php');

$status = relay_status(3);

if ($status === "off") {
    // Initial power-up allows only 2 minutes of power. Dead man's
    // switch must be pressed after that to get the maximum of 5
    // minutes.
    relay_set_timeout(3, "2min");
    `sispmctl -o3`; // Turn on relay
}
$out = relay_left(3);

if ($out === FALSE) {
    $out = erray("Unable to turn on, try again!");
} else if ($status !== "off") {
    $out['error'] = "Relay already on";
}

jprint($out);
