# Dead man's switch

This is a prototype of dead man's switch for controlling relays or any
other security measure if no valid TOTP code has been provided in
given time (e.g. 5 minutes) to avoid 3D printer overheat, nuclear
meltdown or any other non-desired event.

Requirements

- php-fpm
- php-cli
- oathtool
