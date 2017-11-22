<?php

// FIXME $relay_id in these functions allow shell injection. Never
// call these with user provided data

/**
 * Queries time left for the given relay state change
 */
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

/**
 * Queries relay status. Returns "on", "off" or FALSE in case of
 * failure.
 */
function relay_status($relay_id) {
    $ret = preg_match('/:\t(off|on)/', `sispmctl -g $relay_id`, $matches);
    if ($ret === FALSE || !array_key_exists(1, $matches)) {
        return FALSE;
    }
    return $matches[1];
}
