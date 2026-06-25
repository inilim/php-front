<?php

require_once __DIR__ . '/boot.php';

use Inilim\Tool\Path;
use Symfony\Component\Finder\Finder;

$dir = \realpath(__DIR__ . '/../src/php');
$dir = Path::normalize($dir);
$zipFile = $dir . '/php.zip';

if (\is_file($zipFile)) {
    \unlink($zipFile);
}

$zip = new \ZipArchive();
if ($zip->open($zipFile, \ZipArchive::CREATE | \ZipArchive::OVERWRITE) !== true) {
    throw new \RuntimeException("Не удалось создать архив '$zipFile'.");
}

// Создаём Finder и настраиваем обход
$finder = new Finder();
$finder->files()
    ->in($dir)
    ->ignoreVCS(true) // игнорируем .git и т.п.
    // 
;

$finder
    // ->notPath()
    ->notName(['*.zip', '*.base64'])
    // ->notContains([
    //     'vendor/inilim/tools/files/resources/Exp',
    // ])
    // 
;

foreach ($finder as $file) {
    // Относительный путь внутри архива
    $localPath = substr($file->getRealPath(), strlen($dir) + 1);
    // Добавляем файл в архив
    $zip->addFile(Path::normalize($file->getRealPath()), Path::normalize($localPath));
}

$zip->close();
