<?php

namespace App\Service;

use Inilim\Tool\ID;

final class CallbackRegistryService
{
    /**
     * @var array<int,\Closure(mixed,mixed,mixed,mixed,mixed):mixed>
     */
    protected array $callbacks = [];

    /**
     * Сразу получаем JS callback
     * @return \PhpJsStub\Function_
     */
    function getJsCallback(callable $callback, string|int|null $name = null): object
    {
        return \windowApp()->helper->createPhpInvoker($this->register($callback, $name));
    }

    /**
     * Тут регистрируем php функцию на стороне PHP
     * @param string|int|null $name Если требуется получать один и тотже идентификатор, можно придумать имя для callback
     */
    function register(callable $callback, string|int|null $name = null): int
    {
        $id = $name ?? ID::uuidv4();
        $id = \crc32((string)$id);
        if (!($callback instanceof \Closure)) {
            $callback = \Closure::fromCallable($callback);
        }
        $wrpCallback = static function (...$args) use ($callback, $name, $id) {
            try {
                return $callback(...$args);
            } catch (\Throwable $e) {
                \exceptionToConsole(
                    $e,
                    print_r_callback: \print_r($callback, true),
                    name_callback: $name,
                    id_callback: $id,
                );
                throw $e;
            }
        };
        $this->callbacks[$id] = $wrpCallback;
        return $id;
    }

    /**
     * @param int|int[] $id
     */
    function remove(int|array $id): self
    {
        if (\is_int($id)) {
            $id = [$id];
        }
        foreach ($id as $idx) {
            unset($this->callbacks[$idx]);
        }
        return $this;
    }

    function get(int $id): ?\Closure
    {
        return $this->callbacks[$id] ?? null;
    }

    function pull(int $id): ?\Closure
    {
        $callback = $this->callbacks[$id] ?? null;
        unset($this->callbacks[$id]);
        return $callback;
    }

    function has(int $id): bool
    {
        return isset($this->callbacks[$id]);
    }

    function count(): int
    {
        return \count($this->callbacks);
    }
}
