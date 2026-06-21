<?php

use PhpCodeMinifier\MinifierFactory;
use Symfony\Component\Process\Process;

require_once __DIR__ . '/boot.php';


$fileAppPhp = \ROOT . '/src/php/app.php';

if (\is_file($fileAppPhp)) {
    \unlink($fileAppPhp);
}

// ./vendor/bin/classpreloader compile --config="../../cli-tools/preload_config.php" --output="app.php" --strip_comments=1
$process = new Process([
    'php',
    \ROOT . '/src/php/vendor/bin/classpreloader',
    'compile',
    \sprintf('--config=%s', \ROOT . '/cli-tools/preload_config.php'),
    \sprintf('--output=%s', './src/php/app.php'),
    '--strip_comments=1',
]);

// var_dump($process->getCommandLine());

// echo PHP_EOL;
$process->run();


if (!\is_file($fileAppPhp)) {
    exit('Файл не найден: ' . $fileAppPhp);
}

$phpCodeMinifier = MinifierFactory::create();
// $phpCodeMinifier->minifyFile($fileAppPhp);
$phpCodeMinifier->minifyFileToFile($fileAppPhp, $fileAppPhp);
// print_r($process->getOutput());
echo 'build php source --> ok';
