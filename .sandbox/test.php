<?php

$source = '';
$source = \base64_decode($source, true);
$zipFile = './source.zip';
\file_put_contents($zipFile, $source);
unset($source);
$zip = new \ZipArchive;

if (false === $zip->open($zipFile)) {
    echo 'err zip';
}

if (false === \mkdir('./src')) {
    echo 'err create dir';
}

$zip->extractTo('./src');

$zip->close();

\unlink($zipFile);

print_r(\scandir(__DIR__));
print_r(\scandir(__DIR__ . '/src'));
