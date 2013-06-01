<?php

$episode = '1348184';
$episode_id = 'VARA_101320403';

$security = 'MTM3MDA5MDAzMnxOUE9VR1NMIDEuMHx8Z29uZWkxQWk=';
$security_decode = base64_decode($security);
$parts = explode('|', $security_decode);

$hash = strtoupper(md5($episode_id.'|'.$parts[1]));


var_dump($episode,$security,$security_decode,$hash);

var_dump("http://pi.omroep.nl/info/stream/aflevering/$episode_id/$hash");
