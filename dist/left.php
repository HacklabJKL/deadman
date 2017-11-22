<?php

require_once(__DIR__.'/../lib/common.php');

print(json_encode(relay_left(3) ?: [
    "error" => "Relay controller read failure",
])."\n");
