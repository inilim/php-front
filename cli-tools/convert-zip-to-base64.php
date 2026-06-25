<?php

require_once __DIR__ . '/boot.php';

$zip = __DIR__ . '/../src/php/php.zip';

$zipRaw = \file_get_contents($zip);

\file_put_contents(\dirname($zip) . '/php.base64', \base64_encode($zipRaw));
