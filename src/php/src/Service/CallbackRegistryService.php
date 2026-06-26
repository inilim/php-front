<?php

namespace App\Service;

use Inilim\Tool\ID;

final class CallbackRegistryService
{
    /**
     * @var array<int,array{0:\Closure(mixed,mixed,mixed,mixed,mixed):mixed,1:bool}>
     */
    protected array $callbacks = [];

    /**
     * Сразу получаем JS callback
     * @return \PhpJsStub\Function_
     */
    function getJsCallback(callable $callback, string|int|null $name = null, bool $once = true): object
    {
        return \windowApp()->helper->createPhpInvoker(
            $once ? $this->registerOnce($callback, $name) : $this->register($callback, $name)
        );
    }

    /**
     * @param string|int|null $name Если требуется получать один и тотже идентификатор, можно придумать имя для callback
     */
    function register(callable $callback, string|int|null $name = null): int
    {
        [$id, $wrpCallback] = $this->_registry($callback, $name);
        $this->callbacks[$id] = [
            $wrpCallback,
            false,
        ];
        return $id;
    }

    /**
     * Однаразовая функция
     */
    function registerOnce(callable $callback, string|int|null $name = null): int
    {
        [$id, $wrpCallback] = $this->_registry($callback, $name);
        $this->callbacks[$id] = [
            $wrpCallback,
            true,
        ];
        return $id;
    }

    /**
     * @return array{0:int,1:\Closure}
     */
    protected function _registry(callable $callback, string|int|null $name = null): array
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

        return [$id, $wrpCallback];
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

    function removeByName(string|int $name): self
    {
        return $this->remove(\crc32((string)$name));
    }

    /**
     * @return array{0:\Closure,1:bool}|null
     */
    function get(int $id): ?array
    {
        return $this->callbacks[$id] ?? null;
    }

    /**
     * @return array{0:\Closure,1:bool}|null
     */
    function pull(int $id): ?array
    {
        $array = $this->callbacks[$id] ?? null;
        unset($this->callbacks[$id]);
        return $array;
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
