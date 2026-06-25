<?php

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
    (new \App\Init)->__invoke();
}

unset($status);
