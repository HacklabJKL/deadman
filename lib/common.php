<?php

// FIXME $relay_id and $timeout in these functions allow shell
// injection. Never call these with user provided data!

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

/**
 * Sets timeout for given relay. Timeout parameter accepts GNU date(3)
 * formatting such as "5min".
 */
function relay_set_timeout($relay_id, $timeout) {
    `sispmctl -A$relay_id --Aat "\`date '+%F %H:%M' -d $timeout\`" --Ado off`;
}

function erray($msg) {
    return [
        "error" => $msg,
    ];
}

function jprint($arr) {
    print(json_encode($arr)."\n");
}
