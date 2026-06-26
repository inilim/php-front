<?php

namespace App\Action;

/**
 */
final class InvokeCallbackRegistryAction
{
    /**
     * @deprecated Эта функция вызывается на стороне JS
     * @return mixed Результат выполнения callback'а
     */
    static function invoke(int $id): mixed
    {
        try {
            return self::process($id);
        } catch (\Throwable $e) {
            \exceptionToConsole($e, id_callback: $id);
        }
        return null;
    }

    protected static function process(int $id): mixed
    {
        $service = \contextApp()->callback_registry;
        $array = $service->get($id);

        if ($array === null) {
            throw new \LogicException('Callback не найден');
        }

        [$callback, $once] = $array;
        unset($array);

        if ($once) {
            $service->remove($id);
        }

        // 1. Получаем JS-объект { "0": arg, "1": arg, "length": 2 }
        $argsProxy = \dataBridge()->pull('args_' . $id);

        $nativeArgs = [];

        // Если аргументы были переданы
        if ($argsProxy !== null) {
            // 2. Читаем длину. Свойство .length доступно в прокси
            $count = $argsProxy->length;

            // 3. Собираем нативный массив, обращаясь по СТРОКОВЫМ ключам
            for ($i = 0; $i < $count; $i++) {
                // $i конвертируем в строку '0', '1' и т.д.
                // Доступ к свойству объекта: $obj->{'propName'}
                $key = (string)$i;
                $nativeArgs[] = $argsProxy->{$key};
            }
        }
        unset($argsProxy);

        // 4. Вызываем с распаковкой и возвращаем результат напрямую
        return $callback(...$nativeArgs);
    }
}
