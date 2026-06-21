<?php

$root = __DIR__ . '/../';
$root = \realpath($root);
$root = \strtr($root, '\\', '/');
\define('ROOT', $root);
unset($root);

require_once \ROOT . '/src/php-dev/vendor/autoload.php';
