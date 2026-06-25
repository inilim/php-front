<?php

date_default_timezone_set('UTC');
error_reporting(E_ALL);
ini_set('memory_limit', '5m');

function window(): \Vrzno
{
    static $obj = null;
    return $obj ??= new \Vrzno;
}

$status = false;
(static function (bool &$status) {
    $source = window()->__php_zip_source ?? '';
    if ($source === '') {
        window()->console->error('err zip');
        return;
    }

    $source = base64_decode($source, true);
    $zipFile = './source.zip';
    file_put_contents($zipFile, $source);
    $source = null;
    $zip = new \ZipArchive;

    if (false === $zip->open($zipFile)) {
        window()->console->error('err zip');
        return;
    }

    if (false === mkdir('./src')) {
        window()->console->error('err create dir');
        return;
    }

    $zip->extractTo('./src');
    $zip->close();
    $zip = null;
    unlink($zipFile);

    $status = true;
})($status);

if ($status) {
    require_once __DIR__ . '/src/vendor/autoload.php';
    var_dump(is_file(__DIR__ . '/src/vendor/autoload.php'));
}

unset($status);

(new \App\Init)->__invoke();
