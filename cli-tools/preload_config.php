<?php

use ClassPreloader\ClassLoader\Config;
use Symfony\Component\Finder\Finder;

require_once __DIR__ . '/boot.php';

// 1. Создаем конфиг
$config = new Config();

// 2. Ищем все файлы в папке src
$finder = (new Finder)
    ->in([
        \ROOT . '/src/php',
    ])
    ->exclude(['vendor'])
    ->notName([
        'preload_config.php',
        'app.php',
    ])
    ->files()
    ->name(['*.php']);

// 3. Добавляем каждый найденный файл в список прелоадера
foreach ($finder as $file) {
    // echo $file->getRealPath() . PHP_EOL;
    // Важно: передаем полный реальный путь
    $config->addFile($file->getRealPath());
}
return $config;
