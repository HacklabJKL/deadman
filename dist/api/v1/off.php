<?php
require_once(__DIR__.'/../../../lib/common.php');

`sispmctl -f 3`;
jprint([
    "timeout" => 0,
]);
