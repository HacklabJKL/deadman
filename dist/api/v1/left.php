<?php

require_once(__DIR__.'/../../../lib/common.php');

if (relay_status(3) === 'off') {
    jprint([
        "timeout" => 0,
    ]);
} else {
    jprint(relay_left(3) ?: erray("Relay controller read failure"));
}
