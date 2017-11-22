<?php
$timeout = 300;
$last = json_decode(`journalctl -t deadman _TRANSPORT=syslog -n 1 -o json`);
$last_msg = json_decode($last->MESSAGE);
$last_ts = intdiv($last->_SOURCE_REALTIME_TIMESTAMP, 1000000);

print(json_encode([
    "last" => $last_ts,
    "left" => $last_ts - time() + $timeout,
    "ip" => $last_msg->remote_addr,
])."\n");
