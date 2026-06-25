<?php

use PhpJsStub\URL;
use PhpJsStub\Console;
use PhpJsStub\Promise;
use PhpJsStub\Location;
use PhpJsStub\Response;
use PhpJsStub\Function_;
use PhpJsStub\LocalStorage;

final readonly class Vrzno
{
    // ------------------------------------------------------------------
    // Native
    // ------------------------------------------------------------------

    public LocalStorage $localStorage;
    public Console $console;
    public Location $location;
    public \Stub\WindowPhpApp $__php_app;
    // TODO
    public object $document;

    /**
     */
    function setTimeout(Function_ $func, int $delay, ...$args): mixed
    {
        throw new \Error;
    }

    /**
     */
    function open(null|string|URL $url = null, ?string $target = null, ?string $windowFeatures = null): void
    {
        // 
    }

    /**
     * @return Promise<Response>
     */
    function fetch(string $url, \stdClass $options = new \stdClass): Promise
    {
        throw new \Error;
    }

    function alert(mixed $value): void
    {
        // 
    }
}
