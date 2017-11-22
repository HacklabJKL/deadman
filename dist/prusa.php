<?php
$totp = $_GET['totp'];

// Check if it is all-numeric and of correct length
if (preg_match('/^[0-9]{6}$/', $totp)) {
    if (`oathtool -w 1 --totp deadabbabeef $totp` !== NULL) {
        openlog("deadman", LOG_ODELAY, LOG_USER);
        syslog(LOG_INFO, json_encode([
            'remote_addr' => $_SERVER['REMOTE_ADDR'],
            'user_agent' => $_SERVER['HTTP_USER_AGENT'],
        ]));
        print("true\n");
    } else {
        print("false\n");
    }
} else {
    print("false\n");
}

