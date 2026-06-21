<?php

use App\ContextApp;
use Inilim\Tool\Other;

function exceptionToConsole(\Throwable $e, mixed ...$values): void
{
    $details = Other::getExceptionDetails($e);
    $output = [];
    foreach ($details as $name => $value) {
        $output[] = \sprintf('[%s]: %s', $name, $value);
    }
    foreach ($values as $key => $value) {
        $output[] = \sprintf('[%s]: %s', $key, $value);
    }
    \console()->error(...$output);
}

function get_var_dump(mixed ...$values): string
{
    \ob_start();
    \var_dump(...$values);
    return \ob_get_clean();
}

/**
 * @return array<string|int,float|int|string|bool|null>|null
 */
function jsonToArray(string $json): ?array
{
    $array = \json_decode($json, true, \JSON_BIGINT_AS_STRING);
    if (!\is_array($array)) {
        return null;
    }
    return $array;
}

/**
 * @return class-string
 */
function getVrznoType(object $obj): string
{
    if ($obj::class === \Vrzno::class) {
        // TODO временно, пока баг есть https://github.com/seanmorris/php-wasm/issues/96
        $value = \windowApp()->helper->getNameClass($obj);
        if ($value) {
            return $value;
        }
        return $obj::class;

        $value = \print_r($obj, true);
        $value = \trim($value);
        \preg_match('/^([a-z]+)/i', $value, $m);
        return $m[0] ?? '';
    }
    return $obj::class;
}

function window(): \Vrzno
{
    static $obj = null;
    return $obj ??= new \Vrzno;
}

/**
 * @return \Stub\WindowPhpApp
 */
function windowApp(): object
{
    return \window()->__php_app;
}

function contextApp(): ContextApp
{
    static $obj = null;
    return $obj ??= ContextApp::self();
}

/**
 * @return \PhpJsStub\LocalStorage
 */
function localStorage(): object
{
    return \window()->localStorage;
}

/**
 * @return \Stub\DataBridge
 */
function dataBridge(): object
{
    return \windowApp()->data_bridge;
}

/**
 * @return \PhpJsStub\Console
 */
function console(): object
{
    return \window()->console;
}
