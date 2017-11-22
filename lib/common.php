<?php

function relay_left($relay_id) {
    $ret = preg_match('/"([^"]*)"/', `sispmctl -a $relay_id`, $matches);

    if ($ret === FALSE || !array_key_exists(1, $matches)) {
        return FALSE;
    }

    $timeout = new DateTime($matches[1]);
    return [
        "left" => $timeout->getTimestamp() - time(),
        "timeout" => $timeout->getTimestamp(),
    ];
}
