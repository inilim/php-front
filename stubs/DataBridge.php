<?php

namespace Stub;

// DataBridge.ts
final readonly class DataBridge
{
    /**
     * @return array<string,mixed>
     */
    function getAll(): array
    {
        throw new \Error;
    }

    /**
     * undefined передается как null\
     * Nan передается как null\
     * на фронте сделал конвертацию с undefined на null\
     * php-wasm по умолчание не воспринимает undefined
     */
    function get(string $key): mixed
    {
        throw new \Error;
    }

    function pull(string $key): mixed
    {
        throw new \Error;
    }

    function set(string $key, mixed $value): void {}

    function clear(): void {}
}
